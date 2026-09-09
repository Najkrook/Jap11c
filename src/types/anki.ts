export interface AnkiCard {
  kanji: string;
  hiragana: string;
  romaji: string;
  meaning: string;
  source: string;
  audio?: string;
  image?: string;
}

export interface TravelItem {
  japanese: string;
  swedish: string;
  romaji?: string;
  hiragana?: string;
  english?: string;
  category?: string;
  lesson?: string;
  notes?: string;
}

export type AnkiStudyMode = 'listening' | 'reading' | 'beginner';

export type AnkiDeckMode = 'anki' | 'genki' | 'stay_with_me' | 'plastic_love' | 'words' | 'phrases' | 'bookmarks' | 'due' | 'weak';

export type AnkiReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface AnkiCardProgress {
  cardIndex: number;
  easeFactor: number; // default 2.5
  interval: number; // in days
  repetitions: number;
  nextReviewDate: number; // timestamp ms
  lastReviewedDate?: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
  consecutiveCorrect: number;
  totalReviews: number;
  totalErrors: number;
  lapses: number; // failed after learning
}

export interface AnkiChapter {
  index: number;
  title: string;
  itemCount: number;
  startIndex: number;
  endIndex: number;
  isCompleted: boolean;
  preview?: string;
}

export interface AnkiSessionStats {
  cardsReviewed: number;
  againCount: number;
  knownCount: number;
  streak: number;
  maxStreak: number;
  xpEarned: number;
}
