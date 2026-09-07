import { describe, it, expect } from 'vitest';
import { 
  extractShortMeaning, 
  formatAnimeSource, 
  getDeckChapters, 
  searchAnkiCards, 
  ANKI_CARDS,
  calculateNextIntervals,
  getDueAnkiCardIndices,
  getWeakAnkiCardIndices
} from '../ankiLogic';
import type { AnkiCardProgress } from '../../../types/anki';

describe('ankiLogic', () => {
  describe('extractShortMeaning', () => {
    it('extracts definition after colon', () => {
      const raw = 'konnichiha: hello; good day; good afternoon  There are many more greetings in Japanese.';
      expect(extractShortMeaning(raw)).toBe('hello; good day; good afternoon');
    });

    it('extracts bracketed definitions', () => {
      const raw = '[noun] teacher. Used when speaking of one\'s own teacher.';
      expect(extractShortMeaning(raw)).toBe('teacher');
    });

    it('falls back to first sentence if no pattern matches', () => {
      const raw = 'Simple English definition. More details here.';
      expect(extractShortMeaning(raw)).toBe('Simple English definition');
    });
  });

  describe('formatAnimeSource', () => {
    it('cleans up underscores and JP+Eng markers', () => {
      expect(formatAnimeSource('Ore_no_Imouto_ga_konna_ni_Kawaii_Wake_ga_Nai_')).toBe('Ore no Imouto ga konna ni Kawaii Wake ga Nai');
      expect(formatAnimeSource('AnoHana (JP+Eng)')).toBe('AnoHana');
    });
  });

  describe('getDeckChapters', () => {
    it('returns 187 chapters for anki mode', () => {
      const chapters = getDeckChapters('anki', [0, 1]);
      expect(chapters.length).toBe(Math.ceil(ANKI_CARDS.length / 10));
      expect(chapters[0].isCompleted).toBe(true);
      expect(chapters[1].isCompleted).toBe(true);
      expect(chapters[2].isCompleted).toBe(false);
    });

    it('returns 10 chapters for words and phrases mode', () => {
      const wordsChapters = getDeckChapters('words', [0]);
      expect(wordsChapters.length).toBe(10);
      expect(wordsChapters[0].isCompleted).toBe(true);
      expect(wordsChapters[1].isCompleted).toBe(false);

      const phrasesChapters = getDeckChapters('phrases', []);
      expect(phrasesChapters.length).toBe(10);
    });

    it('returns chunked chapters for due mode (15 per batch)', () => {
      const dueIndices = Array.from({ length: 35 }, (_, i) => i);
      const chapters = getDeckChapters('due', [0], undefined, dueIndices);
      expect(chapters.length).toBe(3); // 15 + 15 + 5
      expect(chapters[0].itemCount).toBe(15);
      expect(chapters[0].isCompleted).toBe(true);
      expect(chapters[2].itemCount).toBe(5);
    });

    it('returns chunked chapters for weak mode (15 per batch)', () => {
      const weakIndices = [5, 12, 19];
      const chapters = getDeckChapters('weak', [], undefined, weakIndices);
      expect(chapters.length).toBe(1);
      expect(chapters[0].itemCount).toBe(3);
    });
  });

  describe('searchAnkiCards', () => {
    it('finds cards by anime title or kanji', () => {
      const results = searchAnkiCards('AnoHana', 10);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].card.source.toLowerCase()).toContain('anohana');
    });

    it('finds cards by romaji', () => {
      const results = searchAnkiCards('konnichiha', 5);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].card.romaji).toBe('konnichiha');
    });
  });

  describe('bookmarks', () => {
    it('returns empty chapters if no bookmarks exist', () => {
      const chapters = getDeckChapters('bookmarks', [], []);
      expect(chapters).toEqual([]);
    });

    it('creates chapters chunked by 10 for bookmarked cards', () => {
      const fakeBookmarks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 11 cards -> 2 chapters
      const chapters = getDeckChapters('bookmarks', [0], fakeBookmarks);
      expect(chapters.length).toBe(2);
      expect(chapters[0].itemCount).toBe(10);
      expect(chapters[0].isCompleted).toBe(true);
      expect(chapters[1].itemCount).toBe(1);
      expect(chapters[1].isCompleted).toBe(false);
    });
  });

  describe('calculateNextIntervals', () => {
    it('returns initial intervals for new card', () => {
      const intervals = calculateNextIntervals(undefined);
      expect(intervals.again.label).toBe('<10m');
      expect(intervals.hard.label).toBe('1d');
      expect(intervals.good.label).toBe('1d');
      expect(intervals.easy.label).toBe('3d');
    });

    it('returns intervals for card with repetitions = 1', () => {
      const card: AnkiCardProgress = {
        cardIndex: 0,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReviewDate: Date.now(),
        status: 'review',
        consecutiveCorrect: 1,
        totalReviews: 1,
        totalErrors: 0,
        lapses: 0
      };
      const intervals = calculateNextIntervals(card);
      expect(intervals.again.label).toBe('<10m');
      expect(intervals.hard.label).toBe('2d');
      expect(intervals.good.label).toBe('3d');
      expect(intervals.easy.label).toBe('6d');
    });

    it('scales intervals according to ease factor for mature cards', () => {
      const card: AnkiCardProgress = {
        cardIndex: 0,
        easeFactor: 2.5,
        interval: 10,
        repetitions: 3,
        nextReviewDate: Date.now(),
        status: 'review',
        consecutiveCorrect: 3,
        totalReviews: 3,
        totalErrors: 0,
        lapses: 0
      };
      const intervals = calculateNextIntervals(card);
      expect(intervals.again.label).toBe('<10m');
      expect(intervals.hard.label).toBe('12d');
      expect(intervals.good.label).toBe('25d');
      expect(intervals.easy.label).toBe('1mån');
    });
  });

  describe('getDueAnkiCardIndices and getWeakAnkiCardIndices', () => {
    it('filters due cards based on nextReviewDate', () => {
      const now = Date.now();
      const cardProgress: Record<number, AnkiCardProgress> = {
        1: { cardIndex: 1, nextReviewDate: now - 1000, easeFactor: 2.5, interval: 1, repetitions: 1, status: 'review', consecutiveCorrect: 1, totalReviews: 1, totalErrors: 0, lapses: 0 },
        2: { cardIndex: 2, nextReviewDate: now + 100000, easeFactor: 2.5, interval: 3, repetitions: 2, status: 'review', consecutiveCorrect: 2, totalReviews: 2, totalErrors: 0, lapses: 0 }
      };

      const due = getDueAnkiCardIndices(cardProgress);
      expect(due).toEqual([1]);
    });

    it('identifies weak cards with mistakes sorted descending', () => {
      const now = Date.now();
      const cardProgress: Record<number, AnkiCardProgress> = {
        1: { cardIndex: 1, nextReviewDate: now, easeFactor: 2.5, interval: 1, repetitions: 1, status: 'learning', consecutiveCorrect: 0, totalReviews: 3, totalErrors: 1, lapses: 0 },
        2: { cardIndex: 2, nextReviewDate: now, easeFactor: 2.3, interval: 1, repetitions: 1, status: 'learning', consecutiveCorrect: 0, totalReviews: 5, totalErrors: 3, lapses: 1 },
        3: { cardIndex: 3, nextReviewDate: now, easeFactor: 2.5, interval: 3, repetitions: 2, status: 'review', consecutiveCorrect: 2, totalReviews: 2, totalErrors: 0, lapses: 0 }
      };

      const weak = getWeakAnkiCardIndices(cardProgress);
      expect(weak).toEqual([2, 1]);
    });
  });
});
