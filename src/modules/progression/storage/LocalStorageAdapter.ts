import type { StorageAdapter } from './StorageAdapter';

export const LEGACY_STORAGE_KEY = 'lundkana_user_stats_v1';
export const CURRENT_STORAGE_KEY = 'hiraganaskolan_user_stats_v2';

export class LocalStorageAdapter implements StorageAdapter {
  private key: string;

  constructor(key: string = CURRENT_STORAGE_KEY) {
    this.key = key;
    this.migrateLegacyData();
  }

  private migrateLegacyData(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const currentData = localStorage.getItem(this.key);
      if (!currentData) {
        const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyData) {
          // Automatic seamless migration from legacy v1 to v2
          localStorage.setItem(this.key, legacyData);
          console.info('[Progression] Successfully migrated user stats from legacy key to v2');
        }
      }
    } catch (err) {
      console.warn('[Progression] Migration check encountered an error:', err);
    }
  }

  getItem(key: string = this.key): string | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string = this.key, value: string): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.error('[Progression] Failed to save stats to localStorage:', err);
    }
  }

  removeItem(key: string = this.key): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error('[Progression] Failed to remove stats from localStorage:', err);
    }
  }
}
