import { PsychometricAnalysis } from '../../psychometric/domain/PsychometricAnalysis';
import {
  MOCK_CREATOR_PROFILES,
  SAMPLE_BRAND_CULTURE_PROFILE,
} from '../../psychometric/infrastructure/mockCreatorProfiles';
import type {
  DiscoveryCandidate,
  DiscoveryRepository,
  SwipeDecision,
} from '../domain/DiscoveryModels';

/**
 * Reutiliza los perfiles mock de `psychometric` y calcula afinidad/riesgo
 * con las reglas puras del dominio, sin duplicar datos.
 */
export function buildDiscoveryCandidates(): DiscoveryCandidate[] {
  return MOCK_CREATOR_PROFILES.map((record) => {
    const analysis = PsychometricAnalysis.create({
      creatorId: record.creatorId,
      profile: record.profile,
      signals: record.signals,
    });

    return {
      creatorId: record.creatorId,
      displayName: record.displayName,
      handle: record.handle,
      affinityScore: analysis.calculateAffinity(SAMPLE_BRAND_CULTURE_PROFILE),
      riskLevel: analysis.riskLevel,
      traits: analysis.profile.toPrimitives(),
    };
  });
}

/** Repositorio mock en memoria para Expo Go. */
export class MockDiscoveryRepository implements DiscoveryRepository {
  private readonly candidates: DiscoveryCandidate[];
  private readonly swipes: SwipeDecision[] = [];

  constructor(candidates: readonly DiscoveryCandidate[] = buildDiscoveryCandidates()) {
    this.candidates = candidates.map((candidate) => ({
      ...candidate,
      traits: { ...candidate.traits },
    }));
  }

  async listCandidates(): Promise<DiscoveryCandidate[]> {
    return this.candidates.map((candidate) => ({
      ...candidate,
      traits: { ...candidate.traits },
    }));
  }

  async listSwipes(): Promise<SwipeDecision[]> {
    return [...this.swipes];
  }

  async saveSwipe(decision: SwipeDecision): Promise<void> {
    this.swipes.push(decision);
  }
}
