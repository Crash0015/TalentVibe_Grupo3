import type {
  DiscoveryCandidate,
  SwipeDirection,
} from './DiscoveryModels';
import { DiscoveryError } from './DiscoveryModels';

export interface SwipeResult {
  direction: SwipeDirection;
  candidate: DiscoveryCandidate;
  remaining: number;
}

/**
 * Mazo de tarjetas deslizables.
 *
 * Solo gestiona el cursor del mazo (izquierda = descartar, derecha = like).
 * La persistencia de cada swipe vive en los casos de uso.
 */
export class SwipeDeck {
  private readonly candidates: DiscoveryCandidate[];
  private cursor = 0;

  constructor(candidates: readonly DiscoveryCandidate[]) {
    this.candidates = candidates.map((candidate) => ({ ...candidate }));
  }

  get total(): number {
    return this.candidates.length;
  }

  get remaining(): number {
    return Math.max(0, this.candidates.length - this.cursor);
  }

  get hasMore(): boolean {
    return this.remaining > 0;
  }

  get current(): DiscoveryCandidate | null {
    return this.candidates[this.cursor] ?? null;
  }

  /** Avanza el mazo y devuelve la tarjeta descartada o aprobada. */
  swipe(direction: SwipeDirection): SwipeResult {
    const candidate = this.current;

    if (!candidate) {
      throw new DiscoveryError('EMPTY_DECK', 'No quedan tarjetas por deslizar.');
    }

    if (direction !== 'LEFT' && direction !== 'RIGHT') {
      throw new DiscoveryError(
        'INVALID_DIRECTION',
        'La dirección del swipe debe ser LEFT o RIGHT.',
      );
    }

    this.cursor += 1;

    return { direction, candidate, remaining: this.remaining };
  }

  reset(): void {
    this.cursor = 0;
  }
}
