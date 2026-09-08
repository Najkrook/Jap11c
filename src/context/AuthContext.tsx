import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { AuthContext } from './authState';

const CLOUD_ENABLED_KEY = 'hiraganaskolan_cloud_enabled_v1';

const wasCloudEnabled = () => {
  try {
    return localStorage.getItem(CLOUD_ENABLED_KEY) === 'true';
  } catch {
    return false;
  }
};

const loadFirebaseAuth = async () => {
  const [{ getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut }, { getFirebaseApp }] = await Promise.all([
    import('firebase/auth'),
    import('../config/firebase')
  ]);

  return {
    auth: getAuth(getFirebaseApp()),
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cloudEnabled, setCloudEnabled] = useState(wasCloudEnabled);
  const [loading, setLoading] = useState<boolean>(cloudEnabled);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (!cloudEnabled) {
      return;
    }

    let isActive = true;
    let unsubscribe: (() => void) | undefined;

    void loadFirebaseAuth()
      .then(({ auth, onAuthStateChanged }) => {
        if (!isActive) return;
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (!isActive) return;
          setUser(currentUser);
          setLoading(false);
        });
      })
      .catch((error: unknown) => {
        console.error('Kunde inte starta molnlagring:', error);
        if (isActive) {
          setSyncError('Kunde inte starta molnlagring');
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, [cloudEnabled]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setSyncError(null);
      setLoading(true);
      const { auth, GoogleAuthProvider, signInWithPopup } = await loadFirebaseAuth();
      const googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem(CLOUD_ENABLED_KEY, 'true');
      setUser(result.user);
      setCloudEnabled(true);
    } catch (err: unknown) {
      console.error('Google Sign-in failed:', err);
      const errorMsg = err instanceof Error ? err.message : 'Inloggning med Google misslyckades';
      setSyncError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    try {
      setSyncError(null);
      const { auth, signOut } = await loadFirebaseAuth();
      await signOut(auth);
      localStorage.removeItem(CLOUD_ENABLED_KEY);
      setUser(null);
      setCloudEnabled(false);
    } catch (err: unknown) {
      console.error('Sign-out failed:', err);
      const errorMsg = err instanceof Error ? err.message : 'Utloggning misslyckades';
      setSyncError(errorMsg);
      throw err;
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isSyncing,
    lastSyncedAt,
    syncError,
    signInWithGoogle,
    signOutUser,
    setSyncing: setIsSyncing,
    setLastSyncedAt,
    setSyncError
  }), [user, loading, isSyncing, lastSyncedAt, syncError, signInWithGoogle, signOutUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
