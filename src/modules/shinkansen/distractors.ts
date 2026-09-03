import type { KanaCharacter } from '../../types/kana';
import type { StationConfig, PassengerTask, PassengerPersona, TrackData } from './types';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { KATAKANA_DATA } from '../../data/katakanaData';
import { GENKI_L1_VOCABULARY } from '../../data/genkiVocab';
import { getMnemonicPersona } from './personas';

const KANA_MAP = new Map<string, KanaCharacter>([
  ...HIRAGANA_DATA.map(k => [k.id, k] as [string, KanaCharacter]),
  ...KATAKANA_DATA.map(k => [k.id, k] as [string, KanaCharacter])
]);

export interface TaskGenerationOptions {
  forceKanaId?: string;
  forceIsWord?: boolean;
  randomFn?: () => number;
  excludeKanaId?: string;
}

/**
 * Generates queue of upcoming passengers on the platform
 */
export function generateUpcomingQueue(
  station: StationConfig,
  count: number = 3,
  randomFn: () => number = Math.random
): PassengerPersona[] {
  const pool = [...station.kanaIds].sort(() => 0.5 - randomFn());
  const selected = pool.slice(0, count);
  return selected.map(id => {
    const char = KANA_MAP.get(id);
    return getMnemonicPersona(id, char?.kana || id, false);
  });
}

/**
 * Generates a complete PassengerTask with 3 tracks (1 correct, 2 distractors)
 * prioritizing twin confusing pairs (shi vs tsu, ha vs ho, etc.)
 */
export function generatePassengerTask(
  station: StationConfig,
  options: TaskGenerationOptions = {}
): PassengerTask {
  const random = options.randomFn || Math.random;
  const isWord = options.forceIsWord !== undefined 
    ? options.forceIsWord 
    : (station.allowWords ? random() < 0.35 : false);

  if (isWord) {
    const wordList = GENKI_L1_VOCABULARY.filter(w => w.kana && w.romaji && w.kana.length <= 4 && !w.romaji.includes('/'));
    const candidateWords = (wordList.length > 1 && options.excludeKanaId)
      ? wordList.filter(w => w.romaji !== options.excludeKanaId && w.kana !== options.excludeKanaId)
      : wordList;
    const chosenWord = candidateWords[Math.floor(random() * candidateWords.length)] || wordList[0] || {
      kana: 'ねこ',
      romaji: 'neko',
      meaningSv: 'katt'
    };

    const persona = getMnemonicPersona(chosenWord.romaji, chosenWord.kana, true, chosenWord);

    // Pick 2 distractor words
    const otherWords = wordList.filter(w => w.kana !== chosenWord.kana);
    const shuffledOthers = [...otherWords].sort(() => 0.5 - random());
    const distractor1 = shuffledOthers[0] || { kana: 'ねこ', romaji: 'neko' };
    const distractor2 = shuffledOthers[1] || { kana: 'いぬ', romaji: 'inu' };

    const tracksData = [
      { kana: chosenWord.kana, id: chosenWord.romaji, isCorrect: true },
      { kana: distractor1.kana, id: distractor1.romaji, isCorrect: false },
      { kana: distractor2.kana, id: distractor2.romaji, isCorrect: false }
    ].sort(() => 0.5 - random());

    const tracks: TrackData[] = tracksData.map((t, idx) => ({
      trackNumber: (idx + 1) as 1 | 2 | 3,
      kana: t.kana,
      id: t.id,
      isCorrect: t.isCorrect
    }));

    return {
      id: `task_${Date.now()}_${Math.floor(random() * 100000)}`,
      isWord: true,
      ticketDisplay: chosenWord.romaji.toUpperCase(),
      ticketMeaningSv: `${persona.avatar} ${chosenWord.meaningSv}`,
      correctKana: chosenWord.kana,
      correctId: chosenWord.romaji,
      tracks,
      persona,
      timeLimitMs: Math.round(station.baseTimeSeconds * 1000 * 1.2)
    };
  }

  // Single Kana Character Mode
  const validPool = station.kanaIds
    .map(id => KANA_MAP.get(id))
    .filter((k): k is KanaCharacter => Boolean(k));

  let targetKana: KanaCharacter;
  if (options.forceKanaId) {
    targetKana = KANA_MAP.get(options.forceKanaId) || validPool[0] || HIRAGANA_DATA[0];
  } else {
    const candidatePool = (validPool.length > 1 && options.excludeKanaId)
      ? validPool.filter(k => k.id !== options.excludeKanaId && k.kana !== options.excludeKanaId)
      : validPool;
    targetKana = candidatePool[Math.floor(random() * candidatePool.length)] || validPool[0] || HIRAGANA_DATA[0];
  }

  const persona = getMnemonicPersona(targetKana.id, targetKana.kana, false);

  // Twin pair distractor selection
  let distractor1: KanaCharacter | undefined;
  let distractor2: KanaCharacter | undefined;

  if (station.twinPairs) {
    const twinMatch = station.twinPairs.find(
      pair => pair[0] === targetKana.id || pair[1] === targetKana.id
    );
    if (twinMatch) {
      const twinId = twinMatch[0] === targetKana.id ? twinMatch[1] : twinMatch[0];
      distractor1 = KANA_MAP.get(twinId);
    }
  }

  const poolWithoutTarget = validPool.filter(k => k.id !== targetKana.id);
  if (!distractor1) {
    distractor1 = poolWithoutTarget[Math.floor(random() * poolWithoutTarget.length)] || HIRAGANA_DATA[1];
  }

  const poolWithoutBoth = poolWithoutTarget.filter(k => k.id !== distractor1?.id);
  distractor2 = poolWithoutBoth[Math.floor(random() * poolWithoutBoth.length)] || HIRAGANA_DATA[2];

  const tracksData = [
    { kana: targetKana.kana, id: targetKana.id, isCorrect: true },
    { kana: distractor1.kana, id: distractor1.id, isCorrect: false },
    { kana: distractor2.kana, id: distractor2.id, isCorrect: false }
  ].sort(() => 0.5 - random());

  const tracks: TrackData[] = tracksData.map((t, idx) => ({
    trackNumber: (idx + 1) as 1 | 2 | 3,
    kana: t.kana,
    id: t.id,
    isCorrect: t.isCorrect
  }));

  return {
    id: `task_${Date.now()}_${Math.floor(random() * 100000)}`,
    isWord: false,
    ticketDisplay: targetKana.romaji.toUpperCase(),
    ticketMeaningSv: targetKana.mnemonic?.keyCue || `${persona.avatar} ${persona.titleSv}`,
    correctKana: targetKana.kana,
    correctId: targetKana.id,
    characterInfo: targetKana,
    tracks,
    persona,
    timeLimitMs: Math.round(station.baseTimeSeconds * 1000)
  };
}
