import React from 'react';
import { 
  BrainCircuit,
  Mic2, 
  PenTool, 
  Grid3X3, 
  Flame, 
  Zap, 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap,
  FileText,
  FlaskConical,
  Tv,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { KATAKANA_DATA } from '../../data/katakanaData';
import { LEARNING_CHAPTERS } from '../../data/learningPathData';
import { KATAKANA_LEARNING_CHAPTERS } from '../../data/katakanaLearningPathData';
import { useProgression } from '../../context/progressionState';
import { useScriptMode } from '../../context/scriptModeState';
import { useAudio } from '../../modules/audio';
import type { ActiveTab } from '../layout/navigation';
import { getDashboardRecommendation, navigateFromDashboard } from './dashboardLogic';

interface HeroDashboardProps {
  onNavigate?: (tab: ActiveTab) => void;
}

export const HeroDashboard: React.FC<HeroDashboardProps> = ({
  onNavigate
}) => {
  const navigate = useNavigate();
  const handleNavigate = (tab: ActiveTab) => {
    navigateFromDashboard(tab, onNavigate, navigate);
  };

  const { playSfx } = useAudio();
  const { stats, summary, dueCards } = useProgression();
  const { isKatakana, setScriptMode } = useScriptMode();

  const activeChapters = isKatakana ? KATAKANA_LEARNING_CHAPTERS : LEARNING_CHAPTERS;
  const activeDataset = isKatakana ? KATAKANA_DATA : HIRAGANA_DATA;

  const dueKanaIds = dueCards.filter((id) => {
    const isActiveScript = isKatakana ? id.startsWith('kata_') : !id.startsWith('kata_');
    return isActiveScript && stats.kanaProgress[id]?.status !== 'new';
  });
  const totalCount = activeDataset.length;
  
  // Calculate mastered in active script
  const masteredCount = activeDataset.filter(k => stats.kanaProgress[k.id]?.status === 'mastered').length;
  const masteryPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;
  const nextLevelXp = summary.nextLevelXp;

  // Learning path calculations
  const learningProgress = stats.learningProgress || {};
  const standardChapters = activeChapters.filter(c => !c.isCheckpoint);
  const completedChaptersCount = standardChapters.filter(c => learningProgress[c.id]?.completed).length;
  const nextIncompleteChapter = activeChapters.find(c => !learningProgress[c.id]?.completed) || activeChapters[0];
  const scriptName = isKatakana ? 'katakana' : 'hiragana';
  const scriptLabel = isKatakana ? 'Katakana' : 'Hiragana';
  const recommendation = getDashboardRecommendation({
    completedLessons: completedChaptersCount,
    totalLessons: standardChapters.length,
    dueReviews: dueKanaIds.length,
    nextLessonTitle: nextIncompleteChapter.title,
    scriptName
  });
  const RecommendationIcon = recommendation.tab === 'srs'
    ? BrainCircuit
    : recommendation.tab === 'exam'
      ? FileText
      : GraduationCap;

  return (
    <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 animate-fadeIn">
      
      {/* Clean Textbook & Study Header */}
      <section className={`text-white rounded-3xl p-6 sm:p-10 xl:p-12 shadow-xl border relative overflow-hidden transition-all duration-300 ${
        isKatakana
          ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-sumi-950 border-amber-400/30'
          : 'bg-gradient-to-r from-ink-navy via-brand-600 to-slate-900 border-paper-300/30'
      }`}>
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-6 -bottom-6 opacity-10 text-[190px] font-jp font-bold select-none pointer-events-none">
          {isKatakana ? '片' : '学'}
        </div>

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-2xl space-y-5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Lär dig {scriptLabel} steg för steg
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {isKatakana
                ? 'Bygg säker läsning med korta lektioner, smart repetition och praktiska låneord.'
                : 'Bygg säker läsning med korta lektioner, svenska minnesbilder och smart repetition.'}
            </p>

            <div className="inline-flex bg-black/25 backdrop-blur p-1 rounded-xl border border-white/20" aria-label="Välj teckensystem">
              <button
                type="button"
                aria-pressed={!isKatakana}
                onClick={() => setScriptMode('hiragana')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  !isKatakana ? 'bg-white text-ink-navy shadow-sm' : 'text-slate-200 hover:text-white'
                }`}
              >
                あ Hiragana
              </button>
              <button
                type="button"
                aria-pressed={isKatakana}
                onClick={() => setScriptMode('katakana')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  isKatakana ? 'bg-amber-400 text-sumi-950 shadow-sm' : 'text-slate-200 hover:text-white'
                }`}
              >
                ア Katakana
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 sm:p-6 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-200">
              <RecommendationIcon size={16} aria-hidden="true" />
              {recommendation.label}
            </div>
            <h2 className="mt-3 text-xl sm:text-2xl font-extrabold leading-tight text-white">
              {recommendation.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              {recommendation.description}
            </p>
            <button
              type="button"
              onClick={() => { handleNavigate(recommendation.tab); playSfx('click'); }}
              className="mt-5 w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-sumi-950 font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] border border-amber-300 cursor-pointer"
            >
              {recommendation.actionLabel}
              <ArrowRight size={17} aria-hidden="true" />
            </button>
            <p className="mt-4 text-xs text-slate-300">
              {completedChaptersCount}/{standardChapters.length} lektioner klara
              <span aria-hidden="true"> · </span>
              {dueKanaIds.length} kort att repetera
            </p>
          </div>
        </div>
      </section>

      {/* Stats Quick View Grid (Notebook Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-sumi-900 rounded-2xl p-5 border border-paper-300 dark:border-sumi-800 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bemästrade</span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {masteredCount} <span className="text-sm font-normal text-slate-400">/ {totalCount}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-sumi-800 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${masteryPercent}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {masteryPercent}% av alla {isKatakana ? 'Katakana' : 'Hiragana'}
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-sumi-900 rounded-2xl p-5 border border-paper-300 dark:border-sumi-800 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Studie-Streak</span>
            <Flame size={18} className="text-amber-500 fill-amber-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {stats.streakDays} <span className="text-sm font-normal text-slate-400">dagar</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Öva varje dag för bonus
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-sumi-900 rounded-2xl p-5 border border-paper-300 dark:border-sumi-800 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Erfarenhet</span>
            <Zap size={18} className="text-amber-500 fill-amber-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {stats.xp} <span className="text-sm font-semibold text-amber-500">XP</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Nivå {stats.level} ({nextLevelXp} XP nästa)
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-sumi-900 rounded-2xl p-5 border border-paper-300 dark:border-sumi-800 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tåg-Rekord</span>
            <Trophy size={18} className="text-amber-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {(stats.highScores.shinkansenRush || 0).toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Shinkansen Rush 🚄
          </div>
        </div>
      </div>

      {/* Feature Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
        <button
          type="button"
          onClick={() => { handleNavigate('grammar'); playSfx('click'); }}
          className="group cursor-pointer text-left bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 hover:border-brand-500 transition-all duration-200 hover:-translate-y-1 shadow-xs space-y-2 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold mb-2">
              <BookOpen size={20} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
              Grammatik (Tae Kim) 📖
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              22 kapitel med japansk satslogik, verbböjningar, ljudexempel och miniquiz.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-gold flex items-center gap-1 pt-2">
            Öppna guide <ArrowRight size={13} />
          </span>
        </button>

        <button
          type="button"
          onClick={() => { handleNavigate('anki'); playSfx('click'); }}
          className="group cursor-pointer text-left bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 hover:border-amber-500 transition-all duration-200 hover:-translate-y-1 shadow-xs space-y-2 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-2">
              <Tv size={20} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
              Anki Anime 🎌
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              1 800+ immersionskort med autentiskt anime-ljud & Tae Kim grammatik.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-2">
            Öppna Anki <ArrowRight size={13} />
          </span>
        </button>

        <button
          type="button"
          onClick={() => { navigate('/practice?mode=particles'); playSfx('click'); }}
          className="group cursor-pointer text-left bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 hover:border-purple-500 transition-all duration-200 hover:-translate-y-1 shadow-xs space-y-2 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-2">
              <Sparkles size={20} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
              Partikelträning ⭐
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Mästra は, が, を, に, で m.fl. med lucktext, dueller & regelförklaringar.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 pt-2">
            Träna partiklar <ArrowRight size={13} />
          </span>
        </button>

        <button
          type="button"
          onClick={() => { handleNavigate('chart'); playSfx('click'); }}
          className="group cursor-pointer text-left bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 hover:border-brand-500 transition-all duration-200 hover:-translate-y-1 shadow-xs space-y-2 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-brand-600 dark:text-brand-gold flex items-center justify-center font-bold mb-2">
              <Grid3X3 size={20} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
              50-Tabellen
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Utforska alla tecken med ljud, streckordning och svenska minnesbilder.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-gold flex items-center gap-1 pt-2">
            Öppna tabell <ArrowRight size={13} />
          </span>
        </button>

        <button
          type="button"
          onClick={() => { handleNavigate('pronunciation'); playSfx('click'); }}
          className="group cursor-pointer text-left bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 hover:border-sakura-500 transition-all duration-200 hover:-translate-y-1 shadow-xs space-y-2 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-sakura-50 dark:bg-sakura-950/40 text-sakura-600 dark:text-sakura-300 flex items-center justify-center font-bold mb-2">
              <Mic2 size={20} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-sakura-500 transition-colors">
              Uttalslabb & Mic
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Träna japanska fonem och spela in dig själv med omedelbar feedback.
            </p>
          </div>
          <span className="text-xs font-bold text-sakura-600 dark:text-sakura-300 flex items-center gap-1 pt-2">
            Öva uttal <ArrowRight size={13} />
          </span>
        </button>

        <button
          type="button"
          onClick={() => { handleNavigate('practice'); playSfx('click'); }}
          className="group cursor-pointer text-left bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 hover:border-emerald-500 transition-all duration-200 hover:-translate-y-1 shadow-xs space-y-2 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-2">
              <PenTool size={20} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
              Kluriga Hiragana 🔀
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Öva på alla snarlika tecken som förväxlas (れ/わ/ね, め/ぬ, る/ろ, あ/お m.fl.).
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-2">
            Kör förväxlingstest <ArrowRight size={13} />
          </span>
        </button>

        <button
          type="button"
          onClick={() => { handleNavigate('experimental'); playSfx('click'); }}
          className="group cursor-pointer text-left bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 hover:border-amber-500 transition-all duration-200 hover:-translate-y-1 shadow-xs space-y-2 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-2">
              <FlaskConical size={20} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
              🧪 Experimentellt
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Låneordsdetektiven, tvillingträning och AI-streckanalys.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-2">
            Utforska labbet <ArrowRight size={13} />
          </span>
        </button>
      </div>
    </div>
  );
};
