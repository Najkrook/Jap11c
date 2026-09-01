import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import type { KanaCharacter } from '../../types/kana';
import type { LearningChapter } from '../../data/learningPathData';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { playJapaneseSpeech, sfx } from '../../utils/audio';
import { useMnemonicCoach } from '../../context/MnemonicCoachContext';

export type QuestionType = 'kana-to-romaji' | 'audio-to-kana' | 'romaji-to-kana' | 'word-meaning';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
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

interface LessonQuizPhaseProps {
  chapter: LearningChapter;
  kanaList: KanaCharacter[];
  onFinishQuiz: (scorePercent: number, mistakesKanaIds: string[]) => void;
  onCancel: () => void;
}

// Map of visually or phonetically similar confusers / lookalikes
const VISUAL_AND_PHONETIC_CONFUSERS: Record<string, string[]> = {
  a: ['o', 'me', 'wa', 'e'],
  i: ['ri', 'ko', 'ni', 'u'],
  u: ['tsu', 'ra', 'fu', 'i'],
  e: ['n', 'i', 'te', 'a'],
  o: ['a', 'ka', 'yo', 'u'],
  ka: ['ki', 'ku', 'ke', 'ko', 'wa', 'o', 'ga'],
  ki: ['ka', 'ku', 'ke', 'ko', 'sa', 'chi', 'gi'],
  ku: ['ka', 'ki', 'ke', 'ko', 'he', 'shi', 'gu'],
  ke: ['ka', 'ki', 'ku', 'ko', 'ha', 'ni', 'ge'],
  ko: ['ka', 'ki', 'ku', 'ke', 'ni', 'i', 'go'],
  sa: ['shi', 'su', 'se', 'so', 'ki', 'chi', 'za'],
  shi: ['sa', 'su', 'se', 'so', 'tsu', 'ku', 'ji'],
  su: ['sa', 'shi', 'se', 'so', 'mu', 'nu', 'zu'],
  se: ['sa', 'shi', 'su', 'so', 'ya', 'ze'],
  so: ['sa', 'shi', 'su', 'se', 'ro', 'ru', 'zo'],
  ta: ['chi', 'tsu', 'te', 'to', 'na', 'da'],
  chi: ['ta', 'tsu', 'te', 'to', 'sa', 'ra', 'ji'],
  tsu: ['ta', 'chi', 'te', 'to', 'u', 'shi'],
  te: ['ta', 'chi', 'tsu', 'to', 'so', 'de'],
  to: ['ta', 'chi', 'tsu', 'te', 'te', 'do'],
  na: ['ni', 'nu', 'ne', 'no', 'ta', 'nu'],
  ni: ['na', 'nu', 'ne', 'no', 'ko', 'ke', 'i'],
  nu: ['na', 'ni', 'ne', 'no', 'me', 'ne'],
  ne: ['na', 'ni', 'nu', 'no', 're', 'wa'],
  no: ['na', 'ni', 'nu', 'ne', 'me', 'nu'],
  ha: ['hi', 'fu', 'he', 'ho', 'ho', 'ma', 'ke'],
  hi: ['ha', 'fu', 'he', 'ho', 'he', 'bi'],
  fu: ['ha', 'hi', 'he', 'ho', 'u', 'bu'],
  he: ['ha', 'hi', 'fu', 'ho', 'ku', 'be'],
  ho: ['ha', 'hi', 'fu', 'he', 'ha', 'ma'],
  ma: ['mi', 'mu', 'me', 'mo', 'mo', 'ho', 'ha'],
  mi: ['ma', 'mu', 'me', 'mo', 'ki'],
  mu: ['ma', 'mi', 'me', 'mo', 'su'],
  me: ['ma', 'mi', 'mu', 'mo', 'nu', 'a', 'no'],
  mo: ['ma', 'mi', 'mu', 'me', 'ma', 'shi'],
  ya: ['yu', 'yo', 'se', 'ka'],
  yu: ['ya', 'yo', 'yo', 'u'],
  yo: ['ya', 'yu', 'yu', 'ma', 'o'],
  ra: ['ri', 'ru', 're', 'ro', 'chi', 'u'],
  ri: ['ra', 'ru', 're', 'ro', 'i'],
  ru: ['ra', 'ri', 're', 'ro', 'ro', 'so'],
  re: ['ra', 'ri', 'ru', 'ro', 'ne', 'wa'],
  ro: ['ra', 'ri', 'ru', 're', 'ru'],
  wa: ['wo', 'n', 're', 'ne', 'ka'],
  wo: ['wa', 'n', 'to', 'e'],
  n: ['wa', 'wo', 'e', 'so']
};

