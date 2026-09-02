import React, { useState, useMemo, useCallback } from 'react';
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
import { KATAKANA_LEARNING_CHAPTERS } from '../../data/katakanaLearningPathData';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { KATAKANA_DATA } from '../../data/katakanaData';
import { LessonStudyPhase } from './LessonStudyPhase';
import { LessonQuizPhase } from './LessonQuizPhase';
import { LessonResultPhase } from './LessonResultPhase';
import { MilestoneCheckpointModal } from './MilestoneCheckpointModal';
import { useProgression } from '../../context/ProgressionContext';
import { useAudio } from '../../modules/audio';
import { useScriptMode } from '../../context/ScriptModeContext';
import type { ActiveTab } from '../layout/Navbar';

interface LearningPathViewProps {
  onNavigate?: (tab: ActiveTab) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  onNavigate: _onNavigate
}) => {
  const { playSfx } = useAudio();
  const { stats, recordActivity } = useProgression();
  const { scriptMode, setScriptMode, isKatakana } = useScriptMode();

  const activeChapters = isKatakana ? KATAKANA_LEARNING_CHAPTERS : LEARNING_CHAPTERS;
  const activeDataset = isKatakana ? KATAKANA_DATA : HIRAGANA_DATA;

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
  const handleOpenChapter = useCallback((ch: LearningChapter) => {
    playSfx('click');
    if (ch.isCheckpoint) {
      setActiveCheckpoint(ch);
    } else {
      setActiveChapter(ch);
      setLessonPhase('study');
      setLessonResult(null);
    }
  }, [playSfx]);

  // Handler when quiz completes
  const handleFinishQuiz = useCallback((scorePercent: number, mistakesKanaIds: string[]) => {
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
  }, [activeChapter, recordActivity]);

  // Handler to proceed to the next chapter
  const handleNextChapter = useCallback(() => {
    if (!activeChapter) return;
    const currentIndex = activeChapters.findIndex(c => c.id === activeChapter.id);
    if (currentIndex >= 0 && currentIndex < activeChapters.length - 1) {
      const nextCh = activeChapters[currentIndex + 1];
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
  }, [activeChapter, activeChapters]);

  // Memoized kana objects for active chapter
  const kanaObjects = useMemo(() => {
    if (!activeChapter) return [];
    return activeDataset.filter(k => activeChapter.kanaIds.includes(k.id));
  }, [activeChapter, activeDataset]);

  // Overall calculations
  const standardChapters = activeChapters.filter(c => !c.isCheckpoint);
  const completedStandardCount = standardChapters.filter(c => learningProgress[c.id]?.completed).length;
  const progressPercent = Math.round((completedStandardCount / standardChapters.length) * 100);
  
  const totalStars = Object.values(learningProgress).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const maxPossibleStars = activeChapters.length * 3;

  // Render Lesson runner view
  if (activeChapter) {
    if (lessonPhase === 'study') {
      return (
        <div className="max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <LessonStudyPhase
            key={activeChapter.id}
            chapter={activeChapter}
            kanaList={kanaObjects}
            onStartQuiz={() => {
              playSfx('click');
              setLessonPhase('quiz');
            }}
            onBack={() => setActiveChapter(null)}
          />
        </div>
      );
    }

    if (lessonPhase === 'quiz') {
      return (
        <div className="max-w-3xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <LessonQuizPhase
            key={activeChapter.id}
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
        <div className="max-w-3xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <LessonResultPhase
            key={activeChapter.id}
            chapter={activeChapter}
            scorePercent={lessonResult.scorePercent}
            earnedXp={lessonResult.earnedXp}
            stars={lessonResult.stars}
            isPassed={lessonResult.isPassed}
            mistakesKanaIds={lessonResult.mistakesKanaIds}
            onRetryQuiz={() => {
              playSfx('click');
              setLessonPhase('quiz');
            }}
            onReviewStudy={() => {
              playSfx('click');
              setLessonPhase('study');
            }}
            onNextChapter={handleNextChapter}
            onBackToOverview={() => setActiveChapter(null)}
          />
        </div>
      );
    }
  }

  // Group chapters by stage
  const stage1Items = activeChapters.filter(c => c.stage === 1);
  const stage2Items = activeChapters.filter(c => c.stage === 2);

  return (
    <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 animate-fadeIn">
      {/* Top Hero Banner */}
      <div className={`text-white rounded-3xl p-6 sm:p-10 shadow-xl border relative overflow-hidden transition-all duration-300 ${
        isKatakana
          ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-sumi-950 border-amber-400/30'
          : 'bg-gradient-to-r from-ink-navy via-brand-700 to-slate-900 border-brand-bronze/30'
      }`}>
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-6 -bottom-6 opacity-10 text-[180px] font-jp font-bold pointer-events-none select-none">
          {isKatakana ? '片' : '学'}
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-amber-200 text-xs font-bold uppercase tracking-wider border border-white/20">
            <GraduationCap size={15} /> Pedagogisk {isKatakana ? 'Katakana-lärstig' : 'Hiragana-lärstig'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Lär dig {isKatakana ? 'Katakana' : 'Hiragana'} i strukturerad turordning
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Ta 5 tecken i taget med svenska minnesbilder och ljud. Testa direkt efter varje rad och certifiera dig med delprov och slutprov!
          </p>

          {/* Script mode switcher */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-300 font-semibold">Växla lärstig:</span>
            <div className="inline-flex bg-black/20 backdrop-blur p-1 rounded-xl border border-white/20">
              <button
                onClick={() => setScriptMode('hiragana')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  !isKatakana ? 'bg-white text-ink-navy shadow-sm' : 'text-slate-200 hover:text-white'
                }`}
              >
                あ Hiragana-stig
              </button>
              <button
                onClick={() => setScriptMode('katakana')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  isKatakana ? 'bg-amber-400 text-sumi-950 font-black shadow-sm' : 'text-slate-200 hover:text-white'
                }`}
              >
                ア Katakana-stig
              </button>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-xs text-slate-300 font-medium">Avklarat:</span>
              <span className="text-sm font-bold text-white">{completedStandardCount} av {standardChapters.length} kapitel</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {stage1Items.map((ch) => renderChapterCard(ch))}
        </div>
      </div>

      {/* ==========================================
          ETAPP 2: RESTERANDE TECKEN & SPECIALER
          ========================================== */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-paper-300 dark:border-sumi-800 pb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Etapp 2
            </div>
            <h2 className="text-xl font-bold text-ink-900 dark:text-white">
              {isKatakana ? 'Resterande tecken, Dakuon & Specialkombinationer' : 'Resterande 21 tecken (HA till N) & Slutprov'}
            </h2>
          </div>
          <span className="text-xs px-3 py-1 bg-paper-200 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 rounded-full font-medium">
            Kapitel 6+ & Slutprov
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
    const currentKanaObjects = activeDataset.filter(k => ch.kanaIds.includes(k.id));

    if (ch.isCheckpoint) {
      return (
        <div
          key={ch.id}
          className={`md:col-span-2 xl:col-span-3 p-6 rounded-3xl border-2 transition-all ${
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
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Milstolpe • Delprov
                  </span>
                  {isCompleted && (
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full">
                      Klarad ({progress.score}%)
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-ink-900 dark:text-white">
                  {ch.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                  {ch.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenChapter(ch)}
              disabled={!isUnlocked}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-paper-200 dark:bg-sumi-800 text-ink-900 dark:text-white hover:bg-paper-300'
                  : isUnlocked
                  ? 'bg-amber-400 text-sumi-950 hover:bg-amber-300 shadow-md hover:scale-105 active:scale-95'
                  : 'bg-paper-200 dark:bg-sumi-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isCompleted ? (
                <>
                  <RotateCcw size={16} /> Gör om provet
                </>
              ) : isUnlocked ? (
                <>
                  <Play size={16} className="fill-current" /> Starta provet
                </>
              ) : (
                <>
                  <Lock size={16} /> Låst
                </>
              )}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={ch.id}
        onClick={() => isUnlocked && handleOpenChapter(ch)}
        className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between group ${
          isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
        } ${
          isCompleted
            ? 'bg-white dark:bg-sumi-900 border-emerald-300 dark:border-emerald-800/80 shadow-xs hover:shadow-md'
            : isUnlocked
            ? 'bg-white dark:bg-sumi-900 border-paper-300 dark:border-sumi-800 hover:border-amber-400 shadow-xs hover:shadow-md'
            : 'bg-paper-100/50 dark:bg-sumi-950/50 border-paper-200 dark:border-sumi-800/60'
        }`}
      >
        <div className="space-y-3">
          {/* Header row: Chapter Tag, Stars & Status */}
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">
              Kapitel {ch.chapterNumber}
            </span>

            <div className="flex items-center gap-1">
              {isUnlocked && !isCompleted && (
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                  Redo
                </span>
              )}
              {isCompleted && (
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      size={14}
                      className={
                        starIdx <= stars
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 dark:text-sumi-700'
                      }
                    />
                  ))}
                </div>
              )}
              {!isUnlocked && <Lock size={14} className="text-slate-400" />}
            </div>
          </div>

          {/* Title & Row name */}
          <div>
            <h3 className="font-extrabold text-base text-ink-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {ch.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
              {ch.subtitle}
            </p>
          </div>

          {/* Kana Characters Preview Chips */}
          <div className="flex items-center gap-1.5 py-1">
            {currentKanaObjects.map((k) => (
              <div
                key={k.id}
                className="w-9 h-9 rounded-xl bg-paper-100 dark:bg-sumi-800 border border-paper-300 dark:border-sumi-700 flex flex-col items-center justify-center font-jp font-bold text-sm text-ink-900 dark:text-white shadow-2xs"
              >
                <span>{k.kana}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Action CTA */}
        <div className="pt-3 border-t border-paper-200 dark:border-sumi-800 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">+{ch.xpReward} XP</span>
          
          <div className="flex items-center gap-1 font-bold text-ink-700 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
            <span>{isCompleted ? 'Öva igen' : isUnlocked ? 'Börja' : 'Låst'}</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    );
  }
};
