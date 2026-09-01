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
import type { UserStats } from './types/kana';
import { loadUserStats, saveUserStats, getDueItems } from './utils/srs';
import { sfx } from './utils/audio';
import { MnemonicCoachProvider } from './context/MnemonicCoachContext';
import { MnemonicCoach } from './components/common/MnemonicCoach';

export const AppContent: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats>(() => loadUserStats());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync Dark Mode class with HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync SFX state
  useEffect(() => {
    sfx.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  const handleUpdateStats = (newStats: UserStats) => {
    setUserStats(newStats);
    saveUserStats(newStats);
  };

  const dueCount = getDueItems(userStats.kanaProgress).length;

  return (
    <div className="min-h-screen flex flex-col bg-paper-100 dark:bg-sumi-950 text-ink-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navigation header with live stats & tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userStats={userStats}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        dueCardsCount={dueCount}
      />

      {/* Main Viewport */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HeroDashboard
            userStats={userStats}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'learning' && (
          <LearningPathView
            userStats={userStats}
            onUpdateStats={handleUpdateStats}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'intensive' && (
          <IntensiveCrashCourse
            userStats={userStats}
            onUpdateStats={handleUpdateStats}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'chart' && (
          <HiraganaMatrix
            kanaProgress={userStats.kanaProgress}
          />
        )}

        {activeTab === 'srs' && (
          <SrsFlashcards
            userStats={userStats}
            onUpdateStats={handleUpdateStats}
            onGoToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'game' && (
          <ShinkansenRush
            userStats={userStats}
            onUpdateStats={handleUpdateStats}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeHub
            userStats={userStats}
            onUpdateStats={handleUpdateStats}
          />
        )}

        {activeTab === 'pronunciation' && (
          <PronunciationLab
            userStats={userStats}
            onUpdateStats={handleUpdateStats}
          />
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
    <MnemonicCoachProvider>
      <AppContent />
    </MnemonicCoachProvider>
  );
};

export default App;