/**
 * Get 3 smart distractors: prioritizing characters from the SAME chapter,
 * then visually similar confusers, so learners cannot easily guess by elimination.
 */
function getSmartKanaDistractors(target: KanaCharacter, chapterKana: KanaCharacter[]): KanaCharacter[] {
  // 1. Same chapter siblings (excluding target)
  const sameChapter = chapterKana
    .filter(k => k.id !== target.id)
    .sort(() => Math.random() - 0.5);

  // 2. Lookalike / phonetic confusers
  const confusersList = (VISUAL_AND_PHONETIC_CONFUSERS[target.id] || []).filter(id => id !== target.id);
  const visualConfusers = HIRAGANA_DATA
    .filter(k => confusersList.includes(k.id) && k.id !== target.id && !sameChapter.some(s => s.id === k.id))
    .sort(() => Math.random() - 0.5);

  // 3. Combine prioritising same chapter and visual lookalikes
  const candidates = [...sameChapter, ...visualConfusers];

  // If still under 3 (e.g. rare case), fallback to any hiragana
  if (candidates.length < 3) {
    const fallback = HIRAGANA_DATA
      .filter(k => k.id !== target.id && !candidates.some(c => c.id === k.id))
      .sort(() => Math.random() - 0.5);
    candidates.push(...fallback);
  }

  return candidates.slice(0, 3);
}

