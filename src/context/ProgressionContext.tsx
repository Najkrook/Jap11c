import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import type { 
  ProgressionService,
  ProgressionActivity, 
  ActivityResult,
  ProgressionSummary
} from '../modules/progression/types';
import type { UserStats } from '../types/kana';
import { ProgressionServiceImpl } from '../modules/progression/ProgressionServiceImpl';
import { LocalStorageAdapter } from '../modules/progression/storage/LocalStorageAdapter';
import { useAudio } from '../modules/audio';
import { fireConfetti, fireSuperCelebration } from '../components/common/Confetti';
import { useAuthSafe } from './authState';
import { mergeUserStats } from '../modules/progression/sync/mergeUserStats';
import { ProgressionContext } from './progressionState';

const loadCloudSync = () => import('../modules/progression/sync/firestoreSync');

export const ProgressionProvider: React.FC<{
  children: React.ReactNode;
  serviceOverride?: ProgressionService;
}> = ({ children, serviceOverride }) => {
  const auth = useAuthSafe();
  const { playSfx } = useAudio();
  const service = useMemo(() => {
    return serviceOverride || new ProgressionServiceImpl(new LocalStorageAdapter());
  }, [serviceOverride]);

  const [stats, setStats] = useState<Readonly<UserStats>>(() => service.getStats());
  const [summary, setSummary] = useState<ProgressionSummary>(() => service.getSummary());
  const [dueCards, setDueCards] = useState<string[]>(() => service.getDueCards());
  const [dueAnkiCards, setDueAnkiCards] = useState<number[]>(() => service.getDueAnkiCards());
  const [weakAnkiCards, setWeakAnkiCards] = useState<number[]>(() => service.getWeakAnkiCards());
  
  const authRef = useRef(auth);
  useEffect(() => {
    authRef.current = auth;
  });

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentUserIdRef = useRef<string | null>(null);
  const isSyncInProgressRef = useRef(false);

  // Keep state synchronized with service changes
  useEffect(() => {
    const unsubscribe = service.subscribe((newStats) => {
      setStats(newStats);
      setSummary(service.getSummary());
      setDueCards(service.getDueCards());
      setDueAnkiCards(service.getDueAnkiCards());
      setWeakAnkiCards(service.getWeakAnkiCards());
    });
    return unsubscribe;
  }, [service]);

  const executeFullSync = useCallback(async (
    userId: string,
    userProfile?: { displayName?: string | null; email?: string | null; photoURL?: string | null }
  ): Promise<boolean> => {
    if (isSyncInProgressRef.current) {
      return false;
    }
    isSyncInProgressRef.current = true;
    authRef.current?.setSyncing(true);

    try {
      const { fetchUserStatsFromFirestore, saveUserStatsToFirestore } = await loadCloudSync();
      const cloudStats = await fetchUserStatsFromFirestore(userId);
      const currentLocal = service.getStats();

      let targetStats: UserStats;
      if (cloudStats) {
        targetStats = mergeUserStats(currentLocal, cloudStats);
        service.importData(JSON.stringify(targetStats));
      } else {
        targetStats = currentLocal;
      }

      const success = await saveUserStatsToFirestore(userId, targetStats, userProfile);
      if (success) {
        authRef.current?.setLastSyncedAt(new Date());
        authRef.current?.setSyncError(null);
        return true;
      } else {
        authRef.current?.setSyncError('Kunde inte spara framsteg till molnet');
        return false;
      }
    } catch (err: unknown) {
      console.error('Cloud sync error:', err);
      authRef.current?.setSyncError(err instanceof Error ? err.message : 'Kunde inte synka med molnet');
      return false;
    } finally {
      isSyncInProgressRef.current = false;
      authRef.current?.setSyncing(false);
    }
  }, [service]);

  // Synchronize with Firestore when user logs in or switches user
  const loggedInUid = auth?.user?.uid || null;
  useEffect(() => {
    if (!loggedInUid) {
      currentUserIdRef.current = null;
      return;
    }

    if (loggedInUid === currentUserIdRef.current) {
      return;
    }
    currentUserIdRef.current = loggedInUid;

    const currentUser = authRef.current?.user;
    if (currentUser) {
      void executeFullSync(currentUser.uid, {
        displayName: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL
      });
    }
  }, [loggedInUid, executeFullSync]);

  // Synchronize with Firestore on tab focus / visibility change (multi-device)
  useEffect(() => {
    let lastCheckTime = Date.now();

    const handleVisibilityOrFocus = () => {
      const currentUser = authRef.current?.user;
      if (!currentUser) return;

      const now = Date.now();
      // Throttle to at most once every 30 seconds
      if (now - lastCheckTime < 30000) return;
      lastCheckTime = now;

      if (document.visibilityState === 'visible' && !isSyncInProgressRef.current) {
        void executeFullSync(currentUser.uid, {
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [executeFullSync]);

  // Save to Firestore helper (debounced on local user activity)
  const triggerCloudSave = useCallback((updatedStats: UserStats) => {
    const user = authRef.current?.user;
    if (!user) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const currentUser = authRef.current?.user;
      if (!currentUser) return;

      if (isSyncInProgressRef.current) return;

      try {
        authRef.current?.setSyncing(true);
        const { saveUserStatsToFirestore } = await loadCloudSync();
        const success = await saveUserStatsToFirestore(currentUser.uid, updatedStats, {
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL
        });
        if (success) {
          authRef.current?.setLastSyncedAt(new Date());
          authRef.current?.setSyncError(null);
        } else {
          authRef.current?.setSyncError('Kunde inte spara framsteg till molnet');
        }
      } catch (e: unknown) {
        console.error('Cloud save failed:', e);
        authRef.current?.setSyncError('Kunde inte spara framsteg till molnet');
      } finally {
        authRef.current?.setSyncing(false);
      }
    }, 1200);
  }, []);

  const recordActivity = useCallback((activity: ProgressionActivity): ActivityResult => {
    const result = service.recordActivity(activity);

    // Global sound feedback and celebrations
    if (result.leveledUp) {
      playSfx('levelUp');
      fireConfetti();
    }
    if (result.newlyUnlockedBadges.length > 0) {
      playSfx('levelUp');
      fireSuperCelebration();
    }

    // Trigger cloud persistence if authenticated
    triggerCloudSave(result.currentStats);

    return result;
  }, [service, playSfx, triggerCloudSave]);

  const syncNow = useCallback(async (): Promise<boolean> => {
    const currentUser = authRef.current?.user;
    if (!currentUser) return false;

    return executeFullSync(currentUser.uid, {
      displayName: currentUser.displayName,
      email: currentUser.email,
      photoURL: currentUser.photoURL
    });
  }, [executeFullSync]);

  const resetStats = useCallback(() => {
    service.resetStats();
    if (authRef.current?.user) {
      triggerCloudSave(service.getStats());
    }
  }, [service, triggerCloudSave]);

  const exportData = useCallback(() => {
    return service.exportData();
  }, [service]);

  const importData = useCallback((jsonData: string) => {
    const success = service.importData(jsonData);
    if (success && authRef.current?.user) {
      triggerCloudSave(service.getStats());
    }
    return success;
  }, [service, triggerCloudSave]);

  const contextValue = useMemo(() => ({
    service,
    stats,
    summary,
    dueCards,
    dueAnkiCards,
    weakAnkiCards,
    recordActivity,
    resetStats,
    exportData,
    importData,
    syncNow
  }), [service, stats, summary, dueCards, dueAnkiCards, weakAnkiCards, recordActivity, resetStats, exportData, importData, syncNow]);

  return (
    <ProgressionContext.Provider value={contextValue}>
      {children}
    </ProgressionContext.Provider>
  );
};
