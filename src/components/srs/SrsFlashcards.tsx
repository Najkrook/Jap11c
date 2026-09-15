import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  BrainCircuit, 
  RotateCw, 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  Zap, 
  BookOpen, 
  HelpCircle
} from 'lucide-react';
import type { KanaCharacter, SrsRating } from '../../types/kana';
import { HIRAGANA_DATA, HIRAGANA_MAP } from '../../data/hiraganaData';
import { KATAKANA_DATA, KATAKANA_MAP } from '../../data/katakanaData';
import { useProgression } from '../../context/progressionState';
import { useScriptMode } from '../../context/scriptModeState';
import { useAudio } from '../../modules/audio';
import { AudioButton } from '../common/AudioButton';
import { fireSuperCelebration } from '../common/Confetti';
import { useNavigate } from 'react-router-dom';
import { type ActiveTab, TAB_ROUTES } from '../layout/navigation';
import { 
  updateSessionStats, 
  calculateNextSessionStep, 
  filterDueCards, 
  INITIAL_SRS_SESSION_STATS 
} from './srsLogic';

export type SrsDeckId = 'due' | 'script_all' | 'week1' | 'week2' | 'dakuon' | 'mixed';

export interface SrsSubDeckOption {
  id: SrsDeckId;
  label: string;
  badge: string;
  isUrgent: boolean;
}

interface SrsFlashcardsProps {
  onGoToTab?: (tab: ActiveTab | string) => void;
  embedded?: boolean;
  initialDeck?: SrsDeckId;
}

