import type { KanaCharacter, SrsRating } from '../../types/kana';

export interface SrsSessionStats {
  reviewed: number;
  again: number;
  hard: number;
  good: number;
  easy: number;
  xpEarned: number;
}

export const INITIAL_SRS_SESSION_STATS: SrsSessionStats = {
  reviewed: 0,
  again: 0,
  hard: 0,
  good: 0,
  easy: 0,
  xpEarned: 0
};

export function updateSessionStats(
  prev: SrsSessionStats,
  rating: SrsRating,
  earnedXp: number
): SrsSessionStats {
  return {
    ...prev,
    reviewed: prev.reviewed + 1,
    [rating]: prev[rating] + 1,
    xpEarned: prev.xpEarned + earnedXp
  };
}

export function calculateNextSessionStep(
  currentIndex: number,
  queueLength: number,
  rating: SrsRating
): {
  nextIndex: number;
  isCompleted: boolean;
  shouldReinsert: boolean;
} {
  const shouldReinsert = rating === 'again';
  const effectiveLength = queueLength + (shouldReinsert ? 1 : 0);
  const nextIndex = currentIndex + 1;
  const isCompleted = nextIndex >= effectiveLength;

  return {
    nextIndex: isCompleted ? currentIndex : nextIndex,
    isCompleted,
    shouldReinsert
  };
}

export function filterDueCards(
  dueCardIds: string[],
  isKatakana: boolean,
  kanaMap: Map<string, KanaCharacter>,
  fallbackList: KanaCharacter[]
): KanaCharacter[] {
  const activeDueIds = dueCardIds.filter(id => isKatakana ? id.startsWith('kata_') : !id.startsWith('kata_'));
  const cards = activeDueIds
    .map(id => kanaMap.get(id))
    .filter((k): k is KanaCharacter => k !== undefined);

  if (cards.length === 0) {
    return fallbackList.slice(0, 15);
  }
  return cards;
}
