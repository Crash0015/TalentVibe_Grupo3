import type { KeyValueStorage } from './KeyValueStorage';

/**
 * Implementación en memoria de `KeyValueStorage`.
 *
 * Útil para tests, para entornos sin AsyncStorage y como fallback seguro
 * cuando el almacenamiento nativo no está disponible.
 */
export class InMemoryKeyValueStorage implements KeyValueStorage {
  private readonly store = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
