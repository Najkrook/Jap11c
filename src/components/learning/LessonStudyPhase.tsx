import React, { useState } from 'react';
import { 
  Volume2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Play
} from 'lucide-react';
import type { KanaCharacter } from '../../types/kana';
import type { LearningChapter } from '../../data/learningPathData';
import { playJapaneseSpeech, sfx } from '../../utils/audio';

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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentKana = kanaList[currentIndex] || kanaList[0];

  const handleNext = () => {
    sfx.playClick();
    if (currentIndex < kanaList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    sfx.playClick();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePlayAudio = (text: string) => {
    sfx.playClick();
    playJapaneseSpeech(text);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-sumi-900 p-4 rounded-2xl border border-paper-200 dark:border-sumi-800 shadow-sm">
        <button
          onClick={() => {
            sfx.playClick();
            onBack();
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Tillbaka till översikten
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            Fas 1: Lär känna
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Tecken {currentIndex + 1} av {kanaList.length}
          </span>
        </div>
      </div>

      {/* Chapter Intro Banner */}
      <div className="bg-gradient-to-br from-paper-50 to-brand-50/40 dark:from-sumi-900 dark:to-brand-950/20 p-5 rounded-2xl border border-brand-100 dark:border-sumi-800">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink-900 dark:text-white flex items-center gap-2">
              <span>{chapter.title}</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {chapter.description}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-800">
            +{chapter.xpReward} XP vid godkänt
          </span>
        </div>
      </div>

      {/* Kana Selection Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto py-2">
        {kanaList.map((k, idx) => {
          const isSelected = idx === currentIndex;
          return (
            <button
              key={k.id}
              onClick={() => {
                sfx.playClick();
                setCurrentIndex(idx);
              }}
              className={`flex flex-col items-center justify-center w-14 h-16 sm:w-16 sm:h-20 rounded-2xl font-jp transition-all transform duration-150 ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-105 ring-2 ring-brand-400 ring-offset-2 dark:ring-offset-sumi-950'
                  : 'bg-white dark:bg-sumi-900 text-ink-900 dark:text-slate-200 border border-paper-200 dark:border-sumi-800 hover:border-brand-300 hover:scale-102 shadow-sm'
              }`}
            >
              <span className="text-2xl sm:text-3xl font-bold">{k.kana}</span>
              <span className={`text-xs font-sans mt-0.5 ${isSelected ? 'text-brand-100 font-semibold' : 'text-slate-500'}`}>
                {k.romaji}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Study Card */}
      {currentKana && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl border border-paper-200 dark:border-sumi-800 shadow-md p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Big Glyph & Audio */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-paper-50 dark:bg-sumi-950/60 rounded-3xl border border-paper-200 dark:border-sumi-800 relative">
              <div className="text-8xl sm:text-9xl font-jp font-bold text-ink-900 dark:text-slate-100 leading-none py-4 select-none">
                {currentKana.kana}
              </div>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  /{currentKana.romaji}/
                </span>
                <span className="text-xs px-2.5 py-1 bg-paper-200 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 rounded-full font-medium">
                  {currentKana.strokeCount} {currentKana.strokeCount === 1 ? 'streck' : 'streck'}
                </span>
              </div>

              <button
                onClick={() => handlePlayAudio(currentKana.kana)}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Volume2 size={18} className="animate-pulse" />
                Lyssna på uttal
              </button>
            </div>

            {/* Right Mnemonic & Phonetics */}
            <div className="md:col-span-7 space-y-4">
              {/* Mnemonic Box (SV + EN) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs">
                    <Sparkles size={14} />
                    <span>🇸🇪 Svensk Minnesbild</span>
                  </div>
                  <p className="text-base font-semibold text-amber-950 dark:text-amber-100">
                    {currentKana.mnemonic.summary}
                  </p>
                  <p className="text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-normal">
                    {currentKana.mnemonic.storySv}
                  </p>
                </div>

                {currentKana.mnemonic.summaryEn && (
                  <div className="pt-2.5 border-t border-amber-200/60 dark:border-amber-900/40 space-y-0.5">
                    <div className="text-xs font-bold text-amber-800 dark:text-amber-400">
                      🇬🇧 English Mnemonic: <span className="font-semibold text-amber-950 dark:text-amber-200">{currentKana.mnemonic.summaryEn}</span>
                    </div>
                    <p className="text-xs text-amber-900/80 dark:text-amber-300/80 italic leading-relaxed">
                      {currentKana.mnemonic.storyEn}
                    </p>
                  </div>
                )}
              </div>

              {/* Pronunciation tip */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-sumi-950/60 border border-slate-200 dark:border-sumi-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <Lightbulb size={15} className="text-amber-500" />
                  <span>Svensk uttalshjälp</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {currentKana.pronunciationTipSv}
                </p>
                {currentKana.similarSoundPitfall && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    ⚠️ {currentKana.similarSoundPitfall}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Example Words Section */}
          {currentKana.exampleWords && currentKana.exampleWords.length > 0 && (
            <div className="pt-4 border-t border-paper-200 dark:border-sumi-800 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <BookOpen size={16} />
                <span>Exempelord med {currentKana.kana}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentKana.exampleWords.slice(0, 3).map((word, wIdx) => (
                  <div
                    key={wIdx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-paper-50 dark:bg-sumi-950/60 border border-paper-200 dark:border-sumi-800 hover:border-brand-300 transition-colors"
                  >
                    <div>
                      <div className="text-lg font-bold font-jp text-ink-900 dark:text-slate-100">
                        {word.kana}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        /{word.romaji}/ • {word.meaningSv}
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlayAudio(word.kana)}
                      className="p-2 rounded-xl bg-white dark:bg-sumi-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950 shadow-xs transition-colors"
                      title="Lyssna på ordet"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-sumi-900 border border-paper-200 dark:border-sumi-800 text-slate-700 dark:text-slate-300 font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper-50 dark:hover:bg-sumi-800 transition-all"
          >
            <ArrowLeft size={16} /> Föregående tecken
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === kanaList.length - 1}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-sumi-900 border border-paper-200 dark:border-sumi-800 text-slate-700 dark:text-slate-300 font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper-50 dark:hover:bg-sumi-800 transition-all"
          >
            Nästa tecken <ArrowRight size={16} />
          </button>
        </div>

        <button
          onClick={() => {
            sfx.playClick();
            onStartQuiz();
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-ink-navy text-white font-bold text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-102 active:scale-98 transition-all"
        >
          <Play size={18} className="fill-white" />
          Starta snabbtest nu ({chapter.kanaIds.length} frågor)
        </button>
      </div>
    </div>
  );
};
