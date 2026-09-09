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
  Sparkles
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
  toggleAnkiBookmark,
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
  const { playSfx, speakJapanese } = useAudio();
  const { recordActivity, stats } = useProgression();

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

  // Study mode: listening (audio-first), reading (kanji-first), beginner (romaji visible)
  const [studyMode, setStudyMode] = useState<AnkiStudyMode>(() => {
    const saved = localStorage.getItem('hiragana_anki_study_mode');
    if (saved === 'reading' || saved === 'beginner' || saved === 'listening') return saved;
    return 'listening';
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

  // Card view state
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [streak, setStreak] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showCompletedModal, setShowCompletedModal] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [sessionMistakes, setSessionMistakes] = useState<number>(0);

  // Bookmarks state
  const [bookmarkedList, setBookmarkedList] = useState<number[]>(() => getAnkiBookmarks());

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

  // Audio playback handler
  const playCurrentAudio = useCallback(() => {
    if (isAnki && currentCard?.audio) {
      if (audioRef.current) {
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          speakJapanese(currentCard.kanji || currentCard.hiragana);
        });
      } else {
        speakJapanese(currentCard.kanji || currentCard.hiragana);
      }
    } else if (currentTravel) {
      speakJapanese(currentTravel.japanese);
    }
  }, [isAnki, currentCard, currentTravel, playbackRate, speakJapanese]);

  // Autoplay trigger
  useEffect(() => {
    if (!autoplay) return;

    if (!isRevealed && (studyMode === 'listening' || studyMode === 'beginner')) {
      const timer = setTimeout(() => {
        playCurrentAudio();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [queueIndex, autoplay, studyMode, playCurrentAudio, isRevealed]);

  useEffect(() => {
    if (!autoplay) return;
    if (isRevealed && studyMode === 'reading') {
      const timer = setTimeout(() => {
        playCurrentAudio();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, autoplay, studyMode, playCurrentAudio]);

  // Study Mode switcher
  const handleSetStudyMode = (newMode: AnkiStudyMode) => {
    playSfx('click');
    setStudyMode(newMode);
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
    toggleAnkiBookmark(originalAnkiIndex);
    setBookmarkedList(getAnkiBookmarks());
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
    const isQueueFinished = nextQueueIndex >= studyQueue.length;

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

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      if (showCompletedModal) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          onBackToChapters();
        }
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isRevealed) {
          handleReveal();
        }
        return;
      }

      if (e.code === 'KeyR') {
        e.preventDefault();
        playCurrentAudio();
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
          if (e.code === 'Enter' || e.code === 'ArrowRight' || e.code === 'Digit2') {
            e.preventDefault();
            handleYes();
          } else if (e.code === 'Backspace' || e.code === 'ArrowLeft' || e.code === 'Digit1') {
            e.preventDefault();
            handleNo();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, showCompletedModal, playCurrentAudio, handleReveal, handleYes, handleNo, handleReviewRating, isReviewMode, onBackToChapters]);

  if (!currentItem) {
    return (
      <div className="p-8 text-center space-y-4">
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* Hidden Audio element for native MP3s */}
      {isAnki && currentCard?.audio && (
        <audio
          ref={audioRef}
          src={`/audio/${currentCard.audio}`}
          preload="auto"
        />
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-sumi-900 p-4 sm:p-5 rounded-3xl border border-paper-300 dark:border-sumi-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToChapters}
            className="p-2 rounded-xl text-slate-500 hover:text-ink-900 dark:text-slate-400 dark:hover:text-white hover:bg-paper-100 dark:hover:bg-sumi-800 transition-colors cursor-pointer"
            title="Tillbaka till kapitelval"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-300/40">
                {isAnki ? (mode === 'bookmarks' ? '⭐ Favoriter' : 'Tae Kim Immersion') : isGenki ? 'Genki I Tentaord' : isStayWithMe ? 'Stay With Me (松原みき)' : isPlasticLove ? 'Plastic Love (竹内まりや)' : isWords ? 'Reseord' : 'Resefraser'}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Kapitel {chapterIndex + 1}
              </span>
            </div>
            <h2 className="text-lg font-bold text-ink-900 dark:text-white leading-tight">
              {chapterTitle}
            </h2>
          </div>
        </div>

        {/* Status Indicators & Control Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-wrap">
          {/* Audio Playback Rate Toggle */}
          <button
            onClick={togglePlaybackRate}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              playbackRate === 0.75
                ? 'bg-amber-500 text-sumi-950 border-amber-500 shadow-xs scale-105'
                : 'bg-paper-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 border-paper-300 dark:border-sumi-700 hover:bg-paper-200'
            }`}
            title="Ljudhastighet: Klicka för att växla mellan 1.0x och 0.75x (långsammare tal)"
          >
            ⚡ {playbackRate}x
          </button>

          {/* Autoplay Toggle */}
          <button
            onClick={toggleAutoplay}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              autoplay
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-paper-100 dark:bg-sumi-800 text-slate-400 dark:text-slate-500 border-paper-300 dark:border-sumi-700'
            }`}
            title="Autoplay: Spela ljud automatiskt när kort visas"
          >
            {autoplay ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span className="hidden md:inline">{autoplay ? 'Auto-ljud: På' : 'Auto-ljud: Av'}</span>
          </button>

          {/* Streak indicator */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs font-bold text-amber-800 dark:text-amber-300">
            <Flame size={14} className="text-amber-500 fill-amber-500" />
            <span>{streak}</span>
          </div>

          {/* Sidebar drawer toggle button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isSidebarOpen
                ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 border-ink-navy'
                : 'bg-paper-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 border-paper-300 dark:border-sumi-700 hover:bg-paper-200'
            }`}
            title="Visa kapitellista"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Study Mode Selector & Queue Info Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-paper-50 dark:bg-sumi-900/60 p-3 rounded-2xl border border-paper-200 dark:border-sumi-800">
        {/* Mode Selector */}
        {isAnki ? (
          <div className="flex items-center gap-1 bg-white dark:bg-sumi-800 p-1 rounded-xl border border-paper-300 dark:border-sumi-700 shadow-xs">
            <button
              onClick={() => handleSetStudyMode('listening')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                studyMode === 'listening'
                  ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white'
              }`}
              title="Hörförståelse: Bild och ljud på framsidan. Texten är dold tills du vänder."
            >
              <Headphones size={13} />
              <span>Hörförståelse</span>
            </button>

            <button
              onClick={() => handleSetStudyMode('reading')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                studyMode === 'reading'
                  ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white'
              }`}
              title="Läsförståelse: Japansk text på framsidan utan romaji."
            >
              <BookOpen size={13} />
              <span>Läsförståelse</span>
            </button>

            <button
              onClick={() => handleSetStudyMode('beginner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                studyMode === 'beginner'
                  ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white'
              }`}
              title="Nybörjare: Romaji visas direkt på framsidan."
            >
              <Sparkles size={13} />
              <span>Nybörjare</span>
            </button>
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-500">
            Öva från svenska till japanska
          </div>
        )}

        {/* Queue Progress Counter */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
          <span>Kort {queueIndex + 1} av {studyQueue.length}</span>
          {studyQueue.length > totalInChapter && (
            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[11px]">
              +{studyQueue.length - totalInChapter} repetition{studyQueue.length - totalInChapter > 1 ? 'er' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-paper-200 dark:bg-sumi-800 h-2 rounded-full overflow-hidden border border-paper-300 dark:border-sumi-700">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-brand-500 transition-all duration-300"
          style={{ width: `${Math.min(100, Math.round((queueIndex / Math.max(studyQueue.length, 1)) * 100))}%` }}
        />
      </div>

      {/* Smart Re-queue Feedback Notification */}
      {requeueNotice && (
        <div className="bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2">
            <RotateCcw size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{requeueNotice}</span>
          </div>
          <span className="text-[11px] opacity-75 font-mono">Re-queue</span>
        </div>
      )}

      {/* Main Flashcard Container */}
      <div className="relative">
        <div className="bg-white dark:bg-sumi-900 rounded-3xl border border-paper-300 dark:border-sumi-800 shadow-xl overflow-hidden transition-all">
          {/* Card Top: Anime Screenshot or Header */}
          {isAnki && currentCard?.image && !imageError ? (
            <div className="relative w-full h-56 sm:h-72 bg-sumi-950 overflow-hidden flex items-center justify-center border-b border-paper-200 dark:border-sumi-800">
              <img
                src={`/images/anki/${currentCard.image}`}
                alt="Anime scenkontext"
                onError={() => setImageError(true)}
                className="w-full h-full object-contain sm:object-cover filter contrast-105 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sumi-950/80 via-transparent to-transparent pointer-events-none" />
              
              {currentCard.source && (
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[11px] font-bold text-slate-200 border border-white/15">
                  <Tv size={12} className="text-amber-400" />
                  <span>{formatAnimeSource(currentCard.source)}</span>
                </div>
              )}

              {/* Action buttons on image overlay: Bookmark + Audio */}
              <div className="absolute bottom-3 right-4 flex items-center gap-2">
                {originalAnkiIndex >= 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBookmark();
                    }}
                    className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                      isCurrentBookmarked
                        ? 'bg-amber-500 text-sumi-950 border-amber-400 shadow-md scale-105'
                        : 'bg-black/60 text-white/80 hover:text-white border-white/20 hover:bg-black/80'
                    }`}
                    title={isCurrentBookmarked ? 'Ta bort från sparade kort' : 'Spara kort till favoriter (⭐)'}
                  >
                    <Star size={15} className={isCurrentBookmarked ? 'fill-current' : ''} />
                  </button>
                )}

                <button
                  onClick={playCurrentAudio}
                  title="Spela anime-ljud (R)"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-sumi-950 font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer text-xs"
                >
                  <Volume2 size={15} />
                  <span>Ljud <kbd className="text-[10px] bg-black/20 px-1 rounded font-mono">R</kbd></span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-paper-50 dark:bg-sumi-950/60 border-b border-paper-200 dark:border-sumi-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">
                {isAnki ? currentCard?.source : 'Gloskort'}
              </span>
              {originalAnkiIndex >= 0 && (
                <button
                  onClick={handleToggleBookmark}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isCurrentBookmarked
                      ? 'bg-amber-500 text-sumi-950 border-amber-400 shadow-xs'
                      : 'bg-paper-100 dark:bg-sumi-800 text-slate-400 border-paper-300 dark:border-sumi-700 hover:text-amber-500'
                  }`}
                  title={isCurrentBookmarked ? 'Ta bort från favoriter' : 'Spara kort till favoriter (⭐)'}
                >
                  <Star size={15} className={isCurrentBookmarked ? 'fill-current' : ''} />
                </button>
              )}
            </div>
          )}

          {/* Card Content Area */}
          <div className="p-6 sm:p-8 space-y-6">
            {!isRevealed ? (
              /* ================= FRONT VIEW ================= */
              <div className="flex flex-col items-center justify-center text-center py-6 space-y-4 animate-fadeIn">
                {isAnki && currentCard && (
                  <>
                    {/* Mode: Listening (Audio First) */}
                    {studyMode === 'listening' && (
                      <div className="space-y-4 max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 rounded-full text-xs font-bold">
                          <Headphones size={14} className="text-amber-500" />
                          <span>Hörförståelse: Lyssna & förstå</span>
                        </div>

                        <div className="py-2">
                          <button
                            onClick={playCurrentAudio}
                            className="inline-flex items-center gap-2.5 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-sumi-950 font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all text-base cursor-pointer"
                          >
                            <Volume2 size={22} />
                            <span>Spela replik (R)</span>
                          </button>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          Fundera på vad meningen betyder och hur den skrivs på japanska innan du vänder kortet.
                        </p>
                      </div>
                    )}

                    {/* Mode: Reading (Kanji First) */}
                    {studyMode === 'reading' && (
                      <div className="space-y-4 max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-900/50 rounded-full text-xs font-bold">
                          <BookOpen size={14} className="text-brand-600 dark:text-brand-gold" />
                          <span>Läsförståelse: Läs tecknen</span>
                        </div>

                        <p className="text-3xl sm:text-4xl font-black text-ink-900 dark:text-white font-japanese tracking-wide py-2">
                          {currentCard.kanji}
                        </p>

                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          Hur uttalas meningen och vad betyder den?
                        </p>
                      </div>
                    )}

                    {/* Mode: Beginner (Romaji + hints) */}
                    {studyMode === 'beginner' && (
                      <div className="space-y-3 max-w-lg">
                        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-600 dark:text-slate-300">
                          Romaji & Lyssning
                        </span>
                        <p className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-wide font-mono">
                          {currentCard.romaji}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Försök minnas hur meningen skrivs med Kanji/Hiragana samt vad den betyder.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Travel & Genki words / phrases Front */}
                {currentTravel && (
                  <div className="space-y-3">
                    {currentTravel.category && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-paper-200 dark:bg-sumi-800 text-amber-700 dark:text-amber-400 border border-paper-300 dark:border-sumi-700">
                          {currentTravel.category}
                        </span>
                        {currentTravel.lesson && (
                          <span className="text-xs font-semibold text-slate-400">
                            {currentTravel.lesson}
                          </span>
                        )}
                      </div>
                    )}
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-600 dark:text-slate-300">
                      Svenska
                    </span>
                    <p className="text-2xl sm:text-4xl font-extrabold text-ink-900 dark:text-white">
                      {currentTravel.swedish}
                    </p>
                    {currentTravel.english && (
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                        🇬🇧 {currentTravel.english}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 dark:text-slate-500 pt-1">
                      Hur skrivs eller uttalas detta på japanska?
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* ================= BACK VIEW (REVEALED) ================= */
              <div className="space-y-6 animate-fadeIn">
                {isAnki && currentCard && (
                  <div className="space-y-6">
                    {/* Kanji Display */}
                    <div className="text-center p-4 bg-paper-100 dark:bg-sumi-800/70 rounded-2xl border border-paper-300 dark:border-sumi-700">
                      <span className="text-xs uppercase font-extrabold text-slate-600 dark:text-slate-300 tracking-wider">
                        Japanska
                      </span>
                      <p className="text-3xl sm:text-4xl font-black text-ink-900 dark:text-white font-japanese tracking-wide mt-1">
                        {currentCard.kanji}
                      </p>

                      {currentCard.hiragana && currentCard.hiragana !== currentCard.kanji && (
                        <p className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400 mt-1 font-japanese">
                          {currentCard.hiragana}
                        </p>
                      )}
                    </div>

                    {/* Romaji & Short Meaning */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-paper-50 dark:bg-sumi-800/40 rounded-2xl border border-paper-200 dark:border-sumi-700/60">
                        <span className="text-xs uppercase font-bold text-slate-400">Romaji</span>
                        <p className="text-base font-bold text-ink-800 dark:text-slate-200 font-mono mt-0.5">
                          {currentCard.romaji}
                        </p>
                      </div>

                      <div className="p-4 bg-paper-50 dark:bg-sumi-800/40 rounded-2xl border border-paper-200 dark:border-sumi-700/60">
                        <span className="text-xs uppercase font-bold text-slate-400">Betydelse</span>
                        <p className="text-base font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                          {shortMeaning || currentCard.meaning}
                        </p>
                      </div>
                    </div>

                    {/* Collapsible Grammar Notes */}
                    {hasLongNotes && (
                      <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/40 overflow-hidden">
                        <button
                          onClick={() => setShowNotes(!showNotes)}
                          className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-amber-900 dark:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-950/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen size={15} />
                            <span>Tae Kim Grammatikanteckningar</span>
                          </div>
                          {showNotes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {showNotes && (
                          <div className="p-4 pt-0 text-sm text-ink-700 dark:text-slate-300 leading-relaxed border-t border-amber-200/50 dark:border-amber-900/30">
                            <p className="whitespace-pre-line mt-2">{currentCard.meaning}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {currentTravel && (
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-paper-100 dark:bg-sumi-800/70 rounded-2xl border border-paper-300 dark:border-sumi-700 space-y-3">
                      {currentTravel.category && (
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-paper-200 dark:bg-sumi-800 text-amber-700 dark:text-amber-400 border border-paper-300 dark:border-sumi-700">
                            {currentTravel.category}
                          </span>
                          {currentTravel.lesson && (
                            <span className="text-xs font-semibold text-slate-400">
                              {currentTravel.lesson}
                            </span>
                          )}
                        </div>
                      )}

                      <div>
                        <span className="text-xs uppercase font-extrabold text-slate-400">Svenska</span>
                        <p className="text-xl font-bold text-ink-700 dark:text-slate-300">{currentTravel.swedish}</p>
                        {currentTravel.english && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">🇬🇧 {currentTravel.english}</p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-paper-300 dark:border-sumi-700">
                        <span className="text-xs uppercase font-extrabold text-amber-600 dark:text-amber-400">Japanska</span>
                        <p className="text-3xl sm:text-4xl font-black text-ink-900 dark:text-white font-japanese mt-1">
                          {currentTravel.japanese}
                        </p>
                        {currentTravel.hiragana && (
                          <p className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1 font-japanese">
                            Hiragana: {currentTravel.hiragana}
                          </p>
                        )}
                        {currentTravel.romaji && (
                          <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mt-1">
                            {currentTravel.romaji}
                          </p>
                        )}
                      </div>

                      {currentTravel.notes && (
                        <div className="pt-2 border-t border-paper-200 dark:border-sumi-700/60 text-left">
                          <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            <strong className="text-amber-800 dark:text-amber-300">
                              {isSongMode ? '🎵 Låtrad & kontext:' : '💡 Tips inför tentan:'}
                            </strong> {currentTravel.notes}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex justify-center">
                        <button
                          type="button"
                          onClick={playCurrentAudio}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <Volume2 size={15} />
                          <span>Lyssna på japanskt uttal</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Button Controls Bar */}
          <div className="p-4 sm:p-6 bg-paper-50 dark:bg-sumi-950/60 border-t border-paper-200 dark:border-sumi-800">
            {!isRevealed ? (
              <button
                onClick={handleReveal}
                className="w-full py-4 bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 rounded-2xl font-extrabold text-base shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Visa Svar</span>
                <kbd className="hidden sm:inline-block text-xs bg-white/20 dark:bg-black/20 px-2 py-0.5 rounded font-mono">
                  Space
                </kbd>
              </button>
            ) : isReviewMode ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <button
                  onClick={() => handleReviewRating('again')}
                  className="py-3 px-2 sm:px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] flex flex-col items-center justify-center cursor-pointer group"
                  title="Kortet repeteras i slutet av omgången"
                >
                  <span className="text-[10px] text-rose-200 font-mono tracking-wider font-normal">
                    {nextIntervals.again.label}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <RotateCcw size={14} />
                    <span>Igen</span>
                  </div>
                  <kbd className="hidden sm:inline-block text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono mt-1 opacity-75">
                    1
                  </kbd>
                </button>

                <button
                  onClick={() => handleReviewRating('hard')}
                  className="py-3 px-2 sm:px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] flex flex-col items-center justify-center cursor-pointer group"
                  title="Lite trögt att minnas"
                >
                  <span className="text-[10px] text-amber-200 font-mono tracking-wider font-normal">
                    {nextIntervals.hard.label}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span>Svår</span>
                  </div>
                  <kbd className="hidden sm:inline-block text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono mt-1 opacity-75">
                    2
                  </kbd>
                </button>

                <button
                  onClick={() => handleReviewRating('good')}
                  className="py-3 px-2 sm:px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] flex flex-col items-center justify-center cursor-pointer group"
                  title="Satt bra med normal repetition"
                >
                  <span className="text-[10px] text-emerald-200 font-mono tracking-wider font-normal">
                    {nextIntervals.good.label}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Check size={14} />
                    <span>Bra</span>
                  </div>
                  <kbd className="hidden sm:inline-block text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono mt-1 opacity-75">
                    3
                  </kbd>
                </button>

                <button
                  onClick={() => handleReviewRating('easy')}
                  className="py-3 px-2 sm:px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] flex flex-col items-center justify-center cursor-pointer group"
                  title="Satt direkt utan problem"
                >
                  <span className="text-[10px] text-sky-200 font-mono tracking-wider font-normal">
                    {nextIntervals.easy.label}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Sparkles size={14} />
                    <span>Lätt</span>
                  </div>
                  <kbd className="hidden sm:inline-block text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono mt-1 opacity-75">
                    4
                  </kbd>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleNo}
                  className="py-3.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold text-sm sm:text-base shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  title="Kortet repeteras sist i omgången"
                >
                  <RotateCcw size={18} />
                  <span>Kunde inte (Repetera)</span>
                  <kbd className="hidden sm:inline-block text-xs bg-white/20 px-1.5 py-0.5 rounded font-mono">
                    1 / ←
                  </kbd>
                </button>

                <button
                  onClick={handleYes}
                  className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm sm:text-base shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check size={18} />
                  <span>Kunde den!</span>
                  <kbd className="hidden sm:inline-block text-xs bg-white/20 px-1.5 py-0.5 rounded font-mono">
                    2 / Enter / →
                  </kbd>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Drawer with chapter cards */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-sm bg-white dark:bg-sumi-900 h-full p-6 shadow-2xl flex flex-col justify-between border-l border-paper-300 dark:border-sumi-800 animate-slideLeft">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-paper-200 dark:border-sumi-800">
                  <div className="flex items-center gap-2">
                    <List size={18} className="text-amber-500" />
                    <h3 className="font-bold text-base text-ink-900 dark:text-white">
                      Kapitel {chapterIndex + 1} ({totalInChapter} kort)
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 space-y-2 overflow-y-auto max-h-[70vh] pr-1">
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
                        onClick={() => handleJumpToItem(globalIdx)}
                        className={`w-full p-3 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-ink-900 dark:text-white shadow-xs'
                            : 'bg-paper-100 dark:bg-sumi-800 border-paper-200 dark:border-sumi-700 text-slate-600 dark:text-slate-300 hover:bg-paper-200 dark:hover:bg-sumi-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-amber-500 text-sumi-950' : 'bg-paper-300 dark:bg-sumi-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="truncate">
                            <p className="font-bold text-xs truncate leading-tight">{titleLabel}</p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{subLabel}</p>
                          </div>
                        </div>
                        {isDone && <Check size={14} className="text-emerald-500 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-full py-2.5 bg-paper-200 dark:bg-sumi-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-paper-300 transition-colors cursor-pointer"
              >
                Stäng lista
              </button>
            </div>
          </div>
        )}
      </div>

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
                  Repetera nästa block
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
