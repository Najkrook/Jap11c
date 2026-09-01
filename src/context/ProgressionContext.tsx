import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { 
  ProgressionService, 
  ProgressionActivity, 
  ActivityResult, 
  ProgressionSummary 
} from '../modules/progression/types';
import type { UserStats } from '../types/kana';
import { ProgressionServiceImpl } from '../modules/progression/ProgressionServiceImpl';
import { LocalStorageAdapter } from '../modules/progression/storage/LocalStorageAdapter';
import { sfx } from '../utils/audio';
import { fireConfetti, fireSuperCelebration } from '../components/common/Confetti';

interface ProgressionContextValue {
  service: ProgressionService;
  stats: Readonly<UserStats>;
  summary: ProgressionSummary;
  dueCards: string[];
  recordActivity: (activity: ProgressionActivity) => ActivityResult;
  resetStats: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const ProgressionContext = createContext<ProgressionContextValue | null>(null);

export const ProgressionProvider: React.FC<{
  children: React.ReactNode;
  serviceOverride?: ProgressionService;
}> = ({ children, serviceOverride }) => {
  const service = useMemo(() => {
    return serviceOverride || new ProgressionServiceImpl(new LocalStorageAdapter());
  }, [serviceOverride]);

  const [stats, setStats] = useState<Readonly<UserStats>>(() => service.getStats());
  const [summary, setSummary] = useState<ProgressionSummary>(() => service.getSummary());
  const [dueCards, setDueCards] = useState<string[]>(() => service.getDueCards());

  useEffect(() => {
    const unsubscribe = service.subscribe((newStats) => {
      setStats(newStats);
      setSummary(service.getSummary());
      setDueCards(service.getDueCards());
    });
    return unsubscribe;
  }, [service]);

  const recordActivity = (activity: ProgressionActivity): ActivityResult => {
    const result = service.recordActivity(activity);

    // Global sound feedback and celebrations
    if (result.leveledUp) {
      sfx.playLevelUp();
      fireConfetti();
    }
    if (result.newlyUnlockedBadges.length > 0) {
      sfx.playLevelUp();
      fireSuperCelebration();
    }

    return result;
  };

  const resetStats = () => {
    service.resetStats();
  };

  const exportData = () => {
    return service.exportData();
  };

  const importData = (jsonData: string) => {
    return service.importData(jsonData);
  };

  return (
    <ProgressionContext.Provider
      value={{
        service,
        stats,
        summary,
        dueCards,
        recordActivity,
        resetStats,
        exportData,
        importData
      }}
    >
      {children}
    </ProgressionContext.Provider>
  );
};

export const useProgression = (): ProgressionContextValue => {
  const context = useContext(ProgressionContext);
  if (!context) {
    throw new Error('useProgression must be used within a ProgressionProvider');
  }
  return context;
};