export const LessonQuizPhase: React.FC<LessonQuizPhaseProps> = ({
  chapter,
  kanaList,
  onFinishQuiz,
  onCancel
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [mistakesKanaIds, setMistakesKanaIds] = useState<string[]>([]);
  const timerRef = useRef<number | null>(null);

  // Generate question set on mount
  useEffect(() => {
    const generated: QuizQuestion[] = [];

    // 1. Kana -> Romaji for each kana in the chapter (using chapter siblings & lookalikes)
    kanaList.forEach((k) => {
      const distractors = getSmartKanaDistractors(k, kanaList);
      
      const options = [
        { id: k.id, label: k.romaji, isCorrect: true },
        ...distractors.map(d => ({ id: d.id, label: d.romaji, isCorrect: false }))
      ].sort(() => Math.random() - 0.5);

      generated.push({
        id: `k2r_${k.id}_${Math.random()}`,
        type: 'kana-to-romaji',
        prompt: 'Vilket ljud motsvarar tecknet?',
        targetKanaId: k.id,
        displayItem: k.kana,
        audioItem: k.kana,
        options
      });
    });

    // 2. Audio -> Kana for a subset of kana (using chapter siblings & lookalikes)
    const audioTargets = [...kanaList].sort(() => Math.random() - 0.5).slice(0, Math.min(3, kanaList.length));
    audioTargets.forEach((k) => {
      const distractors = getSmartKanaDistractors(k, kanaList);
      
      const options = [
        { id: k.id, label: k.kana, isCorrect: true },
        ...distractors.map(d => ({ id: d.id, label: d.kana, isCorrect: false }))
      ].sort(() => Math.random() - 0.5);

      generated.push({
        id: `a2k_${k.id}_${Math.random()}`,
        type: 'audio-to-kana',
        prompt: 'Lyssna på ljudet och välj rätt tecken:',
        targetKanaId: k.id,
        displayItem: '?',
        audioItem: k.kana,
        options
      });
    });

    // 3. Word question if chapter has words
    if (chapter.targetWords && chapter.targetWords.length > 0) {
      const sampleWord = chapter.targetWords[Math.floor(Math.random() * chapter.targetWords.length)];
      const otherWords = chapter.targetWords.filter(w => w.kana !== sampleWord.kana);
      
      const distractors = otherWords.length >= 3 
        ? otherWords.slice(0, 3) 
        : [
            ...otherWords,
            { kana: 'ねこ', romaji: 'neko', meaningSv: 'katt' },
            { kana: 'いぬ', romaji: 'inu', meaningSv: 'hund' },
            { kana: 'あさ', romaji: 'asa', meaningSv: 'morgon' }
          ].filter(w => w.kana !== sampleWord.kana).slice(0, 3);

      const options = [
        { id: sampleWord.kana, label: sampleWord.meaningSv, subLabel: `/${sampleWord.romaji}/`, isCorrect: true },
        ...distractors.map(d => ({ id: d.kana, label: d.meaningSv, subLabel: `/${d.romaji}/`, isCorrect: false }))
      ].sort(() => Math.random() - 0.5);

      generated.push({
        id: `word_${sampleWord.kana}_${Math.random()}`,
        type: 'word-meaning',
        prompt: `Vad betyder ordet "${sampleWord.kana}"?`,
        targetKanaId: kanaList[0]?.id || '',
        displayItem: sampleWord.kana,
        audioItem: sampleWord.kana,
        options
      });
    }

    // Shuffle all questions
    const finalShuffled = generated.sort(() => Math.random() - 0.5);
    setQuestions(finalShuffled);
    setCurrentIndex(0);
    setCorrectCount(0);
    setMistakesKanaIds([]);
  }, [chapter, kanaList]);

  // Autoplay audio on question change if audio-to-kana
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      const q = questions[currentIndex];
      if (q.type === 'audio-to-kana' && q.audioItem) {
        const timeout = setTimeout(() => {
          playJapaneseSpeech(q.audioItem!);
        }, 200);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentIndex, questions]);

  const currentQ = questions[currentIndex];

  const { showCoach, isCoachEnabled } = useMnemonicCoach();

  const handleSelectOption = (option: QuizQuestion['options'][0]) => {
    if (isAnswered) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    if (option.isCorrect) {
      sfx.playCorrect();
      setCorrectCount(prev => prev + 1);

      // Auto advance on correct answer
      timerRef.current = window.setTimeout(() => {
        advanceNext(correctCount + 1);
      }, 1000);
    } else {
      sfx.playWrong();
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
  };

  const advanceNext = (finalCorrect: number) => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      const scorePercent = Math.round((finalCorrect / questions.length) * 100);
      onFinishQuiz(scorePercent, mistakesKanaIds);
    }
  };

  const handlePlayPromptAudio = () => {
    if (currentQ?.audioItem) {
      sfx.playClick();
      playJapaneseSpeech(currentQ.audioItem);
    }
  };

  if (!currentQ) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        Laddar frågor...
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex) / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Bar with Progress & Cancel */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
        >
          Avbryt test
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
            Fråga {currentIndex + 1} av {questions.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-paper-200 dark:bg-sumi-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-brand-500 to-amber-500 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-sumi-900 rounded-3xl border border-paper-200 dark:border-sumi-800 shadow-md p-6 sm:p-8 space-y-6 text-center">
        
        {/* Question Prompt Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold">
            <HelpCircle size={14} /> Snabbtest: {chapter.rowName}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-ink-900 dark:text-white">
            {currentQ.prompt}
          </h2>
        </div>

        {/* Display Item / Glyph */}
        <div className="flex flex-col items-center justify-center py-4">
          {currentQ.type === 'audio-to-kana' ? (
            <button
              onClick={handlePlayPromptAudio}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-brand-50 dark:bg-brand-950/80 border-2 border-dashed border-brand-300 dark:border-brand-700 flex flex-col items-center justify-center text-brand-600 dark:text-brand-400 hover:scale-105 active:scale-95 transition-all shadow-sm group"
            >
              <Volume2 size={36} className="animate-bounce" />
              <span className="text-xs font-bold mt-1 group-hover:underline">Lyssna igen</span>
            </button>
          ) : (
            <div className="relative">
              <div className="text-6xl sm:text-7xl font-bold font-jp text-ink-900 dark:text-slate-100 tracking-tight">
                {currentQ.displayItem}
              </div>
              {currentQ.audioItem && (
                <button
                  onClick={handlePlayPromptAudio}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <Volume2 size={13} /> Hör uttal
                </button>
              )}
            </div>
          )}
        </div>

        {/* Option Buttons (2x2 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
          {currentQ.options.map((option) => {
            let btnStyle = 'bg-paper-50 dark:bg-sumi-800 text-ink-900 dark:text-slate-100 border-paper-200 dark:border-sumi-700 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/40';

            if (isAnswered) {
              if (option.isCorrect) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/25 scale-102';
              } else if (selectedOptionId === option.id) {
                btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-500/25 animate-shake';
              } else {
                btnStyle = 'opacity-40 bg-paper-100 dark:bg-sumi-800 text-slate-400 border-transparent';
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`p-4 sm:p-5 rounded-2xl border-2 font-bold text-lg sm:text-xl transition-all duration-150 flex flex-col items-center justify-center min-h-[70px] ${btnStyle}`}
              >
                <span className="font-jp">{option.label}</span>
                {option.subLabel && (
                  <span className="text-xs font-sans font-normal opacity-80 mt-0.5">
                    {option.subLabel}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
