import { GetCurrentSessionUseCase } from '../application/GetCurrentSessionUseCase';
import { LoginUseCase } from '../application/LoginUseCase';
import { LogoutUseCase } from '../application/LogoutUseCase';
import { RegisterUseCase } from '../application/RegisterUseCase';
import type { AuthRepository } from '../domain/AuthRepository';
import { AsyncStorageKeyValueStorage } from './AsyncStorageKeyValueStorage';
import type { KeyValueStorage } from './KeyValueStorage';
import { MockAuthRepository } from './MockAuthRepository';

/** Casos de uso del módulo `auth` listos para la capa de presentación. */
export interface AuthModule {
  repository: AuthRepository;
  login: LoginUseCase;
  register: RegisterUseCase;
  logout: LogoutUseCase;
  getCurrentSession: GetCurrentSessionUseCase;
}

/**
 * Composition root del Bounded Context `auth`.
 *
 * Por defecto usa AsyncStorage (persistente en Expo Go). En tests se puede
 * inyectar `InMemoryKeyValueStorage` sin tocar los casos de uso.
 */
export function createAuthModule(
  storage: KeyValueStorage = new AsyncStorageKeyValueStorage(),
): AuthModule {
  const repository = new MockAuthRepository(storage);

  return {
    repository,
    login: new LoginUseCase(repository),
    register: new RegisterUseCase(repository),
    logout: new LogoutUseCase(repository),
    getCurrentSession: new GetCurrentSessionUseCase(repository),
  };
}
