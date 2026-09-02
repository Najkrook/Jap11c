import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Train,
  FileText,
  FlaskConical
} from 'lucide-react';
import { useProgression } from '../../context/ProgressionContext';
import { useMnemonicCoach } from '../../context/MnemonicCoachContext';
import { useAudio } from '../../modules/audio';
import { useAuth } from '../../context/AuthContext';
import { useScriptMode } from '../../context/ScriptModeContext';
import { UserProfileModal } from './UserProfileModal';

export type ActiveTab = 'home' | 'learning' | 'exam' | 'chart' | 'srs' | 'game' | 'practice' | 'pronunciation' | 'experimental' | 'lund';

export const TAB_ROUTES: Record<ActiveTab, string> = {
  home: '/',
  learning: '/learn',
  exam: '/exam',
  chart: '/chart',
  srs: '/srs',
  game: '/game',
  practice: '/practice',
  pronunciation: '/pronunciation',
  experimental: '/experimental',
  lund: '/guide'
};

export const getActiveTabFromPath = (pathname: string): ActiveTab => {
  if (pathname.startsWith('/learn')) return 'learning';
  if (pathname.startsWith('/exam')) return 'exam';
  if (pathname.startsWith('/chart')) return 'chart';
  if (pathname.startsWith('/srs')) return 'srs';
  if (pathname.startsWith('/game')) return 'game';
  if (pathname.startsWith('/practice')) return 'practice';
  if (pathname.startsWith('/pronunciation')) return 'pronunciation';
  if (pathname.startsWith('/experimental')) return 'experimental';
  if (pathname.startsWith('/guide')) return 'lund';
  return 'home';
};

