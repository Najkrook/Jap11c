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
  
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentUserIdRef = useRef<string | null>(null);

  // Keep state synchronized with service changes
  useEffect(() => {
    const unsubscribe = service.subscribe((newStats) => {
      setStats(newStats);
      setSummary(service.getSummary());
      setDueCards(service.getDueCards());
    });
    return unsubscribe;
  }, [service]);

  // Synchronize with Firestore when user logs in
  useEffect(() => {
    const currentUser = auth?.user;
    const uid = currentUser?.uid || null;

    if (uid === currentUserIdRef.current) {
      return;
    }
    currentUserIdRef.current = uid;

    if (!currentUser || !auth) {
      return;
    }

    let isMounted = true;

    async function initialSync() {
      if (!currentUser || !auth) return;
      try {
        auth.setSyncing(true);
        const { fetchUserStatsFromFirestore, saveUserStatsToFirestore } = await loadCloudSync();
        const cloudStats = await fetchUserStatsFromFirestore(currentUser.uid);
        
        if (!isMounted) return;

        if (cloudStats) {
          // Merge local and cloud progress
          const currentLocal = service.getStats();
          const merged = mergeUserStats(currentLocal, cloudStats);
          service.importData(JSON.stringify(merged));
          await saveUserStatsToFirestore(currentUser.uid, merged, {
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL
          });
        } else {
          // Upload local stats to new cloud document
          await saveUserStatsToFirestore(currentUser.uid, service.getStats(), {
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL
          });
        }

        if (isMounted) {
          auth.setLastSyncedAt(new Date());
          auth.setSyncError(null);
        }
      } catch (err: unknown) {
        console.error('Initial sync error:', err);
        if (isMounted) {
          auth.setSyncError(err instanceof Error ? err.message : 'Kunde inte synka med molnet');
        }
      } finally {
        if (isMounted) {
          auth.setSyncing(false);
        }
      }
    }

    initialSync();

    return () => {
      isMounted = false;
    };
  }, [auth?.user, auth, service]);

  // Save to Firestore helper
  const triggerCloudSave = useCallback((updatedStats: UserStats) => {
    if (!auth?.user) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      if (!auth?.user) return;
      try {
        auth.setSyncing(true);
        const { saveUserStatsToFirestore } = await loadCloudSync();
        const success = await saveUserStatsToFirestore(auth.user.uid, updatedStats, {
          displayName: auth.user.displayName,
          email: auth.user.email,
          photoURL: auth.user.photoURL
        });
        if (success) {
          auth.setLastSyncedAt(new Date());
          auth.setSyncError(null);
        }
      } catch (e: unknown) {
        console.error('Cloud save failed:', e);
        auth.setSyncError('Kunde inte spara framsteg till molnet');
      } finally {
        auth.setSyncing(false);
      }
    }, 1000);
  }, [auth]);

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
    if (!auth?.user) return false;
    try {
      auth.setSyncing(true);
      const { fetchUserStatsFromFirestore, saveUserStatsToFirestore } = await loadCloudSync();
      const cloudStats = await fetchUserStatsFromFirestore(auth.user.uid);
      let targetStats = service.getStats();
      if (cloudStats) {
        targetStats = mergeUserStats(targetStats, cloudStats);
        service.importData(JSON.stringify(targetStats));
      }
      const success = await saveUserStatsToFirestore(auth.user.uid, targetStats, {
        displayName: auth.user.displayName,
        email: auth.user.email,
        photoURL: auth.user.photoURL
      });
      if (success) {
        auth.setLastSyncedAt(new Date());
        auth.setSyncError(null);
      }
      return success;
    } catch (e: unknown) {
      console.error('Manual sync failed:', e);
      auth.setSyncError('Manuell synkning misslyckades');
      return false;
    } finally {
      auth.setSyncing(false);
    }
  }, [auth, service]);

  const resetStats = useCallback(() => {
    service.resetStats();
    if (auth?.user) {
      triggerCloudSave(service.getStats());
    }
  }, [service, auth?.user, triggerCloudSave]);

  const exportData = useCallback(() => {
    return service.exportData();
  }, [service]);

  const importData = useCallback((jsonData: string) => {
    const success = service.importData(jsonData);
    if (success && auth?.user) {
      triggerCloudSave(service.getStats());
    }
    return success;
  }, [service, auth?.user, triggerCloudSave]);

  const contextValue = useMemo(() => ({
    service,
    stats,
    summary,
    dueCards,
    recordActivity,
    resetStats,
    exportData,
    importData,
    syncNow
  }), [service, stats, summary, dueCards, recordActivity, resetStats, exportData, importData, syncNow]);

  return (
    <ProgressionContext.Provider value={contextValue}>
      {children}
    </ProgressionContext.Provider>
  );
};
