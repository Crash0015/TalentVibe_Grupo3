/**
 * Error de dominio del Bounded Context `auth`.
 *
 * Vive en `domain/` y no debe depender de React, Expo ni de ninguna librería
 * de infraestructura: es un contrato puro de negocio.
 */

export type AuthErrorCode =
  | 'INVALID_EMAIL'
  | 'INVALID_USER'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_REGISTERED';

export class AuthError extends Error {
  constructor(
    readonly code: AuthErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
