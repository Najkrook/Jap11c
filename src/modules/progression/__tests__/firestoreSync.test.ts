import { describe, it, expect } from 'vitest';
import { mergeUserStats } from '../sync/mergeUserStats';
import type { UserStats } from '../../../types/kana';
import { INITIAL_USER_STATS } from '../ProgressionServiceImpl';

describe('mergeUserStats', () => {
  it('correctly merges higher XP and calculates level', () => {
    const local: UserStats = {
      ...INITIAL_USER_STATS,
      xp: 200,
      level: 3,
      streakDays: 2,
      lastActiveDate: '2026-09-01'
    };
    const cloud: UserStats = {
      ...INITIAL_USER_STATS,
      xp: 450,
      level: 4,
      streakDays: 4,
      lastActiveDate: '2026-09-01'
    };

    const merged = mergeUserStats(local, cloud);
    expect(merged.xp).toBe(450);
    expect(merged.level).toBe(4);
    expect(merged.streakDays).toBe(4);
  });

  it('unions unlocked badges without duplicates', () => {
    const local: UserStats = {
      ...INITIAL_USER_STATS,
      unlockedBadges: ['first_five', 'streak_3']
    };
    const cloud: UserStats = {
      ...INITIAL_USER_STATS,
      unlockedBadges: ['streak_3', 'combo_king']
    };

    const merged = mergeUserStats(local, cloud);
    expect(merged.unlockedBadges).toEqual(expect.arrayContaining(['first_five', 'streak_3', 'combo_king']));
    expect(merged.unlockedBadges.length).toBe(3);
  });

  it('merges high scores taking the maximum for each game', () => {
    const local: UserStats = {
      ...INITIAL_USER_STATS,
      highScores: {
        kanaDrop: 500,
        speedQuiz: 120,
        wordScramble: 50,
        shinkansenRush: 1200,
        dojoRoguelike: 800
      }
    };
    const cloud: UserStats = {
      ...INITIAL_USER_STATS,
      highScores: {
        kanaDrop: 800,
        speedQuiz: 100,
        wordScramble: 90,
        shinkansenRush: 950,
        dojoRoguelike: 1500
      }
    };

    const merged = mergeUserStats(local, cloud);
    expect(merged.highScores.kanaDrop).toBe(800);
    expect(merged.highScores.speedQuiz).toBe(120);
    expect(merged.highScores.wordScramble).toBe(90);
    expect(merged.highScores.shinkansenRush).toBe(1200);
    expect(merged.highScores.dojoRoguelike).toBe(1500);
  });

  it('merges kana progress favoring mastered and highest repetitions', () => {
    const local: UserStats = {
      ...INITIAL_USER_STATS,
      kanaProgress: {
        a: {
          id: 'a',
          status: 'learning',
          repetitions: 2,
          easeFactor: 2.5,
          interval: 1,
          nextReviewDate: 1000,
          consecutiveCorrect: 2,
          totalReviews: 3,
          totalErrors: 1
        }
      }
    };
    const cloud: UserStats = {
      ...INITIAL_USER_STATS,
      kanaProgress: {
        a: {
          id: 'a',
          status: 'mastered',
          repetitions: 5,
          easeFactor: 2.8,
          interval: 7,
          nextReviewDate: 2000,
          consecutiveCorrect: 5,
          totalReviews: 6,
          totalErrors: 1
        }
      }
    };

    const merged = mergeUserStats(local, cloud);
    expect(merged.kanaProgress.a.status).toBe('mastered');
    expect(merged.kanaProgress.a.repetitions).toBe(5);
    expect(merged.kanaProgress.a.easeFactor).toBe(2.8);
  });

  it('preserves katakana progress that only exists on one side', () => {
    const katakanaProgress = {
      id: 'kata_a',
      status: 'learning' as const,
      repetitions: 2,
      easeFactor: 2.5,
      interval: 1,
      nextReviewDate: 1000,
      consecutiveCorrect: 2,
      totalReviews: 2,
      totalErrors: 0
    };

    const merged = mergeUserStats(
      { ...INITIAL_USER_STATS, kanaProgress: { kata_a: katakanaProgress } },
      { ...INITIAL_USER_STATS, kanaProgress: {} }
    );

    expect(merged.kanaProgress.kata_a).toEqual(katakanaProgress);
  });

  it('migrates the legacy master badge id without duplicates', () => {
    const merged = mergeUserStats(
      { ...INITIAL_USER_STATS, unlockedBadges: ['lund_ready'] },
      { ...INITIAL_USER_STATS, unlockedBadges: ['hiragana_master'] }
    );

    expect(merged.unlockedBadges).toEqual(['hiragana_master']);
  });

  it('correctly merges ankiCardProgress across devices', () => {
    const local: UserStats = {
      ...INITIAL_USER_STATS,
      ankiCardProgress: {
        5: {
          cardIndex: 5,
          status: 'learning',
          repetitions: 2,
          easeFactor: 2.5,
          interval: 1,
          nextReviewDate: 1500,
          consecutiveCorrect: 2,
          totalReviews: 2,
          totalErrors: 0,
          lapses: 0
        }
      }
    };
    const cloud: UserStats = {
      ...INITIAL_USER_STATS,
      ankiCardProgress: {
        5: {
          cardIndex: 5,
          status: 'review',
          repetitions: 4,
          easeFactor: 2.6,
          interval: 3,
          nextReviewDate: 1200,
          consecutiveCorrect: 3,
          totalReviews: 5,
          totalErrors: 1,
          lapses: 1
        },
        12: {
          cardIndex: 12,
          status: 'mastered',
          repetitions: 8,
          easeFactor: 2.8,
          interval: 14,
          nextReviewDate: 5000,
          consecutiveCorrect: 8,
          totalReviews: 8,
          totalErrors: 0,
          lapses: 0
        }
      }
    };

    const merged = mergeUserStats(local, cloud);
    expect(merged.ankiCardProgress?.[5].status).toBe('review');
    expect(merged.ankiCardProgress?.[5].repetitions).toBe(4);
    expect(merged.ankiCardProgress?.[5].easeFactor).toBe(2.6);
    expect(merged.ankiCardProgress?.[5].nextReviewDate).toBe(1200);
    expect(merged.ankiCardProgress?.[5].lapses).toBe(1);
    expect(merged.ankiCardProgress?.[12].status).toBe('mastered');
    expect(merged.ankiCardProgress?.[12].repetitions).toBe(8);
  });

  it('unions learning chapters completed on different devices', () => {
    const local: UserStats = {
      ...INITIAL_USER_STATS,
      learningProgress: {
        chapter_1: {
          chapterId: 'chapter_1',
          completed: true,
          score: 100,
          bestScore: 100,
          stars: 3,
          lastCompletedDate: '2026-09-07T10:00:00Z',
          mistakesKanaIds: []
        }
      }
    };
    const cloud: UserStats = {
      ...INITIAL_USER_STATS,
      learningProgress: {
        chapter_2: {
          chapterId: 'chapter_2',
          completed: true,
          score: 95,
          bestScore: 95,
          stars: 3,
          lastCompletedDate: '2026-09-07T11:00:00Z',
          mistakesKanaIds: ['ka']
        }
      }
    };

    const merged = mergeUserStats(local, cloud);
    expect(merged.learningProgress?.chapter_1.completed).toBe(true);
    expect(merged.learningProgress?.chapter_2.completed).toBe(true);
    expect(merged.learningProgress?.chapter_2.mistakesKanaIds).toContain('ka');
  });

  it('unions grammarProgress read chapters across devices without duplicates', () => {
    const local: UserStats = {
      ...INITIAL_USER_STATS,
      grammarProgress: ['tk-state-of-being', 'tk-particles-wa-ga']
    };
    const cloud: UserStats = {
      ...INITIAL_USER_STATS,
      grammarProgress: ['tk-particles-wa-ga', 'tk-adjectives']
    };

    const merged = mergeUserStats(local, cloud);
    expect(merged.grammarProgress).toEqual(
      expect.arrayContaining(['tk-state-of-being', 'tk-particles-wa-ga', 'tk-adjectives'])
    );
    expect(merged.grammarProgress?.length).toBe(3);
  });

  it('unions and sorts ankiBookmarks across devices', () => {
    const local: UserStats = {
      ...INITIAL_USER_STATS,
      ankiBookmarks: [5, 12, 42]
    };
    const cloud: UserStats = {
      ...INITIAL_USER_STATS,
      ankiBookmarks: [2, 12, 100]
    };

    const merged = mergeUserStats(local, cloud);
    expect(merged.ankiBookmarks).toEqual([2, 5, 12, 42, 100]);
  });

  it('merges studyGuideTasks and intensiveTasks with boolean OR logic', () => {
    const local: UserStats = {
      ...INITIAL_USER_STATS,
      studyGuideTasks: { task_1: true, task_2: false },
      intensiveTasks: { day1_block1: true }
    };
    const cloud: UserStats = {
      ...INITIAL_USER_STATS,
      studyGuideTasks: { task_2: true, task_3: true },
      intensiveTasks: { day1_block1: false, day2_block1: true }
    };

    const merged = mergeUserStats(local, cloud);
    expect(merged.studyGuideTasks?.task_1).toBe(true);
    expect(merged.studyGuideTasks?.task_2).toBe(true);
    expect(merged.studyGuideTasks?.task_3).toBe(true);
    expect(merged.intensiveTasks?.day1_block1).toBe(true);
    expect(merged.intensiveTasks?.day2_block1).toBe(true);
  });

  it('merges genkiCardProgress across devices preserving latest review and highest repetitions', () => {
    const local: UserStats = {
      ...INITIAL_USER_STATS,
      genkiCardProgress: {
        0: {
          cardIndex: 0,
          status: 'learning',
          easeFactor: 2.5,
          intervalHours: 0.1667,
          repetitions: 1,
          nextReviewDate: 1700000000000,
          lastReviewedDate: 1699999000000,
          consecutiveCorrect: 1,
          totalReviews: 1,
          totalErrors: 0,
          lapses: 0
        },
        1: {
          cardIndex: 1,
          status: 'mastered',
          easeFactor: 2.6,
          intervalHours: 168,
          repetitions: 3,
          nextReviewDate: 1700500000000,
          lastReviewedDate: 1700000000000,
          consecutiveCorrect: 3,
          totalReviews: 3,
          totalErrors: 0,
          lapses: 0
        }
      }
    };
    const cloud: UserStats = {
      ...INITIAL_USER_STATS,
      genkiCardProgress: {
        0: {
          cardIndex: 0,
          status: 'review',
          easeFactor: 2.5,
          intervalHours: 72,
          repetitions: 2,
          nextReviewDate: 1700200000000,
          lastReviewedDate: 1699999900000, // newer review on cloud!
          consecutiveCorrect: 2,
          totalReviews: 2,
          totalErrors: 0,
          lapses: 0
        },
        2: {
          cardIndex: 2,
          status: 'learning',
          easeFactor: 2.5,
          intervalHours: 5,
          repetitions: 1,
          nextReviewDate: 1700100000000,
          lastReviewedDate: 1700000000000,
          consecutiveCorrect: 1,
          totalReviews: 1,
          totalErrors: 0,
          lapses: 0
        }
      }
    };

    const merged = mergeUserStats(local, cloud);
    // Card 0: cloud was reviewed more recently, so its intervalHours (72) and nextReviewDate should be used
    expect(merged.genkiCardProgress?.[0].intervalHours).toBe(72);
    expect(merged.genkiCardProgress?.[0].repetitions).toBe(2);
    // Card 1: exists in local
    expect(merged.genkiCardProgress?.[1].status).toBe('mastered');
    expect(merged.genkiCardProgress?.[1].intervalHours).toBe(168);
    // Card 2: exists in cloud
    expect(merged.genkiCardProgress?.[2].status).toBe('learning');
    expect(merged.genkiCardProgress?.[2].repetitions).toBe(1);
  });
});
