import type { StorageAdapter } from './StorageAdapter';

export class InMemoryStorageAdapter implements StorageAdapter {
  private store = new Map<string, string>();

  constructor(initialData?: Record<string, string>) {
    if (initialData) {
      Object.entries(initialData).forEach(([k, v]) => this.store.set(k, v));
    }
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
