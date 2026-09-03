import { createContext, useContext } from 'react';
import type {
  ActivityResult,
  ProgressionActivity,
  ProgressionService,
  ProgressionSummary
} from '../modules/progression/types';
import type { UserStats } from '../types/kana';

export interface ProgressionContextValue {
  service: ProgressionService;
  stats: Readonly<UserStats>;
  summary: ProgressionSummary;
  dueCards: string[];
  recordActivity: (activity: ProgressionActivity) => ActivityResult;
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
