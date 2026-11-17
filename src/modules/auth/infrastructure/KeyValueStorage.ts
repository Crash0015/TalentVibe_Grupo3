/**
 * Puerto de almacenamiento clave-valor usado por la infraestructura mock.
 *
 * Permite intercambiar AsyncStorage (Expo Go / dispositivo) por memoria
 * (tests o web) sin tocar el repositorio.
 */
export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
