import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Tv, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Compass, 
  ArrowRight,
  Star,
  RotateCcw,
  AlertCircle,
  Sparkles,
  GraduationCap,
  Download,
  Music,
  Disc,
  ChevronDown,
  Award,
  Layers,
  BrainCircuit
} from 'lucide-react';
import type { AnkiDeckMode, AnkiChapter } from '../../types/anki';
import { GENKI_EXAM_CHAPTERS } from '../../data/genkiExamData';
import { STAY_WITH_ME_CHAPTERS, PLASTIC_LOVE_CHAPTERS } from '../../data/songDecksData';
import { 
  ANKI_ARCS, 
  ANKI_CATEGORIES, 
  getArcForChapter, 
  getArcCompletedCount,
  type AnkiCategoryType 
} from '../../data/ankiArcData';
import { 
  ANKI_CARDS, 
  getDeckChapters, 
  searchAnkiCards, 
  type SearchResult,
  formatAnimeSource,
  saveAnkiBookmarks
} from './ankiLogic';
import { AnkiCardStudy } from './AnkiCardStudy';
import { SrsFlashcards } from '../srs/SrsFlashcards';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/progressionState';
import { useScriptMode } from '../../context/scriptModeState';

export const AnkiHub: React.FC = () => {
  const { playSfx } = useAudio();
  const { stats, summary, dueCards, dueAnkiCards, weakAnkiCards, toggleAnkiBookmark: toggleBookmarkProgression } = useProgression();
  const { isKatakana } = useScriptMode();
  const [searchParams] = useSearchParams();
  const initialCategoryParam = searchParams.get('category') || searchParams.get('deck');

  const [activeDeck, setActiveDeck] = useState<AnkiDeckMode>(() => {
    if (initialCategoryParam === 'kana') return 'kana';
    return 'anki';
  });

  useEffect(() => {
    if (initialCategoryParam === 'kana') {
      setActiveDeck('kana');
    }
  }, [initialCategoryParam]);

  const dueKanaCardsCount = useMemo(() => {
    return dueCards.filter((id) => {
      const isActiveScript = isKatakana ? id.startsWith('kata_') : !id.startsWith('kata_');
      return isActiveScript && stats.kanaProgress[id]?.status !== 'new';
    }).length;
  }, [dueCards, isKatakana, stats.kanaProgress]);

  const totalDueToday = dueKanaCardsCount + dueAnkiCards.length;

  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [initialItemIndex, setInitialItemIndex] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'uncompleted' | 'completed'>('all');
  const bookmarks = useMemo(() => stats.ankiBookmarks || [], [stats.ankiBookmarks]);

  useEffect(() => {
    saveAnkiBookmarks(bookmarks);
  }, [bookmarks]);

  const handleToggleBookmark = (index: number) => {
    toggleBookmarkProgression(index);
    playSfx('click');
  };

  const currentCompleted = useMemo(() => {
    return stats.ankiProgress?.[activeDeck] || [];
  }, [stats.ankiProgress, activeDeck]);

  const customDeckIndices = useMemo(() => {
    if (activeDeck === 'due') return dueAnkiCards;
    if (activeDeck === 'weak') return weakAnkiCards;
    return undefined;
  }, [activeDeck, dueAnkiCards, weakAnkiCards]);

  // Compute all chapters for active deck
  const chapters: AnkiChapter[] = useMemo(() => {
    return getDeckChapters(activeDeck, currentCompleted, bookmarks, customDeckIndices);
  }, [activeDeck, currentCompleted, bookmarks, customDeckIndices]);

  // Tae Kim specific completed array
  const ankiCompleted = useMemo(() => {
    return stats.ankiProgress?.anki || [];
  }, [stats.ankiProgress]);

  // Find next uncompleted Tae Kim chapter
  const nextUncompletedTaeKimChapter = useMemo(() => {
    for (let i = 0; i < 208; i++) {
      if (!ankiCompleted.includes(i)) return i;
    }
    return 0;
  }, [ankiCompleted]);

  const currentArc = useMemo(() => {
    return getArcForChapter(nextUncompletedTaeKimChapter);
  }, [nextUncompletedTaeKimChapter]);

  // Next uncompleted chapter in current active deck
  const nextUncompletedChapter = chapters.find((c) => !c.isCompleted)?.index ?? 0;

  // Search results for cards
  const searchResults: SearchResult[] = useMemo(() => {
    if (!searchQuery.trim() || activeDeck !== 'anki') return [];
    return searchAnkiCards(searchQuery, 24);
  }, [searchQuery, activeDeck]);

  // Search matching chapters
  const searchMatchingChapterIndices = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    const matched = new Set<number>();
    searchResults.forEach((r) => matched.add(r.chapterIndex));
    chapters.forEach((chap) => {
      if (chap.title.toLowerCase().includes(q) || (chap.preview && chap.preview.toLowerCase().includes(q))) {
        matched.add(chap.index);
      }
    });
    return matched;
  }, [searchQuery, searchResults, chapters]);

  // Filtered chapters for non-anki decks
  const filteredChapters = useMemo(() => {
    return chapters.filter((chap) => {
      if (statusFilter === 'completed') return chap.isCompleted;
      if (statusFilter === 'uncompleted') return !chap.isCompleted;
      return true;
    });
  }, [chapters, statusFilter]);

  // Determine active category based on activeDeck
  const activeCategory = useMemo<AnkiCategoryType>(() => {
    const found = ANKI_CATEGORIES.find((cat) =>
      cat.availableDecks.some((d) => d.mode === activeDeck)
    );
    return found?.id || 'immersion';
  }, [activeDeck]);

  const currentCategoryDef = useMemo(() => {
    return ANKI_CATEGORIES.find((c) => c.id === activeCategory) || ANKI_CATEGORIES[0];
  }, [activeCategory]);

  const handleSelectCategory = (catId: AnkiCategoryType) => {
    playSfx('click');
    const cat = ANKI_CATEGORIES.find((c) => c.id === catId);
    if (!cat) return;
    if (!cat.availableDecks.some((d) => d.mode === activeDeck)) {
      setActiveDeck(cat.defaultDeck);
    }
  };

  // State for expanded Arcs (default auto-expands the arc with nextUncompletedTaeKimChapter)
  const [expandedArcs, setExpandedArcs] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const activeA = getArcForChapter(nextUncompletedTaeKimChapter);
    ANKI_ARCS.forEach((arc) => {
      initial[arc.id] = activeA ? arc.id === activeA.id : arc.id === 'arc-1';
    });
    return initial;
  });

  // Auto-expand arcs when search query or status filter is active
  useEffect(() => {
    if (searchQuery.trim() || statusFilter !== 'all') {
      setExpandedArcs((prev) => {
        const next = { ...prev };
        ANKI_ARCS.forEach((arc) => {
          const arcChaps = chapters.slice(arc.startChapterIndex, arc.endChapterIndex + 1);
          const hasMatch = arcChaps.some((chap) => {
            const statusMatch =
              statusFilter === 'all'
                ? true
                : statusFilter === 'completed'
                ? chap.isCompleted
                : !chap.isCompleted;
            const searchMatch = !searchMatchingChapterIndices
              ? true
              : searchMatchingChapterIndices.has(chap.index);
            return statusMatch && searchMatch;
          });
          if (hasMatch) {
            next[arc.id] = true;
          }
        });
        return next;
      });
    }
  }, [searchQuery, statusFilter, searchMatchingChapterIndices, chapters]);

  const toggleArc = (arcId: string) => {
    playSfx('click');
    setExpandedArcs((prev) => ({
      ...prev,
      [arcId]: !prev[arcId]
    }));
  };

  const handleExpandAll = () => {
    playSfx('click');
    const allOpen: Record<string, boolean> = {};
    ANKI_ARCS.forEach((arc) => {
      allOpen[arc.id] = true;
    });
    setExpandedArcs(allOpen);
  };

  const handleCollapseAll = () => {
    playSfx('click');
    const allClosed: Record<string, boolean> = {};
    ANKI_ARCS.forEach((arc) => {
      allClosed[arc.id] = false;
    });
    setExpandedArcs(allClosed);
  };

  const completedArcsCount = useMemo(() => {
    return ANKI_ARCS.filter(
      (arc) => getArcCompletedCount(arc, ankiCompleted) === arc.totalChapters
    ).length;
  }, [ankiCompleted]);

  const handleStartChapter = (chapterIdx: number, itemIdx?: number) => {
    playSfx('click');
    setSelectedChapter(chapterIdx);
    setInitialItemIndex(itemIdx);
  };

  const handleStartDueReview = () => {
    playSfx('click');
    if (dueKanaCardsCount > 0 && dueAnkiCards.length === 0) {
      setActiveDeck('kana');
    } else if (dueAnkiCards.length > 0) {
      setActiveDeck('due');
      handleStartChapter(0);
    } else {
      setActiveDeck('kana');
    }
  };

  const handleBackToChapters = () => {
    playSfx('click');
    setSelectedChapter(null);
    setInitialItemIndex(undefined);
  };

  const handleChapterDone = (_chapterIdx: number) => {
    // ProgressionService automatically updates stats reactively
  };

  // If currently studying a chapter, render the study session
  if (selectedChapter !== null) {
    const hasNextChapter = selectedChapter + 1 < chapters.length;
    return (
      <AnkiCardStudy
        key={`${activeDeck}-${selectedChapter}`}
        mode={activeDeck}
        chapterIndex={selectedChapter}
        initialItemIndex={initialItemIndex}
        customCardIndices={customDeckIndices}
        onBackToChapters={handleBackToChapters}
        onChapterCompleted={handleChapterDone}
        onNextChapter={
          hasNextChapter
            ? (nextIdx) => {
                setSelectedChapter(nextIdx);
                setInitialItemIndex(undefined);
              }
            : undefined
        }
      />
    );
  }

  const totalCompletedCount = currentCompleted.length;
  const progressPercent = Math.round((totalCompletedCount / Math.max(chapters.length, 1)) * 100);

  return (
    <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Hero Banner with School Aesthetic */}
      <div className="bg-gradient-to-br from-ink-navy via-slate-900 to-sumi-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-400/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-400/30 flex items-center gap-1.5">
                <Layers size={14} /> Flashcards & Repetition
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Hiragana, Katakana, Anime & Glosor
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Flashcards & Immersion
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Repetera Hiragana & Katakana med SM-2, studera autentiska japanska meningar från kända anime-serier med äkta ljud och grammatikförklaringar, eller träna in reseorden inför Japanresan.
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15">
            <div className="text-center pr-3 border-r border-white/20">
              <span className="text-[11px] uppercase font-bold text-slate-300 block">
                {activeDeck === 'kana' ? 'Bemästrade tecken' : 'Klara kapitel'}
              </span>
              <span className="text-xl font-black text-amber-400">
                {activeDeck === 'kana' ? `${summary.totalMasteredKana} / 85` : `${totalCompletedCount} / ${chapters.length}`}
              </span>
            </div>
            <div className="text-center pr-3 border-r border-white/20">
              <span className="text-[11px] uppercase font-bold text-slate-300 block">Repetera idag</span>
              <span className="text-xl font-black text-amber-300">{totalDueToday}</span>
            </div>
            <div className="text-center pl-1">
              <span className="text-[11px] uppercase font-bold text-slate-300 block">Framsteg</span>
              <span className="text-xl font-black text-white">
                {activeDeck === 'kana' ? `${summary.levelProgressPercent}%` : `${progressPercent}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Prominent One-Click Due Repetition Hero Banner */}
      {totalDueToday > 0 ? (
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-600/20 dark:from-amber-950/70 dark:via-sumi-900 dark:to-orange-950/50 p-5 sm:p-6 rounded-3xl border-2 border-amber-400/60 shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-sumi-950 flex items-center justify-center font-black shadow-md shrink-0 animate-pulse">
              <RotateCcw size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-sumi-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Dagens repetition
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                  {totalDueToday} kort förfallna enligt SM-2
                </span>
              </div>
              <h4 className="font-extrabold text-base sm:text-lg text-ink-900 dark:text-white mt-0.5">
                Dags att repetera enligt glömskekurvan!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Repetera i korta block för att behålla tecken och ord i långtidsminnet med minsta möjliga ansträngning.
              </p>
            </div>
          </div>
          <button
            onClick={handleStartDueReview}
            className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-sumi-950 font-black text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
          >
            <span>Repetera nu ({totalDueToday} kort)</span>
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50/90 dark:bg-emerald-950/40 p-4 sm:p-5 rounded-3xl border border-emerald-300 dark:border-emerald-800/70 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4 animate-fadeIn">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                  Repetitioner klara för idag 🎉
                </span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-ink-900 dark:text-white mt-0.5">
                Fortsätt studera nya kapitel
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Alla kort i repetitionskön är avklarade. Fortsätt din resa i{' '}
                <strong>
                  {currentArc ? `${currentArc.titleSv} (Kapitel ${nextUncompletedTaeKimChapter + 1})` : `Kapitel ${nextUncompletedTaeKimChapter + 1}`}
                </strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveDeck('anki');
              handleStartChapter(nextUncompletedTaeKimChapter);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 font-extrabold text-sm rounded-xl shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Fortsätt i {currentArc ? `Arc ${currentArc.arcNumber}` : 'Kapitel'} (Kapitel {nextUncompletedTaeKimChapter + 1})</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Categorized Deck Selector Tabs (6 categories) */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ANKI_CATEGORIES.map((cat) => {
            const isCatActive = activeCategory === cat.id;
            const CatIcon = cat.icon;

            let badgeContent: React.ReactNode = cat.badgeLabel;
            let isUrgent = false;

            if (cat.id === 'kana') {
              if (dueKanaCardsCount > 0) {
                isUrgent = true;
                badgeContent = `${dueKanaCardsCount} redo`;
              } else {
                badgeContent = isKatakana ? '85 katakana' : '85 hiragana';
              }
            } else if (cat.id === 'repetition') {
              if (dueAnkiCards.length > 0) {
                isUrgent = true;
                badgeContent = `${dueAnkiCards.length} redo`;
              } else {
                badgeContent = '0 redo';
              }
            } else if (cat.id === 'immersion') {
              badgeContent = `${stats.ankiProgress?.anki?.length || 0}/208 kap`;
            } else if (cat.id === 'exam') {
              badgeContent = `${stats.ankiProgress?.genki?.length || 0}/${GENKI_EXAM_CHAPTERS.length} kap`;
            } else if (cat.id === 'music') {
              const musicDone = (stats.ankiProgress?.stay_with_me?.length || 0) + (stats.ankiProgress?.plastic_love?.length || 0);
              badgeContent = `${musicDone}/124 ord`;
            } else if (cat.id === 'travel') {
              const travelDone = (stats.ankiProgress?.words?.length || 0) + (stats.ankiProgress?.phrases?.length || 0);
              badgeContent = `${travelDone}/20 kap`;
            }

            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  isCatActive
                    ? 'bg-white dark:bg-sumi-900 border-amber-500 shadow-md ring-2 ring-amber-400/20'
                    : 'bg-paper-100 dark:bg-sumi-800/60 border-paper-300 dark:border-sumi-700 hover:bg-paper-200'
                }`}
              >
                {isUrgent && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                    {cat.id === 'kana' ? dueKanaCardsCount : dueAnkiCards.length}
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                    isCatActive
                      ? 'bg-amber-500 text-sumi-950'
                      : 'bg-paper-200 dark:bg-sumi-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    <CatIcon size={16} />
                  </span>
                  <span className={`text-[11px] font-bold ${
                    isUrgent
                      ? 'text-rose-600 dark:text-rose-400 font-black'
                      : isCatActive
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {badgeContent}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-ink-900 dark:text-white mt-2">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {cat.id === 'kana' && 'SM-2 minneskort'}
                  {cat.id === 'immersion' && '2 075 kort i 6 Arcs'}
                  {cat.id === 'repetition' && 'SM-2 glömskekurva'}
                  {cat.id === 'exam' && 'Genki I tentaord'}
                  {cat.id === 'music' && 'City Pop glosor'}
                  {cat.id === 'travel' && 'Reseord & fraser'}
                </p>
              </button>
            );
          })}
        </div>

        {/* Secondary Sub-deck Pills (for categories with multiple decks) */}
        {currentCategoryDef.availableDecks.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 p-2 bg-paper-100/90 dark:bg-sumi-900/80 rounded-2xl border border-paper-300 dark:border-sumi-800 animate-fadeIn">
            <span className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider hidden sm:inline">
              Välj kortlek:
            </span>
            {currentCategoryDef.availableDecks.map((deck) => {
              const isSubActive = activeDeck === deck.mode;

              let badge: string | null = null;
              if (deck.mode === 'due') {
                badge = dueAnkiCards.length > 0 ? `${dueAnkiCards.length} förfallna` : '0 förfallna';
              } else if (deck.mode === 'weak') {
                badge = `${weakAnkiCards.length} svaga`;
              } else if (deck.mode === 'bookmarks') {
                badge = `${bookmarks.length} sparade`;
              } else if (deck.mode === 'stay_with_me') {
                badge = `${stats.ankiProgress?.stay_with_me?.length || 0}/${STAY_WITH_ME_CHAPTERS.length} kap`;
              } else if (deck.mode === 'plastic_love') {
                badge = `${stats.ankiProgress?.plastic_love?.length || 0}/${PLASTIC_LOVE_CHAPTERS.length} kap`;
              } else if (deck.mode === 'words') {
                badge = `${stats.ankiProgress?.words?.length || 0}/10 kap`;
              } else if (deck.mode === 'phrases') {
                badge = `${stats.ankiProgress?.phrases?.length || 0}/10 kap`;
              }

              return (
                <button
                  key={deck.mode}
                  onClick={() => {
                    setActiveDeck(deck.mode);
                    playSfx('click');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSubActive
                      ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                      : 'bg-white dark:bg-sumi-800 text-slate-700 dark:text-slate-300 hover:bg-paper-200 dark:hover:bg-sumi-700 border border-paper-300/60 dark:border-sumi-700'
                  }`}
                >
                  <span>{deck.label}</span>
                  {badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isSubActive
                        ? 'bg-white/20 text-white dark:bg-sumi-950/20 dark:text-sumi-950'
                        : deck.mode === 'due' && dueAnkiCards.length > 0
                        ? 'bg-rose-500 text-white'
                        : 'bg-paper-200 dark:bg-sumi-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Empty state for Due reviews if none due */}
      {activeDeck === 'due' && dueAnkiCards.length === 0 && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-8 sm:p-10 border border-dashed border-emerald-300 dark:border-emerald-800 text-center space-y-4 max-w-lg mx-auto animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-extrabold text-ink-900 dark:text-white">
            Inga repetitioner redo just nu!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Fantastiskt jobbat! Alla dina anime-kort är uppdaterade enligt glömskekurvan. Nya repetitioner dyker upp automatiskt när de förfaller.
          </p>
          <button
            onClick={() => {
              setActiveDeck('anki');
              playSfx('click');
            }}
            className="px-5 py-2.5 bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 rounded-xl font-bold text-xs shadow-md hover:opacity-95 cursor-pointer"
          >
            Fortsätt studera nya kapitel
          </button>
        </div>
      )}

      {/* Empty state for Weak cards if none recorded */}
      {activeDeck === 'weak' && weakAnkiCards.length === 0 && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-8 sm:p-10 border border-dashed border-paper-300 dark:border-sumi-700 text-center space-y-4 max-w-lg mx-auto animate-fadeIn">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/80 rounded-2xl flex items-center justify-center mx-auto text-amber-500">
            <Sparkles size={32} className="text-amber-500" />
          </div>
          <h3 className="text-xl font-extrabold text-ink-900 dark:text-white">
            Inga svaga kort registrerade
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            När du svarar "Kunde inte" eller "Igen" på anime-kort under dina studier sparas de automatiskt här så att du kan intensivträna just de fraser du har svårt för.
          </p>
          <button
            onClick={() => {
              setActiveDeck('anki');
              playSfx('click');
            }}
            className="px-5 py-2.5 bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 rounded-xl font-bold text-xs shadow-md hover:opacity-95 cursor-pointer"
          >
            Öva kapitel
          </button>
        </div>
      )}

      {/* Empty state for bookmarks if none saved */}
      {activeDeck === 'bookmarks' && bookmarks.length === 0 && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-8 sm:p-10 border border-dashed border-paper-300 dark:border-sumi-700 text-center space-y-4 max-w-lg mx-auto animate-fadeIn">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/80 rounded-2xl flex items-center justify-center mx-auto text-amber-500">
            <Star size={32} className="fill-amber-400 text-amber-500" />
          </div>
          <h3 className="text-xl font-extrabold text-ink-900 dark:text-white">
            Inga sparade kort än
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            När du studerar kapitel eller söker bland anime-korten kan du klicka på stjärnan (⭐) för att samla dina favoritcitat och svåra fraser i en egen repetitionskortlek.
          </p>
          <button
            onClick={() => {
              setActiveDeck('anki');
              playSfx('click');
            }}
            className="px-5 py-2.5 bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 rounded-xl font-bold text-xs shadow-md hover:opacity-95 cursor-pointer"
          >
            Utforska Anime-kortleken
          </button>
        </div>
      )}

      {/* Genki I Exam Information & Download Banner */}
      {activeDeck === 'genki' && (
        <div className="bg-rose-50/90 dark:bg-rose-950/40 p-5 rounded-3xl border border-rose-200 dark:border-rose-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Tentafokus
              </span>
              <span className="text-xs text-rose-700 dark:text-rose-300 font-bold">
                Genki I (3rd Edition) Kapitel 0, 1 & 2
              </span>
            </div>
            <h4 className="font-extrabold text-base sm:text-lg text-ink-900 dark:text-white">
              115 ord & fraser uppdelade i 14 temakapitel
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Öva aktiv framkallning från svenska till japanska, hör talsyntesen och lär dig tentafällor (t.ex. partiklar, långa vokaler och Kosoado-pekord).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/Genki_I_Tenta_Ordforrad.apkg"
              download="Genki_I_Tenta_Ordforrad.apkg"
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              title="Ladda ner färdig .apkg-fil för Anki på dator eller mobil"
            >
              <Download size={15} />
              <span>Ladda ner .apkg</span>
            </a>
          </div>
        </div>
      )}

      {/* Stay With Me City Pop Information & Download Banner */}
      {activeDeck === 'stay_with_me' && (
        <div className="bg-indigo-50/90 dark:bg-indigo-950/40 p-5 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Music size={12} /> City Pop Kortlek
              </span>
              <span className="text-xs text-indigo-700 dark:text-indigo-300 font-bold">
                真夜中のドア〜Stay With Me (松原みき, 1979)
              </span>
            </div>
            <h4 className="font-extrabold text-base sm:text-lg text-ink-900 dark:text-white">
              54 glosor sorterade efter förekomst i det japanska språket
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Korten börjar med japanskans allra vanligaste basord (私, 言う, 来る, 今 m.fl.) och bygger gradvis mot låtens mest stämningsfulla och poetiska uttryck. Varje kort visar den exakta textraden ur låten!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/Stay_With_Me_Ordforrad.apkg"
              download="Stay_With_Me_Ordforrad.apkg"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              title="Ladda ner färdig .apkg-fil för Anki på dator eller mobil"
            >
              <Download size={15} />
              <span>Ladda ner .apkg</span>
            </a>
          </div>
        </div>
      )}

      {/* Plastic Love City Pop Information & Download Banner */}
      {activeDeck === 'plastic_love' && (
        <div className="bg-fuchsia-50/90 dark:bg-fuchsia-950/40 p-5 rounded-3xl border border-fuchsia-200 dark:border-fuchsia-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-fuchsia-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Disc size={12} /> City Pop Kortlek
              </span>
              <span className="text-xs text-fuchsia-700 dark:text-fuchsia-300 font-bold">
                プラスティック・ラブ / Plastic Love (竹内まりや, 1984)
              </span>
            </div>
            <h4 className="font-extrabold text-base sm:text-lg text-ink-900 dark:text-white">
              70 glosor sorterade efter förekomst i det japanska språket
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Upptäck alla ord ur den legendariska City Pop-klassikern. Börjar med högfrekventa basord och avancerar mot klubbliv, Tokyos motorvägar och 80-talets digitala kärleksliknelser.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/Plastic_Love_Ordforrad.apkg"
              download="Plastic_Love_Ordforrad.apkg"
              className="px-4 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-extrabold rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              title="Ladda ner färdig .apkg-fil för Anki på dator eller mobil"
            >
              <Download size={15} />
              <span>Ladda ner .apkg</span>
            </a>
          </div>
        </div>
      )}

      {/* KANA FLASHCARDS (When activeCategory === 'kana') */}
      {activeCategory === 'kana' ? (
        <SrsFlashcards embedded={true} />
      ) : activeDeck === 'anki' ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Search & Filter Controls */}
          <div className="space-y-3">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Sök bland alla 2 075 anime-kort efter anime-titel, romaji, kanji eller betydelse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-sumi-900 border border-paper-300 dark:border-sumi-800 rounded-2xl text-sm font-medium text-ink-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
            </div>

            {/* Live Search Results Drawer */}
            {searchQuery.trim() && (
              <div className="bg-white dark:bg-sumi-900 p-4 rounded-2xl border border-paper-300 dark:border-sumi-800 shadow-lg space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Hittade {searchResults.length} kort matchande "{searchQuery}"
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                  >
                    Rensa sökning
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
                  {searchResults.map(({ card, globalIndex, chapterIndex }) => (
                    <div
                      key={globalIndex}
                      onClick={() => handleStartChapter(chapterIndex, globalIndex)}
                      className="p-3 bg-paper-100 dark:bg-sumi-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl border border-paper-200 dark:border-sumi-700 text-left transition-colors cursor-pointer flex justify-between items-start gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                          <span>Kapitel {chapterIndex + 1}</span>
                          {card.source && <span className="truncate max-w-[120px]">{formatAnimeSource(card.source)}</span>}
                        </div>
                        <p className="font-bold text-sm text-ink-900 dark:text-white truncate font-japanese mt-0.5">
                          {card.kanji}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{card.romaji}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBookmark(globalIndex);
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
                          bookmarks.includes(globalIndex)
                            ? 'bg-amber-500 text-sumi-950 border-amber-400 shadow-xs'
                            : 'bg-white dark:bg-sumi-900 text-slate-400 border-paper-300 dark:border-sumi-700 hover:text-amber-500'
                        }`}
                        title={bookmarks.includes(globalIndex) ? 'Ta bort från sparade kort' : 'Spara till favoriter (⭐)'}
                      >
                        <Star size={13} className={bookmarks.includes(globalIndex) ? 'fill-current' : ''} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Pills & Accordion Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-paper-200 dark:bg-sumi-800 p-1 rounded-xl border border-paper-300 dark:border-sumi-700">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === 'all'
                        ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-ink-900'
                    }`}
                  >
                    Alla ({chapters.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('uncompleted')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === 'uncompleted'
                        ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-ink-900'
                    }`}
                  >
                    Ej klara ({chapters.length - ankiCompleted.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('completed')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === 'completed'
                        ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-ink-900'
                    }`}
                  >
                    Klara ({ankiCompleted.length})
                  </button>
                </div>

                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2.5 py-1 bg-paper-100 dark:bg-sumi-800/50 rounded-lg border border-paper-300/50 dark:border-sumi-700">
                  {completedArcsCount} av 6 Arcs klara
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleExpandAll}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white bg-paper-100 dark:bg-sumi-800 hover:bg-paper-200 dark:hover:bg-sumi-700 border border-paper-300 dark:border-sumi-700 transition-all cursor-pointer"
                >
                  Öppna alla
                </button>
                <button
                  onClick={handleCollapseAll}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white bg-paper-100 dark:bg-sumi-800 hover:bg-paper-200 dark:hover:bg-sumi-700 border border-paper-300 dark:border-sumi-700 transition-all cursor-pointer"
                >
                  Stäng alla
                </button>
              </div>
            </div>
          </div>

          {/* 6 Arc Accordions */}
          <div className="space-y-4">
            {ANKI_ARCS.map((arc) => {
              const ArcIcon = arc.icon;
              const isOpen = Boolean(expandedArcs[arc.id]);
              const arcAllChapters = chapters.slice(arc.startChapterIndex, arc.endChapterIndex + 1);

              const arcFilteredChapters = arcAllChapters.filter((chap) => {
                if (statusFilter === 'completed' && !chap.isCompleted) return false;
                if (statusFilter === 'uncompleted' && chap.isCompleted) return false;
                if (searchMatchingChapterIndices && !searchMatchingChapterIndices.has(chap.index)) return false;
                return true;
              });

              const completedInArc = getArcCompletedCount(arc, ankiCompleted);
              const arcPercent = Math.round((completedInArc / arc.totalChapters) * 100);
              const isArc100 = completedInArc === arc.totalChapters;

              return (
                <div
                  key={arc.id}
                  className={`bg-white dark:bg-sumi-900 rounded-3xl border transition-all overflow-hidden ${
                    isOpen
                      ? `${arc.theme.borderHighlight} shadow-md`
                      : 'border-paper-300 dark:border-sumi-800 hover:border-paper-400 dark:hover:border-sumi-700 shadow-xs'
                  }`}
                >
                  {/* Arc Header Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleArc(arc.id)}
                    className="w-full p-4 sm:p-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-paper-50/50 dark:hover:bg-sumi-800/30 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${arc.theme.badgeBg} ${arc.theme.badgeBorder} border shadow-2xs`}>
                        <ArcIcon size={20} className={arc.theme.accentColor} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">
                          <span>ARC {arc.arcNumber}</span>
                          <span>·</span>
                          <span>Kapitel {arc.startChapter}–{arc.endChapter}</span>
                          <span>·</span>
                          <span>{arc.totalCards} kort</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-ink-900 dark:text-white flex items-center gap-2 mt-0.5 flex-wrap">
                          <span>{arc.titleSv}</span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-400 font-japanese">
                            {arc.titleJap}
                          </span>
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-paper-200 dark:border-sumi-800">
                      <div className="text-left md:text-right">
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          {completedInArc} / {arc.totalChapters} kapitel
                          <span className="text-slate-400 ml-1">({arcPercent}%)</span>
                        </div>
                        <div className="w-32 sm:w-40 h-2 bg-paper-200 dark:bg-sumi-800 rounded-full overflow-hidden mt-1.5">
                          <div
                            className={`h-full ${arc.theme.progressColor} transition-all duration-500 rounded-full`}
                            style={{ width: `${arcPercent}%` }}
                          />
                        </div>
                      </div>

                      {isArc100 && (
                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                          <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                          <span>Fullbordad 🏅</span>
                        </span>
                      )}

                      <div className="w-8 h-8 rounded-xl bg-paper-100 dark:bg-sumi-800 flex items-center justify-center text-slate-400 shrink-0">
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-500' : ''}`}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Arc Expanded Body */}
                  {isOpen && (
                    <div className="border-t border-paper-200 dark:border-sumi-800 animate-fadeIn">
                      {/* Pedagogical Description & Milestone Info */}
                      <div className="bg-paper-100/70 dark:bg-sumi-950/60 p-4 sm:px-6 border-b border-paper-200 dark:border-sumi-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                          <span className="font-extrabold text-ink-900 dark:text-white">Pedagogiskt fokus: </span>
                          {arc.descriptionSv}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-sumi-800/80 px-3 py-1.5 rounded-xl border border-paper-300/70 dark:border-sumi-700 shadow-2xs">
                          <Award size={14} className={arc.theme.accentColor} />
                          <span>Milstolpe: <strong className="text-ink-900 dark:text-white">{arc.badgeTitle}</strong> <span className="font-japanese text-slate-400 font-normal">({arc.badgeJap})</span></span>
                        </div>
                      </div>

                      {/* Chapter Cards Grid */}
                      <div className="p-4 sm:p-6">
                        {arcFilteredChapters.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                            {arcFilteredChapters.map((chap) => (
                              <button
                                key={chap.index}
                                onClick={() => handleStartChapter(chap.index)}
                                className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex flex-col justify-between min-h-[110px] ${
                                  chap.isCompleted
                                    ? 'bg-white dark:bg-sumi-900 border-emerald-400/60 shadow-xs ring-1 ring-emerald-400/20'
                                    : 'bg-white dark:bg-sumi-900 border-paper-300 dark:border-sumi-800 shadow-xs hover:border-amber-400'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-ink-900 dark:text-slate-200">
                                      {chap.title}
                                    </span>
                                    {chap.isCompleted ? (
                                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                                        <CheckCircle2 size={12} /> Klarad
                                      </span>
                                    ) : (
                                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-paper-200 dark:bg-sumi-800 px-2 py-0.5 rounded-md">
                                        {chap.itemCount} kort
                                      </span>
                                    )}
                                  </div>

                                  {chap.preview && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate font-medium">
                                      {chap.preview}
                                    </p>
                                  )}
                                </div>

                                <div className="pt-3 flex items-center justify-between border-t border-paper-200 dark:border-sumi-800/80 text-xs font-bold text-amber-600 dark:text-amber-400 mt-3">
                                  <span>{chap.isCompleted ? 'Öva igen' : 'Starta kapitel'}</span>
                                  <ArrowRight size={14} />
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="py-6 text-center text-xs text-slate-400">
                            Inga kapitel i denna Arc matchar det valda filtret.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* NON-ANKI DECKS (Genki, Stay With Me, Plastic Love, Words, Phrases, Due, Weak, Bookmarks) */
        <div className="space-y-6 animate-fadeIn">
          {/* Chapter Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg font-bold text-ink-900 dark:text-white">
              Alla kapitel ({chapters.length} st)
            </h3>

            <div className="flex items-center gap-1.5 bg-paper-200 dark:bg-sumi-800 p-1 rounded-xl border border-paper-300 dark:border-sumi-700">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-ink-900'
                }`}
              >
                Alla ({chapters.length})
              </button>
              <button
                onClick={() => setStatusFilter('uncompleted')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'uncompleted'
                    ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-ink-900'
                }`}
              >
                Ej klara ({chapters.length - totalCompletedCount})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'completed'
                    ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-ink-900'
                }`}
              >
                Klara ({totalCompletedCount})
              </button>
            </div>
          </div>

          {/* Chapters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredChapters.map((chap) => (
              <button
                key={chap.index}
                onClick={() => handleStartChapter(chap.index)}
                className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex flex-col justify-between min-h-[110px] ${
                  chap.isCompleted
                    ? 'bg-white dark:bg-sumi-900 border-emerald-400/60 shadow-xs ring-1 ring-emerald-400/20'
                    : 'bg-white dark:bg-sumi-900 border-paper-300 dark:border-sumi-800 shadow-xs hover:border-amber-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-ink-900 dark:text-slate-200">
                      {chap.title}
                    </span>
                    {chap.isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 size={12} /> Klarad
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-paper-200 dark:bg-sumi-800 px-2 py-0.5 rounded-md">
                        {chap.itemCount} kort
                      </span>
                    )}
                  </div>

                  {chap.preview && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate font-medium">
                      {chap.preview}
                    </p>
                  )}
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-paper-200 dark:border-sumi-800/80 text-xs font-bold text-amber-600 dark:text-amber-400 mt-3">
                  <span>{chap.isCompleted ? 'Öva igen' : 'Starta kapitel'}</span>
                  <ArrowRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