interface NavbarProps {
  activeTab?: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  soundEnabled?: boolean;
  setSoundEnabled?: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab: propsActiveTab,
  soundEnabled: propsSoundEnabled,
  setSoundEnabled: propsSetSoundEnabled,
  darkMode,
  setDarkMode
}) => {
  const location = useLocation();
  const currentTab = propsActiveTab || getActiveTabFromPath(location.pathname);

  const { scriptMode, setScriptMode, isKatakana } = useScriptMode();
  const { isCoachEnabled, toggleCoach } = useMnemonicCoach();
  const { stats, summary, dueCards } = useProgression();
  const { soundEnabled: audioSoundEnabled, setSoundEnabled: audioSetSoundEnabled, playSfx } = useAudio();
  const { user, signInWithGoogle } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const soundEnabled = propsSoundEnabled !== undefined ? propsSoundEnabled : audioSoundEnabled;
  const setSoundEnabled = propsSetSoundEnabled || audioSetSoundEnabled;

  const dueCardsCount = dueCards.filter(id => isKatakana ? id.startsWith('kata_') : !id.startsWith('kata_')).length;
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

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      playSfx('click');
      await signInWithGoogle();
    } catch {
      // Handled in AuthContext
    } finally {
      setIsSigningIn(false);
    }
  };

  const navItems = [
    { id: 'home' as ActiveTab, path: '/', label: 'Översikt', icon: Home },
    { id: 'learning' as ActiveTab, path: '/learn', label: isKatakana ? 'Katakana-stig 🎓' : 'Lärstig 🎓', icon: GraduationCap, highlight: true },
    { id: 'exam' as ActiveTab, path: '/exam', label: isKatakana ? 'Katakana-tenta 📝' : 'Hiragana-tenta 📝', icon: FileText },
    { id: 'chart' as ActiveTab, path: '/chart', label: '50-Tabell', icon: Grid3X3 },
    { 
      id: 'srs' as ActiveTab, 
      path: '/srs',
      label: 'SRS Minneskort', 
      icon: BrainCircuit,
      badge: dueCardsCount > 0 ? dueCardsCount : undefined 
    },
    { id: 'game' as ActiveTab, path: '/game', label: 'Shinkansen Rush 🚄', icon: Train },
    { id: 'practice' as ActiveTab, path: '/practice', label: 'Övningar & Rita', icon: PenTool },
    { id: 'pronunciation' as ActiveTab, path: '/pronunciation', label: 'Uttalslabb', icon: Mic2 },
    { id: 'experimental' as ActiveTab, path: '/experimental', label: '🧪 Experimentellt', icon: FlaskConical, highlight: true },
    { id: 'lund' as ActiveTab, path: '/guide', label: 'Studieguide', icon: BookOpen }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-sumi-900/95 backdrop-blur border-b border-paper-300 dark:border-sumi-800 shadow-xs transition-colors">
        {/* Main Bar */}
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand (School Study Aesthetic) */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link 
                to="/"
                onClick={() => playSfx('click')}
                className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm group-hover:scale-105 transition-transform border ${
                  isKatakana 
                    ? 'bg-amber-500 text-sumi-950 border-amber-300' 
                    : 'bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 border-amber-400/30'
                }`}>
                  {isKatakana ? 'ア' : 'あ'}
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base sm:text-lg text-ink-800 dark:text-white tracking-tight">
                      {isKatakana ? 'Katakana' : 'Hiragana'}<span className="text-amber-600 dark:text-amber-400">Skolan</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      {isKatakana ? 'カタカナ' : 'ひらがな'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                    Självstudiekurs i japanska
                  </p>
                </div>
              </Link>

              {/* Seamless Script Switcher (Hiragana vs Katakana) */}
              <div 
                title="Växla sömlöst mellan Hiragana och Katakana"
                className="flex items-center bg-paper-200 dark:bg-sumi-800 p-1 rounded-xl border border-paper-300 dark:border-sumi-700 shadow-inner"
              >
                <button
                  type="button"
                  onClick={() => setScriptMode('hiragana')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    !isKatakana
                      ? 'bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-xs">あ</span>
                  <span className="hidden md:inline">Hiragana</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScriptMode('katakana')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    isKatakana
                      ? 'bg-amber-500 text-sumi-950 shadow-xs font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-xs">ア</span>
                  <span className="hidden md:inline">Katakana</span>
                </button>
              </div>
            </div>

            {/* User Stats & Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
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

              {/* Google Sign In / User Profile */}
              {user ? (
                <button
                  onClick={() => { setIsProfileOpen(true); playSfx('click'); }}
                  title={`Inloggad som ${user.displayName || user.email} (Klicka för molnstatus)`}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-paper-100 dark:bg-sumi-800 border border-paper-300 dark:border-sumi-700 text-xs font-bold hover:bg-paper-200 dark:hover:bg-sumi-700 shadow-2xs transition-colors cursor-pointer"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profil" 
                      className="w-5 h-5 rounded-full object-cover border border-amber-400/40" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 flex items-center justify-center text-[10px]">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden md:inline max-w-[80px] truncate text-ink-800 dark:text-slate-200 font-semibold">
                    {user.displayName?.split(' ')[0] || 'Konto'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  title="Logga in med Google för att spara dina framsteg i molnet"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-sumi-800 border border-paper-300 dark:border-sumi-700 text-ink-800 dark:text-slate-200 text-xs font-bold hover:bg-paper-100 dark:hover:bg-sumi-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="hidden sm:inline">Spara</span>
                </button>
              )}

              {/* Sensei Mascot Coach Toggle */}
              <button
                onClick={toggleCoach}
                title={isCoachEnabled ? "Kitsune Sensei (Minneshjälp) är påslagen: Klicka för att stänga av" : "Kitsune Sensei är avstängd: Klicka för att slå på minnestips"}
                className={`px-2 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs cursor-pointer ${
                  isCoachEnabled
                    ? 'bg-amber-100/90 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                    : 'bg-paper-100 dark:bg-sumi-800 text-slate-400 border-paper-300 dark:border-sumi-700 opacity-60 hover:opacity-100'
                }`}
              >
                <span className="text-sm">🦊</span>
                <span className="hidden lg:inline">{isCoachEnabled ? 'Sensei' : 'Sensei: Av'}</span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                title={soundEnabled ? "Ljudeffekter aktiverade" : "Ljudeffekter avstängda"}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-paper-200 dark:hover:bg-sumi-800 transition-colors focus:outline-none cursor-pointer"
              >
                {soundEnabled ? <Volume2 size={18} className="text-brand-600 dark:text-brand-gold" /> : <VolumeX size={18} className="text-slate-400" />}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                title={darkMode ? "Växla till ljust läge" : "Växla till mörkt läge"}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-paper-200 dark:hover:bg-sumi-800 transition-colors focus:outline-none cursor-pointer"
              >
                {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2 border-t border-paper-200 dark:border-sumi-800/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => {
                    playSfx('click');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 relative cursor-pointer ${
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
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* User Profile / Cloud Sync Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};
