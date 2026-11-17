import type { UserPrimitives } from '../domain/User';

/**
 * Cuenta de prueba preconfigurada.
 *
 * La contraseña vive solo en la infraestructura mock: el dominio nunca
 * conoce credenciales en texto plano.
 */
export interface MockAccount {
  user: UserPrimitives;
  password: string;
}

/** Cuentas semilla: una marca y un creador listos para Expo Go. */
export const MOCK_ACCOUNTS: readonly MockAccount[] = [
  {
    user: {
      id: 'usr_company_demo',
      name: 'Estudio Nova',
      email: 'marca@talentvibe.com',
      role: 'COMPANY',
      handleOrCompany: 'Estudio Nova S.A.S.',
    },
    password: 'marca1234',
  },
  {
    user: {
      id: 'usr_creator_demo',
      name: 'Sofía Martínez',
      email: 'creador@talentvibe.com',
      role: 'CREATOR',
      handleOrCompany: '@sofiamartinez',
    },
    password: 'creador1234',
  },
];

/** Credenciales mostradas en la pantalla de Login para pruebas. */
export const DEMO_CREDENTIALS = {
  company: {
    email: 'marca@talentvibe.com',
    password: 'marca1234',
  },
  creator: {
    email: 'creador@talentvibe.com',
    password: 'creador1234',
  },
} as const;
