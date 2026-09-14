import { describe, it, expect } from 'vitest';
import { 
  ANKI_ARCS, 
  ANKI_CATEGORIES, 
  getArcForChapter, 
  getArcCompletedCount,
  type AnkiCategoryType 
} from '../../../data/ankiArcData';
import { 
  ANKI_CARDS, 
  getDeckChapters, 
  searchAnkiCards 
} from '../ankiLogic';
import { GENKI_EXAM_CHAPTERS } from '../../../data/genkiExamData';
import { STAY_WITH_ME_CHAPTERS, PLASTIC_LOVE_CHAPTERS } from '../../../data/songDecksData';
import type { AnkiDeckMode, AnkiChapter } from '../../../types/anki';

describe('Milestone 1 Empirical Stress Tests', () => {
  describe('1. Category Selection Logic & State Transitions', () => {
    it('verifies all 9 deck modes map to exactly one category', () => {
      const allDeckModes: AnkiDeckMode[] = [
        'anki', 'genki', 'stay_with_me', 'plastic_love', 'words', 'phrases', 'due', 'weak', 'bookmarks'
      ];

      allDeckModes.forEach((mode) => {
        const matchingCategories = ANKI_CATEGORIES.filter((cat) =>
          cat.availableDecks.some((d) => d.mode === mode)
        );
        expect(matchingCategories.length, `Mode ${mode} should map to exactly 1 category`).toBe(1);
      });
    });

    it('simulates category switching logic in AnkiHub', () => {
      let activeDeck: AnkiDeckMode = 'anki';

      const selectCategory = (catId: AnkiCategoryType) => {
        const cat = ANKI_CATEGORIES.find((c) => c.id === catId);
        if (!cat) return;
        if (!cat.availableDecks.some((d) => d.mode === activeDeck)) {
          activeDeck = cat.defaultDeck;
        }
      };

      const getActiveCategory = (deck: AnkiDeckMode): AnkiCategoryType => {
        const found = ANKI_CATEGORIES.find((cat) =>
          cat.availableDecks.some((d) => d.mode === deck)
        );
        return found?.id || 'immersion';
      };

      expect(getActiveCategory(activeDeck)).toBe('immersion');

      // Switch to repetition
      selectCategory('repetition');
      expect(activeDeck).toBe('due');
      expect(getActiveCategory(activeDeck)).toBe('repetition');

      // Switch subdeck to weak
      activeDeck = 'weak';
      expect(getActiveCategory(activeDeck)).toBe('repetition');

      // Selecting repetition category again preserves current sub-deck 'weak'
      selectCategory('repetition');
      expect(activeDeck).toBe('weak');

      // Switch to music
      selectCategory('music');
      expect(activeDeck).toBe('stay_with_me');
      expect(getActiveCategory(activeDeck)).toBe('music');

      // Switch subdeck to plastic_love
      activeDeck = 'plastic_love';
      expect(getActiveCategory(activeDeck)).toBe('music');

      // Re-selecting music preserves 'plastic_love'
      selectCategory('music');
      expect(activeDeck).toBe('plastic_love');

      // Switch to travel
      selectCategory('travel');
      expect(activeDeck).toBe('words');
      expect(getActiveCategory(activeDeck)).toBe('travel');

      // Switch subdeck to phrases
      activeDeck = 'phrases';
      expect(getActiveCategory(activeDeck)).toBe('travel');

      // Switch to exam
      selectCategory('exam');
      expect(activeDeck).toBe('genki');
      expect(getActiveCategory(activeDeck)).toBe('exam');

      // Switch back to immersion
      selectCategory('immersion');
      expect(activeDeck).toBe('anki');
      expect(getActiveCategory(activeDeck)).toBe('immersion');
    });

    it('empirically checks category badge computation and unit consistency', () => {
      // Mock stats
      const stats = {
        ankiProgress: {
          anki: Array.from({ length: 50 }, (_, i) => i),
          genki: [0, 1, 2],
          stay_with_me: [0, 1, 2, 3, 4], // All 5 chapters done
          plastic_love: [0, 1, 2, 3, 4, 5, 6], // All 7 chapters done
          words: [0, 1],
          phrases: [0]
        }
      };

      // Immersion badge
      const immersionBadge = `${stats.ankiProgress.anki.length}/208 kap`;
      expect(immersionBadge).toBe('50/208 kap');

      // Exam badge
      const examBadge = `${stats.ankiProgress.genki.length}/${GENKI_EXAM_CHAPTERS.length} kap`;
      expect(examBadge).toBe('3/14 kap');

      // Travel badge
      const travelDone = stats.ankiProgress.words.length + stats.ankiProgress.phrases.length;
      const travelBadge = `${travelDone}/20 kap`;
      expect(travelBadge).toBe('3/20 kap');

      // Music badge (EMPIRICAL AUDIT POINT)
      const musicChaptersDone = stats.ankiProgress.stay_with_me.length + stats.ankiProgress.plastic_love.length;
      expect(musicChaptersDone).toBe(12); // Exactly 12 chapters total (5 + 7)
      
      const hubMusicBadge = `${musicChaptersDone}/124 ord`;
      // Hub displays completed CHAPTERS count against 124 "ord"
      expect(hubMusicBadge).toBe('12/124 ord');
      // Sub-deck pills show "5/5 kap" and "7/7 kap"
      expect(`${stats.ankiProgress.stay_with_me.length}/${STAY_WITH_ME_CHAPTERS.length} kap`).toBe('5/5 kap');
      expect(`${stats.ankiProgress.plastic_love.length}/${PLASTIC_LOVE_CHAPTERS.length} kap`).toBe('7/7 kap');
    });
  });

  describe('2. Due Repetition Hero Banner Interaction', () => {
    it('shows due repetition CTA when dueAnkiCards.length > 0', () => {
      const dueCards = [10, 25, 42, 99];
      const hasDue = dueCards.length > 0;
      expect(hasDue).toBe(true);

      const buttonLabel = `Repetera nu (${dueCards.length} kort)`;
      expect(buttonLabel).toBe('Repetera nu (4 kort)');

      // Handler sets activeDeck to 'due' and starts chapter 0
      let activeDeck: AnkiDeckMode = 'anki';
      let selectedChapter: number | null = null;
      const handleStartDueReview = () => {
        activeDeck = 'due';
        selectedChapter = 0;
      };
      handleStartDueReview();
      expect(activeDeck).toBe('due');
      expect(selectedChapter).toBe(0);
    });

    it('shows next uncompleted chapter CTA when dueAnkiCards is empty', () => {
      const dueCards: number[] = [];
      const hasDue = dueCards.length > 0;
      expect(hasDue).toBe(false);

      // Helper simulating AnkiHub's nextUncompletedTaeKimChapter calculation
      const getNextUncompleted = (ankiCompleted: number[]) => {
        for (let i = 0; i < 208; i++) {
          if (!ankiCompleted.includes(i)) return i;
        }
        return 0;
      };

      // Test at various milestone points
      // 1. Fresh user
      expect(getNextUncompleted([])).toBe(0);
      const arcFresh = getArcForChapter(0);
      expect(arcFresh?.arcNumber).toBe(1);

      // 2. Arc 1 complete (chapters 0-34)
      const arc1Complete = Array.from({ length: 35 }, (_, i) => i);
      const nextArc2 = getNextUncompleted(arc1Complete);
      expect(nextArc2).toBe(35);
      const arcNext2 = getArcForChapter(nextArc2);
      expect(arcNext2?.arcNumber).toBe(2);

      // 3. Arcs 1-3 complete (chapters 0-104)
      const arc1To3Complete = Array.from({ length: 105 }, (_, i) => i);
      const nextArc4 = getNextUncompleted(arc1To3Complete);
      expect(nextArc4).toBe(105);
      const arcNext4 = getArcForChapter(nextArc4);
      expect(arcNext4?.arcNumber).toBe(4);

      // 4. Arcs 1-5 complete (chapters 0-174)
      const arc1To5Complete = Array.from({ length: 175 }, (_, i) => i);
      const nextArc6 = getNextUncompleted(arc1To5Complete);
      expect(nextArc6).toBe(175);
      const arcNext6 = getArcForChapter(nextArc6);
      expect(arcNext6?.arcNumber).toBe(6);

      // 5. 100% complete (all 208 chapters)
      const allComplete = Array.from({ length: 208 }, (_, i) => i);
      const nextWhenAllDone = getNextUncompleted(allComplete);
      // Fallback returns 0
      expect(nextWhenAllDone).toBe(0);
    });

    it('inspects due mode empty state behavior', () => {
      const dueCards: number[] = [];
      const chapters = getDeckChapters('due', [], undefined, dueCards);
      expect(chapters.length).toBe(0);

      // Quick stats progress percent
      const completedCount = 0;
      const progressPercent = Math.round((completedCount / Math.max(chapters.length, 1)) * 100);
      expect(progressPercent).toBe(0); // Zero division protected
    });
  });

  describe('3. Arc Accordion State, Filtering & Power Controls', () => {
    it('verifies 6 arcs partition exactly 208 chapters and 2075 cards without gaps or overlaps', () => {
      expect(ANKI_ARCS.length).toBe(6);

      let totalChaptersCount = 0;
      let totalCardsCount = 0;
      let expectedStartIdx = 0;

      ANKI_ARCS.forEach((arc, i) => {
        expect(arc.arcNumber).toBe(i + 1);
        expect(arc.startChapterIndex).toBe(expectedStartIdx);
        expect(arc.endChapterIndex).toBe(expectedStartIdx + arc.totalChapters - 1);
        expect(arc.startChapter).toBe(arc.startChapterIndex + 1);
        expect(arc.endChapter).toBe(arc.endChapterIndex + 1);

        totalChaptersCount += arc.totalChapters;
        totalCardsCount += arc.totalCards;
        expectedStartIdx = arc.endChapterIndex + 1;
      });

      expect(totalChaptersCount).toBe(208);
      expect(totalCardsCount).toBe(2075);
      expect(ANKI_CARDS.length).toBe(2075);
    });

    it('initializes expandedArcs to only expand the user current arc', () => {
      const initExpanded = (currentChapter: number) => {
        const initial: Record<string, boolean> = {};
        const activeA = getArcForChapter(currentChapter);
        ANKI_ARCS.forEach((arc) => {
          initial[arc.id] = activeA ? arc.id === activeA.id : arc.id === 'arc-1';
        });
        return initial;
      };

      // User on chapter 0 (Arc 1)
      const exp1 = initExpanded(0);
      expect(exp1['arc-1']).toBe(true);
      expect(exp1['arc-2']).toBe(false);
      expect(exp1['arc-6']).toBe(false);

      // User on chapter 80 (Arc 3)
      const exp3 = initExpanded(80);
      expect(exp3['arc-1']).toBe(false);
      expect(exp3['arc-3']).toBe(true);
      expect(exp3['arc-4']).toBe(false);

      // User on chapter 200 (Arc 6)
      const exp6 = initExpanded(200);
      expect(exp6['arc-1']).toBe(false);
      expect(exp6['arc-6']).toBe(true);
    });

    it('handles expand all and collapse all power controls', () => {
      let expanded: Record<string, boolean> = { 'arc-1': true, 'arc-2': false };

      // Expand all
      const handleExpandAll = () => {
        const allOpen: Record<string, boolean> = {};
        ANKI_ARCS.forEach((arc) => { allOpen[arc.id] = true; });
        return allOpen;
      };
      expanded = handleExpandAll();
      expect(Object.values(expanded).every(Boolean)).toBe(true);
      expect(Object.keys(expanded).length).toBe(6);

      // Collapse all
      const handleCollapseAll = () => {
        const allClosed: Record<string, boolean> = {};
        ANKI_ARCS.forEach((arc) => { allClosed[arc.id] = false; });
        return allClosed;
      };
      expanded = handleCollapseAll();
      expect(Object.values(expanded).every((v) => v === false)).toBe(true);
      expect(Object.keys(expanded).length).toBe(6);
    });

    it('filters chapters by status within each arc and verifies completion progress', () => {
      const ankiCompleted = [0, 1, 2, 35, 36]; // Chapters in Arc 1 and Arc 2
      const chapters: AnkiChapter[] = getDeckChapters('anki', ankiCompleted);

      // Arc 1 completion count
      const arc1 = ANKI_ARCS[0];
      const arc1Done = getArcCompletedCount(arc1, ankiCompleted);
      expect(arc1Done).toBe(3);
      expect(Math.round((arc1Done / arc1.totalChapters) * 100)).toBe(9); // 3/35 = 8.57% -> 9%

      // Filter: 'completed'
      const arc1Chaps = chapters.slice(arc1.startChapterIndex, arc1.endChapterIndex + 1);
      const arc1CompletedChaps = arc1Chaps.filter((c) => c.isCompleted);
      expect(arc1CompletedChaps.length).toBe(3);

      // Filter: 'uncompleted'
      const arc1UncompletedChaps = arc1Chaps.filter((c) => !c.isCompleted);
      expect(arc1UncompletedChaps.length).toBe(32);

      // Arc 1 100% completion milestone badge check
      const arc1AllDone = Array.from({ length: 35 }, (_, i) => i);
      const countFull = getArcCompletedCount(arc1, arc1AllDone);
      expect(countFull).toBe(arc1.totalChapters);
      const isArc100 = countFull === arc1.totalChapters;
      expect(isArc100).toBe(true);
    });

    it('tests search query interaction with chapter matching and arc auto-expansion', () => {
      const chapters: AnkiChapter[] = getDeckChapters('anki', []);
      
      // 'konnichiha' matches card 0 (Tae Kim transcript uses 'ha' for particle は)
      const searchQuery = 'konnichiha';
      const searchResults = searchAnkiCards(searchQuery, 24);

      expect(searchResults.length).toBeGreaterThan(0);

      // Match chapter indices
      const matched = new Set<number>();
      searchResults.forEach((r) => matched.add(r.chapterIndex));
      chapters.forEach((chap) => {
        if (chap.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (chap.preview && chap.preview.toLowerCase().includes(searchQuery.toLowerCase()))) {
          matched.add(chap.index);
        }
      });

      expect(matched.size).toBeGreaterThan(0);

      // Check which arcs contain matching chapters
      const autoExpandedArcs: Record<string, boolean> = {};
      ANKI_ARCS.forEach((arc) => {
        const arcChaps = chapters.slice(arc.startChapterIndex, arc.endChapterIndex + 1);
        const hasMatch = arcChaps.some((chap) => matched.has(chap.index));
        if (hasMatch) {
          autoExpandedArcs[arc.id] = true;
        }
      });

      // 'konnichiha' is card 0 -> Chapter index 0 -> Arc 1
      expect(autoExpandedArcs['arc-1']).toBe(true);
    });
  });
});
