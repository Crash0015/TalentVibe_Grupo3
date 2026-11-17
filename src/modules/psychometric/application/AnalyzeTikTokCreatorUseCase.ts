import type { BigFiveProfile } from '../domain/BigFiveProfile';
import { PsychometricAnalysis } from '../domain/PsychometricAnalysis';
import { PsychometricError } from '../domain/PsychometricError';
import type { PsychometricRepository } from '../domain/PsychometricRepository';
import {
  buildCreatorPsychometricReport,
  type CreatorPsychometricReport,
} from './CreatorPsychometricReport';

export interface AnalyzeTikTokCreatorRequest {
  /** @usuario de TikTok; se acepta con o sin '@'. */
  handle: string;
  /** Perfil cultural de la marca para calcular la afinidad. */
  targetProfile?: BigFiveProfile;
}

/** Normaliza el handle para que sea insensible a mayúsculas y al '@'. */
export function normalizeTikTokHandle(rawHandle: string): string {
  return rawHandle.trim().replace(/^@+/, '').toLowerCase();
}

/**
 * Caso de uso: analizar el perfil Big Five de un creador de TikTok.
 *
 * Recupera el registro del creador, construye la entidad
 * `PsychometricAnalysis` (que calcula el riesgo con reglas puras) y devuelve
 * un reporte plano con la afinidad opcional frente al perfil de la marca.
 */
export class AnalyzeTikTokCreatorUseCase {
  constructor(private readonly repository: PsychometricRepository) {}

  async execute(
    request: AnalyzeTikTokCreatorRequest,
  ): Promise<CreatorPsychometricReport> {
    const handle = normalizeTikTokHandle(request.handle);

    if (!handle) {
      throw new PsychometricError(
        'INVALID_HANDLE',
        'Debes indicar el usuario de TikTok del creador.',
      );
    }

    const record = await this.repository.findByHandle(handle);

    if (!record) {
      throw new PsychometricError(
        'CREATOR_NOT_FOUND',
        `No existe un perfil psicométrico para @${handle}.`,
      );
    }

    const analysis = PsychometricAnalysis.create({
      creatorId: record.creatorId,
      profile: record.profile,
      signals: record.signals,
    });

    return buildCreatorPsychometricReport(
      record,
      analysis,
      request.targetProfile ?? null,
    );
  }
}
