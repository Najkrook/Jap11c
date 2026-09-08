import { describe, it, expect } from 'vitest';
import { 
  PARTICLE_QUESTIONS, 
  PARTICLE_DUEL_GROUPS, 
  PARTICLE_GUIDE_ITEMS,
  getQuestionsByCategory,
  generateParticleQuestion,
  generateParticleSession
} from '../../../data/particleData';

describe('Particle Training Data & Logic', () => {
  it('contains a rich set of beginner particle questions with full metadata', () => {
    expect(PARTICLE_QUESTIONS.length).toBeGreaterThanOrEqual(20);

    PARTICLE_QUESTIONS.forEach(q => {
      expect(q.id).toBeDefined();
      expect(q.category).toBeDefined();
      expect([1, 2, 3]).toContain(q.level);
      expect(q.sentenceParts).toHaveLength(2);
      expect(q.fullSentenceKana.length).toBeGreaterThan(0);
      expect(q.romaji.length).toBeGreaterThan(0);
      expect(q.swedishTranslation.length).toBeGreaterThan(0);
      expect(q.correctParticle.length).toBeGreaterThan(0);
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      expect(q.options).toContain(q.correctParticle);
      expect(q.ruleSummary.length).toBeGreaterThan(0);
      expect(q.explanationSv.length).toBeGreaterThan(0);
    });
  });

  it('contains all essential particle duel categories', () => {
    const requiredCategories = ['all', 'wa_vs_ga', 'ni_vs_de', 'o_vs_ni_vs_he', 'no_to_mo', 'kara_made'];
    const duelIds = PARTICLE_DUEL_GROUPS.map(g => g.id);

    requiredCategories.forEach(cat => {
      expect(duelIds).toContain(cat);
    });

    PARTICLE_DUEL_GROUPS.forEach(group => {
      expect(group.title).toBeDefined();
      expect(group.nicknameSv).toBeDefined();
      expect(group.descriptionSv).toBeDefined();
      expect(group.particles.length).toBeGreaterThan(0);
      expect(group.badgeColor).toBeDefined();
    });
  });

  it('contains a comprehensive particle guide with rules and pitfalls', () => {
    expect(PARTICLE_GUIDE_ITEMS.length).toBeGreaterThanOrEqual(8);

    const essentialParticles = ['は', 'が', 'を', 'に', 'で', 'へ', 'の', 'と', 'も'];
    const guideParticles = PARTICLE_GUIDE_ITEMS.map(item => item.particle);

    essentialParticles.forEach(p => {
      expect(guideParticles).toContain(p);
    });

    PARTICLE_GUIDE_ITEMS.forEach(item => {
      expect(item.particle).toBeDefined();
      expect(item.romaji).toBeDefined();
      expect(item.nameSv).toBeDefined();
      expect(item.coreRoleSv).toBeDefined();
      expect(item.goldenRulesSv.length).toBeGreaterThan(0);
      expect(item.exampleSentences.length).toBeGreaterThan(0);
      item.exampleSentences.forEach(ex => {
        expect(ex.kana).toBeDefined();
        expect(ex.romaji).toBeDefined();
        expect(ex.translationSv).toBeDefined();
      });
      expect(item.pitfallWarningSv).toBeDefined();
    });
  });

  it('correctly filters questions by duel category', () => {
    const waVsGaQuestions = getQuestionsByCategory('wa_vs_ga');
    expect(waVsGaQuestions.length).toBeGreaterThan(0);
    waVsGaQuestions.forEach(q => {
      expect(q.category).toBe('wa_vs_ga');
    });

    const niVsDeQuestions = getQuestionsByCategory('ni_vs_de');
    expect(niVsDeQuestions.length).toBeGreaterThan(0);
    niVsDeQuestions.forEach(q => {
      expect(q.category).toBe('ni_vs_de');
    });

    const allQuestions = getQuestionsByCategory('all');
    expect(allQuestions.length).toBe(PARTICLE_QUESTIONS.length);
  });

  it('generates randomized questions where options contain the correct answer', () => {
    for (let i = 0; i < 25; i++) {
      const q = generateParticleQuestion({ category: 'ni_vs_de' });
      expect(q.category).toBe('ni_vs_de');
      expect(q.options).toContain(q.correctParticle);
    }
  });

  it('generates a full quiz session of specified size', () => {
    const session10 = generateParticleSession(10, 'all');
    expect(session10).toHaveLength(10);

    session10.forEach(q => {
      expect(q.options).toContain(q.correctParticle);
    });

    const session5Duel = generateParticleSession(5, 'wa_vs_ga');
    expect(session5Duel).toHaveLength(5);
    session5Duel.forEach(q => {
      expect(q.category).toBe('wa_vs_ga');
      expect(q.options).toContain(q.correctParticle);
    });
  });

  it('honors excludeId when generating a follow-up question', () => {
    const firstQ = PARTICLE_QUESTIONS[0];
    const nextQ = generateParticleQuestion({ excludeId: firstQ.id });
    expect(nextQ.id).not.toBe(firstQ.id);
  });
});
