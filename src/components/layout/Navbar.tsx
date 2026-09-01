import React from 'react';
import { 
  Home, 
  Grid3X3, 
  BrainCircuit, 
  PenTool, 
  Mic2, 
  BookOpen, 
  Flame, 
  Zap, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun,
  GraduationCap,
  Train
} from 'lucide-react';
import { useProgression } from '../../context/ProgressionContext';
import { useMnemonicCoach } from '../../context/MnemonicCoachContext';
import { useAudio } from '../../modules/audio';

export type ActiveTab = 'home' | 'learning' | 'intensive' | 'chart' | 'srs' | 'game' | 'practice' | 'pronunciation' | 'lund';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  soundEnabled?: boolean;
  setSoundEnabled?: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled: propsSoundEnabled,
  setSoundEnabled: propsSetSoundEnabled,
  darkMode,
  setDarkMode
}) => {
  const { isCoachEnabled, toggleCoach } = useMnemonicCoach();
  const { stats, summary, dueCards } = useProgression();
  const { soundEnabled: audioSoundEnabled, setSoundEnabled: audioSetSoundEnabled, playSfx } = useAudio();

  const soundEnabled = propsSoundEnabled !== undefined ? propsSoundEnabled : audioSoundEnabled;
  const setSoundEnabled = propsSetSoundEnabled || audioSetSoundEnabled;

  const dueCardsCount = dueCards.length;
  const currentProgress = summary.levelProgressPercent;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSfx('click');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    playSfx('click');
  };

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Översikt', icon: Home },
    { id: 'learning' as ActiveTab, label: 'Lärstig 🎓', icon: GraduationCap, highlight: true },
    { id: 'intensive' as ActiveTab, label: 'Intensivkurs ⚡', icon: Zap },
    { id: 'chart' as ActiveTab, label: '50-Tabell', icon: Grid3X3 },
    { 
      id: 'srs' as ActiveTab, 
      label: 'SRS Minneskort', 
      icon: BrainCircuit,
      badge: dueCardsCount > 0 ? dueCardsCount : undefined 
    },
    { id: 'game' as ActiveTab, label: 'Shinkansen Rush 🚄', icon: Train },
    { id: 'practice' as ActiveTab, label: 'Övningar & Rita', icon: PenTool },
    { id: 'pronunciation' as ActiveTab, label: 'Uttalslabb', icon: Mic2 },
    { id: 'lund' as ActiveTab, label: 'Studieguide', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-sumi-900/95 backdrop-blur border-b border-paper-300 dark:border-sumi-800 shadow-xs transition-colors">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand (School Study Aesthetic) */}
          <div 
            onClick={() => { setActiveTab('home'); playSfx('click'); }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 flex items-center justify-center font-bold text-xl shadow-sm group-hover:scale-105 transition-transform border border-amber-400/30">
              あ
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-ink-800 dark:text-white tracking-tight">
                  Hiragana<span className="text-amber-600 dark:text-amber-400">Skolan</span>
                </span>
                <span className="text-[10px] uppercase font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  Studiebok
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                Självstudiekurs i japanska
              </p>
            </div>
          </div>

          {/* User Stats & Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Streak */}
            <div 
              title="Dagar i rad du har pluggat"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-paper-100 dark:bg-sumi-800 border border-paper-300 dark:border-sumi-700 text-ink-700 dark:text-slate-200 text-xs font-bold shadow-2xs"
            >
              <Flame size={15} className="text-amber-500 fill-amber-500" />
              <span>{stats.streakDays} <span className="hidden sm:inline font-normal">dagar</span></span>
            </div>

            {/* XP & Level */}
            <div 
              title={`Nivå ${stats.level} (${stats.xp} XP totalt)`}
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs font-bold text-amber-800 dark:text-amber-300 shadow-2xs"
            >
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              <div className="flex flex-col">
                <span className="leading-tight">Nv {stats.level}</span>
                <div className="w-12 h-1 bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden mt-0.5">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${currentProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sensei Mascot Coach Toggle */}
            <button
              onClick={toggleCoach}
              title={isCoachEnabled ? "Kitsune Sensei (Minneshjälp) är påslagen: Klicka för att stänga av" : "Kitsune Sensei är avstängd: Klicka för att slå på minnestips"}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                isCoachEnabled
                  ? 'bg-amber-100/90 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                  : 'bg-paper-100 dark:bg-sumi-800 text-slate-400 border-paper-300 dark:border-sumi-700 opacity-60 hover:opacity-100'
              }`}
            >
              <span className="text-sm">🦊</span>
              <span className="hidden md:inline">{isCoachEnabled ? 'Sensei: På' : 'Sensei: Av'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? "Ljudeffekter aktiverade" : "Ljudeffekter avstängda"}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-paper-200 dark:hover:bg-sumi-800 transition-colors focus:outline-none"
            >
              {soundEnabled ? <Volume2 size={18} className="text-brand-600 dark:text-brand-gold" /> : <VolumeX size={18} className="text-slate-400" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={darkMode ? "Växla till ljust läge" : "Växla till mörkt läge"}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-paper-200 dark:hover:bg-sumi-800 transition-colors focus:outline-none"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2 border-t border-paper-200 dark:border-sumi-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  playSfx('click');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 relative ${
                  isActive
                    ? 'bg-ink-navy text-white shadow-xs dark:bg-brand-bronze dark:text-sumi-950'
                    : item.highlight
                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-300/70 dark:border-amber-800/60'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-sumi-800 hover:text-ink-800 dark:hover:text-white'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-white dark:text-sumi-950' : item.highlight ? 'text-amber-500' : 'text-slate-400 dark:text-slate-400'} />
                <span>{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                  </span>
                )}
                {item.badge !== undefined && (
                  <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-ink-navy dark:bg-sumi-950 dark:text-brand-gold' : 'bg-amber-500 text-sumi-950'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
