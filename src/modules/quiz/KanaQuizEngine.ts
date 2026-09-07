import type { KanaCharacter } from '../../types/kana';
import type { 
  QuizOption, 
  QuizQuestion, 
  QuizSessionConfig, 
  DistractorOptions, 
  QuizEvaluationResult,
  TargetWord,
  QuestionType 
} from './types';
import { HIRAGANA_CONFUSERS, KATAKANA_CONFUSERS } from './confusers';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { KATAKANA_DATA } from '../../data/katakanaData';

/**
 * Returns lookalike / confuser IDs for a given Kana character.
 */
export function getLookalikes(kanaId: string): string[] {
  const isKatakana = kanaId.startsWith('kata_');
  const cleanId = kanaId.replace('kata_', '');
  const lookup = isKatakana ? KATAKANA_CONFUSERS : HIRAGANA_CONFUSERS;
  const list = lookup[cleanId] || [];
  return list.map(id => (isKatakana ? `kata_${id}` : id));
}

/**
 * Get smart distractors for multiple choice options.
 * Prioritizes:
 * 1. Sibling characters from the provided pool (e.g. current chapter)
 * 2. Visual and phonetic confusers / lookalikes
 * 3. Safe fallback randomly sampled from full alphabet
 */
export function getSmartKanaDistractors(
  target: KanaCharacter,
  pool: KanaCharacter[],
  count: number = 3,
  options?: DistractorOptions
): KanaCharacter[] {
  const isKatakanaTarget = target.script === 'katakana' || target.id.startsWith('kata_');
  const sourceDataset = isKatakanaTarget ? KATAKANA_DATA : HIRAGANA_DATA;
  const excludeIds = new Set([target.id, ...(options?.excludeIds || [])]);

  // 1. Same pool siblings
  const samePool = pool
    .filter(k => !excludeIds.has(k.id))
    .sort(() => Math.random() - 0.5);

  // 2. Lookalike confusers
  const confusersList = getLookalikes(target.id);
  const visualConfusers = sourceDataset
    .filter(k => confusersList.includes(k.id) && !excludeIds.has(k.id) && !samePool.some(s => s.id === k.id))
    .sort(() => Math.random() - 0.5);

  // Combine candidates
  const candidates: KanaCharacter[] = [...samePool, ...visualConfusers];

  // 3. Fallback if candidate pool is smaller than required count
  if (candidates.length < count) {
    const candidateIds = new Set(candidates.map(c => c.id));
    const fallback = sourceDataset
      .filter(k => !excludeIds.has(k.id) && !candidateIds.has(k.id))
      .sort(() => Math.random() - 0.5);
    candidates.push(...fallback);
  }

  return candidates.slice(0, count);
}

/**
 * Get distractors for word meaning questions.
 */
export function getWordMeaningDistractors(
  targetWord: TargetWord,
  pool: TargetWord[],
  count: number = 3
): TargetWord[] {
  const others = pool
    .filter(w => w.kana !== targetWord.kana && w.meaningSv !== targetWord.meaningSv)
    .sort(() => Math.random() - 0.5);

  if (others.length >= count) {
    return others.slice(0, count);
  }

  // Generic fallback words if pool is too small
  const genericFallbacks: TargetWord[] = [
    { kana: 'ねこ', romaji: 'neko', meaningSv: 'katt' },
    { kana: 'いぬ', romaji: 'inu', meaningSv: 'hund' },
    { kana: 'みず', romaji: 'mizu', meaningSv: 'vatten' },
    { kana: 'ほん', romaji: 'hon', meaningSv: 'bok' },
    { kana: 'くるま', romaji: 'kuruma', meaningSv: 'bil' },
    { kana: 'やま', romaji: 'yama', meaningSv: 'berg' }
  ];

  const filteredFallbacks = genericFallbacks
    .filter(w => w.kana !== targetWord.kana && w.meaningSv !== targetWord.meaningSv && !others.some(o => o.kana === w.kana));

  return [...others, ...filteredFallbacks].slice(0, count);
}

/**
 * Shuffles an array immutably.
 */
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Generate a complete pedagogical quiz session for a lesson or review.
 */
