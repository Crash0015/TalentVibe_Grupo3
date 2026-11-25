import { PsychometricAnalysis } from '../../psychometric/domain/PsychometricAnalysis';
import type { CreatorPsychometricRecord } from '../../psychometric/domain/PsychometricRepository';
import { SAMPLE_BRAND_CULTURE_PROFILE } from '../../psychometric/infrastructure/mockCreatorProfiles';
import { SCRAPED_CREATOR_RECORDS } from '../../psychometric/infrastructure/tiktokHeuristics';
import type {
  DiscoveryCandidate,
  DiscoveryRepository,
  SwipeDecision,
} from '../domain/DiscoveryModels';

/**
 * Construye el mazo desde el mismo dataset real de TikTok que usa
 * `psychometric` (20 perfiles de Ecuador). La afinidad y el riesgo se
 * calculan con las reglas puras del dominio, no en la infraestructura.
 */
export function buildDiscoveryCandidates(
  records: readonly CreatorPsychometricRecord[] = SCRAPED_CREATOR_RECORDS,
): DiscoveryCandidate[] {
  return records.map((record) => {
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
      localAvatar: record.localAvatar ?? null,
      avatarUrl: record.avatarUrl ?? null,
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
