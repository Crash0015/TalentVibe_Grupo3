import type { BigFiveProfile } from './BigFiveProfile';
import type { TikTokRiskSignals } from './riskAssessment';

/**
 * Registro psicométrico de un creador tal como lo expone la fuente de datos
 * (en este prototipo, el mock de infraestructura).
 */
export interface CreatorPsychometricRecord {
  creatorId: string;
  /** @usuario de TikTok, siempre con prefijo @. */
  handle: string;
  displayName: string;
  profile: BigFiveProfile;
  signals: TikTokRiskSignals;
  /** Ruta local versionada de la foto (assets/avatars/...), si existe. */
  localAvatar?: string | null;
  /** URL pública original de TikTok, usada como fallback remoto. */
  avatarUrl?: string | null;
  /** ISO-8601 de la última actualización del perfil. */
  updatedAt: string;
}

/**
 * Puerto del Bounded Context `psychometric`.
 *
 * El dominio no sabe si los perfiles vienen de un mock, de una API de
 * análisis de TikTok o de una base de datos.
 */
export interface PsychometricRepository {
  findByHandle(handle: string): Promise<CreatorPsychometricRecord | null>;
  findByCreatorId(creatorId: string): Promise<CreatorPsychometricRecord | null>;
  list(): Promise<CreatorPsychometricRecord[]>;
}
