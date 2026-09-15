import { createContext, useContext } from 'react';
import type {
  ActivityResult,
  ProgressionActivity,
  ProgressionService,
  ProgressionSummary
} from '../modules/progression/types';
import type { UserStats, SrsRating } from '../types/kana';
import type { CustomFlashcard } from '../types/anki';

export interface ProgressionContextValue {
  service: ProgressionService;
  stats: Readonly<UserStats>;
  summary: ProgressionSummary;
  dueCards: string[];
  dueAnkiCards: number[];
  dueGenkiCards: number[];
  weakAnkiCards: number[];
  dueCustomCards: string[];
  recordActivity: (activity: ProgressionActivity) => ActivityResult;
  toggleGrammarChapter: (chapterId: string, completed?: boolean) => ActivityResult;
  toggleAnkiBookmark: (cardIndex: number) => ActivityResult;
  toggleStudyGuideTask: (taskId: string) => ActivityResult;
  toggleIntensiveTask: (taskId: string) => ActivityResult;
  addCustomCard: (card: Omit<CustomFlashcard, 'id' | 'createdAt'>) => ActivityResult;
  deleteCustomCard: (cardId: string) => ActivityResult;
  reviewCustomCard: (cardId: string, rating: SrsRating) => ActivityResult;
  resetStats: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  syncNow: () => Promise<boolean>;
}

export const ProgressionContext = createContext<ProgressionContextValue | null>(null);

export const useProgression = (): ProgressionContextValue => {
  const context = useContext(ProgressionContext);
  if (!context) {
    throw new Error('useProgression must be used within a ProgressionProvider');
  }
  return context;
};