export const SrsFlashcards: React.FC<SrsFlashcardsProps> = ({
  onGoToTab,
  embedded = false,
  initialDeck = 'due'
}) => {
  const navigate = useNavigate();
  const handleGoToTab = (tab: ActiveTab | string) => {
    if (onGoToTab) {
      onGoToTab(tab);
    } else {
      const route = TAB_ROUTES[tab as ActiveTab] || '/';
      navigate(route);
    }
  };

  const { playSfx, speakJapanese } = useAudio();
  const { recordActivity, dueCards } = useProgression();
  const { isKatakana } = useScriptMode();

  const [selectedDeck, setSelectedDeck] = useState<'due' | 'script_all' | 'week1' | 'week2' | 'dakuon' | 'mixed'>(initialDeck);
  const [queue, setQueue] = useState<KanaCharacter[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
    xpEarned: 0
  });

  const activeDataset = isKatakana ? KATAKANA_DATA : HIRAGANA_DATA;
  const dueCardsRef = useRef(dueCards);
  dueCardsRef.current = dueCards;

  const ALL_MAP = useMemo(() => new Map<string, KanaCharacter>([
    ...HIRAGANA_MAP.entries(),
    ...KATAKANA_MAP.entries()
  ]), []);

  const dueDeckCount = useMemo(() => {
    return dueCards.filter(id => {
      const isActiveScript = isKatakana ? id.startsWith('kata_') : !id.startsWith('kata_');
      return isActiveScript;
    }).length;
  }, [dueCards, isKatakana]);

  const subDecks = useMemo<SrsSubDeckOption[]>(() => [
    {
      id: 'due' as const,
      label: 'Dagens Repetition',
      badge: dueDeckCount > 0 ? `${dueDeckCount} redo` : '0 redo',
      isUrgent: dueDeckCount > 0
    },
    {
      id: 'script_all' as const,
      label: isKatakana ? 'Alla Katakana' : 'Alla Hiragana',
      badge: '85 kort',
      isUrgent: false
    },
    {
      id: 'week1' as const,
      label: 'Etapp 1 (A–Na)',
      badge: '25 kort',
      isUrgent: false
    },
    {
      id: 'week2' as const,
      label: 'Etapp 2 (Ha–N)',
      badge: '21 kort',
      isUrgent: false
    },
    {
      id: 'dakuon' as const,
      label: 'Dakuten (が・ぱ)',
      badge: '25 kort',
      isUrgent: false
    },
    {
      id: 'mixed' as const,
      label: '🀄 Blandad (H+K)',
      badge: '92 kort',
      isUrgent: false
    },
  ], [dueDeckCount, isKatakana]);

  // Build deck based on selected filter
  const buildDeck = useCallback(() => {
    let kanaList: KanaCharacter[] = [];

    if (selectedDeck === 'due') {
      kanaList = filterDueCards(dueCardsRef.current, isKatakana, ALL_MAP, activeDataset);
    } else if (selectedDeck === 'week1') {
      kanaList = activeDataset.filter(k => k.courseStage === 1);
    } else if (selectedDeck === 'week2') {
      kanaList = activeDataset.filter(k => k.courseStage === 2);
    } else if (selectedDeck === 'dakuon') {
      kanaList = activeDataset.filter(k => k.group === 'dakuon' || k.group === 'handakuon');
    } else if (selectedDeck === 'mixed') {
      kanaList = [...HIRAGANA_DATA.slice(0, 46), ...KATAKANA_DATA.slice(0, 46)];
    } else {
      kanaList = [...activeDataset];
    }

    // Shuffle deck for interleaving / active recall benefit
    const shuffled = [...kanaList].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setSessionStats(INITIAL_SRS_SESSION_STATS);
  }, [selectedDeck, activeDataset, isKatakana, ALL_MAP]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- Deck/filter changes intentionally reset the review session.
    buildDeck();
  }, [buildDeck]);

  const currentKana = queue[currentIndex] || null;

  // Auto pronounce on flip
  useEffect(() => {
    if (isFlipped && currentKana) {
      speakJapanese(currentKana.kana, { rate: 0.9 });
    }
  }, [isFlipped, currentKana, speakJapanese]);

  // Handle rating submission
  const handleRating = useCallback((rating: SrsRating) => {
    if (!currentKana) return;

    playSfx('click');
    const result = recordActivity({
      type: 'srs_review',
      kanaId: currentKana.id,
      rating
    });

    // Update session metrics
    setSessionStats(prev => updateSessionStats(prev, rating, result.earnedXp));

    const step = calculateNextSessionStep(currentIndex, queue.length, rating);

    // If 'again', optionally re-insert card at end of queue
    if (step.shouldReinsert) {
      setQueue(prev => [...prev, currentKana]);
    }

    // Move to next card or complete
    if (!step.isCompleted) {
      setCurrentIndex(step.nextIndex);
      setIsFlipped(false);
    } else {
      setSessionCompleted(true);
      playSfx('levelUp');
      fireSuperCelebration();
    }
  }, [currentIndex, currentKana, playSfx, queue.length, recordActivity]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sessionCompleted) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRating('again');
        if (e.key === '2') handleRating('hard');
        if (e.key === '3') handleRating('good');
        if (e.key === '4') handleRating('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRating, isFlipped, sessionCompleted]);

  const progressPercent = queue.length > 0 ? (currentIndex / queue.length) * 100 : 0;

  return (
    <div className={`space-y-6 animate-fadeIn ${embedded ? 'w-full' : 'max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
      {/* Header & Sub-Deck Selector */}
      <div className="bg-white dark:bg-sumi-900 p-5 sm:p-6 rounded-3xl border border-paper-300 dark:border-sumi-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30 shadow-xs">
              <BrainCircuit size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-ink-900 dark:text-white tracking-tight">
                Spaced Repetition (SRS Minneskort)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Optimerad med <strong className="text-amber-600 dark:text-amber-400">SuperMemo SM-2</strong> för maximal långtidsretention i minnet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-bold text-slate-600 dark:text-slate-300 bg-paper-100 dark:bg-sumi-800/80 px-3 py-1.5 rounded-xl border border-paper-200 dark:border-sumi-700">
            <span className="text-slate-400">Aktiv kortlek:</span>
            <span className="text-amber-600 dark:text-amber-400 font-extrabold">
              {subDecks.find(d => d.id === selectedDeck)?.label}
            </span>
          </div>
        </div>

        {/* Deck Pill Buttons with wrapping, card counts, and high contrast */}
        <div className="pt-3 border-t border-paper-200 dark:border-sumi-800/80">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Välj delkortlek
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {queue.length} kort i omgången
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {subDecks.map((deck) => {
              const isSelected = selectedDeck === deck.id;
              return (
                <button
                  key={deck.id}
                  onClick={() => {
                    setSelectedDeck(deck.id);
                    playSfx('click');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-sumi-950 font-black shadow-md border border-amber-400 ring-2 ring-amber-400/25'
                      : 'bg-paper-100 dark:bg-sumi-800/90 text-slate-700 dark:text-slate-200 hover:bg-paper-200 dark:hover:bg-sumi-700 border border-paper-300 dark:border-sumi-700 hover:border-amber-400'
                  }`}
                >
                  <span>{deck.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isSelected
                        ? 'bg-sumi-950/20 text-sumi-950 dark:bg-sumi-950/30 dark:text-sumi-950'
                        : deck.isUrgent
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-paper-200 dark:bg-sumi-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {deck.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {!sessionCompleted && queue.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Kort {currentIndex + 1} av {queue.length}</span>
            <span className="text-brand-600 dark:text-brand-gold font-mono">{Math.round(progressPercent)}% klart</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-sumi-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-600 to-brand-gold transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* ACTIVE CARD CONTAINER */}
      {!sessionCompleted && currentKana ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Main Flashcard Column (xl:col-span-8) */}
          <div className="xl:col-span-8 space-y-6">
            {/* 3D Flashcard */}
            <div
              onClick={() => {
                setIsFlipped(!isFlipped);
                playSfx('click');
              }}
              className="cursor-pointer min-h-[400px] xl:min-h-[440px] bg-white dark:bg-sumi-900 rounded-3xl p-8 xl:p-10 border-2 border-slate-200 dark:border-sumi-800 shadow-xl hover:border-brand-bronze transition-all duration-300 flex flex-col justify-between items-center text-center relative overflow-hidden group select-none"
            >
              {/* Top Card Info Bar */}
              <div className="w-full flex justify-between items-center text-xs text-slate-400 font-medium">
                <span className="bg-slate-100 dark:bg-sumi-800 px-3 py-1 rounded-full">
                  {currentKana.rowNameSv} • Etapp {currentKana.courseStage}
                </span>
                <span className="text-[11px] text-slate-400 italic">
                  {isFlipped ? '💡 Svar visas' : 'Klicka eller tryck Mellanslag för att vända'}
                </span>
              </div>

              {/* Front vs Back Content */}
              {!isFlipped ? (
                // FRONT
                <div className="my-auto py-10 space-y-4 animate-fadeIn">
                  <div className="text-[120px] sm:text-[150px] xl:text-[170px] font-jp font-black text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-200 leading-none">
                    {currentKana.kana}
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-slate-400 flex items-center justify-center gap-1.5">
                    <HelpCircle size={17} /> Vad är uttalet och minnesbilden?
                  </p>
                </div>
              ) : (
                // BACK (FLIPPED)
                <div className="my-auto py-4 space-y-5 animate-fadeIn w-full max-w-xl">
                  {/* Big Kana + Romaji + Audio */}
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-6xl sm:text-7xl font-jp font-black text-slate-900 dark:text-white">
                      {currentKana.kana}
                    </span>
                    <div className="text-left">
                      <div className="text-3xl sm:text-4xl font-extrabold text-brand-600 dark:text-brand-gold font-mono uppercase">
                        {currentKana.romaji}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {currentKana.swedishSimilarSound}
                      </div>
                    </div>
                    <AudioButton text={currentKana.kana} size="lg" variant="primary" />
                  </div>

                  {/* Mnemonic Box (SV + EN) */}
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 sm:p-5 text-left space-y-2">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 text-xs mb-1">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>🇸🇪 Minnesbild: {currentKana.mnemonic.summary}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentKana.mnemonic.storySv}
                      </p>
                    </div>

                    {currentKana.mnemonic.summaryEn && (
                      <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
                        <p className="text-xs text-amber-900/80 dark:text-amber-200/80 italic leading-relaxed">
                          <strong>🇬🇧 EN:</strong> {currentKana.mnemonic.summaryEn} — {currentKana.mnemonic.storyEn}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Example Word */}
                  {currentKana.exampleWords[0] && (
                    <div className="bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-800 rounded-xl p-3 flex items-center justify-between text-left text-xs">
                      <div className="flex items-center gap-2">
                        <BookOpen size={15} className="text-brand-600 dark:text-brand-gold" />
                        <div>
                          <span className="font-jp font-bold text-slate-800 dark:text-white mr-2">
                            {currentKana.exampleWords[0].kana} ({currentKana.exampleWords[0].romaji})
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            = 🇸🇪 {currentKana.exampleWords[0].meaningSv}
                          </span>
                        </div>
                      </div>
                      <AudioButton text={currentKana.exampleWords[0].kana} size="sm" />
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Prompt */}
              <div className="w-full pt-4 border-t border-slate-100 dark:border-sumi-800/80 flex justify-between items-center text-xs text-slate-400">
                <span>{currentKana.strokeCount} streck</span>
                <button 
                  type="button"
                  className="font-semibold text-brand-600 dark:text-brand-gold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RotateCw size={13} /> {isFlipped ? 'Vänd tillbaka' : 'Visa svar'}
                </button>
              </div>
            </div>

            {/* RATING BUTTONS (Visible when flipped) */}
            {isFlipped ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeIn">
                {/* Again */}
                <button
                  onClick={() => handleRating('again')}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-900/60 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 font-bold text-sm transition-all hover:scale-102 active:scale-95 shadow-xs cursor-pointer relative"
                >
                  <kbd className="absolute top-2 left-2 text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-200/60 dark:bg-red-900/60 text-red-800 dark:text-red-200">1</kbd>
                  <span className="flex items-center gap-1">🔴 Igen</span>
                  <span className="text-[11px] font-normal text-red-500 mt-0.5">&lt; 6 min</span>
                </button>

                {/* Hard */}
                <button
                  onClick={() => handleRating('hard')}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-900/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold text-sm transition-all hover:scale-102 active:scale-95 shadow-xs cursor-pointer relative"
                >
                  <kbd className="absolute top-2 left-2 text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">2</kbd>
                  <span className="flex items-center gap-1">🟠 Svårt</span>
                  <span className="text-[11px] font-normal text-amber-500 mt-0.5">1 dag</span>
                </button>

                {/* Good */}
                <button
                  onClick={() => handleRating('good')}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold text-sm transition-all hover:scale-102 active:scale-95 shadow-xs cursor-pointer relative"
                >
                  <kbd className="absolute top-2 left-2 text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">3</kbd>
                  <span className="flex items-center gap-1">🟢 Bra</span>
                  <span className="text-[11px] font-normal text-emerald-500 mt-0.5">3 dagar</span>
                </button>

                {/* Easy */}
                <button
                  onClick={() => handleRating('easy')}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-sm transition-all hover:scale-102 active:scale-95 shadow-xs cursor-pointer relative"
                >
                  <kbd className="absolute top-2 left-2 text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-200/60 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">4</kbd>
                  <span className="flex items-center gap-1">🔵 Lätt</span>
                  <span className="text-[11px] font-normal text-blue-500 mt-0.5">5+ dagar</span>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => {
                    setIsFlipped(true);
                    playSfx('click');
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-600 text-white dark:bg-brand-bronze dark:text-sumi-950 font-bold text-sm shadow-lg hover:opacity-90 transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  Klicka för att vända kortet <kbd className="ml-1.5 px-1.5 py-0.5 text-xs bg-white/20 rounded font-mono">Mellanslag</kbd>
                </button>
              </div>
            )}
          </div>

          {/* Right Desktop Companion Panel (xl:col-span-4) */}
          <div className="hidden xl:flex xl:col-span-4 flex-col gap-4">
            {/* Session Stats Card */}
            <div className="bg-white dark:bg-sumi-900 rounded-3xl p-5 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Omgångens Statistik
              </span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 dark:bg-sumi-950 p-3 rounded-2xl border border-slate-200 dark:border-sumi-800">
                  <div className="text-xl font-extrabold text-slate-800 dark:text-white">{sessionStats.reviewed}</div>
                  <div className="text-[11px] text-slate-400">Repeterade</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900/60">
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{sessionStats.good + sessionStats.easy}</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Bra svar</div>
                </div>
              </div>
            </div>

            {/* SuperMemo Algorithm pill */}
            <div className="bg-brand-50/70 dark:bg-brand-950/30 rounded-3xl p-5 border border-brand-200 dark:border-brand-900/50 space-y-2 text-xs text-brand-900 dark:text-brand-200">
              <div className="flex items-center gap-2 font-bold text-xs">
                <BrainCircuit size={16} className="text-brand-600" />
                <span>SuperMemo SM-2 Algoritm</span>
              </div>
              <p className="text-[11px] leading-relaxed text-brand-800 dark:text-brand-300">
                Kort du kan väl skjuts upp längre fram i tiden. Svåra kort repeteras oftare tills de sitter i långtidsminnet.
              </p>
            </div>

            {/* Desktop Shortcuts */}
            <div className="bg-paper-100 dark:bg-sumi-800/60 rounded-3xl p-4 border border-paper-200 dark:border-sumi-700/60 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                ⌨️ Snabbtangenter
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-sumi-900 border border-paper-300 dark:border-sumi-700 font-mono font-bold">Space</kbd>
                  <span>Vänd kort</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-sumi-900 border border-paper-300 dark:border-sumi-700 font-mono font-bold">1-4</kbd>
                  <span>Sätt betyg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* SESSION COMPLETE SUMMARY SCREEN */}
      {sessionCompleted && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-8 border border-slate-200 dark:border-sumi-800 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-900 shadow-lg animate-bounce-short">
            <Trophy size={40} />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Grymt jobbat! Repetitionen är klar! 🎉
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Dina minnesspår har förstärkts i långtidsminnet.
            </p>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-800">
              <div className="text-2xl font-black text-slate-800 dark:text-white">{sessionStats.reviewed}</div>
              <div className="text-xs text-slate-400 font-medium">Repeterade</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{sessionStats.good + sessionStats.easy}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Bra / Lätta</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{sessionStats.hard}</div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Svåra</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-100/50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800">
              <div className="text-2xl font-black text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1">
                <Zap size={18} className="fill-amber-500 text-amber-500" />
                +{sessionStats.xpEarned}
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-300 font-medium">XP intjänat</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
            <button
              onClick={buildDeck}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-sumi-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-sumi-700 transition-colors"
            >
              Repetera en omgång till
            </button>
            <button
              onClick={() => handleGoToTab('game')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-1.5"
            >
              Kör Shinkansen Rush 🚄 <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
