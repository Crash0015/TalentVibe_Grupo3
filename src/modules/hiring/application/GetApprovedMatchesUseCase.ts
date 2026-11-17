import type { HiringRepository, Match } from '../domain/HiringModels';

/**
 * Caso de uso: listar los creadores aprobados (matches),
 * ordenados de mayor a menor afinidad.
 */
export class GetApprovedMatchesUseCase {
  constructor(private readonly repository: HiringRepository) {}

  async execute(): Promise<Match[]> {
    const matches = await this.repository.listMatches();

    return matches.sort((a, b) => b.affinityScore - a.affinityScore);
  }
}