export function generateQuizSession(config: QuizSessionConfig): QuizQuestion[] {
  const { chapter, kanaList, allowedTypes, targetWords } = config;
  const questions: QuizQuestion[] = [];
  const words = targetWords || chapter?.targetWords || [];

  const typesToUse: QuestionType[] = allowedTypes || [
    'kana-to-romaji',
    'audio-to-kana',
    'romaji-to-kana',
    'word-meaning'
  ];

  // 1. Kana-to-Romaji for every kana in list
  if (typesToUse.includes('kana-to-romaji')) {
    for (const k of kanaList) {
      const distractors = getSmartKanaDistractors(k, kanaList, 3);
      const options: QuizOption[] = shuffle([
        { id: k.id, label: k.romaji, isCorrect: true },
        ...distractors.map(d => ({ id: d.id, label: d.romaji, isCorrect: false }))
      ]);

      questions.push({
        id: `q-k2r-${k.id}`,
        type: 'kana-to-romaji',
        prompt: `Vilket romaji-ljud motsvarar detta tecken?`,
        targetKanaId: k.id,
        displayItem: k.kana,
        options
      });
    }
  }

  // 2. Audio-to-Kana for every kana in list
  if (typesToUse.includes('audio-to-kana')) {
    for (const k of kanaList) {
      const distractors = getSmartKanaDistractors(k, kanaList, 3);
      const options: QuizOption[] = shuffle([
        { id: k.id, label: k.kana, isCorrect: true },
        ...distractors.map(d => ({ id: d.id, label: d.kana, isCorrect: false }))
      ]);

      questions.push({
        id: `q-a2k-${k.id}`,
        type: 'audio-to-kana',
        prompt: `Lyssna på ljudet och välj rätt tecken:`,
        targetKanaId: k.id,
        displayItem: '?',
        audioItem: k.kana,
        options
      });
    }
  }

  // 3. Romaji-to-Kana for selected kana
  if (typesToUse.includes('romaji-to-kana')) {
    const selectedKana = kanaList.slice(0, Math.min(2, kanaList.length));
    for (const k of selectedKana) {
      const distractors = getSmartKanaDistractors(k, kanaList, 3);
      const options: QuizOption[] = shuffle([
        { id: k.id, label: k.kana, isCorrect: true },
        ...distractors.map(d => ({ id: d.id, label: d.kana, isCorrect: false }))
      ]);

      questions.push({
        id: `q-r2k-${k.id}`,
        type: 'romaji-to-kana',
        prompt: `Vilket tecken skrivs som / ${k.romaji} / ?`,
        targetKanaId: k.id,
        displayItem: k.romaji,
        options
      });
    }
  }

  // 4. Word Meaning questions if words are available
  if (typesToUse.includes('word-meaning') && words.length > 0) {
    const selectedWords = words.slice(0, Math.min(2, words.length));
    for (const w of selectedWords) {
      const wordDistractors = getWordMeaningDistractors(w, words, 3);
      const options: QuizOption[] = shuffle([
        { id: w.kana, label: w.meaningSv, subLabel: `/${w.romaji}/`, isCorrect: true },
        ...wordDistractors.map(d => ({ id: d.kana, label: d.meaningSv, subLabel: `/${d.romaji}/`, isCorrect: false }))
      ]);

      const primaryKana = kanaList.find(k => w.kana.includes(k.kana)) || kanaList[0];

      questions.push({
        id: `q-wm-${w.kana}`,
        type: 'word-meaning',
        prompt: `Vad betyder ordet?`,
        targetKanaId: primaryKana?.id || 'unknown',
        displayItem: w.kana,
        audioItem: w.kana,
        options
      });
    }
  }

  return shuffle(questions);
}

/**
 * Generate a randomized checkpoint / review quiz across a wide pool of kana.
 */
export function generateCheckpointQuestions(poolKana: KanaCharacter[], count: number = 10): QuizQuestion[] {
  const shuffledPool = shuffle(poolKana);
  const selectedPool = shuffledPool.slice(0, Math.min(count, poolKana.length));

  const questions: QuizQuestion[] = selectedPool.map((target, idx) => {
    const isAudioType = idx % 2 === 1;
    const distractors = getSmartKanaDistractors(target, poolKana, 3);

    if (isAudioType) {
      const options: QuizOption[] = shuffle([
        { id: target.id, label: target.kana, isCorrect: true },
        ...distractors.map(d => ({ id: d.id, label: d.kana, isCorrect: false }))
      ]);

      return {
        id: `chk-a2k-${target.id}-${idx}`,
        type: 'audio-to-kana',
        prompt: 'Lyssna och välj rätt tecken:',
        targetKanaId: target.id,
        displayItem: '?',
        audioItem: target.kana,
        options
      };
    } else {
      const options: QuizOption[] = shuffle([
        { id: target.id, label: target.romaji, isCorrect: true },
        ...distractors.map(d => ({ id: d.id, label: d.romaji, isCorrect: false }))
      ]);

      return {
        id: `chk-k2r-${target.id}-${idx}`,
        type: 'kana-to-romaji',
        prompt: 'Vilket romaji-ljud motsvarar detta tecken?',
        targetKanaId: target.id,
        displayItem: target.kana,
        options
      };
    }
  });

  return shuffle(questions);
}

/**
 * Calculates standardized score percentage, stars (0-3), and pass status.
 */
export function evaluateQuizScore(
  totalQuestions: number,
  mistakesKanaIds: string[]
): QuizEvaluationResult {
  const correctCount = Math.max(0, totalQuestions - mistakesKanaIds.length);
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPassed = scorePercent >= 80;
  const stars = scorePercent >= 100 ? 3 : scorePercent >= 90 ? 2 : scorePercent >= 80 ? 1 : 0;

  return {
    scorePercent,
    isPassed,
    stars,
    mistakesKanaIds,
    totalAnswered: totalQuestions,
    correctCount
  };
}
