import type { SrsRating } from '../../types/kana';
export type { SrsRating };

export type DeckId = 'kana' | 'anki' | 'genki' | 'custom' | 'song' | 'travel';

export interface CardRef {
  deckId: DeckId;
  cardId: string;
}

export type SrsItemStatus = 'new' | 'learning' | 'review' | 'mastered';

export interface SrsItemProgress {
  cardRef: CardRef;
  easeFactor: number;
  interval: number; // Interval in days (supports fractional days, e.g. 10m = 10 / 1440)
  repetitions: number;
  nextReviewDate: number; // Timestamp ms
  lastReviewedDate?: number;
  status: SrsItemStatus;
  consecutiveCorrect: number;
  totalReviews: number;
  totalErrors: number;
  lapses: number;
}

export interface SrsSessionStats {
  reviewed: number;
  again: number;
  hard: number;
  good: number;
  easy: number;
  xpEarned: number;
}

export interface SrsIntervalPreview {
  again: { days: number; label: string };
  hard: { days: number; label: string };
  good: { days: number; label: string };
  easy: { days: number; label: string };
}

export function serializeCardRef(ref: CardRef): string {
  return `${ref.deckId}:${ref.cardId}`;
}

export function parseCardRef(key: string): CardRef {
  const colonIndex = key.indexOf(':');
  if (colonIndex === -1) {
    // Default fallback to kana for legacy keys like 'a', 'kata_ka'
    const deckId = key.startsWith('kata_') ? 'kana' : 'kana';
    return { deckId, cardId: key };
  }
  const deckId = key.slice(0, colonIndex) as DeckId;
  const cardId = key.slice(colonIndex + 1);
  return { deckId, cardId };
}