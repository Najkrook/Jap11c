import React, { useState, useEffect } from 'react';
import { Navbar, type ActiveTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroDashboard } from './components/home/HeroDashboard';
import { LearningPathView } from './components/learning/LearningPathView';
import { IntensiveCrashCourse } from './components/intensive/IntensiveCrashCourse';
import { HiraganaMatrix } from './components/chart/HiraganaMatrix';
import { SrsFlashcards } from './components/srs/SrsFlashcards';
import { ShinkansenRush } from './components/game/ShinkansenRush';
import { PracticeHub } from './components/practice/PracticeHub';
import { PronunciationLab } from './components/pronunciation/PronunciationLab';
import { LundJapc11View } from './components/lund/LundJapc11View';
import { AudioProvider, useAudio } from './modules/audio';
import { AuthProvider } from './context/AuthContext';
import { ProgressionProvider } from './context/ProgressionContext';
import { MnemonicCoachProvider } from './context/MnemonicCoachContext';
import { MnemonicCoach } from './components/common/MnemonicCoach';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const { soundEnabled, setSoundEnabled } = useAudio();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kanamaster_theme');
        if (saved !== null) {
          return saved === 'dark';
        }
      } catch {
        // Ignore localStorage error
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync Dark Mode class with HTML element & save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('kanamaster_theme', darkMode ? 'dark' : 'light');
    } catch {
      // Ignore localStorage error
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-paper-100 dark:bg-sumi-950 text-ink-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navigation header with live stats, auth & tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Viewport */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HeroDashboard
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'learning' && (
          <LearningPathView
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'intensive' && (
          <IntensiveCrashCourse
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'chart' && (
          <HiraganaMatrix />
        )}

        {activeTab === 'srs' && (
          <SrsFlashcards
            onGoToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'game' && (
          <ShinkansenRush />
        )}

        {activeTab === 'practice' && (
          <PracticeHub />
        )}

        {activeTab === 'pronunciation' && (
          <PronunciationLab />
        )}

        {activeTab === 'lund' && (
          <LundJapc11View />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Sensei Mnemonic Mascot Coach */}
      <MnemonicCoach />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AudioProvider>
      <AuthProvider>
        <ProgressionProvider>
          <MnemonicCoachProvider>
            <AppContent />
          </MnemonicCoachProvider>
        </ProgressionProvider>
      </AuthProvider>
    </AudioProvider>
  );
};

export default App;