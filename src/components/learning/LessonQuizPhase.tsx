import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Volume2, 
  Sparkles, 
  HelpCircle,
  X
} from 'lucide-react';
import type { KanaCharacter } from '../../types/kana';
import type { LearningChapter } from '../../data/learningPathData';
import { useAudio } from '../../modules/audio';
import { useMnemonicCoach } from '../../context/mnemonicCoachState';
import { generateQuizSession, type QuizQuestion, type QuestionType } from '../../modules/quiz';

export type { QuestionType, QuizQuestion };

interface LessonQuizPhaseProps {
  chapter: LearningChapter;
  kanaList: KanaCharacter[];
  onFinishQuiz: (scorePercent: number, mistakesKanaIds: string[]) => void;
  onCancel: () => void;
}

export const LessonQuizPhase: React.FC<LessonQuizPhaseProps> = ({
  chapter,
  kanaList,
  onFinishQuiz,
  onCancel
}) => {
  const { playSfx, speakJapanese } = useAudio();
  const [questions] = useState<QuizQuestion[]>(() => generateQuizSession({ chapter, kanaList }));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [mistakesKanaIds, setMistakesKanaIds] = useState<string[]>([]);
  const timerRef = useRef<number | null>(null);

  // Clear any pending advancement timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Autoplay audio on question change if audio-to-kana
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      const q = questions[currentIndex];
      if (q.type === 'audio-to-kana' && q.audioItem) {
        const timeout = setTimeout(() => {
          speakJapanese(q.audioItem!);
        }, 200);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentIndex, questions, speakJapanese]);

  const currentQ = questions[currentIndex];
  const { showCoach, isCoachEnabled } = useMnemonicCoach();

  const advanceNext = useCallback((finalCorrect: number) => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      const scorePercent = Math.round((finalCorrect / questions.length) * 100);
      onFinishQuiz(scorePercent, mistakesKanaIds);
    }
  }, [currentIndex, mistakesKanaIds, onFinishQuiz, questions.length]);

  const handlePlayPromptAudio = useCallback(() => {
    if (currentQ?.audioItem) {
      playSfx('click');
      speakJapanese(currentQ.audioItem);
    }
  }, [currentQ, playSfx, speakJapanese]);

  const handleSelectOption = useCallback((option: QuizQuestion['options'][0]) => {
    if (isAnswered) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    if (option.isCorrect) {
      playSfx('correct');
      setCorrectCount(prev => prev + 1);

      // Auto advance on correct answer
      timerRef.current = window.setTimeout(() => {
        advanceNext(correctCount + 1);
      }, 1000);
    } else {
      playSfx('wrong');
      if (currentQ.targetKanaId && !mistakesKanaIds.includes(currentQ.targetKanaId)) {
        setMistakesKanaIds(prev => [...prev, currentQ.targetKanaId]);
      }

      // Show Mascot coach if enabled, otherwise fallback to short delay
      if (isCoachEnabled && currentQ.targetKanaId) {
        const shown = showCoach(currentQ.targetKanaId, () => {
          advanceNext(correctCount);
        });
        if (!shown) {
          timerRef.current = window.setTimeout(() => {
            advanceNext(correctCount);
          }, 1200);
        }
      } else {
        timerRef.current = window.setTimeout(() => {
          advanceNext(correctCount);
        }, 1200);
      }
    }
  }, [advanceNext, correctCount, currentQ, isAnswered, isCoachEnabled, mistakesKanaIds, playSfx, showCoach]);

  // Keyboard shortcut listener for desktop users (1-4, Space for audio, Esc to cancel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handlePlayPromptAudio();
        return;
      }

      if (!isAnswered && currentQ && currentQ.options.length >= 2) {
        const key = e.key.toLowerCase();
        let index = -1;
        if (key === '1' || e.code === 'Numpad1' || key === 'a') index = 0;
        else if (key === '2' || e.code === 'Numpad2' || key === 'b') index = 1;
        else if (key === '3' || e.code === 'Numpad3' || key === 'c') index = 2;
        else if (key === '4' || e.code === 'Numpad4' || key === 'd') index = 3;

        if (index >= 0 && index < currentQ.options.length) {
          e.preventDefault();
          handleSelectOption(currentQ.options[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQ, handlePlayPromptAudio, handleSelectOption, isAnswered, onCancel]);

  if (!currentQ) {
    return (
      <div className="flex items-center justify-center p-16 text-slate-500 text-lg">
        Laddar frågor...
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex) / questions.length) * 100);

  return (
    <div className="max-w-3xl xl:max-w-6xl 2xl:max-w-7xl mx-auto space-y-5 animate-fadeIn pb-8">
      {/* Top Bar with Progress & Cancel */}
      <div className="flex items-center justify-between bg-white dark:bg-sumi-900 px-5 py-3 rounded-2xl border border-paper-200 dark:border-sumi-800 shadow-xs">
        <button
          onClick={onCancel}
          className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <X size={16} />
          <span>Avbryt test</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono bg-paper-100 dark:bg-sumi-800 text-slate-400 rounded border border-paper-300 dark:border-sumi-700">Esc</kbd>
        </button>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
            <Sparkles size={14} className="text-amber-500" />
            <span>Rätt: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{correctCount}</strong> / {questions.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800">
              Fråga {currentIndex + 1} av {questions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-paper-200 dark:bg-sumi-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-brand-500 via-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Desktop Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Main Question Card (Left / Center) */}
        <div className="xl:col-span-8 bg-white dark:bg-sumi-900 rounded-3xl border border-paper-200 dark:border-sumi-800 shadow-md p-6 sm:p-8 xl:p-9 space-y-6 text-center">
          
          {/* Question Prompt Title */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs sm:text-sm font-bold">
              <HelpCircle size={15} /> Snabbtest: {chapter.rowName}
            </div>
            <h2 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
              {currentQ.prompt}
            </h2>
          </div>

          {/* Display Item / Glyph */}
          <div className="flex flex-col items-center justify-center py-4 sm:py-5">
            {currentQ.type === 'audio-to-kana' ? (
              <button
                onClick={handlePlayPromptAudio}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-brand-50 dark:bg-sumi-800 border-2 border-dashed border-brand-300 dark:border-sumi-600 flex flex-col items-center justify-center text-brand-700 dark:text-amber-300 hover:scale-105 active:scale-95 transition-all shadow-sm group cursor-pointer"
              >
                <Volume2 size={40} className="animate-bounce text-brand-600 dark:text-amber-400" />
                <span className="text-xs sm:text-sm font-bold mt-1.5 group-hover:underline">Lyssna igen</span>
                <kbd className="hidden sm:inline-block mt-1 px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-sumi-900 text-slate-500 dark:text-slate-400 rounded border border-brand-200 dark:border-sumi-700">Mellanslag</kbd>
              </button>
            ) : (
              <div className="relative">
                <div className="text-7xl sm:text-8xl xl:text-9xl font-bold font-jp text-ink-900 dark:text-slate-100 tracking-tight leading-none drop-shadow-sm select-none">
                  {currentQ.displayItem}
                </div>
                {currentQ.audioItem && (
                  <button
                    onClick={handlePlayPromptAudio}
                    className="mt-3.5 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-700 dark:text-amber-300 hover:text-brand-900 dark:hover:text-amber-200 cursor-pointer bg-brand-50 hover:bg-brand-100 dark:bg-sumi-800 dark:hover:bg-sumi-700 px-4 py-1.5 rounded-full border border-brand-200 dark:border-sumi-600 shadow-xs hover:scale-105 active:scale-95 transition-all"
                  >
                    <Volume2 size={16} className="text-brand-600 dark:text-amber-400" />
                    <span>Hör uttal</span>
                    <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 font-mono font-normal">(Mellanslag)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Option Buttons (2x2 Grid with Keyboard Shortcut badges) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
            {currentQ.options.map((option, optIdx) => {
              let btnStyle = 'bg-paper-50 dark:bg-sumi-800 text-ink-900 dark:text-slate-100 border-paper-200 dark:border-sumi-700 hover:border-amber-400 dark:hover:border-amber-400 hover:bg-amber-50/40 dark:hover:bg-sumi-700 hover:scale-[1.01] shadow-xs';

              if (isAnswered) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/25 scale-[1.01]';
                } else if (selectedOptionId === option.id) {
                  btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-500/25 animate-shake';
                } else {
                  btnStyle = 'opacity-35 bg-paper-100 dark:bg-sumi-800 text-slate-400 border-transparent';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={`p-4 sm:p-5 xl:p-5 rounded-2xl border-2 font-bold text-xl sm:text-2xl xl:text-3xl transition-all duration-150 flex flex-col items-center justify-center min-h-[72px] sm:min-h-[80px] xl:min-h-[84px] relative cursor-pointer group ${btnStyle}`}
                >
                  {/* Keyboard Badge [1], [2], [3], [4] */}
                  <span className={`hidden sm:inline-flex absolute top-3 left-3 text-xs font-mono font-bold px-2 py-0.5 rounded-lg border transition-colors ${
                    isAnswered 
                      ? 'bg-black/20 text-white/90 border-white/20' 
                      : 'bg-white dark:bg-sumi-900 text-slate-600 dark:text-slate-300 border-paper-300 dark:border-sumi-700 group-hover:border-amber-400'
                  }`}>
                    {optIdx + 1}
                  </span>

                  <span className="font-jp">{option.label}</span>
                  {option.subLabel && (
                    <span className="text-xs sm:text-sm font-sans font-normal opacity-85 mt-0.5">
                      {option.subLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Desktop Companion Panel (Only visible on wide desktop xl and up) */}
        <div className="hidden xl:flex xl:col-span-4 flex-col gap-4">
          
          {/* 1. Chapter Test Status / Goals */}
          <div className="bg-white dark:bg-sumi-900 rounded-3xl p-5 border border-paper-200 dark:border-sumi-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Snabbtest
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {chapter.rowName}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-ink-900 dark:text-white">
                {chapter.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Testa dina kunskaper på tecknen i detta kapitel utan ledtrådar.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-xl bg-paper-50 dark:bg-sumi-800/70 border border-paper-200 dark:border-sumi-700">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Krav för godkänt</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">80% rätt</div>
              </div>
              <div className="p-2.5 rounded-xl bg-paper-50 dark:bg-sumi-800/70 border border-paper-200 dark:border-sumi-700">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Belöning</div>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400">+{chapter.xpReward} XP</div>
              </div>
            </div>
          </div>

          {/* 2. Live Question Roadmap / Dots */}
          <div className="bg-white dark:bg-sumi-900 rounded-3xl p-5 border border-paper-200 dark:border-sumi-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Frågeöversikt
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {questions.map((q, qIdx) => {
                const isDone = qIdx < currentIndex;
                const isCurrent = qIdx === currentIndex;

                let dotStyle = 'bg-paper-100 dark:bg-sumi-800 text-slate-500 dark:text-slate-400 border border-paper-200 dark:border-sumi-700';

                if (isCurrent) {
                  dotStyle = 'bg-brand-600 dark:bg-amber-500 text-white dark:text-sumi-950 shadow-md shadow-brand-500/30 dark:shadow-amber-500/20 scale-105 ring-2 ring-brand-400 dark:ring-amber-400 ring-offset-2 dark:ring-offset-sumi-900 font-black';
                } else if (isDone) {
                  dotStyle = 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold';
                }

                return (
                  <div
                    key={q.id}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold font-mono transition-all ${dotStyle}`}
                  >
                    {qIdx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Live Stats & Accuracy */}
          <div className="bg-white dark:bg-sumi-900 rounded-3xl p-5 border border-paper-200 dark:border-sumi-800 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Teststatistik
            </span>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Rätt svar:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {correctCount} / {currentIndex + (isAnswered && currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect ? 1 : 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Återstående frågor:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {Math.max(0, questions.length - currentIndex - 1)}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Desktop Keyboard Shortcuts reference */}
          <div className="bg-paper-100/90 dark:bg-sumi-800/70 rounded-3xl p-4 border border-paper-200 dark:border-sumi-700/60 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              ⌨️ Snabbtangenter på skrivbordet
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-sumi-900 border border-paper-300 dark:border-sumi-700 font-mono font-bold text-slate-800 dark:text-slate-200 shadow-2xs">1-4</kbd>
                <span>Välj svar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-sumi-900 border border-paper-300 dark:border-sumi-700 font-mono font-bold text-slate-800 dark:text-slate-200 shadow-2xs">Space</kbd>
                <span>Lyssna</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-sumi-900 border border-paper-300 dark:border-sumi-700 font-mono font-bold text-slate-800 dark:text-slate-200 shadow-2xs">Esc</kbd>
                <span>Avbryt</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
