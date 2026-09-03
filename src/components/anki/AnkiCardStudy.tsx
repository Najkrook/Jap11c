import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  RotateCcw, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Tv, 
  BookOpen, 
  Flame, 
  List, 
  X,
  Zap
} from 'lucide-react';
import type { AnkiCard, AnkiDeckMode, TravelItem } from '../../types/anki';
import { 
  ANKI_CARDS, 
  ANKI_CHAPTER_SIZE, 
  TRAVEL_CHAPTER_SIZE, 
  extractShortMeaning, 
  formatAnimeSource, 
  preloadAnkiImages 
} from './ankiLogic';
import { TRAVEL_WORDS, TRAVEL_PHRASES, TRAVEL_WORDS_CHAPTERS, TRAVEL_PHRASES_CHAPTERS } from '../../data/travelVocabData';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/progressionState';
import { fireSuperCelebration } from '../common/Confetti';

interface AnkiCardStudyProps {
  mode: AnkiDeckMode;
  chapterIndex: number;
  initialItemIndex?: number;
  onBackToChapters: () => void;
  onChapterCompleted?: (chapterIndex: number) => void;
}

export const AnkiCardStudy: React.FC<AnkiCardStudyProps> = ({
  mode,
  chapterIndex,
  initialItemIndex,
  onBackToChapters,
  onChapterCompleted,
}) => {
  const { playSfx, speakJapanese } = useAudio();
  const { recordActivity } = useProgression();

  const isAnki = mode === 'anki';
  const isWords = mode === 'words';
  const isPhrases = mode === 'phrases';

  const chapterSize = isAnki ? ANKI_CHAPTER_SIZE : TRAVEL_CHAPTER_SIZE;
  const activeDataset: (AnkiCard | TravelItem)[] = isAnki
    ? ANKI_CARDS
    : isWords
      ? TRAVEL_WORDS
      : TRAVEL_PHRASES;

  const chapterStart = chapterIndex * chapterSize;
  const chapterEnd = Math.min(chapterStart + chapterSize, activeDataset.length);
  const chapterItems = activeDataset.slice(chapterStart, chapterEnd);

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (initialItemIndex !== undefined && initialItemIndex >= chapterStart && initialItemIndex < chapterEnd) {
      return initialItemIndex;
    }
    return chapterStart;
  });

  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [streak, setStreak] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showCompletedModal, setShowCompletedModal] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentItem = activeDataset[currentIndex];
  const currentCard = isAnki ? (currentItem as AnkiCard) : null;
  const currentTravel = !isAnki ? (currentItem as TravelItem) : null;

  const relativeIndex = currentIndex - chapterStart;
  const totalInChapter = chapterEnd - chapterStart;

  // Chapter title
  const chapterTitle = isWords
    ? TRAVEL_WORDS_CHAPTERS[chapterIndex] || `Kapitel ${chapterIndex + 1}`
    : isPhrases
      ? TRAVEL_PHRASES_CHAPTERS[chapterIndex] || `Kapitel ${chapterIndex + 1}`
      : `Kapitel ${chapterIndex + 1}`;

  // Preload next images
  useEffect(() => {
    if (isAnki) {
      preloadAnkiImages(ANKI_CARDS, currentIndex, 5);
    }
  }, [isAnki, currentIndex]);

  // Audio playback
  const playCurrentAudio = useCallback(() => {
    if (isAnki && currentCard?.audio) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // Fallback to TTS if audio file fails
          speakJapanese(currentCard.kanji || currentCard.hiragana);
        });
      } else {
        speakJapanese(currentCard.kanji || currentCard.hiragana);
      }
    } else if (currentTravel) {
      speakJapanese(currentTravel.japanese);
    }
  }, [isAnki, currentCard, currentTravel, speakJapanese]);

  // Handle Card Reveal
  const handleReveal = useCallback(() => {
    setIsRevealed(true);
    playSfx('click');
  }, [playSfx]);

  // Handle Known (Yes)
  const handleYes = useCallback(() => {
    playSfx('correct', { combo: streak + 1 });

    // Award review XP
    recordActivity({
      type: 'practice_completed',
      practiceType: 'words',
      score: 10,
    });

    const nextIndex = currentIndex + 1;
    const isLastInChapter = nextIndex >= chapterEnd;

    if (!isLastInChapter && nextIndex < activeDataset.length) {
      setCurrentIndex(nextIndex);
      setIsRevealed(false);
      setShowNotes(true);
      setImageError(false);
      setStreak((prev) => prev + 1);
    } else {
      // Completed entire chapter!
      recordActivity({
        type: 'anki_chapter_completed',
        mode,
        chapterIndex,
      });
      if (onChapterCompleted) onChapterCompleted(chapterIndex);

      fireSuperCelebration();
      playSfx('levelUp');
      setShowCompletedModal(true);
      setStreak((prev) => prev + 1);
    }
  }, [playSfx, streak, recordActivity, currentIndex, chapterEnd, activeDataset.length, mode, chapterIndex, onChapterCompleted]);

  // Handle Again (No - restart chapter from start)
  const handleNo = useCallback(() => {
    playSfx('wrong');
    setCurrentIndex(chapterStart);
    setIsRevealed(false);
    setShowNotes(true);
    setImageError(false);
    setStreak(0);
  }, [playSfx, chapterStart]);

  // Jump directly to an item
  const handleJumpToItem = (globalIdx: number) => {
    playSfx('click');
    setCurrentIndex(globalIdx);
    setIsRevealed(false);
    setShowNotes(true);
    setImageError(false);
    setIsSidebarOpen(false);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid shortcuts if input is focused
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
        if (e.code === 'Enter' || e.code === 'ArrowRight' || e.code === 'Digit1') {
          e.preventDefault();
          handleYes();
        } else if (e.code === 'Backspace' || e.code === 'ArrowLeft' || e.code === 'Digit2') {
          e.preventDefault();
          handleNo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, showCompletedModal, playCurrentAudio, handleReveal, handleYes, handleNo, onBackToChapters]);

  if (!currentItem) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">Kortet kunde inte laddas.</p>
        <button
          onClick={onBackToChapters}
          className="mt-4 px-4 py-2 bg-ink-navy text-white rounded-xl font-bold"
        >
          Tillbaka
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
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-sumi-900 p-4 rounded-2xl border border-paper-300 dark:border-sumi-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToChapters}
            className="p-2 rounded-xl text-slate-500 hover:text-ink-900 dark:text-slate-400 dark:hover:text-white hover:bg-paper-100 dark:hover:bg-sumi-800 transition-colors"
            title="Tillbaka till kapitelval"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-300/40">
                {isAnki ? 'Tae Kim Immersion' : isWords ? 'Reseord' : 'Resefraser'}
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

        {/* Status Indicators & Drawer Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak indicator */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs font-bold text-amber-800 dark:text-amber-300">
            <Flame size={14} className="text-amber-500 fill-amber-500" />
            <span>{streak}</span>
          </div>

          {/* Progress badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-paper-100 dark:bg-sumi-800 rounded-xl border border-paper-300 dark:border-sumi-700 text-xs font-bold text-ink-700 dark:text-slate-300">
            <span>Kort {relativeIndex + 1} av {totalInChapter}</span>
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

      {/* Progress Bar */}
      <div className="w-full bg-paper-200 dark:bg-sumi-800 h-2 rounded-full overflow-hidden border border-paper-300 dark:border-sumi-700">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-brand-500 transition-all duration-300"
          style={{ width: `${((relativeIndex + (isRevealed ? 0.5 : 0)) / totalInChapter) * 100}%` }}
        />
      </div>

      {/* Main Flashcard Container */}
      <div className="relative">
        <div className="bg-white dark:bg-sumi-900 rounded-3xl border border-paper-300 dark:border-sumi-800 shadow-lg overflow-hidden transition-all">
          {/* Card Top: Anime Screenshot / Context Banner */}
          {isAnki && currentCard?.image && !imageError && (
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

              {/* Audio button overlay on image */}
              <button
                onClick={playCurrentAudio}
                title="Spela anime-ljud (R)"
                className="absolute bottom-3 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-sumi-950 font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer text-xs"
              >
                <Volume2 size={15} />
                <span>Ljud <kbd className="text-[10px] bg-black/20 px-1 rounded font-mono">R</kbd></span>
              </button>
            </div>
          )}

          {/* Card Content Area */}
          <div className="p-6 sm:p-8 space-y-6">
            {!isRevealed ? (
              /* ================= FRONT VIEW ================= */
              <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-600 dark:text-slate-300">
                  {isAnki ? 'Lyssna / Romaji' : 'Svenska'}
                </span>

                {isAnki && currentCard && (
                  <div className="space-y-3">
                    <p className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-wide font-mono">
                      {currentCard.romaji}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md">
                      Försök minnas hur meningen skrivs med Kanji & Hiragana samt vad den betyder.
                    </p>
                  </div>
                )}

                {currentTravel && (
                  <div className="space-y-2">
                    <p className="text-2xl sm:text-4xl font-extrabold text-ink-900 dark:text-white">
                      {currentTravel.swedish}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Hur säger du detta på japanska?
                    </p>
                  </div>
                )}

                {/* Big Audio trigger for cards without images */}
                {(!isAnki || !currentCard?.image || imageError) && (
                  <button
                    onClick={playCurrentAudio}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 rounded-xl text-sm font-bold border border-amber-300 dark:border-amber-800 hover:scale-105 transition-all cursor-pointer"
                  >
                    <Volume2 size={18} />
                    <span>Lyssna (R)</span>
                  </button>
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
                      <div>
                        <span className="text-xs uppercase font-extrabold text-slate-400">Svenska</span>
                        <p className="text-xl font-bold text-ink-700 dark:text-slate-300">{currentTravel.swedish}</p>
                      </div>
                      <div className="pt-2 border-t border-paper-300 dark:border-sumi-700">
                        <span className="text-xs uppercase font-extrabold text-amber-600 dark:text-amber-400">Japanska</span>
                        <p className="text-3xl sm:text-4xl font-black text-ink-900 dark:text-white font-japanese mt-1">
                          {currentTravel.japanese}
                        </p>
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleYes}
                  className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm sm:text-base shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check size={18} />
                  <span>Ja, jag kunde den</span>
                  <kbd className="hidden sm:inline-block text-xs bg-white/20 px-1.5 py-0.5 rounded font-mono">
                    Enter / →
                  </kbd>
                </button>

                <button
                  onClick={handleNo}
                  className="py-3.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold text-sm sm:text-base shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={18} />
                  <span>Nej, börja om kapitel</span>
                  <kbd className="hidden sm:inline-block text-xs bg-white/20 px-1.5 py-0.5 rounded font-mono">
                    Backspace / ←
                  </kbd>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Drawer with 10 chapter cards */}
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
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 space-y-2 overflow-y-auto max-h-[70vh] pr-1">
                  {chapterItems.map((item, idx) => {
                    const globalIdx = chapterStart + idx;
                    const isActive = globalIdx === currentIndex;
                    const isDone = globalIdx < currentIndex;
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
                className="w-full py-2.5 bg-paper-200 dark:bg-sumi-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-paper-300 transition-colors"
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
                Kapitel slutfört!
              </span>
              <h3 className="text-2xl font-extrabold text-ink-900 dark:text-white">
                Bra jobbat!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Du klarade alla {totalInChapter} kort i <strong>{chapterTitle}</strong>!
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
              <button
                onClick={onBackToChapters}
                className="w-full py-3.5 bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 rounded-xl font-bold text-sm shadow-md hover:opacity-95 transition-all cursor-pointer"
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
