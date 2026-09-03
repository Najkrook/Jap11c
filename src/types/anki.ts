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
}

export type AnkiDeckMode = 'anki' | 'words' | 'phrases';

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
