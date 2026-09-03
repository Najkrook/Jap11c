import { describe, it, expect } from 'vitest';
import { 
  getLookalikes, 
  getSmartKanaDistractors, 
  getWordMeaningDistractors, 
  generateQuizSession, 
  generateCheckpointQuestions, 
  evaluateQuizScore 
} from '../KanaQuizEngine';
import { HIRAGANA_DATA } from '../../../data/hiraganaData';
import { KATAKANA_DATA } from '../../../data/katakanaData';
import type { KanaCharacter } from '../../../types/kana';
import type { LearningChapter } from '../../../data/learningPathData';

describe('KanaQuizEngine', () => {
  const sampleKanaList: KanaCharacter[] = HIRAGANA_DATA.slice(0, 5); // a, i, u, e, o
  const targetA = sampleKanaList[0]; // a
  const targetKataShi = KATAKANA_DATA.find(k => k.id === 'kata_shi') || KATAKANA_DATA[0];

  describe('getLookalikes', () => {
    it('returns lookalikes for Hiragana characters', () => {
      const lookalikes = getLookalikes('a');
      expect(lookalikes).toContain('o');
      expect(lookalikes).toContain('me');
    });

    it('returns lookalikes for Katakana characters with kata_ prefix preserved', () => {
      const lookalikes = getLookalikes('kata_shi');
      expect(lookalikes).toContain('kata_tsu');
      expect(lookalikes).toContain('kata_so');
    });

    it('returns empty array for unknown kana id', () => {
      expect(getLookalikes('non_existent')).toEqual([]);
    });
  });

  describe('getSmartKanaDistractors', () => {
    it('returns requested number of distractors and never includes target', () => {
      const distractors = getSmartKanaDistractors(targetA, sampleKanaList, 3);
      expect(distractors).toHaveLength(3);
      expect(distractors.some(d => d.id === targetA.id)).toBe(false);
    });

    it('prioritizes siblings from the same chapter pool', () => {
      const pool = sampleKanaList; // a, i, u, e, o
      const distractors = getSmartKanaDistractors(targetA, pool, 3);
      // All distractors should come from the pool if pool >= 4
      expect(distractors.every(d => pool.some(p => p.id === d.id))).toBe(true);
    });

    it('falls back to alphabet dataset when pool is smaller than requested count', () => {
      const smallPool = [targetA, sampleKanaList[1]]; // only 2 items
      const distractors = getSmartKanaDistractors(targetA, smallPool, 3);
      expect(distractors).toHaveLength(3);
      expect(distractors.some(d => d.id === targetA.id)).toBe(false);
    });

    it('works seamlessly with Katakana datasets', () => {
      const kataPool = KATAKANA_DATA.slice(0, 5);
      const distractors = getSmartKanaDistractors(targetKataShi, kataPool, 3);
      expect(distractors).toHaveLength(3);
      expect(distractors.some(d => d.id === targetKataShi.id)).toBe(false);
    });
  });

  describe('getWordMeaningDistractors', () => {
    it('returns word distractors excluding the target word', () => {
      const targetWord = { kana: 'あい', romaji: 'ai', meaningSv: 'kärlek' };
      const words = [
        targetWord,
        { kana: 'いえ', romaji: 'ie', meaningSv: 'hus' },
        { kana: 'うえ', romaji: 'ue', meaningSv: 'över' },
        { kana: 'あお', romaji: 'ao', meaningSv: 'blå' }
      ];

      const distractors = getWordMeaningDistractors(targetWord, words, 3);
      expect(distractors).toHaveLength(3);
      expect(distractors.some(d => d.kana === targetWord.kana)).toBe(false);
    });
  });

  describe('generateQuizSession', () => {
    const chapter: LearningChapter = {
      id: 'test-ch-1',
      chapterNumber: 1,
      stage: 1,
      title: 'Test Chapter',
      subtitle: 'Sub',
      rowName: 'A-raden',
      kanaIds: ['a', 'i', 'u', 'e', 'o'],
      description: 'Desc',
      pedagogicalNote: 'Note',
      targetWords: [
        { kana: 'あい', romaji: 'ai', meaningSv: 'kärlek' },
        { kana: 'いえ', romaji: 'ie', meaningSv: 'hus' }
      ],
      xpReward: 50
    };

    it('generates a full multi-format quiz session', () => {
      const questions = generateQuizSession({
        chapter,
        kanaList: sampleKanaList
      });

      expect(questions.length).toBeGreaterThan(5);

      // Verify every question has exactly 1 correct option and 4 total options
      for (const q of questions) {
        expect(q.options).toHaveLength(4);
        const correctOptions = q.options.filter(o => o.isCorrect);
        expect(correctOptions).toHaveLength(1);
      }
    });

    it('respects allowedTypes filter', () => {
      const questions = generateQuizSession({
        chapter,
        kanaList: sampleKanaList,
        allowedTypes: ['kana-to-romaji']
      });

      expect(questions.every(q => q.type === 'kana-to-romaji')).toBe(true);
      expect(questions).toHaveLength(sampleKanaList.length);
    });
  });

  describe('generateCheckpointQuestions', () => {
    it('generates requested number of questions across pool', () => {
      const questions = generateCheckpointQuestions(HIRAGANA_DATA.slice(0, 20), 10);
      expect(questions).toHaveLength(10);
      for (const q of questions) {
        expect(q.options).toHaveLength(4);
        expect(q.options.filter(o => o.isCorrect)).toHaveLength(1);
      }
    });
  });

  describe('evaluateQuizScore', () => {
    it('calculates 100% score and 3 stars for perfect quiz', () => {
      const result = evaluateQuizScore(10, []);
      expect(result.scorePercent).toBe(100);
      expect(result.stars).toBe(3);
      expect(result.isPassed).toBe(true);
    });

    it('calculates 80% score and 1 star for passing threshold', () => {
      const result = evaluateQuizScore(10, ['a', 'i']);
      expect(result.scorePercent).toBe(80);
      expect(result.stars).toBe(1);
      expect(result.isPassed).toBe(true);
    });

    it('fails when score is below 80%', () => {
      const result = evaluateQuizScore(10, ['a', 'i', 'u']);
      expect(result.scorePercent).toBe(70);
      expect(result.stars).toBe(0);
      expect(result.isPassed).toBe(false);
    });
  });
});
