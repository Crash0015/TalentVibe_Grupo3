/**
 * Modelos del Bounded Context `discovery`.
 *
 * Sin imports de React/Expo: tipos puros, error de dominio y puerto de
 * persistencia del mazo de tarjetas.
 */

export type SwipeDirection = 'LEFT' | 'RIGHT';

/** Mismos niveles que psychometric, replicados para no acoplar contextos. */
export type DiscoveryRiskLevel = 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';

export interface DiscoveryTraits {
  innovation: number;
  selfManagement: number;
  communication: number;
  empathy: number;
  resilience: number;
}

/** Tarjeta del mazo: datos planos listos para la UI. */
export interface DiscoveryCandidate {
  creatorId: string;
  displayName: string;
  handle: string;
  affinityScore: number;
  riskLevel: DiscoveryRiskLevel;
  traits: DiscoveryTraits;
  /** Ruta local versionada de la foto (assets/avatars/...), si existe. */
  localAvatar?: string | null;
  /** URL pública original de TikTok, usada como fallback remoto. */
  avatarUrl?: string | null;
}

/** Filtros básicos del mazo. */
export interface DiscoveryFilters {
  /** Afinidad mínima (0-100). */
  minAffinity?: number;
  /** Niveles de riesgo aceptados; por defecto se excluye HIGH_RISK. */
  riskLevels?: readonly DiscoveryRiskLevel[];
  /** Búsqueda por nombre o @usuario. */
  search?: string;
}

export const DEFAULT_DISCOVERY_FILTERS: DiscoveryFilters = {
  minAffinity: 0,
  riskLevels: ['LOW_RISK', 'MEDIUM_RISK'],
  search: '',
};

/** Decisión de swipe ya registrada (se usa para no repetir tarjetas). */
export interface SwipeDecision {
  creatorId: string;
  direction: SwipeDirection;
  decidedAt: string;
}

export interface DiscoveryRepository {
  listCandidates(): Promise<DiscoveryCandidate[]>;
  listSwipes(): Promise<SwipeDecision[]>;
  saveSwipe(decision: SwipeDecision): Promise<void>;
}

export type DiscoveryErrorCode =
  | 'EMPTY_DECK'
  | 'INVALID_DIRECTION'
  | 'CANDIDATE_NOT_FOUND';

export class DiscoveryError extends Error {
  constructor(
    readonly code: DiscoveryErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'DiscoveryError';
  }
}

/** Regla pura de filtrado de tarjetas. */
export function candidateMatchesFilters(
  candidate: DiscoveryCandidate,
  filters: DiscoveryFilters = DEFAULT_DISCOVERY_FILTERS,
): boolean {
  const minAffinity = filters.minAffinity ?? 0;
  const riskLevels = filters.riskLevels ?? DEFAULT_DISCOVERY_FILTERS.riskLevels ?? [];
  const search = (filters.search ?? '').trim().toLowerCase();

  if (candidate.affinityScore < minAffinity) {
    return false;
  }

  if (!riskLevels.includes(candidate.riskLevel)) {
    return false;
  }

  if (!search) {
    return true;
  }

  return (
    candidate.displayName.toLowerCase().includes(search) ||
    candidate.handle.toLowerCase().includes(search)
  );
}
