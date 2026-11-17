import type { AuthRepository } from '../domain/AuthRepository';
import { AuthError } from '../domain/AuthError';
import { Email } from '../domain/Email';
import type { User } from '../domain/User';

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Caso de uso: iniciar sesión con correo y contraseña.
 *
 * Valida y normaliza el correo con el Value Object Email antes de delegar
 * en el repositorio de autenticación.
 */
export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(request: LoginRequest): Promise<User> {
    const email = Email.create(request.email);
    const password = request.password.trim();

    if (!password) {
      throw new AuthError('INVALID_CREDENTIALS', 'La contraseña es obligatoria.');
    }

    return this.authRepository.login({ email: email.value, password });
  }
}
