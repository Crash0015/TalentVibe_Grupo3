import { AuthError } from './AuthError';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Value Object Email del Bounded Context `auth`.
 *
 * Garantiza que cualquier correo que circule por el dominio esté normalizado
 * (minúsculas y sin espacios) y tenga un formato válido.
 */
export class Email {
  private constructor(private readonly address: string) {}

  static create(raw: string): Email {
    const normalized = raw.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalized)) {
      throw new AuthError('INVALID_EMAIL', `El correo "${raw}" no es válido.`);
    }

    return new Email(normalized);
  }

  get value(): string {
    return this.address;
  }

  equals(other: Email): boolean {
    return this.address === other.address;
  }

  toString(): string {
    return this.address;
  }
}
