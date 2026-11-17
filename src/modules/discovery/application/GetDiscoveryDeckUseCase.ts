import {
  candidateMatchesFilters,
  DEFAULT_DISCOVERY_FILTERS,
  type DiscoveryCandidate,
  type DiscoveryFilters,
  type DiscoveryRepository,
} from '../domain/DiscoveryModels';

/**
 * Caso de uso: construir el mazo filtrado y ordenado por afinidad.
 * Excluye a los creadores que ya recibieron un swipe.
 */
export class GetDiscoveryDeckUseCase {
  constructor(private readonly repository: DiscoveryRepository) {}

  async execute(
    filters: DiscoveryFilters = DEFAULT_DISCOVERY_FILTERS,
  ): Promise<DiscoveryCandidate[]> {
    const [candidates, swipes] = await Promise.all([
      this.repository.listCandidates(),
      this.repository.listSwipes(),
    ]);

    const swipedIds = new Set(swipes.map((swipe) => swipe.creatorId));

    return candidates
      .filter(
        (candidate) =>
          !swipedIds.has(candidate.creatorId) &&
          candidateMatchesFilters(candidate, filters),
      )
      .sort((a, b) => b.affinityScore - a.affinityScore);
  }
}
