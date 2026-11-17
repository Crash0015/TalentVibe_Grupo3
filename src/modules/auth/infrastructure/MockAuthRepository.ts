import { AuthError } from '../domain/AuthError';
import type {
  AuthRepository,
  LoginCredentials,
  RegisterData,
} from '../domain/AuthRepository';
import { User, type UserPrimitives, type UserRole } from '../domain/User';
import type { KeyValueStorage } from './KeyValueStorage';
import { MOCK_ACCOUNTS } from './mockAccounts';

const USERS_KEY = '@talentvibe/auth/users';
const SESSION_KEY = '@talentvibe/auth/session';

/** Usuario persistido por el mock: primitivas + contraseña de prueba. */
interface StoredUser extends UserPrimitives {
  password: string;
}

interface StoredSession {
  userId: string;
  issuedAt: string;
}

/**
 * Repositorio mock de autenticación para Expo Go.
 *
 * - Siembra dos cuentas de prueba (marca y creador) la primera vez.
 * - Persiste usuarios registrados y la sesión activa en AsyncStorage.
 * - No sustituye a un backend real: las contraseñas se guardan en claro
 *   a propósito, porque este adaptador es solo para el prototipo.
 */
export class MockAuthRepository implements AuthRepository {
  private seeded = false;

  constructor(private readonly storage: KeyValueStorage) {}

  async login(credentials: LoginCredentials): Promise<User> {
    await this.ensureSeeded();

    const users = await this.readUsers();
    const email = credentials.email.trim().toLowerCase();
    const account = users.find((user) => user.email.toLowerCase() === email);

    if (!account || account.password !== credentials.password) {
      throw new AuthError('INVALID_CREDENTIALS', 'Correo o contraseña incorrectos.');
    }

    await this.writeSession(account.id);
    return MockAuthRepository.toUser(account);
  }

  async register(data: RegisterData): Promise<User> {
    await this.ensureSeeded();

    const users = await this.readUsers();
    const email = data.email.trim().toLowerCase();

    if (users.some((user) => user.email.toLowerCase() === email)) {
      throw new AuthError(
        'EMAIL_ALREADY_REGISTERED',
        'Ese correo ya está registrado. Inicia sesión o usa otro correo.',
      );
    }

    const newAccount: StoredUser = {
      id: MockAuthRepository.createId(data.role),
      name: data.name.trim(),
      email,
      role: data.role,
      handleOrCompany: data.handleOrCompany.trim(),
      password: data.password,
    };

    await this.storage.setItem(USERS_KEY, JSON.stringify([...users, newAccount]));
    await this.writeSession(newAccount.id);

    return MockAuthRepository.toUser(newAccount);
  }

  async logout(): Promise<void> {
    await this.storage.removeItem(SESSION_KEY);
  }

  async getCurrentSession(): Promise<User | null> {
    const rawSession = await this.storage.getItem(SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    const session = MockAuthRepository.parse<StoredSession>(rawSession);

    if (!session) {
      await this.logout();
      return null;
    }

    const users = await this.readUsers();
    const account = users.find((user) => user.id === session.userId);

    if (!account) {
      await this.logout();
      return null;
    }

    return MockAuthRepository.toUser(account);
  }

  private async ensureSeeded(): Promise<void> {
    if (this.seeded) {
      return;
    }

    const rawUsers = await this.storage.getItem(USERS_KEY);

    if (!rawUsers) {
      const seed: StoredUser[] = MOCK_ACCOUNTS.map((account) => ({
        ...account.user,
        password: account.password,
      }));

      await this.storage.setItem(USERS_KEY, JSON.stringify(seed));
    }

    this.seeded = true;
  }

  private async readUsers(): Promise<StoredUser[]> {
    const rawUsers = await this.storage.getItem(USERS_KEY);

    if (!rawUsers) {
      return [];
    }

    return MockAuthRepository.parse<StoredUser[]>(rawUsers) ?? [];
  }

  private async writeSession(userId: string): Promise<void> {
    const session: StoredSession = {
      userId,
      issuedAt: new Date().toISOString(),
    };

    await this.storage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  private static toUser(account: StoredUser): User {
    return User.fromPrimitives({
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      handleOrCompany: account.handleOrCompany,
    });
  }

  private static createId(role: UserRole): string {
    const suffix = Math.random().toString(36).slice(2, 8);
    return `usr_${role.toLowerCase()}_${Date.now().toString(36)}_${suffix}`;
  }

  private static parse<T>(raw: string): T | null {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
}
