import { describe, it, expect } from 'vitest';
import { 
  ANKI_ARCS, 
  ANKI_CATEGORIES, 
  getArcForChapter, 
  getArcChapters, 
  getArcCompletedCount,
  type AnkiCategoryType 
} from '../../../data/ankiArcData';
import { ANKI_CARDS, getDeckChapters } from '../ankiLogic';
import type { AnkiDeckMode } from '../../../types/anki';

describe('ANKI_ARCS Mathematical & Pedagogical Integrity', () => {
  it('contains exactly 6 arcs', () => {
    expect(ANKI_ARCS).toHaveLength(6);
    const arcNumbers = ANKI_ARCS.map((a) => a.arcNumber);
    expect(arcNumbers).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('covers chapter indices 0 through 207 contiguously with 0 gaps and 0 overlaps', () => {
    // Arc 1 must start at index 0 and chapter 1
    expect(ANKI_ARCS[0].startChapterIndex).toBe(0);
    expect(ANKI_ARCS[0].startChapter).toBe(1);

    // Final Arc must end at index 207 and chapter 208
    expect(ANKI_ARCS[ANKI_ARCS.length - 1].endChapterIndex).toBe(207);
    expect(ANKI_ARCS[ANKI_ARCS.length - 1].endChapter).toBe(208);

    // Contiguity & disjointness check across adjacent arcs
    for (let i = 0; i < ANKI_ARCS.length; i++) {
      const arc = ANKI_ARCS[i];
      // Index consistency: endChapterIndex - startChapterIndex + 1 === totalChapters
      expect(arc.endChapterIndex - arc.startChapterIndex + 1).toBe(arc.totalChapters);
      // 1-indexed consistency
      expect(arc.endChapter - arc.startChapter + 1).toBe(arc.totalChapters);
      expect(arc.startChapter).toBe(arc.startChapterIndex + 1);
      expect(arc.endChapter).toBe(arc.endChapterIndex + 1);

      if (i > 0) {
        const prevArc = ANKI_ARCS[i - 1];
        // 0 gaps: next start is prev end + 1
        expect(arc.startChapterIndex).toBe(prevArc.endChapterIndex + 1);
        expect(arc.startChapter).toBe(prevArc.endChapter + 1);
      }
    }

    // Comprehensive check: Every chapter index 0..207 belongs to exactly one arc
    const indexCoverage = new Array(208).fill(0);
    ANKI_ARCS.forEach((arc) => {
      for (let idx = arc.startChapterIndex; idx <= arc.endChapterIndex; idx++) {
        indexCoverage[idx]++;
      }
    });
    for (let idx = 0; idx < 208; idx++) {
      expect(indexCoverage[idx]).toBe(1);
    }
  });

  it('verifies that total chapters sum to exactly 208', () => {
    const totalChapters = ANKI_ARCS.reduce((sum, arc) => sum + arc.totalChapters, 0);
    expect(totalChapters).toBe(208);
  });

  it('verifies that total cards sum up to exactly 2,075 cards matching ANKI_CARDS.length', () => {
    expect(ANKI_CARDS.length).toBe(2075);
    const sumCards = ANKI_ARCS.reduce((sum, arc) => sum + arc.totalCards, 0);
    expect(sumCards).toBe(2075);

    // Verify individual arc card distributions
    // Arcs 1-5 have 35 chapters * 10 cards = 350 cards each
    for (let i = 0; i < 5; i++) {
      expect(ANKI_ARCS[i].totalChapters).toBe(35);
      expect(ANKI_ARCS[i].totalCards).toBe(350);
    }
    // Arc 6 has 33 chapters: 32 chapters * 10 cards + chapter 207 with 5 cards = 325 cards
    expect(ANKI_ARCS[5].totalChapters).toBe(33);
    expect(ANKI_ARCS[5].totalCards).toBe(325);
  });

  it('verifies getArcForChapter(i) maps correctly for all 0 <= i <= 207', () => {
    for (let i = 0; i <= 207; i++) {
      const arc = getArcForChapter(i);
      expect(arc).toBeDefined();
      expect(i).toBeGreaterThanOrEqual(arc!.startChapterIndex);
      expect(i).toBeLessThanOrEqual(arc!.endChapterIndex);
    }

    // Boundary stress testing
    expect(getArcForChapter(-1)).toBeUndefined();
    expect(getArcForChapter(-100)).toBeUndefined();
    expect(getArcForChapter(208)).toBeUndefined();
    expect(getArcForChapter(999)).toBeUndefined();
  });

  it('verifies getArcChapters returns the exact slice of chapters', () => {
    const allChapters = getDeckChapters('anki', []);
    expect(allChapters.length).toBe(208);

    ANKI_ARCS.forEach((arc) => {
      const arcChapters = getArcChapters(arc, allChapters);
      expect(arcChapters.length).toBe(arc.totalChapters);
      expect(arcChapters[0].index).toBe(arc.startChapterIndex);
      expect(arcChapters[arcChapters.length - 1].index).toBe(arc.endChapterIndex);

      const cardCount = arcChapters.reduce((sum, c) => sum + c.itemCount, 0);
      expect(cardCount).toBe(arc.totalCards);
    });
  });

  describe('getArcCompletedCount stress tests', () => {
    const arc1 = ANKI_ARCS[0]; // 0..34

    it('returns 0 for empty or undefined input', () => {
      expect(getArcCompletedCount(arc1, [])).toBe(0);
      // @ts-expect-error test undefined/null safety
      expect(getArcCompletedCount(arc1, null)).toBe(0);
      // @ts-expect-error test undefined/null safety
      expect(getArcCompletedCount(arc1, undefined)).toBe(0);
    });

    it('returns exact count for completed chapters in the arc', () => {
      expect(getArcCompletedCount(arc1, [0])).toBe(1);
      expect(getArcCompletedCount(arc1, [0, 1, 2, 34])).toBe(4);
    });

    it('ignores completed chapters from other arcs', () => {
      expect(getArcCompletedCount(arc1, [35, 36, 100, 207])).toBe(0);
    });

    it('handles duplicate indices without overcounting', () => {
      expect(getArcCompletedCount(arc1, [0, 0, 1, 1, 2, 2])).toBe(3);
    });

    it('returns totalChapters when all chapters in arc are complete', () => {
      const allArc1 = Array.from({ length: 35 }, (_, i) => i);
      expect(getArcCompletedCount(arc1, allArc1)).toBe(35);

      const allArc6 = Array.from({ length: 33 }, (_, i) => 175 + i);
      expect(getArcCompletedCount(ANKI_ARCS[5], allArc6)).toBe(33);
    });
  });

  describe('Arc Metadata, Icons, Badges & Theme integrity', () => {
    it('has complete metadata, badges, and valid Tailwind themes for each arc', () => {
      ANKI_ARCS.forEach((arc) => {
        expect(arc.id).toMatch(/^arc-[1-6]$/);
        expect(arc.titleSv).toBeTruthy();
        expect(arc.titleJap).toBeTruthy();
        expect(arc.romajiTitle).toBeTruthy();
        expect(arc.descriptionSv).toBeTruthy();
        expect(arc.badgeId).toBe(`arc_${arc.arcNumber}_master`);
        expect(arc.badgeTitle).toBeTruthy();
        expect(arc.badgeJap).toBeTruthy();
        expect(arc.badgeDescription).toBeTruthy();
        expect(arc.icon).toBeDefined();
        expect(arc.theme.accentColor).toContain('text-');
        expect(arc.theme.badgeBg).toContain('bg-');
        expect(arc.theme.badgeBorder).toContain('border-');
        expect(arc.theme.progressColor).toContain('bg-');
        expect(arc.theme.borderHighlight).toContain('border-');
      });
    });
  });
});

describe('ANKI_CATEGORIES Deck Organization Integrity', () => {
  it('defines 7 top-level categories', () => {
    expect(ANKI_CATEGORIES).toHaveLength(7);
    const categoryIds: AnkiCategoryType[] = ANKI_CATEGORIES.map((c) => c.id);
    expect(categoryIds).toEqual(['custom', 'kana', 'immersion', 'repetition', 'exam', 'music', 'travel']);
  });

  it('covers all 11 AnkiDeckModes with 0 omissions and 0 duplicates', () => {
    const allExpectedModes: AnkiDeckMode[] = [
      'custom',
      'kana',
      'anki',
      'due',
      'weak',
      'bookmarks',
      'genki',
      'stay_with_me',
      'plastic_love',
      'words',
      'phrases'
    ];

    const mappedModes = ANKI_CATEGORIES.flatMap((c) => c.availableDecks.map((d) => d.mode));
    expect(mappedModes).toHaveLength(11);
    expect(new Set(mappedModes).size).toBe(11);
    expect(mappedModes.sort()).toEqual(allExpectedModes.sort());
  });

  it('ensures each category has a valid defaultDeck from its availableDecks', () => {
    ANKI_CATEGORIES.forEach((cat) => {
      const modeList = cat.availableDecks.map((d) => d.mode);
      expect(modeList).toContain(cat.defaultDeck);
    });
  });

  it('ensures categories have valid icons and descriptive titles', () => {
    ANKI_CATEGORIES.forEach((cat) => {
      expect(cat.title).toBeTruthy();
      expect(cat.icon).toBeDefined();
      expect(cat.availableDecks.length).toBeGreaterThan(0);
      cat.availableDecks.forEach((deck) => {
        expect(deck.label).toBeTruthy();
        expect(deck.sublabel).toBeTruthy();
      });
    });
  });
});
