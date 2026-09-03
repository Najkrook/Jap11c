import { describe, it, expect } from 'vitest';
import { 
  extractShortMeaning, 
  formatAnimeSource, 
  getDeckChapters, 
  searchAnkiCards, 
  ANKI_CARDS 
} from '../ankiLogic';

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
});
