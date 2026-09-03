import { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';

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

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthSafe = (): AuthContextValue | null => useContext(AuthContext);
