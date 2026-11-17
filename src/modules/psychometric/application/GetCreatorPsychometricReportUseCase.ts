import { PsychometricAnalysis } from '../domain/PsychometricAnalysis';
import { PsychometricError } from '../domain/PsychometricError';
import type { PsychometricRepository } from '../domain/PsychometricRepository';
import {
  buildCreatorPsychometricReport,
  type CreatorPsychometricReport,
} from './CreatorPsychometricReport';

/**
 * Caso de uso: obtener el reporte psicométrico ya guardado de un creador.
 *
 * No vuelve a analizar TikTok: trabaja con el registro persistido por el
 * repositorio y recalcula el reporte de forma determinista.
 */
export class GetCreatorPsychometricReportUseCase {
  constructor(private readonly repository: PsychometricRepository) {}

  async execute(creatorId: string): Promise<CreatorPsychometricReport> {
    const normalizedId = creatorId.trim();

    if (!normalizedId) {
      throw new PsychometricError(
        'CREATOR_NOT_FOUND',
        'Debes indicar el id del creador.',
      );
    }

    const record = await this.repository.findByCreatorId(normalizedId);

    if (!record) {
      throw new PsychometricError(
        'CREATOR_NOT_FOUND',
        `No existe un perfil psicométrico para el creador "${normalizedId}".`,
      );
    }

    const analysis = PsychometricAnalysis.create({
      creatorId: record.creatorId,
      profile: record.profile,
      signals: record.signals,
    });

    return buildCreatorPsychometricReport(record, analysis);
  }
}
