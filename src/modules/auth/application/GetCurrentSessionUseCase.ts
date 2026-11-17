import type { AuthRepository } from '../domain/AuthRepository';
import type { User } from '../domain/User';

/**
 * Caso de uso: recuperar la sesión activa al abrir la app.
 *
 * Devuelve `null` cuando no hay sesión persistida o cuando el usuario
 * asociado ya no existe (sesión huérfana).
 */
export class GetCurrentSessionUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<User | null> {
    return this.authRepository.getCurrentSession();
  }
}
