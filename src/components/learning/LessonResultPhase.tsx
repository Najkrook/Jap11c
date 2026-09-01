import React, { useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Sparkles, 
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import type { KanaCharacter } from '../../types/kana';
import type { LearningChapter } from '../../data/learningPathData';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { playJapaneseSpeech, sfx } from '../../utils/audio';
import { fireSuperCelebration } from '../common/Confetti';

interface LessonResultPhaseProps {
  chapter: LearningChapter;
  scorePercent: number;
  earnedXp: number;
  stars: number;
  isPassed: boolean;
  mistakesKanaIds: string[];
  onRetryQuiz: () => void;
  onReviewStudy: () => void;
  onNextChapter?: () => void;
  onBackToOverview: () => void;
}

export const LessonResultPhase: React.FC<LessonResultPhaseProps> = ({
  chapter,
  scorePercent,
  earnedXp,
  stars,
  isPassed,
  mistakesKanaIds,
  onRetryQuiz,
  onReviewStudy,
  onNextChapter,
  onBackToOverview
}) => {
  useEffect(() => {
    if (isPassed) {
      fireSuperCelebration();
      sfx.playLevelUp();
    } else {
      sfx.playWrong();
    }
  }, [isPassed]);

  const missedKanaObjects = HIRAGANA_DATA.filter(k => mistakesKanaIds.includes(k.id));

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Banner & Header */}
      <div className={`p-8 rounded-3xl text-center space-y-4 border shadow-xl ${
        isPassed 
          ? 'bg-gradient-to-br from-emerald-500 via-teal-600 to-ink-navy text-white border-emerald-400/40 shadow-emerald-500/10'
          : 'bg-gradient-to-br from-rose-500 via-pink-600 to-slate-900 text-white border-rose-400/40 shadow-rose-500/10'
      }`}>
        {/* Status Icon */}
        <div className="inline-flex p-4 rounded-3xl bg-white/15 backdrop-blur-md shadow-inner">
          {isPassed ? (
            <Trophy size={48} className="text-amber-300 animate-bounce" />
          ) : (
            <RotateCcw size={48} className="text-rose-200" />
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isPassed ? 'Strålande jobb!' : 'Nära ögat!'}
          </h1>
          <p className="text-sm text-slate-100 opacity-90">
            {isPassed 
              ? `Du har bemästrat ${chapter.title} med ${scorePercent}% rätt.`
              : `Du fick ${scorePercent}%. Minst 80% krävs för att låsa upp nästa steg.`
            }
          </p>
        </div>

        {/* Star Rating Display */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {[1, 2, 3].map((starIndex) => (
            <Star
              key={starIndex}
              size={36}
              className={`${
                starIndex <= stars
                  ? 'fill-amber-400 text-amber-400 drop-shadow-md scale-110'
                  : 'text-white/30'
              } transition-all duration-300`}
            />
          ))}
        </div>

        {/* Score & XP pills */}
        <div className="inline-flex items-center gap-3 bg-black/20 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 text-sm font-semibold">
          <span>Poäng: {scorePercent}%</span>
          <span>•</span>
          <span className="text-amber-300">+{earnedXp} XP</span>
        </div>
      </div>

      {/* Review Section for Missed Items */}
      {missedKanaObjects.length > 0 && (
        <div className="bg-white dark:bg-sumi-900 p-6 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
            <Sparkles size={16} />
            <span>Repetera tecknen du missade:</span>
          </div>

          <div className="space-y-3">
            {missedKanaObjects.map((k) => (
              <div 
                key={k.id}
                className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-sumi-800 flex items-center justify-center text-2xl font-bold font-jp text-ink-900 dark:text-white shadow-xs">
                    {k.kana}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink-900 dark:text-white">
                      /{k.romaji}/ • 🇸🇪 {k.mnemonic.summary}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      {k.mnemonic.storySv}
                    </div>
                    {k.mnemonic.summaryEn && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">
                        🇬🇧 {k.mnemonic.summaryEn} ({k.mnemonic.storyEn})
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    sfx.playClick();
                    playJapaneseSpeech(k.kana);
                  }}
                  className="self-end sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-sumi-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 shadow-xs"
                >
                  <Volume2 size={14} /> Lyssna
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={() => {
            sfx.playClick();
            onBackToOverview();
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-sumi-900 border border-paper-200 dark:border-sumi-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-paper-50 dark:hover:bg-sumi-800 transition-all"
        >
          <ArrowLeft size={16} /> Tillbaka till kartan
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              sfx.playClick();
              onRetryQuiz();
            }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-paper-100 dark:bg-sumi-800 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-paper-200 dark:hover:bg-sumi-700 transition-all"
          >
            <RotateCcw size={16} /> Gör om testet
          </button>

          {isPassed && onNextChapter && (
            <button
              onClick={() => {
                sfx.playClick();
                onNextChapter();
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 hover:scale-102 transition-all"
            >
              Nästa kapitel <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
