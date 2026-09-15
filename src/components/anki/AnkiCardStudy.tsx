import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX,
  RotateCcw, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Tv, 
  BookOpen, 
  Flame, 
  List, 
  X,
  Zap,
  Star,
  Headphones,
  Sparkles,
  Eye
} from 'lucide-react';
import type { AnkiCard, AnkiDeckMode, AnkiStudyMode, AnkiReviewRating, TravelItem } from '../../types/anki';
import { 
  ANKI_CARDS, 
  ANKI_CHAPTER_SIZE, 
  TRAVEL_CHAPTER_SIZE, 
  extractShortMeaning, 
  formatAnimeSource, 
  preloadAnkiImages,
  getDeckItems,
  saveAnkiBookmarks,
  getAnkiBookmarks,
  calculateNextIntervals
} from './ankiLogic';
import { TRAVEL_WORDS_CHAPTERS, TRAVEL_PHRASES_CHAPTERS } from '../../data/travelVocabData';
import { GENKI_EXAM_CHAPTERS } from '../../data/genkiExamData';
import { STAY_WITH_ME_CHAPTERS, PLASTIC_LOVE_CHAPTERS } from '../../data/songDecksData';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/progressionState';
import { fireSuperCelebration } from '../common/Confetti';

interface AnkiCardStudyProps {
  mode: AnkiDeckMode;
  chapterIndex: number;
  initialItemIndex?: number;
  customCardIndices?: number[];
  onBackToChapters: () => void;
  onChapterCompleted?: (chapterIndex: number) => void;
  onNextChapter?: (nextChapterIndex: number) => void;
}

