import {
  DiscoveryError,
  type DiscoveryRepository,
  type SwipeDecision,
  type SwipeDirection,
} from '../domain/DiscoveryModels';

export interface SwipeCandidateRequest {
  creatorId: string;
  direction: SwipeDirection;
}

/**
 * Caso de uso: registrar un swipe.
 * LEFT = descartar · RIGHT = like (candidato a match).
 */
export class SwipeCandidateUseCase {
  constructor(private readonly repository: DiscoveryRepository) {}

  async execute(request: SwipeCandidateRequest): Promise<SwipeDecision> {
    if (request.direction !== 'LEFT' && request.direction !== 'RIGHT') {
      throw new DiscoveryError(
        'INVALID_DIRECTION',
        'La dirección del swipe debe ser LEFT o RIGHT.',
      );
    }

    const creatorId = request.creatorId.trim();

    if (!creatorId) {
      throw new DiscoveryError(
        'CANDIDATE_NOT_FOUND',
        'Debes indicar el creador que se está deslizando.',
      );
    }

    const candidates = await this.repository.listCandidates();
    const exists = candidates.some(
      (candidate) => candidate.creatorId === creatorId,
    );

    if (!exists) {
      throw new DiscoveryError(
        'CANDIDATE_NOT_FOUND',
        `No existe una tarjeta para el creador "${creatorId}".`,
      );
    }

    const decision: SwipeDecision = {
      creatorId,
      direction: request.direction,
      decidedAt: new Date().toISOString(),
    };

    await this.repository.saveSwipe(decision);
    return decision;
  }
}
