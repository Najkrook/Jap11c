import { describe, it, expect } from 'vitest';
import { 
  TRICKY_HIRAGANA_GROUPS, 
  generateTrickyQuestion, 
  generateTrickyQuizSession 
} from '../../../data/trickyHiraganaData';

describe('Tricky Hiragana Data & Logic', () => {
  it('contains comprehensive lookalike groups with complete metadata', () => {
    expect(TRICKY_HIRAGANA_GROUPS.length).toBeGreaterThanOrEqual(10);

    TRICKY_HIRAGANA_GROUPS.forEach(group => {
      expect(group.id).toBeDefined();
      expect(group.title).toBeDefined();
      expect(group.nicknameSv).toBeDefined();
      expect(group.comparisonTipSv).toBeDefined();
      expect(group.characters.length).toBeGreaterThanOrEqual(2);

      group.characters.forEach(char => {
        expect(char.kana).toBeDefined();
        expect(char.romaji).toBeDefined();
        expect(char.keyFeature).toBeDefined();
        expect(char.distinctionSv).toBeDefined();
        expect(char.mnemonicSv).toBeDefined();
      });
    });
  });

  it('generates a question where ALL options come strictly from the SAME lookalike group', () => {
    for (let i = 0; i < 30; i++) {
      const q = generateTrickyQuestion();
      const group = TRICKY_HIRAGANA_GROUPS.find(g => g.id === q.groupId);
      expect(group).toBeDefined();

      if (q.type === 'kana_to_romaji') {
        const groupRomajis = group!.characters.map(c => c.romaji);
        q.options.forEach(opt => {
          expect(groupRomajis).toContain(opt);
        });
        expect(q.options).toContain(q.correctOption);
        expect(groupRomajis).toContain(q.correctOption);
      } else {
        const groupKanas = group!.characters.map(c => c.kana);
        q.options.forEach(opt => {
          expect(groupKanas).toContain(opt);
        });
        expect(q.options).toContain(q.correctOption);
        expect(groupKanas).toContain(q.correctOption);
      }
    }
  });

  it('generates a full quiz session of specified size', () => {
    const session10 = generateTrickyQuizSession(10);
    expect(session10).toHaveLength(10);

    const session15 = generateTrickyQuizSession(15);
    expect(session15).toHaveLength(15);
  });

  it('supports generating questions of a specific type', () => {
    const kanaToRomaji = generateTrickyQuestion({ type: 'kana_to_romaji' });
    expect(kanaToRomaji.type).toBe('kana_to_romaji');
    expect(kanaToRomaji.correctOption).toBe(kanaToRomaji.targetRomaji);

    const romajiToKana = generateTrickyQuestion({ type: 'romaji_to_kana' });
    expect(romajiToKana.type).toBe('romaji_to_kana');
    expect(romajiToKana.correctOption).toBe(romajiToKana.targetKana);
  });
});
