import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  X, 
  Award, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import type { LearningChapter } from '../../data/learningPathData';
import type { KanaCharacter } from '../../types/kana';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { useAudio } from '../../modules/audio';
import { fireSuperCelebration } from '../common/Confetti';
import { useProgression } from '../../context/ProgressionContext';
import { useMnemonicCoach } from '../../context/MnemonicCoachContext';

interface MilestoneCheckpointModalProps {
  checkpoint: LearningChapter;
  onClose: () => void;
}

interface CheckpointQuestion {
  id: string;
  type: 'kana-to-romaji' | 'audio-to-kana' | 'word-reading';
  prompt: string;
  targetKanaId: string;
  displayItem: string;
  audioItem?: string;
  options: {
    id: string;
    label: string;
    subLabel?: string;
    isCorrect: boolean;
  }[];
}

export const MilestoneCheckpointModal: React.FC<MilestoneCheckpointModalProps> = ({
  checkpoint,
  onClose
}) => {
  const { playSfx, speakJapanese } = useAudio();
  const { recordActivity } = useProgression();
  const [stage, setStage] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [questions, setQuestions] = useState<CheckpointQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [mistakesKanaIds, setMistakesKanaIds] = useState<string[]>([]);
  const [resultData, setResultData] = useState<{
    scorePercent: number;
    earnedXp: number;
    stars: number;
    isPassed: boolean;
  } | null>(null);

  const poolKana = HIRAGANA_DATA.filter(k => checkpoint.kanaIds.includes(k.id));

  // Generate question pool
  const startExam = () => {
    playSfx('click');
    const count = checkpoint.id === 'cp-1' ? 15 : 25;
    const generated: CheckpointQuestion[] = [];

    // Shuffle pool
    const shuffledKana = [...poolKana].sort(() => Math.random() - 0.5);

    // 1. Kana -> Romaji questions
    shuffledKana.slice(0, Math.floor(count * 0.6)).forEach((k) => {
      const distractors = poolKana
        .filter(d => d.id !== k.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      generated.push({
        id: `cp_k2r_${k.id}_${Math.random()}`,
        type: 'kana-to-romaji',
        prompt: 'Vad är rätt romaji för tecknet?',
        targetKanaId: k.id,
        displayItem: k.kana,
        audioItem: k.kana,
        options: [
          { id: k.id, label: k.romaji, isCorrect: true },
          ...distractors.map(d => ({ id: d.id, label: d.romaji, isCorrect: false }))
        ].sort(() => Math.random() - 0.5)
      });
    });

    // 2. Audio -> Kana questions
    shuffledKana.slice(Math.floor(count * 0.6), Math.floor(count * 0.85)).forEach((k) => {
      const distractors = poolKana
        .filter(d => d.id !== k.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      generated.push({
        id: `cp_a2k_${k.id}_${Math.random()}`,
        type: 'audio-to-kana',
        prompt: 'Lyssna och välj rätt tecken:',
        targetKanaId: k.id,
        displayItem: '?',
        audioItem: k.kana,
        options: [
          { id: k.id, label: k.kana, isCorrect: true },
          ...distractors.map(d => ({ id: d.id, label: d.kana, isCorrect: false }))
        ].sort(() => Math.random() - 0.5)
      });
    });

    // 3. Target words questions
    if (checkpoint.targetWords && checkpoint.targetWords.length > 0) {
      checkpoint.targetWords.forEach(w => {
        const dummyWords = [
          { kana: 'あさ', meaningSv: 'morgon', romaji: 'asa' },
          { kana: 'やま', meaningSv: 'berg', romaji: 'yama' },
          { kana: 'ねこ', meaningSv: 'katt', romaji: 'neko' },
          { kana: 'すし', meaningSv: 'sushi', romaji: 'sushi' }
        ].filter(d => d.kana !== w.kana).slice(0, 3);

        generated.push({
          id: `cp_w_${w.kana}_${Math.random()}`,
          type: 'word-reading',
          prompt: `Vad betyder ordet "${w.kana}"?`,
          targetKanaId: '',
          displayItem: w.kana,
          audioItem: w.kana,
          options: [
            { id: w.kana, label: w.meaningSv, subLabel: `/${w.romaji}/`, isCorrect: true },
            ...dummyWords.map(d => ({ id: d.kana, label: d.meaningSv, subLabel: `/${d.romaji}/`, isCorrect: false }))
          ].sort(() => Math.random() - 0.5)
        });
      });
    }

    const finalQuestions = generated.sort(() => Math.random() - 0.5).slice(0, count);
    setQuestions(finalQuestions);
    setCurrentIndex(0);
    setCorrectCount(0);
    setMistakesKanaIds([]);
    setIsAnswered(false);
    setSelectedOptionId(null);
    setStage('quiz');
  };

  // Play sound automatically on audio question
  useEffect(() => {
    if (stage === 'quiz' && questions.length > 0 && currentIndex < questions.length) {
      const q = questions[currentIndex];
      if (q.type === 'audio-to-kana' && q.audioItem) {
        const t = setTimeout(() => speakJapanese(q.audioItem!), 200);
        return () => clearTimeout(t);
      }
    }
  }, [stage, currentIndex, questions, speakJapanese]);

  const { showCoach, isCoachEnabled } = useMnemonicCoach();

  const handleOptionClick = (option: CheckpointQuestion['options'][0]) => {
    if (isAnswered) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    const q = questions[currentIndex];
    let newCorrect = correctCount;

    const advanceStep = () => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setIsAnswered(false);
        setSelectedOptionId(null);
      } else {
        // Exam complete
        finishExam(newCorrect);
      }
    };

    if (option.isCorrect) {
      playSfx('correct');
      newCorrect += 1;
      setCorrectCount(newCorrect);

      setTimeout(() => {
        advanceStep();
      }, 1000);
    } else {
      playSfx('wrong');
      if (q.targetKanaId && !mistakesKanaIds.includes(q.targetKanaId)) {
        setMistakesKanaIds(prev => [...prev, q.targetKanaId]);
      }

      if (isCoachEnabled && (q.targetKanaId || q.displayItem)) {
        const target = q.targetKanaId || q.displayItem;
        const shown = showCoach(target, () => {
          advanceStep();
        });
        if (!shown) {
          setTimeout(advanceStep, 1200);
        }
      } else {
        setTimeout(advanceStep, 1200);
      }
    }
  };

  const finishExam = (finalCorrect: number) => {
    const score = Math.round((finalCorrect / questions.length) * 100);
    const result = recordActivity({
      type: 'lesson_completed',
      chapterId: checkpoint.id,
      score,
      mistakesKanaIds
    });

    const isPassed = score >= 80;
    const stars = score >= 100 ? 3 : score >= 90 ? 2 : score >= 80 ? 1 : 0;

    setResultData({
      scorePercent: score,
      earnedXp: result.earnedXp,
      stars,
      isPassed
    });
    setStage('result');

    if (isPassed) {
      fireSuperCelebration();
      playSfx('levelUp');
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-sumi-900 rounded-3xl border border-paper-300 dark:border-sumi-800 shadow-2xl max-w-2xl w-full overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-paper-200 dark:border-sumi-800 bg-paper-50 dark:bg-sumi-950">
          <div className="flex items-center gap-2">
            <Trophy className="text-amber-500" size={22} />
            <h2 className="font-bold text-ink-900 dark:text-white text-base sm:text-lg">
              {checkpoint.title}
            </h2>
          </div>
          <button
            onClick={() => {
              playSfx('click');
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-paper-200 dark:hover:bg-sumi-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 1. INTRO STAGE */}
        {stage === 'intro' && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
              <Award size={44} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white">
                Redo för {checkpoint.title}?
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {checkpoint.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto py-2">
              <div className="p-3 rounded-2xl bg-paper-100 dark:bg-sumi-800 border border-paper-200 dark:border-sumi-700">
                <div className="text-lg font-bold text-ink-900 dark:text-white">
                  {checkpoint.id === 'cp-1' ? '15' : '25'}
                </div>
                <div className="text-xs text-slate-500 font-medium">Frågor</div>
              </div>
              <div className="p-3 rounded-2xl bg-paper-100 dark:bg-sumi-800 border border-paper-200 dark:border-sumi-700">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">80%</div>
                <div className="text-xs text-slate-500 font-medium">Krav för godkänt</div>
              </div>
              <div className="p-3 rounded-2xl bg-paper-100 dark:bg-sumi-800 border border-paper-200 dark:border-sumi-700">
                <div className="text-lg font-bold text-amber-500">+{checkpoint.xpReward}</div>
                <div className="text-xs text-slate-500 font-medium">XP-belöning</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={startExam}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-brand-600 text-white font-bold text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-102 active:scale-98 transition-all"
              >
                <Sparkles size={18} /> Starta certifieringstestet
              </button>
            </div>
          </div>
        )}

        {/* 2. QUIZ STAGE */}
        {stage === 'quiz' && currentQ && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Milstolpetest • {checkpoint.title}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Fråga {currentIndex + 1} av {questions.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-paper-200 dark:bg-sumi-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.round(((currentIndex) / questions.length) * 100)}%` }}
              />
            </div>

            {/* Question Box */}
            <div className="text-center space-y-4 py-2">
              <h3 className="text-lg font-bold text-ink-900 dark:text-white">
                {currentQ.prompt}
              </h3>

              {currentQ.type === 'audio-to-kana' ? (
                <button
                  onClick={() => {
                    playSfx('click');
                    speakJapanese(currentQ.audioItem!);
                  }}
                  className="w-20 h-20 mx-auto rounded-3xl bg-brand-50 dark:bg-brand-950/60 border-2 border-brand-300 dark:border-brand-700 flex flex-col items-center justify-center text-brand-600 dark:text-brand-400 hover:scale-105 transition-transform"
                >
                  <Volume2 size={32} />
                </button>
              ) : (
                <div className="text-6xl font-bold font-jp text-ink-900 dark:text-white py-2">
                  {currentQ.displayItem}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt) => {
                let style = 'bg-paper-50 dark:bg-sumi-800 text-ink-900 dark:text-white border-paper-200 dark:border-sumi-700 hover:border-amber-400';

                if (isAnswered) {
                  if (opt.isCorrect) {
                    style = 'bg-emerald-500 text-white border-emerald-600';
                  } else if (selectedOptionId === opt.id) {
                    style = 'bg-rose-500 text-white border-rose-600';
                  } else {
                    style = 'opacity-40 bg-paper-100 dark:bg-sumi-800 text-slate-400';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionClick(opt)}
                    disabled={isAnswered}
                    className={`p-4 rounded-2xl border-2 font-bold text-lg transition-all flex flex-col items-center justify-center min-h-[64px] ${style}`}
                  >
                    <span className="font-jp">{opt.label}</span>
                    {opt.subLabel && (
                      <span className="text-xs font-normal opacity-80 mt-0.5">{opt.subLabel}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. RESULT STAGE */}
        {stage === 'result' && resultData && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-lg ${
              resultData.isPassed 
                ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-300'
                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
            }`}>
              {resultData.isPassed ? <Award size={52} /> : <RotateCcw size={44} />}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white">
                {resultData.isPassed ? 'Grattis! Milstolpen avklarad!' : 'Inte godkänt denna gång'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {resultData.isPassed 
                  ? `Du klarade provet med ${resultData.scorePercent}% och tilldelades +${resultData.earnedXp} XP!`
                  : `Du fick ${resultData.scorePercent}%. 80% krävs för certifiering och upplåsning.`
                }
              </p>
            </div>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  size={32}
                  className={s <= resultData.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={startExam}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-paper-100 dark:bg-sumi-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-paper-200"
              >
                <RotateCcw size={16} /> Gör om testet
              </button>

              <button
                onClick={() => {
                  playSfx('click');
                  onClose();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md"
              >
                Fortsätt lärstigen <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
