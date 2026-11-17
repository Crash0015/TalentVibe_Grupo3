import type { User, UserRole } from './User';

/** Credenciales para iniciar sesión. */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Datos necesarios para registrar una cuenta (Marca o Creador). */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  handleOrCompany: string;
}

/**
 * Puerto de persistencia de autenticación.
 *
 * El dominio solo declara el contrato; `infrastructure/` provee la
 * implementación (mock con AsyncStorage para Expo Go).
 */
export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
  register(data: RegisterData): Promise<User>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<User | null>;
}
