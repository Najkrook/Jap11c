import { describe, expect, it } from 'vitest';
import { GRAMMAR_PRACTICE, isGrammarAnswerCorrect } from '../../../data/grammarPracticeData';
import { TAE_KIM_CHAPTERS } from '../../../data/taeKimGrammarData';

describe('Grammar scenario practice', () => {
  it('provides two contextual writing tasks for every chapter without orphan content', () => {
    expect(Object.keys(GRAMMAR_PRACTICE).sort()).toEqual(TAE_KIM_CHAPTERS.map(chapter => chapter.id).sort());
    for (const scenario of Object.values(GRAMMAR_PRACTICE)) {
      expect(scenario.tasks).toHaveLength(2);
      for (const task of scenario.tasks) {
        expect(task.answers.length).toBeGreaterThanOrEqual(2);
        expect(task.answers.some(answer => /^[a-z ]+$/i.test(answer))).toBe(true);
        for (const answer of task.answers) expect(isGrammarAnswerCorrect(answer, task.answers)).toBe(true);
      }
    }
  });

  it('accepts cosmetic differences without erasing grammatical differences', () => {
    expect(isGrammarAnswerCorrect('  OCHA o NOMU! ', ['ocha o nomu'])).toBe(true);
    expect(isGrammarAnswerCorrect('おちゃ を のむ。', ['おちゃをのむ'])).toBe(true);
    expect(isGrammarAnswerCorrect('ＯＣＨＡ　Ｏ　ＮＯＭＵ', ['ocha o nomu'])).toBe(true);
    expect(isGrammarAnswerCorrect('は', ['が'])).toBe(false);
    expect(isGrammarAnswerCorrect('かえない', ['かえらない'])).toBe(false);
    expect(isGrammarAnswerCorrect('かた', ['かった'])).toBe(false);
    expect(isGrammarAnswerCorrect('。 ', [''])).toBe(false);
  });
});
