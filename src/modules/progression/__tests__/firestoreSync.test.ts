import { describe, it, expect } from 'vitest';
import { mergeUserStats } from '../sync/firestoreSync';
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
});
