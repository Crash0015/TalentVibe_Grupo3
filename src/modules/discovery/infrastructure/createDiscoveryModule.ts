import { GetDiscoveryDeckUseCase } from '../application/GetDiscoveryDeckUseCase';
import { SwipeCandidateUseCase } from '../application/SwipeCandidateUseCase';
import type { DiscoveryRepository } from '../domain/DiscoveryModels';
import { MockDiscoveryRepository } from './MockDiscoveryRepository';

export interface DiscoveryModule {
  repository: DiscoveryRepository;
  getDeck: GetDiscoveryDeckUseCase;
  swipe: SwipeCandidateUseCase;
}

/** Composition root del Bounded Context `discovery`. */
export function createDiscoveryModule(
  repository: DiscoveryRepository = new MockDiscoveryRepository(),
): DiscoveryModule {
  return {
    repository,
    getDeck: new GetDiscoveryDeckUseCase(repository),
    swipe: new SwipeCandidateUseCase(repository),
  };
}
