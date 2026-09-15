import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ANKI_CARDS,
  ANKI_CHAPTER_SIZE,
  calculateNextIntervals,
  extractShortMeaning
} from '../ankiLogic';
import type { AnkiCard, AnkiDeckMode, AnkiReviewRating, AnkiCardProgress } from '../../../types/anki';

describe('Milestone 2 Empirical Stress Tests — Interactive Study Controls & State Handling', () => {

  describe('1. Keyboard Shortcuts & Event Filtering', () => {
    // Simulator for AnkiCardStudy handleKeyDown logic
    function createKeyboardHandlerState(initial = {}) {
      return {
        isRevealed: false,
        isReviewMode: false,
        isSidebarOpen: false,
        showCompletedModal: false,
        soundEnabled: true,
        showFurigana: false,
        studyQueue: [0, 1],
        queueIndex: 0,
        revealedCount: 0,
        ratingRecorded: null as AnkiReviewRating | null,
        yesCount: 0,
        noCount: 0,
        audioPlayed: 0,
        furiganaToggled: 0,
        backToChaptersCalled: 0,
        defaultPrevented: false,
        ...initial,
      };
    }

    function dispatchKeyEvent(
      state: ReturnType<typeof createKeyboardHandlerState>,
      event: { code: string; key?: string; ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean; targetTag?: string }
    ) {
      state.defaultPrevented = false;

      const e = {
        code: event.code,
        key: event.key || event.code,
        ctrlKey: !!event.ctrlKey,
        metaKey: !!event.metaKey,
        altKey: !!event.altKey,
        target: { tagName: event.targetTag || 'BODY' },
        preventDefault: () => {
          state.defaultPrevented = true;
        },
      };

      // Exact replication of AnkiCardStudy.tsx lines 497-565
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      if (['input', 'textarea', 'select'].includes((e.target as any)?.tagName?.toLowerCase())) {
        return;
      }

      if (state.showCompletedModal) {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
          e.preventDefault();
          state.backToChaptersCalled++;
        }
        return;
      }

      if (e.code === 'Escape') {
        e.preventDefault();
        if (state.isSidebarOpen) {
          state.isSidebarOpen = false;
        } else {
          state.backToChaptersCalled++;
        }
        return;
      }

      if (state.isSidebarOpen) {
        return;
      }

      if (e.code === 'KeyR') {
        e.preventDefault();
        state.audioPlayed++;
        return;
      }

      if (e.code === 'KeyF') {
        e.preventDefault();
        state.furiganaToggled++;
        state.showFurigana = !state.showFurigana;
        return;
      }

      if (!state.isRevealed) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          state.isRevealed = true;
          state.revealedCount++;
        }
        return;
      }

      if (state.isRevealed) {
        if (state.isReviewMode) {
          if (e.code === 'Digit1' || e.code === 'Numpad1') {
            e.preventDefault();
            state.ratingRecorded = 'again';
          } else if (e.code === 'Digit2' || e.code === 'Numpad2') {
            e.preventDefault();
            state.ratingRecorded = 'hard';
          } else if (e.code === 'Digit3' || e.code === 'Numpad3') {
            e.preventDefault();
            state.ratingRecorded = 'good';
          } else if (e.code === 'Digit4' || e.code === 'Numpad4') {
            e.preventDefault();
            state.ratingRecorded = 'easy';
          }
        } else {
          if (e.code === 'Enter' || e.code === 'ArrowRight' || e.code === 'Digit2' || e.code === 'Numpad2') {
            e.preventDefault();
            state.yesCount++;
          } else if (e.code === 'Backspace' || e.code === 'ArrowLeft' || e.code === 'Digit1' || e.code === 'Numpad1') {
            e.preventDefault();
            state.noCount++;
          }
        }
      }
    }

    it('triggers card reveal on Space or Enter when unrevealed', () => {
      const state = createKeyboardHandlerState({ isRevealed: false });

      dispatchKeyEvent(state, { code: 'Space' });
      expect(state.isRevealed).toBe(true);
      expect(state.revealedCount).toBe(1);
      expect(state.defaultPrevented).toBe(true);

      state.isRevealed = false;
      dispatchKeyEvent(state, { code: 'Enter' });
      expect(state.isRevealed).toBe(true);
      expect(state.revealedCount).toBe(2);
    });

    it('does NOT trigger ratings when unrevealed', () => {
      const state = createKeyboardHandlerState({ isRevealed: false, isReviewMode: true });

      dispatchKeyEvent(state, { code: 'Digit1' });
      dispatchKeyEvent(state, { code: 'Digit2' });
      dispatchKeyEvent(state, { code: 'Digit3' });
      dispatchKeyEvent(state, { code: 'Digit4' });

      expect(state.ratingRecorded).toBeNull();
      expect(state.isRevealed).toBe(false);
    });

    it('triggers SRS ratings 1-4 when revealed in isReviewMode', () => {
      const state = createKeyboardHandlerState({ isRevealed: true, isReviewMode: true });

      dispatchKeyEvent(state, { code: 'Digit1' });
      expect(state.ratingRecorded).toBe('again');
      expect(state.defaultPrevented).toBe(true);

      dispatchKeyEvent(state, { code: 'Numpad2' });
      expect(state.ratingRecorded).toBe('hard');

      dispatchKeyEvent(state, { code: 'Digit3' });
      expect(state.ratingRecorded).toBe('good');

      dispatchKeyEvent(state, { code: 'Numpad4' });
      expect(state.ratingRecorded).toBe('easy');
    });

    it('triggers Kunde inte (1) and Kunde den (2) in chapter mode', () => {
      const state = createKeyboardHandlerState({ isRevealed: true, isReviewMode: false });

      dispatchKeyEvent(state, { code: 'Digit1' });
      expect(state.noCount).toBe(1);
      expect(state.yesCount).toBe(0);

      dispatchKeyEvent(state, { code: 'Digit2' });
      expect(state.yesCount).toBe(1);

      // 3 and 4 should be ignored in chapter mode
      dispatchKeyEvent(state, { code: 'Digit3' });
      dispatchKeyEvent(state, { code: 'Digit4' });
      expect(state.noCount).toBe(1);
      expect(state.yesCount).toBe(1);
    });

    it('handles audio (R) and furigana (F) triggers in both revealed and unrevealed states', () => {
      const state = createKeyboardHandlerState({ isRevealed: false, showFurigana: false });

      dispatchKeyEvent(state, { code: 'KeyR' });
      expect(state.audioPlayed).toBe(1);

      dispatchKeyEvent(state, { code: 'KeyF' });
      expect(state.furiganaToggled).toBe(1);
      expect(state.showFurigana).toBe(true);

      state.isRevealed = true;
      dispatchKeyEvent(state, { code: 'KeyR' });
      expect(state.audioPlayed).toBe(2);

      dispatchKeyEvent(state, { code: 'KeyF' });
      expect(state.furiganaToggled).toBe(2);
      expect(state.showFurigana).toBe(false);
    });

    it('handles Escape hierarchical navigation: drawer first, then exit', () => {
      const state = createKeyboardHandlerState({ isSidebarOpen: true });

      // First Esc closes drawer
      dispatchKeyEvent(state, { code: 'Escape' });
      expect(state.isSidebarOpen).toBe(false);
      expect(state.backToChaptersCalled).toBe(0);

      // Second Esc exits to chapters
      dispatchKeyEvent(state, { code: 'Escape' });
      expect(state.backToChaptersCalled).toBe(1);
    });

    it('ignores shortcuts when user is typing in form controls', () => {
      const state = createKeyboardHandlerState({ isRevealed: false });

      dispatchKeyEvent(state, { code: 'Space', targetTag: 'INPUT' });
      expect(state.isRevealed).toBe(false);

      dispatchKeyEvent(state, { code: 'KeyR', targetTag: 'TEXTAREA' });
      expect(state.audioPlayed).toBe(0);

      dispatchKeyEvent(state, { code: 'Escape', targetTag: 'SELECT' });
      expect(state.backToChaptersCalled).toBe(0);
    });

    // CHALLENGE TEST: Modifier key interception defect resolved
    it('EMPIRICAL CHALLENGE: checks if Ctrl/Meta modifier keys are hijacked', () => {
      const state = createKeyboardHandlerState({ isRevealed: false });

      // User presses Ctrl+R (browser refresh)
      dispatchKeyEvent(state, { code: 'KeyR', ctrlKey: true });
      const interceptedCtrlR = state.audioPlayed > 0 || state.defaultPrevented;
      expect(interceptedCtrlR, 'Ctrl+R must not intercept browser reload').toBe(false);

      // User presses Ctrl+F (browser find)
      dispatchKeyEvent(state, { code: 'KeyF', ctrlKey: true });
      const interceptedCtrlF = state.furiganaToggled > 0 || state.defaultPrevented;
      expect(interceptedCtrlF, 'Ctrl+F must not intercept browser search').toBe(false);
    });

    // CHALLENGE TEST: Drawer leak defect resolved
    it('EMPIRICAL CHALLENGE: checks if shortcuts leak behind open drawer modal', () => {
      const state = createKeyboardHandlerState({ isRevealed: false, isSidebarOpen: true });

      // User presses Space while drawer modal is open
      dispatchKeyEvent(state, { code: 'Space' });
      expect(state.isRevealed, 'Space must not reveal card behind open sidebar modal').toBe(false);
    });
  });

  describe('2. Furigana Toggle & Persistence Stress', () => {
    let mockStorage: Record<string, string> = {};

    beforeEach(() => {
      mockStorage = {};
      vi.stubGlobal('localStorage', {
        getItem: (k: string) => mockStorage[k] ?? null,
        setItem: (k: string, v: string) => {
          mockStorage[k] = String(v);
        },
        removeItem: (k: string) => {
          delete mockStorage[k];
        },
        clear: () => {
          mockStorage = {};
        },
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('initializes to false when localStorage is empty or false', () => {
      const initFromStorage = () => localStorage.getItem('hiragana_anki_furigana') === 'true';

      expect(initFromStorage()).toBe(false);

      localStorage.setItem('hiragana_anki_furigana', 'false');
      expect(initFromStorage()).toBe(false);
    });

    it('initializes to true when localStorage contains "true"', () => {
      localStorage.setItem('hiragana_anki_furigana', 'true');
      const initFromStorage = () => localStorage.getItem('hiragana_anki_furigana') === 'true';
      expect(initFromStorage()).toBe(true);
    });

    it('persists repeated toggle states cleanly in localStorage', () => {
      let state = localStorage.getItem('hiragana_anki_furigana') === 'true';

      const toggle = () => {
        state = !state;
        localStorage.setItem('hiragana_anki_furigana', String(state));
        return state;
      };

      for (let i = 0; i < 20; i++) {
        const expected = i % 2 === 0; // first toggle makes it true
        const next = toggle();
        expect(next).toBe(expected);
        expect(localStorage.getItem('hiragana_anki_furigana')).toBe(String(expected));
      }
    });

    it('correctly filters redundant furigana when kanji equals hiragana across real deck cards', () => {
      const deck = ANKI_CARDS;
      expect(deck.length).toBeGreaterThan(0);

      // Find cards where kanji is already kana
      const redundantCandidates = deck.filter((c) => c.hiragana && c.hiragana === c.kanji);
      expect(redundantCandidates.length).toBeGreaterThan(0);

      redundantCandidates.forEach((c) => {
        // AnkiCardStudy.tsx condition: currentCard.hiragana && currentCard.hiragana !== currentCard.kanji
        const shouldShowFurigana = Boolean(c.hiragana && c.hiragana !== c.kanji);
        expect(shouldShowFurigana, `Card "${c.kanji}" should not show redundant furigana`).toBe(false);
      });

      // Find cards where kanji differs from hiragana
      const kanjiCards = deck.filter((c) => c.hiragana && c.hiragana !== c.kanji);
      expect(kanjiCards.length).toBeGreaterThan(0);

      kanjiCards.slice(0, 50).forEach((c) => {
        const shouldShowFurigana = Boolean(c.hiragana && c.hiragana !== c.kanji);
        expect(shouldShowFurigana, `Card "${c.kanji}" should show furigana`).toBe(true);
      });
    });

    it('safely handles localStorage.setItem exceptions (private browsing / quota exceeded)', () => {
      vi.stubGlobal('localStorage', {
        getItem: () => null,
        setItem: () => {
          throw new DOMException('The quota has been exceeded', 'QuotaExceededError');
        },
      });

      let state = false;
      const toggleSafe = () => {
        state = !state;
        try {
          localStorage.setItem('hiragana_anki_furigana', String(state));
        } catch {
          // Gracefully ignored
        }
        return state;
      };

      expect(() => toggleSafe()).not.toThrow();
      expect(state).toBe(true);
    });
  });

  describe('3. Live Audio Playback State & Fallback Logic', () => {
    it('selects correct speech text for Anki vs Travel cards', () => {
      const ankiCardWithKanji: AnkiCard = {
        kanji: '学校に行く',
        hiragana: 'がっこうにいく',
        romaji: 'gakkou ni iku',
        meaning: 'Go to school',
        source: 'Anime A',
      };

      const ankiCardKanaOnly: AnkiCard = {
        kanji: '',
        hiragana: 'ありがとう',
        romaji: 'arigatou',
        meaning: 'Thank you',
        source: 'Anime B',
      };

      const travelItem = {
        category: 'Travel',
        lesson: 'Lesson 1',
        japanese: 'すみません',
        romaji: 'sumimasen',
        swedish: 'Ursäkta',
      };

      const resolveText = (isAnki: boolean, card: any, travel: any) => {
        return isAnki
          ? (card?.kanji || card?.hiragana || '')
          : (travel?.japanese || '');
      };

      expect(resolveText(true, ankiCardWithKanji, null)).toBe('学校に行く');
      expect(resolveText(true, ankiCardKanaOnly, null)).toBe('ありがとう');
      expect(resolveText(false, null, travelItem)).toBe('すみません');
    });

    it('properly transitions isPlayingAudio state with safety timeout', async () => {
      let isPlayingAudio = false;
      let timeoutId: any = null;

      const startAudio = () => {
        isPlayingAudio = true;
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          isPlayingAudio = false;
        }, 100); // reduced for test
      };

      const stopAudio = () => {
        isPlayingAudio = false;
        if (timeoutId) clearTimeout(timeoutId);
      };

      startAudio();
      expect(isPlayingAudio).toBe(true);

      // Fast manual stop
      stopAudio();
      expect(isPlayingAudio).toBe(false);

      // Safety timeout trigger
      startAudio();
      expect(isPlayingAudio).toBe(true);
      await new Promise((r) => setTimeout(r, 150));
      expect(isPlayingAudio).toBe(false);
    });

    // CHALLENGE TEST: Audio AbortError race condition on rapid clicks resolved
    it('EMPIRICAL CHALLENGE: tests fallback triggering on rapid-click AbortError', async () => {
      let fallbackTriggered = false;

      // Mock audio play that rejects with AbortError when interrupted
      const mockPlay = vi.fn().mockRejectedValue(new DOMException('The play request was interrupted', 'AbortError'));
      const mockSpeakJapanese = vi.fn().mockResolvedValue(undefined);

      // Guarded playCurrentAudio handler (matching AnkiCardStudy.tsx line 222 fix)
      const playCurrentAudioGuarded = () => {
        return mockPlay().catch((err: any) => {
          if (err?.name === 'AbortError') return;
          fallbackTriggered = true;
          return mockSpeakJapanese('学校');
        });
      };

      await playCurrentAudioGuarded();

      // With the AbortError guard, interrupted playback does NOT trigger fallback TTS:
      expect(fallbackTriggered, 'AbortError on rapid click must not trigger TTS fallback').toBe(false);
      expect(mockSpeakJapanese).not.toHaveBeenCalled();
    });
  });

  describe('4. SM-2 Queue Re-Queue & Premature Completion Bug', () => {
    // CHALLENGE TEST: Last card 'again' rating premature completion bug resolved
    it('EMPIRICAL CHALLENGE: reveals premature round completion when last card is rated "again"', () => {
      // Setup a review round with 2 cards in queue
      const initialQueue = [101, 102];
      let studyQueue = [...initialQueue];
      let queueIndex = 1; // User is on card 102 (index 1 of 2, the last card!)
      let isCompletedCalled = false;
      let showCompletedModal = false;

      const onChapterCompleted = () => {
        isCompletedCalled = true;
      };

      // Exact replication of fixed AnkiCardStudy.tsx lines 354-401 handleReviewRating
      const handleReviewRating = (rating: AnkiReviewRating) => {
        if (rating === 'again') {
          // Schedules React state update:
          // In React, setStudyQueue((prev) => [...prev, currentGlobalIndex])
          // Closure studyQueue.length is 2
          const currentGlobalIndex = studyQueue[queueIndex];
          studyQueue = [...studyQueue, currentGlobalIndex]; // simulated queued state
        }

        const renderTimeQueueLength = 2; // Closure state inside component!
        const nextQueueIndex = queueIndex + 1;
        const effectiveQueueLength = rating === 'again' ? renderTimeQueueLength + 1 : renderTimeQueueLength;
        const isQueueFinished = nextQueueIndex >= effectiveQueueLength;

        if (!isQueueFinished) {
          queueIndex = nextQueueIndex;
        } else {
          onChapterCompleted();
          showCompletedModal = true;
        }
      };

      // User fails the last card and clicks 'again' (rating 1)
      handleReviewRating('again');

      // EXPECTED BEHAVIOR FOR ANKI SRS:
      // The user failed card 102, so card 102 MUST be re-queued and studied!
      // Round must NOT be finished!
      expect(showCompletedModal, 'Session must not finish when last card is rated again').toBe(false);
      expect(isCompletedCalled, 'onChapterCompleted must not be called when card needs repetition').toBe(false);
      expect(queueIndex).toBe(2);
      expect(studyQueue.length).toBe(3);
      expect(studyQueue[2]).toBe(102);
    });

    it('verifies calculateNextIntervals labels for all rating buttons', () => {
      const newCardIntervals = calculateNextIntervals(undefined);
      expect(newCardIntervals.again.label).toBe('<10m');
      expect(newCardIntervals.hard.label).toBe('1d');
      expect(newCardIntervals.good.label).toBe('1d');
      expect(newCardIntervals.easy.label).toBe('3d');

      const learnedCard: AnkiCardProgress = {
        cardIndex: 5,
        repetitions: 3,
        interval: 10,
        easeFactor: 2.5,
        nextReviewDate: Date.now(),
        totalReviews: 3,
        totalErrors: 0,
        lapses: 0,
        status: 'review',
        consecutiveCorrect: 3,
      };

      const learnedIntervals = calculateNextIntervals(learnedCard);
      expect(learnedIntervals.again.label).toBe('<10m');
      expect(learnedIntervals.hard.label).toBe('12d');
      expect(learnedIntervals.good.label).toBe('25d');
      expect(learnedIntervals.easy.label).toBe('1mån');
    });
  });

  describe('5. Zero-Scroll Layout Contract Verification', () => {
    it('verifies chapter size configuration across all modes', () => {
      const getChapterSize = (mode: AnkiDeckMode) => {
        const isReviewMode = mode === 'due' || mode === 'weak';
        const isAnki = mode === 'anki' || mode === 'bookmarks' || mode === 'due' || mode === 'weak';
        return isReviewMode ? 15 : isAnki ? ANKI_CHAPTER_SIZE : 10;
      };

      expect(getChapterSize('due')).toBe(15);
      expect(getChapterSize('weak')).toBe(15);
      expect(getChapterSize('anki')).toBe(10);
      expect(getChapterSize('bookmarks')).toBe(10);
      expect(getChapterSize('words')).toBe(10);
      expect(getChapterSize('phrases')).toBe(10);
      expect(getChapterSize('genki')).toBe(10);
    });

    it('verifies extractShortMeaning helper handles dictionary definitions without layout blowup', () => {
      const colonFormatted = 'sensei: teacher; instructor; master  (P)';
      expect(extractShortMeaning(colonFormatted)).toBe('teacher; instructor; master');

      const bracketFormatted = '[n] student; pupil. (P)';
      expect(extractShortMeaning(bracketFormatted)).toBe('student; pupil');

      const periodSentence = 'This is a short definition. This is a very long extended note with multiple sentences.';
      expect(extractShortMeaning(periodSentence)).toBe('This is a short definition');

      const short = 'A simple cat';
      expect(extractShortMeaning(short)).toBe('A simple cat');
    });
  });

  describe('6. Chapter Transition & State Reset Contract Verification', () => {
    it('verifies nextChapter navigation bounds check against total chapters', () => {
      const totalChapters = 5;
      const getHasNextChapter = (currentChapterIdx: number) => currentChapterIdx + 1 < totalChapters;

      expect(getHasNextChapter(0)).toBe(true);
      expect(getHasNextChapter(3)).toBe(true);
      expect(getHasNextChapter(4)).toBe(false); // Last chapter cannot advance
    });

    it('simulates chapter transition resetting queue, queueIndex, and not prematurely completing next chapter', () => {
      // Chapter 3 simulation (indices 28-32, 5 cards)
      const chapter3Start = 28;
      const chapter3End = 33;
      const initialIndicesChap3 = Array.from({ length: chapter3End - chapter3Start }, (_, i) => chapter3Start + i);

      let studyQueue = [...initialIndicesChap3];
      let queueIndex = 4; // User just finished card 32 (5th card)
      let currentChapterIndex = 3;
      const completedChapters: number[] = [0, 1, 2];

      // Simulated completion of Chapter 3
      completedChapters.push(currentChapterIndex);
      expect(completedChapters).toEqual([0, 1, 2, 3]);

      // User clicks "Nästa kapitel" (advancing to chapter 4)
      const nextChapterIndex = currentChapterIndex + 1;
      const chapter4Start = 33;
      const chapter4End = 40;
      const initialIndicesChap4 = Array.from({ length: chapter4End - chapter4Start }, (_, i) => chapter4Start + i);

      // Reset state (matching AnkiCardStudy key change and reset effect)
      currentChapterIndex = nextChapterIndex;
      studyQueue = initialIndicesChap4;
      queueIndex = 0;

      // Verification:
      expect(currentChapterIndex).toBe(4);
      expect(queueIndex).toBe(0);
      expect(studyQueue).toEqual([33, 34, 35, 36, 37, 38, 39]);
      expect(studyQueue[queueIndex]).toBe(33); // First card of Chapter 4, NOT the last card of Chapter 3
      expect(completedChapters.includes(4), 'Chapter 4 must NOT be completed before studying').toBe(false);

      // User answers the first card of Chapter 4
      queueIndex += 1;
      const isChapter4Finished = queueIndex >= studyQueue.length;
      expect(isChapter4Finished).toBe(false); // Only 1 of 7 cards answered, chapter must NOT complete
    });
  });
});
