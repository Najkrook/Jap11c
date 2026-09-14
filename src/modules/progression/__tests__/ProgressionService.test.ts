import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressionServiceImpl } from '../ProgressionServiceImpl';
import { InMemoryStorageAdapter } from '../storage/InMemoryStorageAdapter';

describe('ProgressionService', () => {
  let storage: InMemoryStorageAdapter;
  let service: ProgressionServiceImpl;

  beforeEach(() => {
    storage = new InMemoryStorageAdapter();
    service = new ProgressionServiceImpl(storage);
  });

  it('initializes default stats correctly', () => {
    const stats = service.getStats();
    expect(stats.xp).toBe(0);
    expect(stats.level).toBe(1);
    expect(stats.streakDays).toBe(1);
    expect(Object.keys(stats.kanaProgress).length).toBeGreaterThan(0);
  });

  it('awards XP on SRS review', () => {
    const res1 = service.recordActivity({ type: 'srs_review', kanaId: 'a', rating: 'good' });
    expect(res1.earnedXp).toBe(15);
    expect(res1.newXp).toBe(15);
    expect(res1.leveledUp).toBe(false);
  });

  it('calculates level ups deterministically', () => {
    service.recordActivity({ type: 'srs_review', kanaId: 'i', rating: 'easy' }); // +25 -> 25 XP
    service.recordActivity({ type: 'srs_review', kanaId: 'a', rating: 'good' }); // +15 -> 40 XP
    const resLevelUp = service.recordActivity({ type: 'srs_review', kanaId: 'u', rating: 'good' }); // +15 -> 55 XP (Level 2 threshold is 50 XP)

    expect(resLevelUp.newXp).toBe(55);
    expect(resLevelUp.newLevel).toBe(2);
    expect(resLevelUp.leveledUp).toBe(true);
  });

  it('automatically unlocks badges like first_five', () => {
    service.recordActivity({ type: 'srs_review', kanaId: 'a', rating: 'good' });
    service.recordActivity({ type: 'srs_review', kanaId: 'i', rating: 'good' });
    service.recordActivity({ type: 'srs_review', kanaId: 'u', rating: 'good' });
    service.recordActivity({ type: 'srs_review', kanaId: 'e', rating: 'good' });
    const resVowels = service.recordActivity({ type: 'srs_review', kanaId: 'o', rating: 'good' });

    const firstFive = resVowels.newlyUnlockedBadges.find(b => b.id === 'first_five');
    expect(firstFive).toBeDefined();
  });

  it('records game activity and updates high scores and combo badges', () => {
    const resGame = service.recordActivity({
      type: 'game_finished',
      gameId: 'shinkansenRush',
      score: 1500,
      maxCombo: 18
    });

    expect(resGame.isNewHighScore).toBe(true);
    expect(resGame.currentStats.highScores.shinkansenRush).toBe(1500);

    const gameMasterBadge = resGame.newlyUnlockedBadges.find(b => b.id === 'game_master_1000');
    const comboKingBadge = resGame.newlyUnlockedBadges.find(b => b.id === 'combo_king');
    expect(gameMasterBadge).toBeDefined();
    expect(comboKingBadge).toBeDefined();
  });

  it('persists data and reloads cleanly from StorageAdapter', () => {
    service.recordActivity({ type: 'srs_review', kanaId: 'ka', rating: 'good' });
    const exported = service.exportData();

    const newStorage = new InMemoryStorageAdapter();
    const newService = new ProgressionServiceImpl(newStorage);
    const imported = newService.importData(exported);

    expect(imported).toBe(true);
    expect(newService.getStats().kanaProgress['ka'].status).not.toBe('new');
  });

  it('ensures all kana characters are initialized when importing partial data', () => {
    const partialJson = JSON.stringify({
      xp: 100,
      kanaProgress: {
        a: {
          id: 'a',
          status: 'review',
          interval: 1,
          repetitions: 1,
          easeFactor: 2.5,
          nextReviewDate: Date.now() + 86400000,
          consecutiveCorrect: 1,
          totalReviews: 1,
          totalErrors: 0
        }
      }
    });

    const newStorage = new InMemoryStorageAdapter();
    const newService = new ProgressionServiceImpl(newStorage);
    const success = newService.importData(partialJson);

    expect(success).toBe(true);
    const stats = newService.getStats();
    expect(stats.kanaProgress['a'].status).toBe('review');
    expect(stats.kanaProgress['i']).toBeDefined();
    expect(stats.kanaProgress['i'].status).toBe('new');
    expect(stats.kanaProgress['kata_a']).toBeDefined();
  });

  it('computes progression summary correctly', () => {
    const summary = service.getSummary();
    expect(summary.currentLevel).toBe(1);
    expect(summary.totalMasteredKana).toBe(0);
    expect(summary.currentStreak).toBe(1);
  });

  describe('Anki chapter progression', () => {
    it('records anki chapter completion and awards XP', () => {
      const res = service.recordActivity({
        type: 'anki_chapter_completed',
        mode: 'anki',
        chapterIndex: 0
      });

      expect(res.earnedXp).toBe(35);
      expect(res.newXp).toBe(35);
      expect(service.getAnkiProgress('anki')).toEqual([0]);
    });

    it('handles idempotent completion of already finished chapters with review XP', () => {
      service.recordActivity({
        type: 'anki_chapter_completed',
        mode: 'anki',
        chapterIndex: 0
      });

      const resRepeat = service.recordActivity({
        type: 'anki_chapter_completed',
        mode: 'anki',
        chapterIndex: 0
      });

      expect(resRepeat.earnedXp).toBe(10);
      expect(service.getAnkiProgress('anki')).toEqual([0]);
    });

    it('persists anki progress across StorageAdapter serialization', () => {
      service.recordActivity({ type: 'anki_chapter_completed', mode: 'words', chapterIndex: 2 });
      service.recordActivity({ type: 'anki_chapter_completed', mode: 'words', chapterIndex: 0 });

      const exported = service.exportData();
      const newStorage = new InMemoryStorageAdapter();
      const newService = new ProgressionServiceImpl(newStorage);
      newService.importData(exported);

      expect(newService.getAnkiProgress('words')).toEqual([0, 2]);
    });

    it('records anki_card_review with SM-2 intervals and awards XP', () => {
      const res1 = service.recordActivity({
        type: 'anki_card_review',
        cardIndex: 42,
        rating: 'good'
      });

      expect(res1.earnedXp).toBe(15);
      const card = service.getStats().ankiCardProgress?.[42];
      expect(card).toBeDefined();
      expect(card?.repetitions).toBe(1);
      expect(card?.consecutiveCorrect).toBe(1);
      expect(card?.interval).toBe(1);
      expect(card?.status).toBe('review');
    });

    it('tracks lapses and errors when user fails an anki card with again', () => {
      // First master or learn the card
      service.recordActivity({ type: 'anki_card_review', cardIndex: 10, rating: 'good' });
      service.recordActivity({ type: 'anki_card_review', cardIndex: 10, rating: 'good' });

      // Now fail the card
      const resAgain = service.recordActivity({
        type: 'anki_card_review',
        cardIndex: 10,
        rating: 'again'
      });

      expect(resAgain.earnedXp).toBe(5);
      const card = service.getStats().ankiCardProgress?.[10];
      expect(card?.lapses).toBe(1);
      expect(card?.totalErrors).toBe(1);
      expect(card?.repetitions).toBe(0);
      expect(card?.consecutiveCorrect).toBe(0);
      expect(card?.status).toBe('learning');
      expect(card?.nextReviewDate).toBeLessThanOrEqual(Date.now() + 11 * 60 * 1000);
    });

    it('returns due anki cards and weak anki cards accurately', () => {
      const now = Date.now();
      // Card 1: Due in the past
      service.recordActivity({ type: 'anki_card_review', cardIndex: 1, rating: 'good' });
      const stats = service.getStats();
      if (stats.ankiCardProgress?.[1]) {
        stats.ankiCardProgress[1].nextReviewDate = now - 5000;
      }
      service.importData(JSON.stringify(stats));

      // Card 2: Failed (weak)
      service.recordActivity({ type: 'anki_card_review', cardIndex: 2, rating: 'again' });

      const due = service.getDueAnkiCards();
      expect(due).toContain(1);

      const weak = service.getWeakAnkiCards();
      expect(weak).toContain(2);
    });

    it('toggles grammar chapter completion with XP reward and cloud-ready state', () => {
      const res1 = service.toggleGrammarChapter('tk-state-of-being', true);
      expect(res1.earnedXp).toBe(25);
      expect(service.getStats().grammarProgress).toContain('tk-state-of-being');

      // Toggling same chapter again as complete should not duplicate or award XP twice
      const resDuplicate = service.toggleGrammarChapter('tk-state-of-being', true);
      expect(resDuplicate.earnedXp).toBe(0);
      expect(service.getStats().grammarProgress?.filter(id => id === 'tk-state-of-being').length).toBe(1);

      // Unmarking removes from grammarProgress without negative XP
      const resUnmark = service.toggleGrammarChapter('tk-state-of-being', false);
      expect(resUnmark.earnedXp).toBe(0);
      expect(service.getStats().grammarProgress).not.toContain('tk-state-of-being');
    });

    it('toggles anki bookmarks and preserves sorted order', () => {
      service.toggleAnkiBookmark(42);
      service.toggleAnkiBookmark(10);
      expect(service.getStats().ankiBookmarks).toEqual([10, 42]);

      // Toggling 42 again removes it
      service.toggleAnkiBookmark(42);
      expect(service.getStats().ankiBookmarks).toEqual([10]);
    });

    it('toggles study guide and intensive crash course tasks', () => {
      service.toggleStudyGuideTask('week_1_vocab');
      expect(service.getStats().studyGuideTasks?.week_1_vocab).toBe(true);
      service.toggleStudyGuideTask('week_1_vocab');
      expect(service.getStats().studyGuideTasks?.week_1_vocab).toBe(false);

      service.toggleIntensiveTask('day1_block1');
      expect(service.getStats().intensiveTasks?.day1_block1).toBe(true);
      service.toggleIntensiveTask('day1_block1');
      expect(service.getStats().intensiveTasks?.day1_block1).toBe(false);
    });
  });
});

