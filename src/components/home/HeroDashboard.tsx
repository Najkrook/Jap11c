import React from 'react';
import { 
  BrainCircuit, 
  Gamepad2, 
  Mic2, 
  PenTool, 
  Grid3X3, 
  Sparkles, 
  Flame, 
  Zap, 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen,
  Award,
  Play,
  Lightbulb,
  GraduationCap,
  Calendar,
  Star,
  FileText,
  FlaskConical,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { KATAKANA_DATA } from '../../data/katakanaData';
import { INITIAL_BADGES } from '../../data/badgesData';
import { LEARNING_CHAPTERS } from '../../data/learningPathData';
import { KATAKANA_LEARNING_CHAPTERS } from '../../data/katakanaLearningPathData';
import { useProgression } from '../../context/ProgressionContext';
import { useScriptMode } from '../../context/ScriptModeContext';
import { useAudio } from '../../modules/audio';
import { type ActiveTab, TAB_ROUTES } from '../layout/Navbar';

interface HeroDashboardProps {
  onNavigate?: (tab: ActiveTab) => void;
}

export const HeroDashboard: React.FC<HeroDashboardProps> = ({
  onNavigate
}) => {
  const navigate = useNavigate();
  const handleNavigate = (tab: ActiveTab) => {
    if (onNavigate) {
      handleNavigate(tab);
    } else {
      navigate(TAB_ROUTES[tab]);
    }
  };

  const { playSfx } = useAudio();
  const { stats, summary, dueCards } = useProgression();
  const { scriptMode, isKatakana, setScriptMode } = useScriptMode();

  const activeChapters = isKatakana ? KATAKANA_LEARNING_CHAPTERS : LEARNING_CHAPTERS;
  const activeDataset = isKatakana ? KATAKANA_DATA : HIRAGANA_DATA;

  const dueKanaIds = dueCards.filter(id => isKatakana ? id.startsWith('kata_') : !id.startsWith('kata_'));
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
  const totalStars = summary.totalStars;

  return (
    <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 animate-fadeIn">
      
      {/* Clean Textbook & Study Header */}
      <div className={`text-white rounded-3xl p-6 sm:p-10 xl:p-12 shadow-xl border relative overflow-hidden transition-all duration-300 ${
        isKatakana
          ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-sumi-950 border-amber-400/30'
          : 'bg-gradient-to-r from-ink-navy via-brand-600 to-slate-900 border-paper-300/30'
      }`}>
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-6 -bottom-6 opacity-10 text-[190px] font-jp font-bold select-none pointer-events-none">
          {isKatakana ? '片' : '学'}
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-amber-200 text-xs font-bold uppercase tracking-wider border border-white/20">
            <GraduationCap size={15} /> Självstudiekurs • {isKatakana ? 'Katakana' : 'Hiragana'}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Lär dig all {isKatakana ? 'Katakana' : 'Hiragana'} enkelt & roligt
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            {isKatakana
              ? 'Mästra alla vassa Katakana-tecken, autentiska låneord (Gairaigo) och undvik tvillingfällorna (シ/ツ & ソ/ン).'
              : 'Inga förkunskaper krävs. Använd vår pedagogiska steg-för-steg-lärstig, svenska minnesbilder och smarta minneskort för att bemästra alla japanska tecken.'}
          </p>

          {/* Quick Script Mode Switcher on Hero */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-300 font-semibold">Växla studieläge:</span>
            <div className="inline-flex bg-black/25 backdrop-blur p-1 rounded-xl border border-white/20">
              <button
                onClick={() => setScriptMode('hiragana')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  !isKatakana ? 'bg-white text-ink-navy shadow-sm' : 'text-slate-200 hover:text-white'
                }`}
              >
                あ Hiragana-läge
              </button>
              <button
                onClick={() => setScriptMode('katakana')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  isKatakana ? 'bg-amber-400 text-sumi-950 font-black shadow-sm' : 'text-slate-200 hover:text-white'
                }`}
              >
                ア Katakana-läge
              </button>
            </div>
          </div>

          {/* Direct CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => { handleNavigate('learning'); playSfx('click'); }}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-sumi-950 font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-transform hover:scale-102 active:scale-98 border border-amber-300 cursor-pointer"
            >
              <GraduationCap size={18} className="fill-current text-sumi-950" />
              Starta {isKatakana ? 'Katakana' : 'Hiragana'}-lärstigen 🎓
            </button>

            <button
              onClick={() => { handleNavigate('exam'); playSfx('click'); }}
              className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm border border-emerald-400/50 shadow-md flex items-center gap-2 transition-transform hover:scale-102 active:scale-98 cursor-pointer"
            >
              <FileText size={17} />
              Gör {isKatakana ? 'Katakana' : 'Hiragana'}-tentan 📝
            </button>

            <button
              onClick={() => { handleNavigate('experimental'); playSfx('click'); }}
              className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FlaskConical size={17} />
              🧪 Experimentellt
            </button>
          </div>
        </div>
      </div>

      {/* FEATURED: LEARNING PATH PROGRESS CALLOUT */}
      <div 
        onClick={() => { handleNavigate('learning'); playSfx('click'); }}
        className="group cursor-pointer bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-7 border-2 border-brand-300 dark:border-brand-800 shadow-sm hover:border-brand-500 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 text-2xl font-bold shadow-inner">
            <GraduationCap size={30} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-brand-600 dark:text-brand-400 tracking-wider">
                Pedagogisk Lärstig • {isKatakana ? 'Katakana' : 'Hiragana'}
              </span>
              <span className="bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                5 i taget + Delprov
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {completedChaptersCount === 0 
                ? `Börja med Kapitel 1: Vokalerna (${isKatakana ? 'ア, イ, ウ, エ, オ' : 'A, I, U, E, O'})` 
                : `Fortsätt: ${nextIncompleteChapter.title}`}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              {completedChaptersCount} av {standardChapters.length} lektioner avklarade. {totalStars} stjärnor insamlade. Gå igenom 5 tecken, gör snabbtestet och lås upp nästa rad!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center shrink-0">
          <div className="hidden sm:flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs font-bold text-amber-800 dark:text-amber-300">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span>{totalStars} stjärnor</span>
          </div>

          <button
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform flex items-center gap-2"
          >
            Fortsätt Lärstigen <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* FEATURED: EXPERIMENTAL HIGHLIGHT BANNER */}
      <div 
        onClick={() => { handleNavigate('experimental'); playSfx('click'); }}
        className="group cursor-pointer bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-emerald-500/10 rounded-3xl p-6 sm:p-7 border-2 border-amber-300 dark:border-amber-800/80 shadow-sm hover:border-amber-500 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 text-2xl font-bold shadow-inner">
            🧪
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-amber-600 dark:text-amber-400 tracking-wider">
                Nyhet • Experimentellt Labb
              </span>
              <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                3 Interaktiva Verktyg
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Gairaigo Mystery Decoder, Tvillingtränaren & Stroke AI
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Knäck japanska låneord, lös den beryktade gåtan med シ vs ツ & ソ vs ン och få realtidsbetyg på din handskrift!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center shrink-0">
          <button
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-sumi-950 text-xs sm:text-sm font-extrabold shadow-md group-hover:scale-105 transition-transform flex items-center gap-2"
          >
            Öppna Experimentellt Labb <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 3-STEP ONBOARDING: Kom igång på 3 steg */}
      <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-paper-300 dark:border-sumi-800 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="text-amber-500" size={24} />
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Kom igång på 3 enkla steg 🚀
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Det mest pedagogiska sättet att lära sig {isKatakana ? 'Katakana' : 'Hiragana'} som nybörjare.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div 
            onClick={() => { handleNavigate('learning'); playSfx('click'); }}
            className="group cursor-pointer bg-paper-50 dark:bg-sumi-950 p-5 rounded-2xl border-2 border-paper-300 dark:border-sumi-800 hover:border-brand-500 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                Följ Lärstigen 🎓
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Gå igenom 5 tecken i taget med svenska minnesbilder, följt av snabbtest och delprov.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
              Starta Lektioner <ArrowRight size={14} />
            </span>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => { handleNavigate('game'); playSfx('click'); }}
            className="group cursor-pointer bg-paper-50 dark:bg-sumi-950 p-5 rounded-2xl border-2 border-paper-300 dark:border-sumi-800 hover:border-amber-500 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Kör Shinkansen Rush 🚄
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Sortera passagerare till rätt Shinkansen-tåg innan dörrarna stängs för att automatisera läsningen och träna reflexer.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
              Starta Shinkansen Rush <ArrowRight size={14} />
            </span>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => { handleNavigate('srs'); playSfx('click'); }}
            className="group cursor-pointer bg-paper-50 dark:bg-sumi-950 p-5 rounded-2xl border-2 border-paper-300 dark:border-sumi-800 hover:border-emerald-500 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                Repetera med SRS
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Kör 5 minuter minneskort per dag. Spaced Repetition ser till att du aldrig glömmer vad du lärt dig.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              Kör Minneskort ({dueKanaIds.length > 0 ? dueKanaIds.length : '15'}) <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => { handleNavigate('chart'); playSfx('click'); }}
          className="group cursor-pointer bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 hover:border-brand-500 transition-all duration-200 hover:-translate-y-1 shadow-xs space-y-2 flex flex-col justify-between"
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
        </div>

        <div 
          onClick={() => { handleNavigate('pronunciation'); playSfx('click'); }}
          className="group cursor-pointer bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 hover:border-sakura-500 transition-all duration-200 hover:-translate-y-1 shadow-xs space-y-2 flex flex-col justify-between"
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
        </div>

        <div 
          onClick={() => { handleNavigate('practice'); playSfx('click'); }}
          className="group cursor-pointer bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 hover:border-emerald-500 transition-all duration-200 hover:-translate-y-1 shadow-xs space-y-2 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-2">
              <PenTool size={20} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
              Övningar & Rita
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Snabbskrivning, handskrift på canvasbräda och flervalsfrågor.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-2">
            Öppna övningar <ArrowRight size={13} />
          </span>
        </div>

        <div 
          onClick={() => { handleNavigate('experimental'); playSfx('click'); }}
          className="group cursor-pointer bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 hover:border-amber-500 transition-all duration-200 hover:-translate-y-1 shadow-xs space-y-2 flex flex-col justify-between"
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
        </div>
      </div>
    </div>
  );
};
