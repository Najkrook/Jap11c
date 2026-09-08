import { describe, it, expect } from 'vitest';
import { 
  TAE_KIM_CHAPTERS, 
  GRAMMAR_PARTS, 
  getChapterById, 
  getChaptersByPart, 
  getNextChapter, 
  getPreviousChapter 
} from '../../../data/taeKimGrammarData';

describe('Tae Kim Grammar Data & Logic', () => {
  it('contains exactly 4 main parts and 22 comprehensive chapters', () => {
    expect(GRAMMAR_PARTS).toHaveLength(4);
    expect(TAE_KIM_CHAPTERS).toHaveLength(22);
  });

  it('ensures all chapter numbers are sequential from 1 to 22', () => {
    const numbers = TAE_KIM_CHAPTERS.map(c => c.chapterNumber);
    expect(numbers).toEqual(Array.from({ length: 22 }, (_, i) => i + 1));
  });

  it('ensures every chapter has unique IDs and required metadata', () => {
    const ids = new Set<string>();
    for (const chapter of TAE_KIM_CHAPTERS) {
      expect(ids.has(chapter.id)).toBe(false);
      ids.add(chapter.id);

      expect(chapter.titleSv.length).toBeGreaterThan(0);
      expect(chapter.titleJap.length).toBeGreaterThan(0);
      expect(chapter.romajiTitle.length).toBeGreaterThan(0);
      expect(chapter.readingTimeMin).toBeGreaterThan(0);
      expect(chapter.summarySv.length).toBeGreaterThan(15);
      expect(chapter.taeKimCoreInsightSv.length).toBeGreaterThan(20);
      expect(chapter.sections.length).toBeGreaterThan(0);
    }
  });

  it('verifies all example sentences have valid Japanese, reading and audioText', () => {
    for (const chapter of TAE_KIM_CHAPTERS) {
      expect(chapter.examples.length).toBeGreaterThan(0);
      for (const ex of chapter.examples) {
        expect(ex.japanese.trim().length).toBeGreaterThan(0);
        expect(ex.furigana.trim().length).toBeGreaterThan(0);
        expect(ex.romaji.trim().length).toBeGreaterThan(0);
        expect(ex.translationSv.trim().length).toBeGreaterThan(0);
        expect(ex.audioText.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('validates mini-quiz questions and correct indices', () => {
    for (const chapter of TAE_KIM_CHAPTERS) {
      expect(chapter.miniQuiz.length).toBeGreaterThanOrEqual(1);
      for (const q of chapter.miniQuiz) {
        expect(q.questionSv.length).toBeGreaterThan(0);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
        expect(q.explanationSv.length).toBeGreaterThan(10);
      }
    }
  });

  it('correctly retrieves chapter by ID', () => {
    const stateOfBeing = getChapterById('state-of-being-da-desu');
    expect(stateOfBeing).toBeDefined();
    expect(stateOfBeing?.chapterNumber).toBe(2);

    const nonExistent = getChapterById('does-not-exist');
    expect(nonExistent).toBeUndefined();
  });

  it('correctly filters chapters by partId', () => {
    const basicsChapters = getChaptersByPart('basics');
    expect(basicsChapters.length).toBe(5);
    for (const c of basicsChapters) {
      expect(c.partId).toBe('basics');
    }

    const advancedChapters = getChaptersByPart('advanced');
    expect(advancedChapters.length).toBe(6);
  });

  it('correctly navigates next and previous chapters', () => {
    const first = TAE_KIM_CHAPTERS[0];
    const second = TAE_KIM_CHAPTERS[1];
    const last = TAE_KIM_CHAPTERS[TAE_KIM_CHAPTERS.length - 1];

    expect(getPreviousChapter(first.id)).toBeUndefined();
    expect(getNextChapter(first.id)?.id).toBe(second.id);
    expect(getPreviousChapter(second.id)?.id).toBe(first.id);
    expect(getNextChapter(last.id)).toBeUndefined();
  });
});