export const AnkiCardStudy: React.FC<AnkiCardStudyProps> = ({
  mode,
  chapterIndex,
  initialItemIndex,
  customCardIndices,
  onBackToChapters,
  onChapterCompleted,
  onNextChapter,
}) => {
  const { playSfx, speakJapanese, soundEnabled } = useAudio();
  const { recordActivity, stats, toggleAnkiBookmark: toggleBookmarkProgression } = useProgression();

  const isAnki = mode === 'anki' || mode === 'bookmarks' || mode === 'due' || mode === 'weak';
  const isReviewMode = mode === 'due' || mode === 'weak';
  const isWords = mode === 'words';
  const isPhrases = mode === 'phrases';
  const isGenki = mode === 'genki';
  const isStayWithMe = mode === 'stay_with_me';
  const isPlasticLove = mode === 'plastic_love';
  const isSongMode = isStayWithMe || isPlasticLove;

  const chapterSize = isReviewMode ? 15 : isAnki ? ANKI_CHAPTER_SIZE : TRAVEL_CHAPTER_SIZE;
  const activeDataset = useMemo(() => getDeckItems(mode, undefined, customCardIndices), [mode, customCardIndices]);

  const customChapter = isGenki
    ? GENKI_EXAM_CHAPTERS[chapterIndex]
    : isStayWithMe
    ? STAY_WITH_ME_CHAPTERS[chapterIndex]
    : isPlasticLove
    ? PLASTIC_LOVE_CHAPTERS[chapterIndex]
    : null;
  const chapterStart = customChapter ? customChapter.startIndex : chapterIndex * chapterSize;
  const chapterEnd = customChapter ? customChapter.endIndex : Math.min(chapterStart + chapterSize, activeDataset.length);
  const chapterItems = useMemo(
    () => activeDataset.slice(chapterStart, chapterEnd),
    [activeDataset, chapterStart, chapterEnd]
  );

  // Initialize study queue with chapter card indices
  const initialIndices = useMemo(() => {
    const list: number[] = [];
    for (let i = chapterStart; i < chapterEnd; i++) {
      list.push(i);
    }
    if (initialItemIndex !== undefined && initialItemIndex >= chapterStart && initialItemIndex < chapterEnd) {
      const foundIdx = list.indexOf(initialItemIndex);
      if (foundIdx > -1) {
        list.splice(foundIdx, 1);
        list.unshift(initialItemIndex);
      }
    }
    return list;
  }, [chapterStart, chapterEnd, initialItemIndex]);

  // Queue state for smart re-queue (missed cards repeat at end of round)
  const [studyQueue, setStudyQueue] = useState<number[]>(initialIndices);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [requeueNotice, setRequeueNotice] = useState<string | null>(null);

  // Reset session state when chapterIndex, mode, or initialIndices change
  useEffect(() => {
    setStudyQueue(initialIndices);
    setQueueIndex(0);
    setIsRevealed(false);
    setShowNotes(true);
    setShowCompletedModal(false);
    setSessionMistakes(0);
    setSessionMistakeIndices([]);
    setImageError(false);
    setStreak(0);
  }, [chapterIndex, mode, initialIndices]);

  // Study mode: reading (kanji-first, recommended), listening (audio-first), beginner (romaji visible)
  const [studyMode, setStudyMode] = useState<AnkiStudyMode>(() => {
    const savedV2 = localStorage.getItem('hiragana_anki_study_mode_v2');
    if (savedV2 === 'reading' || savedV2 === 'beginner' || savedV2 === 'listening') return savedV2;
    const savedLegacy = localStorage.getItem('hiragana_anki_study_mode');
    if (savedLegacy === 'reading' || savedLegacy === 'beginner') return savedLegacy;
    // Default to 'reading' for active recall (legacy fallback 'listening' was prematurely revealing answers)
    return 'reading';
  });

  // Audio controls state
  const [playbackRate, setPlaybackRate] = useState<number>(() => {
    const saved = localStorage.getItem('hiragana_anki_rate');
    return saved === '0.75' ? 0.75 : 1.0;
  });

  const [autoplay, setAutoplay] = useState<boolean>(() => {
    const saved = localStorage.getItem('hiragana_anki_autoplay');
    return saved !== 'false';
  });

  // Furigana reading visibility toggle state (persisted to localStorage)
  const [showFurigana, setShowFurigana] = useState<boolean>(() => {
    return localStorage.getItem('hiragana_anki_furigana') === 'true';
  });

  // Live audio playing state for sound wave indicator
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioPlaybackTimeoutRef = useRef<number | null>(null);

  // Card view state
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [streak, setStreak] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showCompletedModal, setShowCompletedModal] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [sessionMistakes, setSessionMistakes] = useState<number>(0);

  // Bookmarks state (synced with ProgressionContext)
  const bookmarkedList = useMemo(() => stats.ankiBookmarks || [], [stats.ankiBookmarks]);

  useEffect(() => {
    saveAnkiBookmarks(bookmarkedList);
  }, [bookmarkedList]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [sessionMistakeIndices, setSessionMistakeIndices] = useState<number[]>([]);

  // Current item calculation
  const currentGlobalIndex = studyQueue[queueIndex] ?? chapterStart;
  const currentItem = activeDataset[currentGlobalIndex];
  const currentCard = isAnki ? (currentItem as AnkiCard) : null;
  const currentTravel = !isAnki ? (currentItem as TravelItem) : null;

  // Resolve original index in ANKI_CARDS for bookmarking
  const originalAnkiIndex = useMemo(() => {
    if (!currentCard) return -1;
    if (mode === 'anki') return currentGlobalIndex;
    return ANKI_CARDS.indexOf(currentCard);
  }, [mode, currentGlobalIndex, currentCard]);

  const isCurrentBookmarked = originalAnkiIndex >= 0 && bookmarkedList.includes(originalAnkiIndex);
  const currentCardProgress = originalAnkiIndex >= 0 ? stats.ankiCardProgress?.[originalAnkiIndex] : undefined;
  const nextIntervals = useMemo(() => calculateNextIntervals(currentCardProgress), [currentCardProgress]);

  const totalInChapter = chapterEnd - chapterStart;

  // Chapter title
  const chapterTitle = isGenki
    ? GENKI_EXAM_CHAPTERS[chapterIndex]?.title || `Kapitel ${chapterIndex + 1}`
    : isStayWithMe
    ? STAY_WITH_ME_CHAPTERS[chapterIndex]?.title || `Kapitel ${chapterIndex + 1}`
    : isPlasticLove
    ? PLASTIC_LOVE_CHAPTERS[chapterIndex]?.title || `Kapitel ${chapterIndex + 1}`
    : isWords
    ? TRAVEL_WORDS_CHAPTERS[chapterIndex] || `Kapitel ${chapterIndex + 1}`
    : isPhrases
      ? TRAVEL_PHRASES_CHAPTERS[chapterIndex] || `Kapitel ${chapterIndex + 1}`
      : mode === 'bookmarks'
        ? `Favoriter Del ${chapterIndex + 1}`
        : mode === 'due'
          ? `Repetition Del ${chapterIndex + 1}`
          : mode === 'weak'
            ? `Svaga kort Del ${chapterIndex + 1}`
            : `Kapitel ${chapterIndex + 1}`;

  // Preload next images
  useEffect(() => {
    if (isAnki) {
      preloadAnkiImages(ANKI_CARDS, currentGlobalIndex, 5);
    }
  }, [isAnki, currentGlobalIndex]);

  // Keep audioRef playbackRate in sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Audio playback handler with live wave indicator support
  const playCurrentAudio = useCallback(() => {
    if (!soundEnabled) return;
    setIsPlayingAudio(true);
    if (audioPlaybackTimeoutRef.current) clearTimeout(audioPlaybackTimeoutRef.current);

    const textToSpeak = isAnki
      ? (currentCard?.kanji || currentCard?.hiragana || '')
      : (currentTravel?.japanese || '');

    if (isAnki && currentCard?.audio) {
      if (audioRef.current) {
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err: any) => {
          if (err?.name === 'AbortError') return;
          if (soundEnabled && textToSpeak) {
            speakJapanese(textToSpeak, { rate: playbackRate })
              .catch(() => {})
              .finally(() => setIsPlayingAudio(false));
          } else {
            setIsPlayingAudio(false);
          }
        });
      } else if (textToSpeak) {
        speakJapanese(textToSpeak, { rate: playbackRate })
          .catch(() => {})
          .finally(() => setIsPlayingAudio(false));
      } else {
        setIsPlayingAudio(false);
      }
    } else if (textToSpeak) {
      speakJapanese(textToSpeak, { rate: playbackRate })
        .catch(() => {})
        .finally(() => setIsPlayingAudio(false));
    } else {
      setIsPlayingAudio(false);
    }

    // Safety fallback timeout to reset isPlayingAudio in case onended doesn't fire
    audioPlaybackTimeoutRef.current = window.setTimeout(() => {
      setIsPlayingAudio(false);
    }, 4000);
  }, [soundEnabled, isAnki, currentCard, currentTravel, playbackRate, speakJapanese]);

  // Body scroll lock effect: lock scroll during study session, restore on unmount
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
      if (audioPlaybackTimeoutRef.current) clearTimeout(audioPlaybackTimeoutRef.current);
    };
  }, []);

  // Reset live playing state on card turn or queue advance
  useEffect(() => {
    setIsPlayingAudio(false);
    if (audioPlaybackTimeoutRef.current) clearTimeout(audioPlaybackTimeoutRef.current);
  }, [queueIndex, isRevealed]);

  // Immediately stop any native HTML audio if sound is muted
  useEffect(() => {
    if (!soundEnabled) {
      setIsPlayingAudio(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [soundEnabled]);

  // Furigana visibility toggle handler
  const toggleFurigana = useCallback(() => {
    playSfx('click');
    setShowFurigana((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('hiragana_anki_furigana', String(next));
      } catch {
        // Ignore storage write exceptions in private/restricted environments
      }
      return next;
    });
  }, [playSfx]);

  // Autoplay trigger: Only when explicitly in listening mode for Anki anime cards should audio play before reveal
  useEffect(() => {
    if (!autoplay || !soundEnabled) return;

    if (!isRevealed && isAnki && studyMode === 'listening') {
      const timer = setTimeout(() => {
        playCurrentAudio();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [queueIndex, autoplay, soundEnabled, isAnki, studyMode, playCurrentAudio, isRevealed]);

  // Autoplay on reveal: Once the answer is revealed, play audio for reading, beginner, and all non-anki decks
  useEffect(() => {
    if (!autoplay || !soundEnabled) return;
    if (isRevealed && (!isAnki || studyMode === 'reading' || studyMode === 'beginner')) {
      const timer = setTimeout(() => {
        playCurrentAudio();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, autoplay, soundEnabled, isAnki, studyMode, playCurrentAudio]);

  // Study Mode switcher
  const handleSetStudyMode = (newMode: AnkiStudyMode) => {
    playSfx('click');
    setStudyMode(newMode);
    localStorage.setItem('hiragana_anki_study_mode_v2', newMode);
    localStorage.setItem('hiragana_anki_study_mode', newMode);
  };

  // Playback rate toggle
  const togglePlaybackRate = () => {
    playSfx('click');
    const nextRate = playbackRate === 1.0 ? 0.75 : 1.0;
    setPlaybackRate(nextRate);
    localStorage.setItem('hiragana_anki_rate', String(nextRate));
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  // Autoplay toggle
  const toggleAutoplay = () => {
    playSfx('click');
    const nextAutoplay = !autoplay;
    setAutoplay(nextAutoplay);
    localStorage.setItem('hiragana_anki_autoplay', String(nextAutoplay));
  };

  // Bookmark toggle
  const handleToggleBookmark = () => {
    if (originalAnkiIndex < 0) return;
    playSfx('click');
    toggleBookmarkProgression(originalAnkiIndex);
  };

  // Handle Card Reveal
  const handleReveal = useCallback(() => {
    setIsRevealed(true);
    playSfx('click');
  }, [playSfx]);

  // Handle Review Rating (SRS 4 buttons: again, hard, good, easy)
  const handleReviewRating = useCallback((rating: AnkiReviewRating) => {
    if (rating === 'again') {
      playSfx('wrong');
      setSessionMistakes((prev) => prev + 1);
      setStreak(0);

      if (originalAnkiIndex >= 0) {
        setSessionMistakeIndices((prev) => prev.includes(originalAnkiIndex) ? prev : [...prev, originalAnkiIndex]);
        recordActivity({
          type: 'anki_card_review',
          cardIndex: originalAnkiIndex,
          rating: 'again',
        });
      }

      setStudyQueue((prev) => [...prev, currentGlobalIndex]);
      const remainingInQueue = studyQueue.length - queueIndex;
      setRequeueNotice(`Kortet repeteras i slutet (${remainingInQueue} kvar i omgången)`);
      setTimeout(() => {
        setRequeueNotice(null);
      }, 3000);
    } else {
      playSfx('correct', { combo: streak + 1 });
      setStreak((prev) => prev + 1);

      if (originalAnkiIndex >= 0) {
        recordActivity({
          type: 'anki_card_review',
          cardIndex: originalAnkiIndex,
          rating,
        });
      }
    }

    const nextQueueIndex = queueIndex + 1;
    const effectiveQueueLength = rating === 'again' ? studyQueue.length + 1 : studyQueue.length;
    const isQueueFinished = nextQueueIndex >= effectiveQueueLength;

    if (!isQueueFinished) {
      setQueueIndex(nextQueueIndex);
      setIsRevealed(false);
      setShowNotes(true);
      setImageError(false);
    } else {
      if (onChapterCompleted) onChapterCompleted(chapterIndex);
      fireSuperCelebration();
      playSfx('levelUp');
      setShowCompletedModal(true);
    }
  }, [playSfx, streak, originalAnkiIndex, recordActivity, currentGlobalIndex, studyQueue.length, queueIndex, onChapterCompleted, chapterIndex]);

  // Handle Known (Yes) in chapter mode
  const handleYes = useCallback(() => {
    playSfx('correct', { combo: streak + 1 });

    if (originalAnkiIndex >= 0) {
      recordActivity({
        type: 'anki_card_review',
        cardIndex: originalAnkiIndex,
        rating: 'good',
      });
    } else {
      recordActivity({
        type: 'practice_completed',
        practiceType: 'words',
        score: 10,
      });
    }

    const nextQueueIndex = queueIndex + 1;
    const isQueueFinished = nextQueueIndex >= studyQueue.length;

    if (!isQueueFinished) {
      setQueueIndex(nextQueueIndex);
      setIsRevealed(false);
      setShowNotes(true);
      setImageError(false);
      setStreak((prev) => prev + 1);
    } else {
      recordActivity({
        type: 'anki_chapter_completed',
        mode,
        chapterIndex,
      });
      if (mode === 'anki') {
        const chapterCardIndices: number[] = [];
        for (let i = chapterStart; i < chapterEnd; i++) chapterCardIndices.push(i);
        recordActivity({
          type: 'anki_chapter_introduced',
          cardIndices: chapterCardIndices,
          mistakeIndices: sessionMistakeIndices,
        });
      }
      if (onChapterCompleted) onChapterCompleted(chapterIndex);

      fireSuperCelebration();
      playSfx('levelUp');
      setShowCompletedModal(true);
      setStreak((prev) => prev + 1);
    }
  }, [playSfx, streak, originalAnkiIndex, recordActivity, queueIndex, studyQueue.length, mode, chapterIndex, chapterStart, chapterEnd, sessionMistakeIndices, onChapterCompleted]);

  // Handle Again (No - re-queue to back of round) in chapter mode
  const handleNo = useCallback(() => {
    playSfx('wrong');
    setSessionMistakes((prev) => prev + 1);

    if (originalAnkiIndex >= 0) {
      setSessionMistakeIndices((prev) => prev.includes(originalAnkiIndex) ? prev : [...prev, originalAnkiIndex]);
      recordActivity({
        type: 'anki_card_review',
        cardIndex: originalAnkiIndex,
        rating: 'again',
      });
    }

    setStudyQueue((prev) => [...prev, currentGlobalIndex]);

    const remainingInQueue = studyQueue.length - queueIndex;
    setRequeueNotice(`Kortet repeteras i slutet (${remainingInQueue} kvar i kön)`);
    setTimeout(() => {
      setRequeueNotice(null);
    }, 3000);

    setQueueIndex((prev) => prev + 1);
    setIsRevealed(false);
    setShowNotes(true);
    setImageError(false);
    setStreak(0);
  }, [playSfx, originalAnkiIndex, recordActivity, currentGlobalIndex, studyQueue.length, queueIndex]);

  // Jump directly to an item
  const handleJumpToItem = (globalIdx: number) => {
    playSfx('click');
    setStudyQueue([globalIdx, ...initialIndices.filter((i) => i !== globalIdx)]);
    setQueueIndex(0);
    setIsRevealed(false);
    setShowNotes(true);
    setImageError(false);
    setIsSidebarOpen(false);
  };

  // Keyboard Shortcuts (Space to reveal, 1-4 ratings, R for audio, F for furigana, Esc for back)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      if (showCompletedModal) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          if (onNextChapter) {
            setShowCompletedModal(false);
            onNextChapter(chapterIndex + 1);
          } else {
            onBackToChapters();
          }
        } else if (e.code === 'Escape') {
          e.preventDefault();
          onBackToChapters();
        }
        return;
      }

      if (e.code === 'Escape') {
        e.preventDefault();
        if (isSidebarOpen) {
          setIsSidebarOpen(false);
        } else {
          onBackToChapters();
        }
        return;
      }

      if (isSidebarOpen) {
        return;
      }

      if (e.code === 'KeyR') {
        e.preventDefault();
        playCurrentAudio();
        return;
      }

      if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFurigana();
        return;
      }

      if (!isRevealed) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          handleReveal();
        }
        return;
      }

      if (isRevealed) {
        if (isReviewMode) {
          if (e.code === 'Digit1' || e.code === 'Numpad1') {
            e.preventDefault();
            handleReviewRating('again');
          } else if (e.code === 'Digit2' || e.code === 'Numpad2') {
            e.preventDefault();
            handleReviewRating('hard');
          } else if (e.code === 'Digit3' || e.code === 'Numpad3') {
            e.preventDefault();
            handleReviewRating('good');
          } else if (e.code === 'Digit4' || e.code === 'Numpad4') {
            e.preventDefault();
            handleReviewRating('easy');
          }
        } else {
          if (e.code === 'Enter' || e.code === 'ArrowRight' || e.code === 'Digit2' || e.code === 'Numpad2') {
            e.preventDefault();
            handleYes();
          } else if (e.code === 'Backspace' || e.code === 'ArrowLeft' || e.code === 'Digit1' || e.code === 'Numpad1') {
            e.preventDefault();
            handleNo();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isRevealed,
    showCompletedModal,
    isSidebarOpen,
    playCurrentAudio,
    toggleFurigana,
    handleReveal,
    handleYes,
    handleNo,
    handleReviewRating,
    isReviewMode,
    onBackToChapters,
  ]);

  if (!currentItem) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-paper-100 dark:bg-sumi-950 text-ink-900 dark:text-slate-100">
        <p className="text-slate-500 dark:text-slate-400">Kortet kunde inte laddas.</p>
        <button
          onClick={onBackToChapters}
          className="px-5 py-2.5 bg-ink-navy text-white rounded-xl font-bold hover:opacity-90 cursor-pointer"
        >
          Tillbaka till översikten
        </button>
      </div>
    );
  }

  const shortMeaning = isAnki ? extractShortMeaning(currentCard?.meaning) : '';
  const hasLongNotes = isAnki && (currentCard?.meaning?.length || 0) > 80;

  return (
    <div className="fixed inset-0 z-40 flex flex-col h-[100dvh] max-h-[100dvh] w-full bg-paper-100 dark:bg-sumi-950 text-ink-900 dark:text-slate-100 overflow-hidden select-none">
      {/* Hidden Audio element for native MP3s */}
      {isAnki && currentCard?.audio && (
        <audio
          ref={audioRef}
          src={`/audio/${currentCard.audio}`}
          preload="auto"
          onPlay={() => setIsPlayingAudio(true)}
          onEnded={() => {
            setIsPlayingAudio(false);
            if (audioPlaybackTimeoutRef.current) clearTimeout(audioPlaybackTimeoutRef.current);
          }}
          onError={() => {
            setIsPlayingAudio(false);
            if (audioPlaybackTimeoutRef.current) clearTimeout(audioPlaybackTimeoutRef.current);
          }}
        />
      )}

      {/* Unified Study Header Bar (52-56px single row) */}
      <header className="shrink-0 bg-white dark:bg-sumi-900 border-b border-paper-300 dark:border-sumi-800 shadow-xs">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 h-12 sm:h-14 flex items-center justify-between gap-2">
          {/* Left: Back & Breadcrumb */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <button
              type="button"
              onClick={onBackToChapters}
              className="p-1.5 rounded-xl text-slate-500 hover:text-ink-900 dark:text-slate-400 dark:hover:text-white hover:bg-paper-100 dark:hover:bg-sumi-800 transition-colors cursor-pointer shrink-0"
              title="Tillbaka till kapitelöversikt (Esc)"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40 truncate max-w-[110px] sm:max-w-[200px]">
                {chapterTitle}
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
                {queueIndex + 1}/{studyQueue.length}
              </span>
              {studyQueue.length > totalInChapter && (
                <span className="hidden sm:inline px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold shrink-0">
                  +{studyQueue.length - totalInChapter}
                </span>
              )}
            </div>
          </div>

          {/* Center: Compact Study Mode Segmented Switcher (Desktop only) */}
          {isAnki && (
            <div className="hidden md:flex items-center bg-paper-100 dark:bg-sumi-800 p-0.5 rounded-xl border border-paper-200 dark:border-sumi-700">
              <button
                type="button"
                onClick={() => handleSetStudyMode('reading')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  studyMode === 'reading'
                    ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white'
                }`}
                title="Läsförståelse (Standard)"
              >
                <BookOpen size={12} />
                <span>Läsa</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetStudyMode('listening')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  studyMode === 'listening'
                    ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white'
                }`}
                title="Hörförståelse"
              >
                <Headphones size={12} />
                <span>Höra</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetStudyMode('beginner')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  studyMode === 'beginner'
                    ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white'
                }`}
                title="Nybörjare"
              >
                <Sparkles size={12} />
                <span>Nybörjare</span>
              </button>
            </div>
          )}

          {/* Right: Study Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Furigana Toggle Button (Requirement R3) */}
            <button
              type="button"
              onClick={toggleFurigana}
              className={`px-2 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                showFurigana
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-paper-100 dark:bg-sumi-800 text-slate-400 border-paper-300 dark:border-sumi-700'
              }`}
              title="Växla Furigana/Uttal på kortet (F)"
            >
              <span className="font-japanese font-bold text-xs">あ</span>
              <span className="hidden sm:inline">{showFurigana ? 'Furigana: På' : 'Furigana: Av'}</span>
              <kbd className="hidden lg:inline text-[9px] bg-black/10 dark:bg-white/10 px-1 rounded font-mono">F</kbd>
            </button>

            {/* Audio Speed (1.0x / 0.75x) */}
            <button
              type="button"
              onClick={togglePlaybackRate}
              className={`px-2 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                playbackRate === 0.75
                  ? 'bg-amber-500 text-sumi-950 border-amber-500 shadow-xs'
                  : 'bg-paper-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 border-paper-300 dark:border-sumi-700'
              }`}
              title="Ljudhastighet (1.0x / 0.75x)"
            >
              {playbackRate}x
            </button>

            {/* Autoplay */}
            <button
              type="button"
              onClick={toggleAutoplay}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                autoplay
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-paper-100 dark:bg-sumi-800 text-slate-400 border-paper-300 dark:border-sumi-700'
              }`}
              title={autoplay ? 'Autoplay: På' : 'Autoplay: Av'}
            >
              {autoplay ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            {/* Streak */}
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Flame size={13} className="text-amber-500 fill-amber-500" />
              <span>{streak}</span>
            </div>

            {/* Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                isSidebarOpen
                  ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 border-ink-navy'
                  : 'bg-paper-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 border-paper-300 dark:border-sumi-700 hover:bg-paper-200'
              }`}
              title="Visa kapitellista"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Integrated Linear Progress Line (4px) */}
        <div className="w-full bg-paper-200 dark:bg-sumi-800 h-1">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-brand-500 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.round((queueIndex / Math.max(studyQueue.length, 1)) * 100))}%` }}
          />
        </div>
      </header>

      {/* Floating Re-queue Feedback Notification */}
      {requeueNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 max-w-sm w-[90%] bg-amber-100 dark:bg-amber-950/95 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn pointer-events-none">
          <div className="flex items-center gap-2 truncate">
            <RotateCcw size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="truncate">{requeueNotice}</span>
          </div>
          <span className="text-[10px] opacity-75 font-mono ml-2 shrink-0">Re-queue</span>
        </div>
      )}

      {/* Stage Area: Centered Card Canvas */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        <div className="w-full max-w-3xl h-full flex flex-col bg-white dark:bg-sumi-900 rounded-2xl sm:rounded-3xl border border-paper-200 dark:border-sumi-800 shadow-sm overflow-hidden">
          {/* Responsive Adaptive Media Frame */}
          {isAnki && currentCard?.image && !imageError ? (
            <div className="relative w-full shrink-0 bg-sumi-950 overflow-hidden flex items-center justify-center border-b border-paper-200 dark:border-sumi-800 aspect-video max-h-[22vh] sm:max-h-[28vh] md:max-h-[32vh]">
              <img
                src={`/images/anki/${currentCard.image}`}
                alt="Anime scenkontext"
                onError={() => setImageError(true)}
                className="w-full h-full object-contain sm:object-cover filter contrast-105 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sumi-950/80 via-transparent to-transparent pointer-events-none" />

              {currentCard.source && (
                <div className="absolute bottom-2 left-2.5 sm:left-3 flex items-center gap-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-slate-200 border border-white/15">
                  <Tv size={11} className="text-amber-400" />
                  <span className="truncate max-w-[140px] sm:max-w-xs">{formatAnimeSource(currentCard.source)}</span>
                </div>
              )}

              {/* Overlays: Bookmark & Live Audio Replay */}
              <div className="absolute bottom-2 right-2.5 sm:right-3 flex items-center gap-1.5">
                {originalAnkiIndex >= 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBookmark();
                    }}
                    className={`p-1.5 rounded-lg border backdrop-blur-md transition-all cursor-pointer ${
                      isCurrentBookmarked
                        ? 'bg-amber-500 text-sumi-950 border-amber-400 shadow-sm'
                        : 'bg-black/60 text-white/80 hover:text-white border-white/20'
                    }`}
                    title={isCurrentBookmarked ? 'Ta bort från sparade kort' : 'Spara kort till favoriter (⭐)'}
                  >
                    <Star size={14} className={isCurrentBookmarked ? 'fill-current' : ''} />
                  </button>
                )}

                {/* Audio Replay with Animated Sound Wave (Requirement R3) */}
                <button
                  type="button"
                  onClick={playCurrentAudio}
                  title="Spela anime-ljud (R)"
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-amber-400 text-sumi-950 ring-2 ring-amber-300 animate-pulse'
                      : 'bg-amber-500 hover:bg-amber-400 text-sumi-950'
                  }`}
                >
                  {isPlayingAudio ? (
                    <div className="flex items-center gap-0.5 h-3.5 px-0.5">
                      <span className="w-1 bg-sumi-950 rounded-full h-3 animate-pulse" />
                      <span className="w-1 bg-sumi-950 rounded-full h-2 animate-bounce" />
                      <span className="w-1 bg-sumi-950 rounded-full h-3.5 animate-pulse" />
                    </div>
                  ) : (
                    <Volume2 size={14} />
                  )}
                  <span>Ljud</span>
                  <kbd className="text-[9px] bg-black/20 px-1 rounded font-mono">R</kbd>
                </button>
              </div>
            </div>
          ) : (
            <div className="shrink-0 px-4 py-2.5 bg-paper-50 dark:bg-sumi-950/60 border-b border-paper-200 dark:border-sumi-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 truncate max-w-[200px] sm:max-w-md">
                {isAnki ? (currentCard?.source ? formatAnimeSource(currentCard.source) : 'Anki Flashcard') : (currentTravel?.category || 'Gloskort')}
              </span>
              <div className="flex items-center gap-1.5">
                {originalAnkiIndex >= 0 && (
                  <button
                    type="button"
                    onClick={handleToggleBookmark}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isCurrentBookmarked
                        ? 'bg-amber-500 text-sumi-950 border-amber-400 shadow-xs'
                        : 'bg-paper-100 dark:bg-sumi-800 text-slate-400 border-paper-300 dark:border-sumi-700 hover:text-amber-500'
                    }`}
                    title={isCurrentBookmarked ? 'Ta bort från favoriter' : 'Spara kort till favoriter (⭐)'}
                  >
                    <Star size={14} className={isCurrentBookmarked ? 'fill-current' : ''} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={playCurrentAudio}
                  title="Spela ljud (R)"
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-amber-400 text-sumi-950 ring-2 ring-amber-300 animate-pulse'
                      : 'bg-amber-500 hover:bg-amber-400 text-sumi-950'
                  }`}
                >
                  {isPlayingAudio ? (
                    <div className="flex items-center gap-0.5 h-3 px-0.5">
                      <span className="w-1 bg-sumi-950 rounded-full h-2.5 animate-pulse" />
                      <span className="w-1 bg-sumi-950 rounded-full h-1.5 animate-bounce" />
                      <span className="w-1 bg-sumi-950 rounded-full h-3 animate-pulse" />
                    </div>
                  ) : (
                    <Volume2 size={13} />
                  )}
                  <span>Ljud</span>
                  <kbd className="text-[9px] bg-black/20 px-1 rounded font-mono">R</kbd>
                </button>
              </div>
            </div>
          )}

          {/* Failsafe Content Canvas */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 flex flex-col justify-center">
            {!isRevealed ? (
              /* ================= FRONT VIEW ================= */
              <div className="text-center py-2 space-y-2 animate-fadeIn my-auto">
                {isAnki && currentCard && (
                  <>
                    {/* Mode: Listening */}
                    {studyMode === 'listening' ? (
                      <div className="space-y-2.5 max-w-md mx-auto">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 rounded-full text-xs font-bold">
                          <Headphones size={13} className="text-amber-500" />
                          <span>Hörförståelse: Lyssna & förstå</span>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={playCurrentAudio}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-sumi-950 font-black rounded-xl shadow-md active:scale-95 transition-all text-sm cursor-pointer ${
                              isPlayingAudio ? 'ring-2 ring-amber-300 animate-pulse' : ''
                            }`}
                          >
                            {isPlayingAudio ? (
                              <div className="flex items-center gap-0.5 h-3.5 px-0.5">
                                <span className="w-1 bg-sumi-950 rounded-full h-3 animate-pulse" />
                                <span className="w-1 bg-sumi-950 rounded-full h-2 animate-bounce" />
                                <span className="w-1 bg-sumi-950 rounded-full h-3.5 animate-pulse" />
                              </div>
                            ) : (
                              <Volume2 size={18} />
                            )}
                            <span>Spela replik (R)</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Fundera på vad meningen betyder och hur den skrivs innan du vänder kortet.
                        </p>
                      </div>
                    ) : (
                      /* Mode: Reading or Beginner */
                      <div className="space-y-2 max-w-md mx-auto">
                        <p className="text-3xl sm:text-4xl font-black text-ink-900 dark:text-white font-japanese tracking-wide py-1">
                          {currentCard.kanji}
                        </p>

                        {/* Optional Furigana on Front (if toggled on) */}
                        {showFurigana && currentCard.hiragana && currentCard.hiragana !== currentCard.kanji && (
                          <p className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 font-japanese">
                            {currentCard.hiragana}
                          </p>
                        )}

                        {studyMode === 'beginner' && (
                          <p className="text-sm sm:text-base font-mono text-slate-600 dark:text-slate-300 font-bold">
                            {currentCard.romaji}
                          </p>
                        )}

                        <p className="text-xs text-slate-400 dark:text-slate-500 pt-1">
                          Hur uttalas meningen och vad betyder den?
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Non-Anki (Travel / Genki / Song) Front */}
                {currentTravel && (
                  <div className="space-y-2 max-w-md mx-auto">
                    {currentTravel.category && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-paper-200 dark:bg-sumi-800 text-amber-700 dark:text-amber-400 border border-paper-300 dark:border-sumi-700">
                          {currentTravel.category}
                        </span>
                        {currentTravel.lesson && (
                          <span className="text-[11px] font-semibold text-slate-400">
                            {currentTravel.lesson}
                          </span>
                        )}
                      </div>
                    )}
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                      Svenska
                    </span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white">
                      {currentTravel.swedish}
                    </p>
                    {currentTravel.english && (
                      <p className="text-xs text-slate-400">
                        🇬🇧 {currentTravel.english}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 dark:text-slate-500 pt-1">
                      Hur uttalas och skrivs detta på japanska?
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* ================= BACK VIEW (REVEALED) ================= */
              <div className="space-y-2.5 sm:space-y-3 animate-fadeIn my-auto">
                {isAnki && currentCard && (
                  <>
                    {/* Japanese Display Box */}
                    <div className="text-center p-2.5 sm:p-3 bg-paper-100 dark:bg-sumi-800/70 rounded-xl border border-paper-200 dark:border-sumi-700">
                      <p className="text-2xl sm:text-3xl md:text-4xl font-black text-ink-900 dark:text-white font-japanese tracking-wide">
                        {currentCard.kanji}
                      </p>

                      {/* Furigana Reading with Independent Toggle */}
                      {currentCard.hiragana && currentCard.hiragana !== currentCard.kanji && (
                        <div className="mt-1">
                          {showFurigana ? (
                            <p className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 font-japanese">
                              {currentCard.hiragana}
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={toggleFurigana}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 px-2 py-0.5 rounded-md bg-paper-200/70 dark:bg-sumi-700/60 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                              title="Visa uttal / Furigana (F)"
                            >
                              <Eye size={12} />
                              <span>Visa uttal (F)</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Compact Romaji & Meaning Flex Row */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-2 text-xs">
                      <div className="flex-1 p-2 sm:p-2.5 bg-paper-50 dark:bg-sumi-800/40 rounded-xl border border-paper-200 dark:border-sumi-700/60">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Romaji</span>
                        <p className="font-bold text-ink-800 dark:text-slate-200 font-mono mt-0.5">{currentCard.romaji}</p>
                      </div>
                      <div className="flex-1 p-2 sm:p-2.5 bg-paper-50 dark:bg-sumi-800/40 rounded-xl border border-paper-200 dark:border-sumi-700/60">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Betydelse</span>
                        <p className="font-bold text-amber-800 dark:text-amber-300 mt-0.5">{shortMeaning || currentCard.meaning}</p>
                      </div>
                    </div>

                    {/* Tae Kim Notes Accordion with compact scrollbox */}
                    {hasLongNotes && (
                      <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 overflow-hidden text-xs">
                        <button
                          type="button"
                          onClick={() => setShowNotes(!showNotes)}
                          className="w-full flex items-center justify-between p-2 font-bold text-amber-900 dark:text-amber-300 hover:bg-amber-100/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <BookOpen size={13} />
                            <span>Tae Kim Grammatikanteckningar</span>
                          </div>
                          {showNotes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {showNotes && (
                          <div className="p-2.5 pt-0 text-[11px] sm:text-xs text-ink-700 dark:text-slate-300 leading-relaxed border-t border-amber-200/50 dark:border-amber-900/30 max-h-24 overflow-y-auto">
                            <p className="whitespace-pre-line mt-1">{currentCard.meaning}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Travel revealed */}
                {currentTravel && (
                  <div className="space-y-2 text-center">
                    <div className="p-2.5 sm:p-3 bg-paper-100 dark:bg-sumi-800/70 rounded-xl border border-paper-200 dark:border-sumi-700">
                      <span className="text-[10px] uppercase font-extrabold text-amber-600 dark:text-amber-400">Japanska</span>
                      <p className="text-2xl sm:text-3xl font-black text-ink-900 dark:text-white font-japanese mt-0.5">
                        {currentTravel.japanese}
                      </p>

                      {currentTravel.hiragana && (
                        <div className="mt-1">
                          {showFurigana ? (
                            <p className="text-sm font-bold text-rose-600 dark:text-rose-400 font-japanese">
                              Hiragana: {currentTravel.hiragana}
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={toggleFurigana}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 px-2 py-0.5 rounded-md bg-paper-200/70 dark:bg-sumi-700/60 transition-colors cursor-pointer"
                              title="Visa uttal / Hiragana (F)"
                            >
                              <Eye size={12} />
                              <span>Visa uttal (F)</span>
                            </button>
                          )}
                        </div>
                      )}

                      {currentTravel.romaji && (
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                          {currentTravel.romaji}
                        </p>
                      )}
                    </div>

                    {/* Translation & Notes */}
                    <div className="p-2 sm:p-2.5 bg-paper-50 dark:bg-sumi-800/40 rounded-xl border border-paper-200 dark:border-sumi-700/60 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Svenska</span>
                      <p className="font-bold text-ink-900 dark:text-white mt-0.5">{currentTravel.swedish}</p>
                      {currentTravel.english && (
                        <p className="text-[11px] text-slate-400 mt-0.5">🇬🇧 {currentTravel.english}</p>
                      )}
                    </div>

                    {currentTravel.notes && (
                      <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-left text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed max-h-20 overflow-y-auto">
                        <strong className="text-amber-800 dark:text-amber-300">
                          {isSongMode ? '🎵 Kontext:' : '💡 Tips:'}
                        </strong> {currentTravel.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Permanently Visible Action Controls Bar */}
          <div className="shrink-0 p-2.5 sm:p-3 bg-paper-50 dark:bg-sumi-950/80 border-t border-paper-200 dark:border-sumi-800 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {!isRevealed ? (
              <button
                type="button"
                onClick={handleReveal}
                className="w-full py-3 bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 rounded-xl font-black text-sm sm:text-base shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Visa Svar</span>
                <kbd className="hidden sm:inline-block text-xs bg-white/20 dark:bg-black/20 px-2 py-0.5 rounded font-mono">
                  Space
                </kbd>
              </button>
            ) : isReviewMode ? (
              /* Single-Row 4-Column Rating Buttons on BOTH Mobile and Desktop */
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {/* 1: Again */}
                <button
                  type="button"
                  onClick={() => handleReviewRating('again')}
                  className="py-2 sm:py-2.5 px-1 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer"
                  title="Kortet repeteras i slutet (1)"
                >
                  <span className="text-[9px] text-rose-200 font-mono leading-none">{nextIntervals.again.label}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <RotateCcw size={12} />
                    <span className="text-[11px] sm:text-xs">Igen</span>
                  </div>
                  <kbd className="hidden sm:inline-block text-[9px] bg-black/20 px-1 rounded font-mono mt-0.5">1</kbd>
                </button>

                {/* 2: Hard */}
                <button
                  type="button"
                  onClick={() => handleReviewRating('hard')}
                  className="py-2 sm:py-2.5 px-1 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer"
                  title="Lite trögt (2)"
                >
                  <span className="text-[9px] text-amber-200 font-mono leading-none">{nextIntervals.hard.label}</span>
                  <span className="text-[11px] sm:text-xs mt-0.5">Svår</span>
                  <kbd className="hidden sm:inline-block text-[9px] bg-black/20 px-1 rounded font-mono mt-0.5">2</kbd>
                </button>

                {/* 3: Good */}
                <button
                  type="button"
                  onClick={() => handleReviewRating('good')}
                  className="py-2 sm:py-2.5 px-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer"
                  title="Satt bra (3)"
                >
                  <span className="text-[9px] text-emerald-200 font-mono leading-none">{nextIntervals.good.label}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Check size={12} />
                    <span className="text-[11px] sm:text-xs">Bra</span>
                  </div>
                  <kbd className="hidden sm:inline-block text-[9px] bg-black/20 px-1 rounded font-mono mt-0.5">3</kbd>
                </button>

                {/* 4: Easy */}
                <button
                  type="button"
                  onClick={() => handleReviewRating('easy')}
                  className="py-2 sm:py-2.5 px-1 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer"
                  title="Satt direkt (4)"
                >
                  <span className="text-[9px] text-sky-200 font-mono leading-none">{nextIntervals.easy.label}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Sparkles size={12} />
                    <span className="text-[11px] sm:text-xs">Lätt</span>
                  </div>
                  <kbd className="hidden sm:inline-block text-[9px] bg-black/20 px-1 rounded font-mono mt-0.5">4</kbd>
                </button>
              </div>
            ) : (
              /* Chapter Mode: 2 Buttons */
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleNo}
                  className="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Kortet repeteras sist i omgången (1 / ←)"
                >
                  <RotateCcw size={14} />
                  <span>Kunde inte</span>
                  <kbd className="hidden sm:inline-block text-[10px] bg-white/20 px-1 rounded font-mono">1 / ←</kbd>
                </button>

                <button
                  type="button"
                  onClick={handleYes}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Kunde den! (2 / Enter)"
                >
                  <Check size={14} />
                  <span>Kunde den!</span>
                  <kbd className="hidden sm:inline-block text-[10px] bg-white/20 px-1 rounded font-mono">2 / Enter</kbd>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar / Drawer with chapter cards */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white dark:bg-sumi-900 h-full p-4 sm:p-5 shadow-2xl flex flex-col justify-between border-l border-paper-300 dark:border-sumi-800 animate-slideLeft">
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex items-center justify-between pb-3 border-b border-paper-200 dark:border-sumi-800 shrink-0">
                <div className="flex items-center gap-2">
                  <List size={18} className="text-amber-500" />
                  <h3 className="font-bold text-sm sm:text-base text-ink-900 dark:text-white truncate">
                    {chapterTitle} ({totalInChapter} kort)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  title="Stäng lista (Esc)"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3 space-y-1.5 overflow-y-auto flex-1 pr-1">
                {chapterItems.map((item, idx) => {
                  const globalIdx = chapterStart + idx;
                  const isActive = globalIdx === currentGlobalIndex;
                  const isDone = !studyQueue.slice(queueIndex).includes(globalIdx);
                  const ankiItem = isAnki ? (item as AnkiCard) : null;
                  const travelItem = !isAnki ? (item as TravelItem) : null;

                  const titleLabel = isAnki
                    ? (ankiItem?.kanji || ankiItem?.romaji)
                    : travelItem?.swedish;
                  const subLabel = isAnki ? ankiItem?.romaji : travelItem?.japanese;

                  return (
                    <button
                      key={globalIdx}
                      type="button"
                      onClick={() => handleJumpToItem(globalIdx)}
                      className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-ink-900 dark:text-white shadow-xs'
                          : 'bg-paper-100 dark:bg-sumi-800 border-paper-200 dark:border-sumi-700 text-slate-600 dark:text-slate-300 hover:bg-paper-200 dark:hover:bg-sumi-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-amber-500 text-sumi-950' : 'bg-paper-300 dark:bg-sumi-700 text-slate-600 dark:text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <p className="font-bold text-xs truncate leading-tight">{titleLabel}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{subLabel}</p>
                        </div>
                      </div>
                      {isDone && <Check size={13} className="text-emerald-500 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="w-full py-2.5 mt-3 bg-paper-200 dark:bg-sumi-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-paper-300 dark:hover:bg-sumi-700 transition-colors cursor-pointer shrink-0"
            >
              Stäng lista
            </button>
          </div>
        </div>
      )}

      {/* Chapter Completion Modal */}
      {showCompletedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-sumi-900 p-6 sm:p-8 rounded-3xl border border-paper-300 dark:border-sumi-800 shadow-2xl text-center space-y-6 animate-popIn">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/80 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-inner border border-amber-300 dark:border-amber-800">
              🏆
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full">
                {isReviewMode ? (mode === 'due' ? '🔥 Repetitionsblock slutfört!' : '⚠️ Svaga kort repeterade!') : 'Kapitel slutfört!'}
              </span>
              <h3 className="text-2xl font-extrabold text-ink-900 dark:text-white">
                Bra jobbat!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isReviewMode
                  ? `Du repeterade alla ${totalInChapter} kort i ${chapterTitle}!`
                  : `Du klarade alla ${totalInChapter} kort i ${chapterTitle}!`}
                {sessionMistakes > 0 && ` (${sessionMistakes} repetitioner gjordes tills alla satt)`}
              </p>
            </div>

            <div className="p-4 bg-paper-100 dark:bg-sumi-800 rounded-2xl flex items-center justify-around">
              <div>
                <span className="text-xs text-slate-400">XP Belöning</span>
                <p className="text-lg font-black text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                  <Zap size={16} /> +50 XP
                </p>
              </div>
              <div className="h-8 w-px bg-paper-300 dark:border-sumi-700" />
              <div>
                <span className="text-xs text-slate-400">Sväng</span>
                <p className="text-lg font-black text-ink-900 dark:text-white flex items-center justify-center gap-1">
                  <Flame size={16} className="text-amber-500 fill-amber-500" /> {streak}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {onNextChapter && (
                <button
                  onClick={() => {
                    setShowCompletedModal(false);
                    onNextChapter(chapterIndex + 1);
                  }}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-sumi-950 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  {isReviewMode ? 'Repetera nästa block' : 'Nästa kapitel'}
                </button>
              )}
              <button
                onClick={onBackToChapters}
                className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                  onNextChapter
                    ? 'bg-paper-200 dark:bg-sumi-800 text-ink-900 dark:text-white hover:bg-paper-300 dark:hover:bg-sumi-700'
                    : 'bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 hover:opacity-95'
                }`}
              >
                Tillbaka till kapitelöversikt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
