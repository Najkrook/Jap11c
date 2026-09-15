import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AudioProvider, useAudio } from './modules/audio';
import { AuthProvider } from './context/AuthContext';
import { ProgressionProvider } from './context/ProgressionContext';
import { MnemonicCoachProvider } from './context/MnemonicCoachContext';
import { ScriptModeProvider } from './context/ScriptModeContext';
import { MnemonicCoach } from './components/common/MnemonicCoach';
import { LoadingFallback } from './components/common/LoadingFallback';
import { ScrollToTop } from './components/common/ScrollToTop';

// Code-split page components for optimal initial loading performance
const HeroDashboard = lazy(() =>
  import('./components/home/HeroDashboard').then(m => ({ default: m.HeroDashboard }))
);
const LearningPathView = lazy(() =>
  import('./components/learning/LearningPathView').then(m => ({ default: m.LearningPathView }))
);
const HiraganaExam = lazy(() =>
  import('./components/exam/HiraganaExam').then(m => ({ default: m.HiraganaExam }))
);
const HiraganaMatrix = lazy(() =>
  import('./components/chart/HiraganaMatrix').then(m => ({ default: m.HiraganaMatrix }))
);
const SrsFlashcards = lazy(() =>
  import('./components/srs/SrsFlashcards').then(m => ({ default: m.SrsFlashcards }))
);
const ShinkansenRush = lazy(() =>
  import('./components/game/ShinkansenRush').then(m => ({ default: m.ShinkansenRush }))
);
const PracticeHub = lazy(() =>
  import('./components/practice/PracticeHub').then(m => ({ default: m.PracticeHub }))
);
const PronunciationLab = lazy(() =>
  import('./components/pronunciation/PronunciationLab').then(m => ({ default: m.PronunciationLab }))
);
const ExperimentalHub = lazy(() =>
  import('./components/experimental/ExperimentalHub').then(m => ({ default: m.ExperimentalHub }))
);
const StudyGuideView = lazy(() =>
  import('./components/guide/StudyGuideView').then(m => ({ default: m.StudyGuideView }))
);
const AnkiHub = lazy(() =>
  import('./components/anki/AnkiHub').then(m => ({ default: m.AnkiHub }))
);
const TaeKimGuideView = lazy(() =>
  import('./components/grammar/TaeKimGuideView').then(m => ({ default: m.TaeKimGuideView }))
);

export const AppContent: React.FC = () => {
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
      <ScrollToTop />

      {/* Navigation header with live stats, auth, script switch & tabs */}
      <Navbar
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Viewport with Routes & Suspense */}
      <main className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HeroDashboard />} />
            <Route path="/learn" element={<LearningPathView />} />
            <Route path="/exam" element={<HiraganaExam />} />
            <Route path="/chart" element={<HiraganaMatrix />} />
            <Route path="/flashcards" element={<AnkiHub />} />
            <Route path="/srs" element={<Navigate to="/flashcards?category=kana" replace />} />
            <Route path="/anki" element={<Navigate to="/flashcards" replace />} />
            <Route path="/game" element={<ShinkansenRush />} />
            <Route path="/practice" element={<PracticeHub />} />
            {/* OBS: Följande sidor är dolda från navigationen och ska förbli osynliga enligt önskemål */}
            <Route path="/pronunciation" element={<PronunciationLab />} />
            <Route path="/experimental" element={<ExperimentalHub />} />
            <Route path="/guide" element={<StudyGuideView />} />
            <Route path="/grammar" element={<TaeKimGuideView />} />
            {/* Catch-all 404 redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
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
    <BrowserRouter>
      <AudioProvider>
        <AuthProvider>
          <ProgressionProvider>
            <ScriptModeProvider>
              <MnemonicCoachProvider>
                <AppContent />
              </MnemonicCoachProvider>
            </ScriptModeProvider>
          </ProgressionProvider>
        </AuthProvider>
      </AudioProvider>
    </BrowserRouter>
  );
};

export default App;

