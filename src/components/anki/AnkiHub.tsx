import React, { useState, useMemo } from 'react';
import { 
  Tv, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Play, 
  Compass, 
  ArrowRight
} from 'lucide-react';
import type { AnkiDeckMode, AnkiChapter } from '../../types/anki';
import { 
  ANKI_CARDS, 
  getDeckChapters, 
  searchAnkiCards, 
  type SearchResult,
  formatAnimeSource
} from './ankiLogic';
import { AnkiCardStudy } from './AnkiCardStudy';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/progressionState';

export const AnkiHub: React.FC = () => {
  const { playSfx } = useAudio();
  const { stats } = useProgression();

  const [activeDeck, setActiveDeck] = useState<AnkiDeckMode>('anki');
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [initialItemIndex, setInitialItemIndex] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'uncompleted' | 'completed'>('all');

  const currentCompleted = useMemo(() => {
    return stats.ankiProgress?.[activeDeck] || [];
  }, [stats.ankiProgress, activeDeck]);

  // Compute all chapters for active deck
  const chapters: AnkiChapter[] = useMemo(() => {
    return getDeckChapters(activeDeck, currentCompleted);
  }, [activeDeck, currentCompleted]);

  // Search results
  const searchResults: SearchResult[] = useMemo(() => {
    if (!searchQuery.trim() || activeDeck !== 'anki') return [];
    return searchAnkiCards(searchQuery, 24);
  }, [searchQuery, activeDeck]);

  // Filtered chapters for display
  const filteredChapters = useMemo(() => {
    return chapters.filter((chap) => {
      if (statusFilter === 'completed') return chap.isCompleted;
      if (statusFilter === 'uncompleted') return !chap.isCompleted;
      return true;
    });
  }, [chapters, statusFilter]);

  // Find next uncompleted chapter for quick start
  const nextUncompletedChapter = chapters.find((c) => !c.isCompleted)?.index ?? 0;

  const handleStartChapter = (chapterIdx: number, itemIdx?: number) => {
    playSfx('click');
    setSelectedChapter(chapterIdx);
    setInitialItemIndex(itemIdx);
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
    return (
      <AnkiCardStudy
        mode={activeDeck}
        chapterIndex={selectedChapter}
        initialItemIndex={initialItemIndex}
        onBackToChapters={handleBackToChapters}
        onChapterCompleted={handleChapterDone}
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
                <Tv size={14} /> Anki & Immersion
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Tae Kim Grammatik & Reseglosor
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Anki Immersion & Fraser
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Studera autentiska japanska meningar från kända anime-serier med äkta ljud och grammatikförklaringar, eller träna in reseorden inför Japanresan.
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15">
            <div className="text-center pr-3 border-r border-white/20">
              <span className="text-[11px] uppercase font-bold text-slate-300 block">Klara kapitel</span>
              <span className="text-xl font-black text-amber-400">{totalCompletedCount} / {chapters.length}</span>
            </div>
            <div className="text-center pl-1">
              <span className="text-[11px] uppercase font-bold text-slate-300 block">Framsteg</span>
              <span className="text-xl font-black text-white">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Deck Mode Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => {
            setActiveDeck('anki');
            playSfx('click');
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeDeck === 'anki'
              ? 'bg-white dark:bg-sumi-900 border-amber-500 shadow-md ring-2 ring-amber-400/20'
              : 'bg-paper-100 dark:bg-sumi-800/60 border-paper-300 dark:border-sumi-700 hover:bg-paper-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
              activeDeck === 'anki' ? 'bg-amber-500 text-sumi-950' : 'bg-paper-200 dark:bg-sumi-700 text-slate-600 dark:text-slate-300'
            }`}>
              <Tv size={16} />
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {(stats.ankiProgress?.anki?.length || 0)} / {Math.ceil(ANKI_CARDS.length / 10)} kap
            </span>
          </div>
          <h3 className="font-extrabold text-base text-ink-900 dark:text-white mt-2">
            Tae Kim Anime Immersion
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {ANKI_CARDS.length} kort med anime-ljud & skärmdumpar
          </p>
        </button>

        <button
          onClick={() => {
            setActiveDeck('words');
            playSfx('click');
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeDeck === 'words'
              ? 'bg-white dark:bg-sumi-900 border-amber-500 shadow-md ring-2 ring-amber-400/20'
              : 'bg-paper-100 dark:bg-sumi-800/60 border-paper-300 dark:border-sumi-700 hover:bg-paper-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
              activeDeck === 'words' ? 'bg-amber-500 text-sumi-950' : 'bg-paper-200 dark:bg-sumi-700 text-slate-600 dark:text-slate-300'
            }`}>
              <BookOpen size={16} />
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {(stats.ankiProgress?.words?.length || 0)} / 10 kap
            </span>
          </div>
          <h3 className="font-extrabold text-base text-ink-900 dark:text-white mt-2">
            Reseord (100 viktigaste)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            10 kapitel ordnade efter användningsområde
          </p>
        </button>

        <button
          onClick={() => {
            setActiveDeck('phrases');
            playSfx('click');
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeDeck === 'phrases'
              ? 'bg-white dark:bg-sumi-900 border-amber-500 shadow-md ring-2 ring-amber-400/20'
              : 'bg-paper-100 dark:bg-sumi-800/60 border-paper-300 dark:border-sumi-700 hover:bg-paper-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
              activeDeck === 'phrases' ? 'bg-amber-500 text-sumi-950' : 'bg-paper-200 dark:bg-sumi-700 text-slate-600 dark:text-slate-300'
            }`}>
              <Compass size={16} />
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {(stats.ankiProgress?.phrases?.length || 0)} / 10 kap
            </span>
          </div>
          <h3 className="font-extrabold text-base text-ink-900 dark:text-white mt-2">
            Resefraser (100 fraser)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Praktiska fraser för tåg, restaurang & hjälp
          </p>
        </button>
      </div>

      {/* Quick Start Action Card */}
      <div className="bg-amber-50/80 dark:bg-amber-950/40 p-4 sm:p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-sumi-950 flex items-center justify-center font-black">
            <Play size={18} />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-ink-900 dark:text-white">
              Fortsätt studera
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Hoppa direkt in i nästa oavklarade kapitel: <strong>Kapitel {nextUncompletedChapter + 1}</strong>
            </p>
          </div>
        </div>
        <button
          onClick={() => handleStartChapter(nextUncompletedChapter)}
          className="w-full sm:w-auto px-5 py-2.5 bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 font-extrabold text-sm rounded-xl shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Starta Kapitel {nextUncompletedChapter + 1}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Search & Filter Bar */}
      {activeDeck === 'anki' && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Sök bland alla 1 867 anime-kort efter anime-titel, romaji, kanji eller betydelse..."
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
                  className="text-xs font-bold text-amber-600 hover:underline"
                >
                  Rensa sökning
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {searchResults.map(({ card, globalIndex, chapterIndex }) => (
                  <button
                    key={globalIndex}
                    onClick={() => handleStartChapter(chapterIndex, globalIndex)}
                    className="p-3 bg-paper-100 dark:bg-sumi-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl border border-paper-200 dark:border-sumi-700 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                      <span>Kapitel {chapterIndex + 1}</span>
                      {card.source && <span className="truncate max-w-[120px]">{formatAnimeSource(card.source)}</span>}
                    </div>
                    <p className="font-bold text-sm text-ink-900 dark:text-white truncate font-japanese mt-0.5">
                      {card.kanji}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{card.romaji}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
  );
};
