import type { AuthRepository } from '../domain/AuthRepository';
import { AuthError } from '../domain/AuthError';
import { Email } from '../domain/Email';
import { USER_ROLES, type User, type UserRole } from '../domain/User';

/** Longitud mínima de contraseña para el repositorio mock de Expo Go. */
export const MIN_PASSWORD_LENGTH = 6;

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  handleOrCompany: string;
}

/**
 * Caso de uso: registrar una cuenta nueva de Marca o Creador.
 *
 * Reglas: correo válido y único, contraseña de al menos 6 caracteres,
 * nombre y usuario/empresa no vacíos, rol dentro de los permitidos.
 */
export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(request: RegisterRequest): Promise<User> {
    const email = Email.create(request.email);
    const name = request.name.trim();
    const handleOrCompany = request.handleOrCompany.trim();
    const password = request.password.trim();

    if (!name) {
      throw new AuthError('INVALID_USER', 'El nombre es obligatorio.');
    }

    if (!handleOrCompany) {
      throw new AuthError(
        'INVALID_USER',
        'El usuario de TikTok o nombre de la empresa es obligatorio.',
      );
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      );
    }

    if (!USER_ROLES.includes(request.role)) {
      throw new AuthError('INVALID_USER', 'El rol seleccionado no es válido.');
    }

    return this.authRepository.register({
      name,
      email: email.value,
      password,
      role: request.role,
      handleOrCompany,
    });
  }
}
