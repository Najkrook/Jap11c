import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Circle, 
  Layers, 
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  GRAMMAR_PARTS, 
  TAE_KIM_CHAPTERS, 
  getChapterById, 
  getNextChapter, 
  getPreviousChapter 
} from '../../data/taeKimGrammarData';
import type { GrammarPartId } from '../../types/grammar';
import { GrammarChapterReader } from './GrammarChapterReader';
import { GrammarQuickReference } from './GrammarQuickReference';
import { useAudio } from '../../modules/audio';

const STORAGE_KEY = 'hiraganaskolan_grammar_progress_v1';

export const TaeKimGuideView: React.FC = () => {
  const { playSfx } = useAudio();
  const [activeView, setActiveView] = useState<'chapters' | 'reference'>('chapters');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(TAE_KIM_CHAPTERS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [partFilter, setPartFilter] = useState<'all' | GrammarPartId>('all');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Persistence for completed chapters
  const [completedChapters, setCompletedChapters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      // Ignore localStorage error
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedChapters));
    } catch (e) {
      console.warn('Failed to save grammar progress', e);
    }
  }, [completedChapters]);

  const toggleChapterComplete = (chapterId: string) => {
    setCompletedChapters(prev => {
      const exists = prev.includes(chapterId);
      const next = exists ? prev.filter(id => id !== chapterId) : [...prev, chapterId];
      return next;
    });
  };

  const selectedChapter = useMemo(() => {
    return getChapterById(selectedChapterId) || TAE_KIM_CHAPTERS[0];
  }, [selectedChapterId]);

  const previousChapter = useMemo(() => {
    return getPreviousChapter(selectedChapterId);
  }, [selectedChapterId]);

  const nextChapter = useMemo(() => {
    return getNextChapter(selectedChapterId);
  }, [selectedChapterId]);

  // Filtered chapters based on search query and part filter
  const filteredChapters = useMemo(() => {
    return TAE_KIM_CHAPTERS.filter(chap => {
      const matchesPart = partFilter === 'all' || chap.partId === partFilter;
      if (!matchesPart) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        chap.titleSv.toLowerCase().includes(q) ||
        chap.titleJap.toLowerCase().includes(q) ||
        chap.romajiTitle.toLowerCase().includes(q) ||
        chap.summarySv.toLowerCase().includes(q) ||
        chap.taeKimCoreInsightSv.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, partFilter]);

  const totalChaptersCount = TAE_KIM_CHAPTERS.length;
  const completedCount = completedChapters.length;
  const progressPercent = Math.round((completedCount / totalChaptersCount) * 100);

  return (
    <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Hero Banner with Study Theme */}
      <div className="bg-gradient-to-r from-ink-navy via-brand-700 to-sumi-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-brand-bronze/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-4 -bottom-8 opacity-10 text-[180px] font-jp font-bold select-none pointer-events-none">
          文法
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-white/15 backdrop-blur text-sakura-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 flex items-center gap-1.5">
                  <BookOpen size={14} /> Tae Kims Grammatikguide
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  22 kapitel • Komplett kursstöd
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Japansk Grammatik från Grunden
              </h1>
              <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Upptäck hur japanska satser faktiskt tänker utan att tvingas genom konstlade västerländska översättningar. Från kopulan och <em>wa</em> vs <em>ga</em>, till te-formens magi och villkorsformerna.
              </p>
            </div>

            {/* Progress Badge */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center min-w-[170px] shrink-0 text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">
                Dina Framsteg
              </span>
              <div className="text-3xl font-black text-amber-300 pt-1">
                {progressPercent}%
              </div>
              <span className="text-xs text-slate-300">
                {completedCount} av {totalChaptersCount} kapitel lästa
              </span>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/15">
            <button
              onClick={() => {
                setActiveView('chapters');
                playSfx('click');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeView === 'chapters'
                  ? 'bg-white text-ink-900 shadow-md scale-102'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <BookOpen size={16} /> Kapitelguide (Läs & Öva)
            </button>
            <button
              onClick={() => {
                setActiveView('reference');
                playSfx('click');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeView === 'reference'
                  ? 'bg-white text-ink-900 shadow-md scale-102'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Layers size={16} /> Formelblad & Snabböversikt
            </button>
          </div>
        </div>
      </div>

      {/* Cross-Link Card: Link to Genki Study Guide */}
      <div className="bg-paper-50 dark:bg-sumi-900/60 border border-paper-300 dark:border-sumi-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <span className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold shrink-0">
            📖
          </span>
          <span>
            Vill du öva Genki-ordlistor, studieplan och klassrumsfraser?
          </span>
        </div>
        <Link
          to="/guide"
          className="text-xs font-bold text-brand-600 dark:text-brand-gold hover:underline flex items-center gap-1.5 shrink-0"
        >
          Öppna Genki Studieguide <ArrowRight size={14} />
        </Link>
      </div>

      {/* Main Content Area */}
      {activeView === 'reference' ? (
        <GrammarQuickReference />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr] gap-8 items-start">
          
          {/* Mobile Chapter Selector Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="w-full p-4 rounded-2xl bg-white dark:bg-sumi-900 border border-paper-300 dark:border-sumi-800 flex items-center justify-between font-bold text-xs sm:text-sm shadow-xs"
            >
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-brand-600" />
                <span>Kapitel {selectedChapter.chapterNumber}: {selectedChapter.titleSv}</span>
              </div>
              {isMobileSidebarOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {/* Left Column: Chapters Navigation Index */}
          <aside className={`bg-white dark:bg-sumi-900 rounded-3xl p-5 border border-paper-300 dark:border-sumi-800 shadow-xs space-y-4 lg:sticky lg:top-20 max-h-[85vh] flex flex-col ${
            isMobileSidebarOpen ? 'block' : 'hidden lg:flex'
          }`}>
            <div className="space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Kapitelförteckning
                </h2>
                <span className="text-xs text-slate-400 font-medium">
                  {filteredChapters.length} av {totalChaptersCount}
                </span>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Sök kapitel, te-form, wa vs ga..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-paper-100 dark:bg-sumi-950 text-xs border border-paper-300 dark:border-sumi-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Part filter pills */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
                <button
                  onClick={() => setPartFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                    partFilter === 'all'
                      ? 'bg-brand-600 text-white shadow-2xs'
                      : 'bg-paper-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Alla ({TAE_KIM_CHAPTERS.length})
                </button>
                {GRAMMAR_PARTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPartFilter(p.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                      partFilter === p.id
                        ? 'bg-brand-600 text-white shadow-2xs'
                        : 'bg-paper-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Del {p.partNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Chapters List Scrollable */}
            <div className="overflow-y-auto pr-1 space-y-1.5 flex-1 divide-y divide-paper-200/60 dark:divide-sumi-800/60">
              {filteredChapters.map(chap => {
                const isSelected = chap.id === selectedChapterId;
                const isDone = completedChapters.includes(chap.id);

                return (
                  <button
                    key={chap.id}
                    type="button"
                    onClick={() => {
                      setSelectedChapterId(chap.id);
                      setIsMobileSidebarOpen(false);
                      playSfx('click');
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all duration-150 flex items-start justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-950/60 border border-brand-300 dark:border-brand-800 text-brand-950 dark:text-brand-100 shadow-2xs'
                        : 'hover:bg-paper-100 dark:hover:bg-sumi-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-brand-200 dark:bg-brand-900 text-brand-900 dark:text-brand-200'
                            : 'bg-paper-200 dark:bg-sumi-800 text-slate-500'
                        }`}>
                          Kap {chap.chapterNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {chap.readingTimeMin} min
                        </span>
                      </div>
                      <div className="text-xs font-extrabold truncate">
                        {chap.titleSv}
                      </div>
                      <div className="text-[11px] font-jp text-slate-400 dark:text-slate-500 truncate">
                        {chap.titleJap}
                      </div>
                    </div>

                    <div className="pt-1 shrink-0">
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <Circle size={16} className="text-slate-300 dark:text-sumi-700" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Column: Active Chapter Reader */}
          <main className="min-w-0">
            <GrammarChapterReader
              key={selectedChapter.id}
              chapter={selectedChapter}
              isCompleted={completedChapters.includes(selectedChapter.id)}
              onToggleComplete={() => toggleChapterComplete(selectedChapter.id)}
              onPrevious={previousChapter ? () => setSelectedChapterId(previousChapter.id) : undefined}
              onNext={nextChapter ? () => setSelectedChapterId(nextChapter.id) : undefined}
              hasPrevious={Boolean(previousChapter)}
              hasNext={Boolean(nextChapter)}
            />
          </main>
        </div>
      )}
    </div>
  );
};
