import type { BigFiveProfile } from '../domain/BigFiveProfile';
import { PsychometricAnalysis } from '../domain/PsychometricAnalysis';
import type { PsychometricRepository } from '../domain/PsychometricRepository';
import {
  buildCreatorPsychometricReport,
  type CreatorPsychometricReport,
} from './CreatorPsychometricReport';

export interface SearchCreatorsRequest {
  /** Texto libre: @usuario, nombre visible o palabras de la bio. */
  query: string;
  /** Perfil cultural de la marca para calcular afinidad en la búsqueda. */
  targetProfile?: BigFiveProfile;
}

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[áàäâã]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöôõ]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n');
}

/**
 * Caso de uso: buscar en todo el repositorio psicométrico.
 *
 * No usa el mazo de discovery, así que también devuelve perfiles ya
 * descartados o fuera de los filtros actuales.
 */
export class SearchCreatorsUseCase {
  constructor(private readonly repository: PsychometricRepository) {}

  async execute(
    request: SearchCreatorsRequest,
  ): Promise<CreatorPsychometricReport[]> {
    const query = normalizeSearchText(request.query.trim());
    const records = await this.repository.list();

    const filtered = query
      ? records.filter((record) =>
          normalizeSearchText(
            `${record.handle} ${record.displayName} ${record.bio ?? ''}`,
          ).includes(query),
        )
      : records;

    return filtered
      .map((record) =>
        buildCreatorPsychometricReport(
          record,
          PsychometricAnalysis.create({
            creatorId: record.creatorId,
            profile: record.profile,
            signals: record.signals,
          }),
          request.targetProfile ?? null,
        ),
      )
      .sort(
        (left, right) =>
          (right.affinityScore ?? 0) - (left.affinityScore ?? 0),
      );
  }
}
