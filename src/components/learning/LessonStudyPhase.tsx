import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Volume2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Lightbulb,
  Play,
  RotateCcw,
  PenTool
} from 'lucide-react';
import type { KanaCharacter } from '../../types/kana';
import type { LearningChapter } from '../../data/learningPathData';
import { useAudio } from '../../modules/audio';

interface LessonStudyPhaseProps {
  chapter: LearningChapter;
  kanaList: KanaCharacter[];
  onStartQuiz: () => void;
  onBack: () => void;
}

export const LessonStudyPhase: React.FC<LessonStudyPhaseProps> = ({
  chapter,
  kanaList,
  onStartQuiz,
  onBack
}) => {
  const { playSfx, speakJapanese } = useAudio();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentKana = kanaList[currentIndex] || kanaList[0];

  // Interactive Mini-canvas for muscle memory drawing
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Clear canvas whenever character changes
  useEffect(() => {
    clearCanvas();
  }, [currentIndex]);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#002B49';
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const handleNext = () => {
    playSfx('click');
    if (currentIndex < kanaList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    playSfx('click');
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePlayAudio = useCallback((text: string) => {
    playSfx('click');
    speakJapanese(text);
  }, [playSfx, speakJapanese]);

  // Keyboard navigation for desktop: Left/Right arrows, Space for audio, Enter for quiz
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < kanaList.length - 1) setCurrentIndex(prev => prev + 1);
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (currentKana) handlePlayAudio(currentKana.kana);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onStartQuiz();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentKana, handlePlayAudio, kanaList.length, onStartQuiz]);

  return (
    <div className="max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-sumi-900 p-4 sm:px-6 rounded-3xl border border-paper-200 dark:border-sumi-800 shadow-sm">
        <button
          onClick={() => {
            playSfx('click');
            onBack();
          }}
          className="inline-flex items-center gap-2 text-base font-bold text-slate-600 dark:text-slate-300 hover:text-ink-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} /> Tillbaka till översikten
        </button>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <kbd className="px-2 py-0.5 rounded-md bg-paper-100 dark:bg-sumi-800 border border-paper-300 dark:border-sumi-700 font-mono text-xs font-bold">← / →</kbd>
            <span>Bläddra</span>
          </div>

          <span className="text-sm font-extrabold px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            Fas 1: Lär känna
          </span>
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Tecken {currentIndex + 1} av {kanaList.length}
          </span>
        </div>
      </div>

      {/* Chapter Intro Banner */}
      <div className="bg-gradient-to-br from-paper-50 to-brand-50/40 dark:from-sumi-900 dark:to-brand-950/20 p-6 sm:p-8 rounded-3xl border border-brand-100 dark:border-sumi-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-ink-900 dark:text-white flex items-center gap-3">
            <span>{chapter.title}</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-1.5">
            {chapter.description}
          </p>
        </div>
        <span className="text-sm font-extrabold px-4 py-2 bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-800 shrink-0 shadow-2xs">
          +{chapter.xpReward} XP vid godkänt
        </span>
      </div>

      {/* Kana Selection Tabs */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-2">
        {kanaList.map((k, idx) => {
          const isSelected = idx === currentIndex;
          return (
            <button
              key={k.id}
              onClick={() => {
                playSfx('click');
                setCurrentIndex(idx);
              }}
              className={`flex flex-col items-center justify-center w-16 h-20 sm:w-20 sm:h-24 rounded-2xl sm:rounded-3xl font-jp transition-all transform duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/25 scale-105 ring-3 ring-brand-400 ring-offset-2 dark:ring-offset-sumi-950'
                  : 'bg-white dark:bg-sumi-900 text-ink-900 dark:text-slate-200 border border-paper-200 dark:border-sumi-800 hover:border-brand-300 hover:scale-102 shadow-xs'
              }`}
            >
              <span className="text-3xl sm:text-4xl font-bold">{k.kana}</span>
              <span className={`text-xs sm:text-sm font-sans mt-0.5 font-bold ${isSelected ? 'text-brand-100 dark:text-brand-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {k.romaji}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Study Workspace (Responsive 3-column on xl desktop) */}
      {currentKana && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl border border-paper-200 dark:border-sumi-800 shadow-md p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
            
            {/* Column 1: Big Glyph & Audio (xl:col-span-4) */}
            <div className="xl:col-span-4 flex flex-col items-center justify-center p-6 bg-paper-50 dark:bg-sumi-950/60 rounded-3xl border border-paper-200 dark:border-sumi-800 relative text-center">
              <div className="text-8xl sm:text-9xl font-jp font-bold text-ink-900 dark:text-slate-100 leading-none py-2 select-none">
                {currentKana.kana}
              </div>

              <div className="flex items-center gap-2.5 mt-3">
                <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  /{currentKana.romaji}/
                </span>
                <span className="text-xs px-2.5 py-1 bg-paper-200 dark:bg-sumi-800 text-slate-700 dark:text-slate-200 rounded-full font-bold">
                  {currentKana.strokeCount} {currentKana.strokeCount === 1 ? 'streck' : 'streck'}
                </span>
              </div>

              <button
                onClick={() => handlePlayAudio(currentKana.kana)}
                className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Volume2 size={18} className="animate-pulse" />
                Lyssna på uttal <span className="hidden sm:inline text-xs opacity-80">(Mellanslag)</span>
              </button>
            </div>

            {/* Column 2: Mnemonic & Phonetics (xl:col-span-4) */}
            <div className="xl:col-span-4 flex flex-col justify-between space-y-4">
              {/* Mnemonic Box (SV + EN) */}
              <div className="p-5 rounded-3xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2.5 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                    <Sparkles size={15} />
                    <span>🇸🇪 Svensk Minnesbild</span>
                  </div>
                  <p className="text-base sm:text-lg font-extrabold text-amber-950 dark:text-amber-100">
                    {currentKana.mnemonic.summary}
                  </p>
                  <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-normal">
                    {currentKana.mnemonic.storySv}
                  </p>
                </div>

                {currentKana.mnemonic.summaryEn && (
                  <div className="pt-3 border-t border-amber-200/60 dark:border-amber-900/40 space-y-1">
                    <div className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-400">
                      🇬🇧 English: <span className="font-semibold text-amber-950 dark:text-amber-200">{currentKana.mnemonic.summaryEn}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-300/80 italic leading-relaxed">
                      {currentKana.mnemonic.storyEn}
                    </p>
                  </div>
                )}
              </div>

              {/* Pronunciation tip */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-sumi-950/60 border border-slate-200 dark:border-sumi-800 space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
                  <Lightbulb size={16} className="text-amber-500" />
                  <span>Svensk uttalshjälp</span>
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium">
                  {currentKana.pronunciationTipSv}
                </p>
                {currentKana.similarSoundPitfall && (
                  <p className="text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-bold">
                    ⚠️ {currentKana.similarSoundPitfall}
                  </p>
                )}
              </div>
            </div>

            {/* Column 3: Mini Draw Pad & Example Words (xl:col-span-4) */}
            <div className="xl:col-span-4 flex flex-col justify-between space-y-5">
              {/* Interactive Mini Writing Canvas */}
              <div className="p-5 rounded-3xl bg-paper-50 dark:bg-sumi-950/60 border border-paper-200 dark:border-sumi-800 space-y-3 flex flex-col items-center">
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <PenTool size={16} className="text-brand-600" />
                    <span>Testa rita tecknet:</span>
                  </span>
                  <button
                    onClick={clearCanvas}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Rensa
                  </button>
                </div>

                <div className="relative w-full aspect-square max-w-[220px] bg-white dark:bg-sumi-900 rounded-3xl border-2 border-dashed border-paper-300 dark:border-sumi-700 overflow-hidden flex items-center justify-center cursor-crosshair shadow-inner">
                  {/* Faint guide underneath */}
                  <span className="absolute font-jp text-8xl font-bold text-slate-200 dark:text-sumi-800 select-none pointer-events-none">
                    {currentKana.kana}
                  </span>
                  <canvas
                    ref={canvasRef}
                    width={220}
                    height={220}
                    onMouseDown={startDraw}
                    onMouseMove={drawMove}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={drawMove}
                    onTouchEnd={endDraw}
                    className="w-full h-full relative z-10 touch-none"
                  />
                </div>
              </div>

              {/* Example Words */}
              {currentKana.exampleWords && currentKana.exampleWords.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <BookOpen size={15} />
                    <span>Exempelord</span>
                  </span>

                  <div className="space-y-2">
                    {currentKana.exampleWords.slice(0, 2).map((word, wIdx) => (
                      <div
                        key={wIdx}
                        className="flex items-center justify-between p-3 rounded-2xl bg-paper-50 dark:bg-sumi-950/60 border border-paper-200 dark:border-sumi-800"
                      >
                        <div>
                          <span className="text-lg font-bold font-jp text-ink-900 dark:text-white">
                            {word.kana}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-500 font-semibold ml-2.5">
                            /{word.romaji}/ • {word.meaningSv}
                          </span>
                        </div>
                        <button
                          onClick={() => handlePlayAudio(word.kana)}
                          className="p-2 rounded-xl bg-white dark:bg-sumi-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 shadow-xs cursor-pointer"
                        >
                          <Volume2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-sumi-900 border border-paper-200 dark:border-sumi-800 text-slate-700 dark:text-slate-300 font-bold text-sm sm:text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper-50 dark:hover:bg-sumi-800 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} /> Föregående <kbd className="hidden sm:inline text-xs opacity-60">(←)</kbd>
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === kanaList.length - 1}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-sumi-900 border border-paper-200 dark:border-sumi-800 text-slate-700 dark:text-slate-300 font-bold text-sm sm:text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper-50 dark:hover:bg-sumi-800 transition-all cursor-pointer"
          >
            Nästa <kbd className="hidden sm:inline text-xs opacity-60">(→)</kbd> <ArrowRight size={18} />
          </button>
        </div>

        <button
          onClick={() => {
            playSfx('click');
            onStartQuiz();
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-ink-navy text-white font-extrabold text-base sm:text-lg shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-102 active:scale-98 transition-all cursor-pointer"
        >
          <Play size={20} className="fill-white" />
          Starta snabbtest ({chapter.kanaIds.length} frågor) <kbd className="hidden sm:inline text-xs opacity-80">(Enter)</kbd>
        </button>
      </div>
    </div>
  );
};
