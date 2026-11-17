import AsyncStorage from '@react-native-async-storage/async-storage';

import type { KeyValueStorage } from './KeyValueStorage';

/**
 * Implementación de `KeyValueStorage` sobre AsyncStorage.
 *
 * Funciona en Expo Go; en web AsyncStorage cae automáticamente a
 * localStorage. Es la persistencia por defecto de la app.
 */
export class AsyncStorageKeyValueStorage implements KeyValueStorage {
  getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }

  setItem(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  }

  removeItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }
}
