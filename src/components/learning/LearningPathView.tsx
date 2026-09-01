import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Play, 
  Star, 
  Trophy, 
  Award, 
  BookOpen, 
  ChevronRight, 
  RotateCcw,
  Zap,
  Volume2
} from 'lucide-react';
import { LEARNING_CHAPTERS, type LearningChapter } from '../../data/learningPathData';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { LessonStudyPhase } from './LessonStudyPhase';
import { LessonQuizPhase } from './LessonQuizPhase';
import { LessonResultPhase } from './LessonResultPhase';
import { MilestoneCheckpointModal } from './MilestoneCheckpointModal';
import { useProgression } from '../../context/ProgressionContext';
import { sfx } from '../../utils/audio';
import type { ActiveTab } from '../layout/Navbar';

interface LearningPathViewProps {
  onNavigate?: (tab: ActiveTab) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  onNavigate
}) => {
  const { stats, recordActivity, summary } = useProgression();
  // Navigation inside the learning path
  const [activeChapter, setActiveChapter] = useState<LearningChapter | null>(null);
  const [lessonPhase, setLessonPhase] = useState<'study' | 'quiz' | 'result'>('study');
  const [activeCheckpoint, setActiveCheckpoint] = useState<LearningChapter | null>(null);
  const [lessonResult, setLessonResult] = useState<{
    scorePercent: number;
    earnedXp: number;
    stars: number;
    isPassed: boolean;
    mistakesKanaIds: string[];
  } | null>(null);

  const learningProgress = stats.learningProgress || {};

  // Check if a chapter is unlocked
  const isChapterUnlocked = (ch: LearningChapter): boolean => {
    if (!ch.requiredPriorChapterId) return true;
    const prior = learningProgress[ch.requiredPriorChapterId];
    return !!(prior && prior.completed);
  };

  // Handlers for starting a lesson
  const handleOpenChapter = (ch: LearningChapter) => {
    sfx.playClick();
    if (ch.isCheckpoint) {
      setActiveCheckpoint(ch);
    } else {
      setActiveChapter(ch);
      setLessonPhase('study');
      setLessonResult(null);
    }
  };

  // Handler when quiz completes
  const handleFinishQuiz = (scorePercent: number, mistakesKanaIds: string[]) => {
    if (!activeChapter) return;

    const result = recordActivity({
      type: 'lesson_completed',
      chapterId: activeChapter.id,
      score: scorePercent,
      mistakesKanaIds
    });

    const isPassed = scorePercent >= 80;
    const stars = scorePercent >= 100 ? 3 : scorePercent >= 90 ? 2 : scorePercent >= 80 ? 1 : 0;

    setLessonResult({
      scorePercent,
      earnedXp: result.earnedXp,
      stars,
      isPassed,
      mistakesKanaIds
    });
    setLessonPhase('result');
  };

  // Handler to proceed to the next chapter
  const handleNextChapter = () => {
    if (!activeChapter) return;
    const currentIndex = LEARNING_CHAPTERS.findIndex(c => c.id === activeChapter.id);
    if (currentIndex >= 0 && currentIndex < LEARNING_CHAPTERS.length - 1) {
      const nextCh = LEARNING_CHAPTERS[currentIndex + 1];
      if (nextCh.isCheckpoint) {
        setActiveChapter(null);
        setActiveCheckpoint(nextCh);
      } else {
        setActiveChapter(nextCh);
        setLessonPhase('study');
        setLessonResult(null);
      }
    } else {
      setActiveChapter(null);
    }
  };

  // Overall calculations
  const standardChapters = LEARNING_CHAPTERS.filter(c => !c.isCheckpoint);
  const completedStandardCount = standardChapters.filter(c => learningProgress[c.id]?.completed).length;
  const progressPercent = Math.round((completedStandardCount / standardChapters.length) * 100);
  
  const totalStars = Object.values(learningProgress).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const maxPossibleStars = LEARNING_CHAPTERS.length * 3;

  // Render Lesson runner view
  if (activeChapter) {
    const kanaObjects = HIRAGANA_DATA.filter(k => activeChapter.kanaIds.includes(k.id));

    if (lessonPhase === 'study') {
      return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <LessonStudyPhase
            chapter={activeChapter}
            kanaList={kanaObjects}
            onStartQuiz={() => {
              sfx.playClick();
              setLessonPhase('quiz');
            }}
            onBack={() => setActiveChapter(null)}
          />
        </div>
      );
    }

    if (lessonPhase === 'quiz') {
      return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <LessonQuizPhase
            chapter={activeChapter}
            kanaList={kanaObjects}
            onFinishQuiz={handleFinishQuiz}
            onCancel={() => setLessonPhase('study')}
          />
        </div>
      );
    }

    if (lessonPhase === 'result' && lessonResult) {
      return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <LessonResultPhase
            chapter={activeChapter}
            scorePercent={lessonResult.scorePercent}
            earnedXp={lessonResult.earnedXp}
            stars={lessonResult.stars}
            isPassed={lessonResult.isPassed}
            mistakesKanaIds={lessonResult.mistakesKanaIds}
            onRetryQuiz={() => {
              sfx.playClick();
              setLessonPhase('quiz');
            }}
            onReviewStudy={() => {
              sfx.playClick();
              setLessonPhase('study');
            }}
            onNextChapter={handleNextChapter}
            onBackToOverview={() => setActiveChapter(null)}
          />
        </div>
      );
    }
  }

  // Stage 1 & Stage 2 Chapters
  const stage1Items = LEARNING_CHAPTERS.filter(c => c.stage === 1);
  const stage2Items = LEARNING_CHAPTERS.filter(c => c.stage === 2);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-ink-navy via-brand-700 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-paper-300/30 overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-4 -bottom-4 opacity-10 text-[180px] font-jp font-bold select-none pointer-events-none">
          道
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-amber-200 text-xs font-bold uppercase tracking-wider border border-white/20">
            <GraduationCap size={15} /> Pedagogisk Hiragana-lärstig
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Lär dig Hiragana i strukturerad turordning
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Ta 5 tecken i taget med svenska minnesbilder och ljud. Testa direkt efter varje rad och certifiera dig med delprov och slutprov!
          </p>

          {/* Quick Stats Banner */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-xs text-slate-300 font-medium">Avklarat:</span>
              <span className="text-sm font-bold text-white">{completedStandardCount} av 10 kapitel</span>
              <span className="text-xs text-amber-300 font-bold">({progressPercent}%)</span>
            </div>

            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-amber-300">{totalStars}</span>
              <span className="text-xs text-slate-300">/ {maxPossibleStars} stjärnor</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="relative z-10 mt-6 bg-white/10 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ==========================================
          ETAPP 1: DE FÖRSTA 25 TECKNEN (A TILL NO)
          ========================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-paper-300 dark:border-sumi-800 pb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Etapp 1
            </div>
            <h2 className="text-xl font-bold text-ink-900 dark:text-white">
              De första 25 grundtecknen (A till NO)
            </h2>
          </div>
          <span className="text-xs px-3 py-1 bg-paper-200 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 rounded-full font-medium">
            Kapitel 1 – 5 + Delprov
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stage1Items.map((ch) => renderChapterCard(ch))}
        </div>
      </div>

      {/* ==========================================
          ETAPP 2: RESTERANDE 21 TECKEN (HA TILL N)
          ========================================== */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-paper-300 dark:border-sumi-800 pb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Etapp 2
            </div>
            <h2 className="text-xl font-bold text-ink-900 dark:text-white">
              Resterande 21 tecken (HA till N) & Slutprov
            </h2>
          </div>
          <span className="text-xs px-3 py-1 bg-paper-200 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 rounded-full font-medium">
            Kapitel 6 – 10 + Mästardiplom
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stage2Items.map((ch) => renderChapterCard(ch))}
        </div>
      </div>

      {/* Active Milestone Checkpoint Modal */}
      {activeCheckpoint && (
        <MilestoneCheckpointModal
          checkpoint={activeCheckpoint}
          onClose={() => setActiveCheckpoint(null)}
        />
      )}
    </div>
  );

  // Helper to render an individual chapter card
  function renderChapterCard(ch: LearningChapter) {
    const isUnlocked = isChapterUnlocked(ch);
    const progress = learningProgress[ch.id];
    const isCompleted = !!progress?.completed;
    const stars = progress?.stars || 0;
    const kanaObjects = HIRAGANA_DATA.filter(k => ch.kanaIds.includes(k.id));

    if (ch.isCheckpoint) {
      return (
        <div
          key={ch.id}
          className={`md:col-span-2 p-6 rounded-3xl border-2 transition-all ${
            isCompleted
              ? 'bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-emerald-500/10 border-amber-400/80 dark:border-amber-500/60 shadow-md'
              : isUnlocked
              ? 'bg-gradient-to-r from-amber-500/5 via-brand-500/5 to-white dark:to-sumi-900 border-amber-300 dark:border-amber-700 hover:border-amber-400 shadow-sm hover:shadow-md'
              : 'bg-paper-100/60 dark:bg-sumi-900/40 border-paper-300 dark:border-sumi-800 opacity-60'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                isCompleted 
                  ? 'bg-amber-400 text-amber-950 font-bold' 
                  : isUnlocked 
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400' 
                  : 'bg-paper-200 dark:bg-sumi-800 text-slate-400'
              }`}>
                {isCompleted ? <Trophy size={28} /> : isUnlocked ? <Award size={28} /> : <Lock size={24} />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Milstolpetest
                  </span>
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 size={12} /> Godkänd ({progress.bestScore}%)
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-ink-900 dark:text-white">
                  {ch.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                  {ch.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {isCompleted && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      size={18}
                      className={s <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}
                    />
                  ))}
                </div>
              )}

              <button
                onClick={() => handleOpenChapter(ch)}
                disabled={!isUnlocked}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                  isCompleted
                    ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 shadow-xs'
                    : isUnlocked
                    ? 'bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-600 hover:to-brand-700 text-white shadow-md hover:scale-102 active:scale-98'
                    : 'bg-paper-200 dark:bg-sumi-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isCompleted ? (
                  <>
                    <RotateCcw size={15} /> Gör om provet
                  </>
                ) : isUnlocked ? (
                  <>
                    <Sparkles size={16} /> Starta delprov (+{ch.xpReward} XP)
                  </>
                ) : (
                  <>
                    <Lock size={15} /> Låst (Klarar kap. innan)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Standard 5-character chapter card
    return (
      <div
        key={ch.id}
        className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
          isCompleted
            ? 'bg-white dark:bg-sumi-900 border-emerald-200 dark:border-emerald-900/60 shadow-sm'
            : isUnlocked
            ? 'bg-white dark:bg-sumi-900 border-paper-300 dark:border-sumi-800 hover:border-brand-400 shadow-sm hover:shadow-md'
            : 'bg-paper-100/60 dark:bg-sumi-900/40 border-paper-200 dark:border-sumi-800 opacity-60'
        }`}
      >
        <div className="space-y-3">
          {/* Top meta */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {ch.rowName}
            </span>

            {isCompleted ? (
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    size={15}
                    className={s <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}
                  />
                ))}
              </div>
            ) : isUnlocked ? (
              <span className="text-xs font-bold px-2 py-0.5 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 rounded-full border border-brand-200 dark:border-brand-800">
                Redo att starta
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Lock size={13} /> Låst
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-lg font-bold text-ink-900 dark:text-white">
              {ch.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5">
              {ch.subtitle}
            </p>
          </div>

          {/* Kana Glyph Badges */}
          <div className="flex items-center gap-2 pt-1">
            {kanaObjects.map((k) => (
              <div
                key={k.id}
                className="w-10 h-10 rounded-xl bg-paper-50 dark:bg-sumi-800 border border-paper-200 dark:border-sumi-700 flex flex-col items-center justify-center font-jp"
              >
                <span className="text-base font-bold text-ink-900 dark:text-slate-100 leading-none">
                  {k.kana}
                </span>
                <span className="text-[9px] text-slate-500 font-sans leading-none mt-0.5">
                  {k.romaji}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-4 mt-2 border-t border-paper-100 dark:border-sumi-800/80 flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            +{ch.xpReward} XP
          </span>

          <button
            onClick={() => handleOpenChapter(ch)}
            disabled={!isUnlocked}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isCompleted
                ? 'bg-paper-100 dark:bg-sumi-800 text-slate-700 dark:text-slate-200 hover:bg-paper-200 dark:hover:bg-sumi-700'
                : isUnlocked
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:scale-102 active:scale-98'
                : 'bg-paper-200 dark:bg-sumi-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isCompleted ? (
              <>
                <RotateCcw size={13} /> Repetera
              </>
            ) : isUnlocked ? (
              <>
                <Play size={13} className="fill-white" /> Starta lektion
              </>
            ) : (
              <>
                <Lock size={13} /> Låst
              </>
            )}
          </button>
        </div>
      </div>
    );
  }
};
