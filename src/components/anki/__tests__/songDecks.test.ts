import { describe, it, expect } from 'vitest';
import { 
  STAY_WITH_ME_VOCAB, 
  STAY_WITH_ME_CHAPTERS, 
  PLASTIC_LOVE_VOCAB, 
  PLASTIC_LOVE_CHAPTERS 
} from '../../../data/songDecksData';
import { getDeckItems, getDeckChapters } from '../ankiLogic';

describe('Song Decks Data & Logic', () => {
  describe('Stay With Me (松原みき)', () => {
    it('contains exactly 54 vocabulary items', () => {
      expect(STAY_WITH_ME_VOCAB.length).toBe(54);
    });

    it('has all required fields properly populated for every card', () => {
      for (const item of STAY_WITH_ME_VOCAB) {
        expect(item.japanese).toBeTruthy();
        expect(item.hiragana).toBeTruthy();
        expect(item.romaji).toBeTruthy();
        expect(item.swedish).toBeTruthy();
        expect(item.english).toBeTruthy();
        expect(item.category).toBeTruthy();
        expect(item.lesson).toContain('Stay With Me');
        expect(item.notes).toBeTruthy();
      }
    });

    it('has 5 contiguous chapters covering all 54 items', () => {
      expect(STAY_WITH_ME_CHAPTERS.length).toBe(5);
      
      let expectedStart = 0;
      for (const chap of STAY_WITH_ME_CHAPTERS) {
        expect(chap.startIndex).toBe(expectedStart);
        expect(chap.endIndex).toBe(chap.startIndex + chap.itemCount);
        expectedStart = chap.endIndex;
      }
      expect(expectedStart).toBe(54);
    });

    it('is sorted with highest frequency words first (e.g. 私 before 紛らわす)', () => {
      const watashiIndex = STAY_WITH_ME_VOCAB.findIndex(i => i.japanese === '私');
      const iuIndex = STAY_WITH_ME_VOCAB.findIndex(i => i.japanese === '言う');
      const magirawasuIndex = STAY_WITH_ME_VOCAB.findIndex(i => i.japanese === '紛らわす');

      expect(watashiIndex).toBeLessThan(iuIndex);
      expect(iuIndex).toBeLessThan(magirawasuIndex);
      expect(magirawasuIndex).toBe(53); // last item
    });

    it('integrates with getDeckItems and getDeckChapters', () => {
      const items = getDeckItems('stay_with_me');
      expect(items).toBe(STAY_WITH_ME_VOCAB);

      const chapters = getDeckChapters('stay_with_me', [0, 2]);
      expect(chapters.length).toBe(5);
      expect(chapters[0].isCompleted).toBe(true);
      expect(chapters[1].isCompleted).toBe(false);
      expect(chapters[2].isCompleted).toBe(true);
    });
  });

  describe('Plastic Love (竹内まりや)', () => {
    it('contains exactly 70 vocabulary items', () => {
      expect(PLASTIC_LOVE_VOCAB.length).toBe(70);
    });

    it('has all required fields properly populated for every card', () => {
      for (const item of PLASTIC_LOVE_VOCAB) {
        expect(item.japanese).toBeTruthy();
        expect(item.hiragana).toBeTruthy();
        expect(item.romaji).toBeTruthy();
        expect(item.swedish).toBeTruthy();
        expect(item.english).toBeTruthy();
        expect(item.category).toBeTruthy();
        expect(item.lesson).toContain('Plastic Love');
        expect(item.notes).toBeTruthy();
      }
    });

    it('has 7 contiguous chapters covering all 70 items', () => {
      expect(PLASTIC_LOVE_CHAPTERS.length).toBe(7);
      
      let expectedStart = 0;
      for (const chap of PLASTIC_LOVE_CHAPTERS) {
        expect(chap.startIndex).toBe(expectedStart);
        expect(chap.endIndex).toBe(chap.startIndex + chap.itemCount);
        expectedStart = chap.endIndex;
      }
      expect(expectedStart).toBe(70);
    });

    it('is sorted with highest frequency words first (e.g. 人 and 私 before 妖しい and 踊り明かす)', () => {
      const hitoIndex = PLASTIC_LOVE_VOCAB.findIndex(i => i.japanese === '人');
      const watashiIndex = PLASTIC_LOVE_VOCAB.findIndex(i => i.japanese === '私');
      const ayashiiIndex = PLASTIC_LOVE_VOCAB.findIndex(i => i.japanese === '妖しい');
      const odoriakasuIndex = PLASTIC_LOVE_VOCAB.findIndex(i => i.japanese === '踊り明かす');

      expect(hitoIndex).toBe(0);
      expect(watashiIndex).toBe(1);
      expect(hitoIndex).toBeLessThan(ayashiiIndex);
      expect(ayashiiIndex).toBeLessThan(odoriakasuIndex);
      expect(odoriakasuIndex).toBe(69); // last item
    });

    it('integrates with getDeckItems and getDeckChapters', () => {
      const items = getDeckItems('plastic_love');
      expect(items).toBe(PLASTIC_LOVE_VOCAB);

      const chapters = getDeckChapters('plastic_love', [1]);
      expect(chapters.length).toBe(7);
      expect(chapters[0].isCompleted).toBe(false);
      expect(chapters[1].isCompleted).toBe(true);
    });
  });
});
