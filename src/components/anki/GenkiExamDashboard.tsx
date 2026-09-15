import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Play, 
  Download, 
  Flame,
  BookOpen,
  Volume2,
  ChevronRight,
  Filter
} from 'lucide-react';
import { GENKI_EXAM_VOCAB, type GenkiVocabItem } from '../../data/genkiExamData';
import { getGenkiDeckStats, calculateGenkiNextIntervals } from './ankiLogic';
import { useProgression } from '../../context/progressionState';
import { useAudio } from '../../modules/audio';

interface GenkiExamDashboardProps {
  onStartSession: (batchSize: number | 'all', specificItemIdx?: number) => void;
}

export const GenkiExamDashboard: React.FC<GenkiExamDashboardProps> = ({
  onStartSession,
}) => {
  const { stats } = useProgression();
  const { playSfx, speakJapanese } = useAudio();
  const [batchSize, setBatchSize] = useState<number | 'all'>(20);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'due' | 'today' | 'mastered' | 'unstarted'>('all');

  const deckStats = useMemo(() => {
    return getGenkiDeckStats(stats.genkiCardProgress, GENKI_EXAM_VOCAB.length);
  }, [stats.genkiCardProgress]);

  // Compute status for every card in the dataset
  const cardStatuses = useMemo(() => {
    const progressMap = stats.genkiCardProgress || {};
    const now = Date.now();
    const fiveHoursLater = now + 5 * 3600 * 1000;

    return GENKI_EXAM_VOCAB.map((item, index) => {
      const progress = progressMap[index];
      if (!progress) {
        return {
          index,
          item,
          statusCategory: 'unstarted' as const,
          badgeLabel: 'Ostartat',
          badgeColor: 'bg-paper-200 dark:bg-sumi-800 text-slate-500 dark:text-slate-400 border-paper-300 dark:border-sumi-700',
          nextReviewDate: null,
          repetitions: 0,
        };
      }

      if (progress.nextReviewDate <= now) {
        return {
          index,
          item,
          statusCategory: 'due' as const,
          badgeLabel: 'Redo nu',
          badgeColor: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse',
          nextReviewDate: progress.nextReviewDate,
          repetitions: progress.repetitions,
        };
      }

      if (progress.nextReviewDate <= fiveHoursLater) {
        const remainingMinutes = Math.max(1, Math.round((progress.nextReviewDate - now) / (60 * 1000)));
        const timeText = remainingMinutes < 60 ? `${remainingMinutes}m` : `${Math.round(remainingMinutes / 60)}h`;
        return {
          index,
          item,
          statusCategory: 'today' as const,
          badgeLabel: `Om ${timeText}`,
          badgeColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          nextReviewDate: progress.nextReviewDate,
          repetitions: progress.repetitions,
        };
      }

      const daysRemaining = Math.max(1, Math.round((progress.nextReviewDate - now) / (24 * 3600 * 1000)));
      return {
        index,
        item,
        statusCategory: 'mastered' as const,
        badgeLabel: `Om ${daysRemaining}d`,
        badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        nextReviewDate: progress.nextReviewDate,
        repetitions: progress.repetitions,
      };
    });
  }, [stats.genkiCardProgress]);

  // Filter and search words
  const filteredWords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return cardStatuses.filter((entry) => {
      // Status filter
      if (filterMode !== 'all' && entry.statusCategory !== filterMode) {
        return false;
      }

      // Search query
      if (!q) return true;
      const { item } = entry;
      return (
        item.japanese.toLowerCase().includes(q) ||
        item.romaji.toLowerCase().includes(q) ||
        item.swedish.toLowerCase().includes(q) ||
        (item.english && item.english.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.lesson && item.lesson.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    });
  }, [cardStatuses, searchQuery, filterMode]);

  const handlePlayAudio = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSfx('click');
    speakJapanese(text).catch(() => {});
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Exam Banner */}
      <div className="bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent dark:from-rose-950/40 dark:via-sumi-900 dark:to-sumi-950 p-6 sm:p-8 rounded-3xl border border-rose-200/80 dark:border-rose-900/60 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-rose-600 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <GraduationCap size={14} /> Genki I Tenta
            </span>
            <span className="text-xs text-rose-700 dark:text-rose-300 font-bold bg-rose-100 dark:bg-rose-900/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800">
              115 tenta-ord i samlad repetitionskö
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
            Intelligent Tenta-Repetition
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Alla 115 ord från Genki I (Kapitel 0, 1 & 2) samlade i ett adaptivt Spaced Repetition-system.
            Betygsätt med 4 tidsintervaller (<strong>Nu</strong>, <strong>10m</strong>, <strong>5h</strong>, <strong>3d+</strong>)
            för att effektivt bygga långtidsminne inför tentamen.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <a
              href="/Genki_I_Tenta_Ordforrad.apkg"
              download="Genki_I_Tenta_Ordforrad.apkg"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-sumi-900 border border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
              title="Ladda ner färdig .apkg-fil för Anki på dator eller mobil"
            >
              <Download size={14} />
              <span>Exportera .apkg</span>
            </a>
          </div>
        </div>

        <div className="hidden lg:block absolute -right-6 -bottom-8 opacity-10 dark:opacity-5 text-rose-900 dark:text-white pointer-events-none">
          <GraduationCap size={240} />
        </div>
      </div>

      {/* 4 Stats KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* 1: Redo nu */}
        <div 
          onClick={() => { setFilterMode('due'); playSfx('click'); }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            filterMode === 'due'
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 ring-2 ring-rose-400/20 shadow-sm'
              : 'bg-white dark:bg-sumi-900 border-paper-300 dark:border-sumi-800 hover:border-rose-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Redo för repetition</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400">
              {deckStats.due}
            </span>
            <span className="text-xs text-slate-400">ord</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Förfallna kort att repetera nu</p>
        </div>

        {/* 2: Idag inom 5h */}
        <div 
          onClick={() => { setFilterMode('today'); playSfx('click'); }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            filterMode === 'today'
              ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
              : 'bg-white dark:bg-sumi-900 border-paper-300 dark:border-sumi-800 hover:border-amber-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Kommande idag</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400">
              {deckStats.upcomingToday}
            </span>
            <span className="text-xs text-slate-400">ord</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Förfaller inom 5 timmar</p>
        </div>

        {/* 3: Inlärda */}
        <div 
          onClick={() => { setFilterMode('mastered'); playSfx('click'); }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            filterMode === 'mastered'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 ring-2 ring-emerald-400/20 shadow-sm'
              : 'bg-white dark:bg-sumi-900 border-paper-300 dark:border-sumi-800 hover:border-emerald-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Inlärda</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {deckStats.mastered}
            </span>
            <span className="text-xs text-slate-400">ord</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Intervall på 3+ dagar</p>
        </div>

        {/* 4: Ostartade */}
        <div 
          onClick={() => { setFilterMode('unstarted'); playSfx('click'); }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            filterMode === 'unstarted'
              ? 'bg-paper-200 dark:bg-sumi-800 border-slate-400 ring-2 ring-slate-400/20 shadow-sm'
              : 'bg-white dark:bg-sumi-900 border-paper-300 dark:border-sumi-800 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Ostartade</span>
            <BookOpen size={16} className="text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-600 dark:text-slate-300">
              {deckStats.unstarted}
            </span>
            <span className="text-xs text-slate-400">ord</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Kvar att introducera</p>
        </div>
      </div>

      {/* Primary Study Launcher Card */}
      <div className="bg-white dark:bg-sumi-900 p-6 rounded-3xl border border-paper-300 dark:border-sumi-800 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold text-ink-900 dark:text-white flex items-center gap-2">
              <Flame size={20} className="text-amber-500 fill-amber-500" />
              Välj omgångsstorlek och starta
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Förfallna repetitionskort prioriteras alltid först i kön, följt av nya oinlärda ord i läroboksordning.
            </p>
          </div>

          {/* Batch Size Selector */}
          <div className="flex items-center gap-1.5 bg-paper-100 dark:bg-sumi-800 p-1.5 rounded-2xl border border-paper-300 dark:border-sumi-700 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => { setBatchSize(10); playSfx('click'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                batchSize === 10
                  ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-ink-900'
              }`}
            >
              10 kort
            </button>
            <button
              type="button"
              onClick={() => { setBatchSize(20); playSfx('click'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                batchSize === 20
                  ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-ink-900'
              }`}
            >
              20 kort
            </button>
            <button
              type="button"
              onClick={() => { setBatchSize('all'); playSfx('click'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                batchSize === 'all'
                  ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-ink-900'
              }`}
            >
              Alla (115)
            </button>
          </div>
        </div>

        {/* Big Start Button */}
        <button
          type="button"
          onClick={() => onStartSession(batchSize)}
          className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 hover:from-amber-400 hover:to-rose-400 text-sumi-950 rounded-2xl font-black text-base sm:text-lg shadow-lg hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play size={20} className="fill-sumi-950" />
          <span>
            {deckStats.due > 0
              ? `Starta Repetition (${deckStats.due} redo nu)`
              : deckStats.unstarted > 0
              ? `Plugga nya ord (${batchSize === 'all' ? deckStats.unstarted : Math.min(batchSize, deckStats.unstarted)} kort)`
              : 'Öva Genki-kort'}
          </span>
        </button>
      </div>

      {/* Searchable 115 Words Registry */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-lg font-extrabold text-ink-900 dark:text-white">
              Alla 115 Tenta-ord ({filteredWords.length} st)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Klicka på ett ord för att starta repetition direkt på den kortpositionen.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => { setFilterMode('all'); playSfx('click'); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950'
                  : 'bg-paper-200 dark:bg-sumi-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Alla
            </button>
            <button
              onClick={() => { setFilterMode('due'); playSfx('click'); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterMode === 'due'
                  ? 'bg-rose-600 text-white'
                  : 'bg-paper-200 dark:bg-sumi-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Redo ({deckStats.due})
            </button>
            <button
              onClick={() => { setFilterMode('today'); playSfx('click'); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterMode === 'today'
                  ? 'bg-amber-600 text-white'
                  : 'bg-paper-200 dark:bg-sumi-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Idag ({deckStats.upcomingToday})
            </button>
            <button
              onClick={() => { setFilterMode('mastered'); playSfx('click'); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterMode === 'mastered'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-paper-200 dark:bg-sumi-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Inlärda ({deckStats.mastered})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Sök bland alla 115 ord på japanska, romaji, svenska eller lektion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-sumi-900 border border-paper-300 dark:border-sumi-800 rounded-2xl text-sm font-medium text-ink-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
          />
        </div>

        {/* Word Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredWords.map(({ index, item, badgeLabel, badgeColor }) => (
            <div
              key={index}
              onClick={() => onStartSession(batchSize, index)}
              className="p-4 bg-white dark:bg-sumi-900 rounded-2xl border border-paper-300 dark:border-sumi-800 hover:border-amber-400 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 bg-paper-200 dark:bg-sumi-800 px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                      {item.category || item.lesson}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {badgeLabel}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h5 className="text-lg font-black text-ink-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {item.japanese}
                    </h5>
                    <button
                      type="button"
                      onClick={(e) => handlePlayAudio(item.japanese, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-sumi-800 transition-all cursor-pointer"
                      title="Lyssna"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 font-mono">
                    {item.romaji}
                  </p>
                </div>

                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 line-clamp-2">
                  {item.swedish}
                </p>

                {item.notes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1 border-t border-paper-200 dark:border-sumi-800/80 pt-1.5">
                    💡 {item.notes}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-paper-200 dark:border-sumi-800/80 flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                <span>Öva detta ord</span>
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>

        {filteredWords.length === 0 && (
          <div className="p-8 bg-white dark:bg-sumi-900 rounded-2xl border border-dashed border-paper-300 dark:border-sumi-800 text-center text-xs text-slate-400 space-y-2">
            <p>Inga ord matchar din sökning eller det valda filtret.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterMode('all'); }}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
            >
              Återställ filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
