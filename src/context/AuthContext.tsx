import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  type User 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  syncError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  setSyncing: (syncing: boolean) => void;
  setLastSyncedAt: (date: Date) => void;
  setSyncError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setSyncError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error('Google Sign-in failed:', err);
      const errorMsg = err instanceof Error ? err.message : 'Inloggning med Google misslyckades';
      setSyncError(errorMsg);
      throw err;
    }
  }, []);

  const signOutUser = useCallback(async () => {
    try {
      setSyncError(null);
      await signOut(auth);
    } catch (err: unknown) {
      console.error('Sign-out failed:', err);
      const errorMsg = err instanceof Error ? err.message : 'Utloggning misslyckades';
      setSyncError(errorMsg);
      throw err;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthSafe = (): AuthContextValue | null => {
  return useContext(AuthContext);
};
