/**
 * Error de dominio del Bounded Context `psychometric`.
 *
 * Sin dependencias de React, Expo ni infraestructura.
 */

export type PsychometricErrorCode =
  | 'INVALID_PROFILE'
  | 'INVALID_SIGNALS'
  | 'INVALID_ANALYSIS'
  | 'INVALID_HANDLE'
  | 'CREATOR_NOT_FOUND';

export class PsychometricError extends Error {
  constructor(
    readonly code: PsychometricErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'PsychometricError';
  }
}
