import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { RegisterRequest } from '../../modules/auth/application/RegisterUseCase';
import type { User } from '../../modules/auth/domain/User';
import {
  createAuthModule,
  type AuthModule,
} from '../../modules/auth/infrastructure/createAuthModule';
import { DEMO_CREDENTIALS } from '../../modules/auth/infrastructure/mockAccounts';

export interface AuthContextValue {
  /** Usuario autenticado o `null` si no hay sesión. */
  user: User | null;
  /** `true` mientras se restaura la sesión persistida al abrir la app. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegisterRequest) => Promise<User>;
  logout: () => Promise<void>;
  /** Credenciales de prueba (marca y creador) para la pantalla de Login. */
  demoCredentials: typeof DEMO_CREDENTIALS;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
  /** Permite inyectar un módulo alternativo (tests o futura API real). */
  authModule?: AuthModule;
}

/**
 * Provider de autenticación de TalentVibe.
 *
 * Conecta la capa de presentación con los casos de uso del Bounded Context
 * `auth` mediante el composition root `createAuthModule()`. Al montarse
 * restaura la sesión guardada en AsyncStorage.
 */
export function AuthProvider({ children, authModule }: AuthProviderProps) {
  const [module] = useState<AuthModule>(() => authModule ?? createAuthModule());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    module.getCurrentSession
      .execute()
      .then((session) => {
        if (isActive) {
          setUser(session);
        }
      })
      .catch(() => {
        if (isActive) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [module]);

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      const authenticated = await module.login.execute({ email, password });
      setUser(authenticated);
      return authenticated;
    },
    [module],
  );

  const register = useCallback(
    async (input: RegisterRequest): Promise<User> => {
      const registered = await module.register.execute(input);
      setUser(registered);
      return registered;
    },
    [module],
  );

  const logout = useCallback(async (): Promise<void> => {
    await module.logout.execute();
    setUser(null);
  }, [module]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      demoCredentials: DEMO_CREDENTIALS,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook de acceso al contexto de autenticación. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  }

  return context;
}

export { AuthContext };
