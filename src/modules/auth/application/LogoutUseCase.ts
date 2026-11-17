import type { AuthRepository } from '../domain/AuthRepository';

/**
 * Caso de uso: cerrar la sesión activa.
 *
 * Elimina la sesión persistida; es idempotente (cerrar sesión dos veces
 * no produce error).
 */
export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}
