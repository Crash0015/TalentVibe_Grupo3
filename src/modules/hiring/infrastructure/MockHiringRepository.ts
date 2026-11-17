import { PsychometricAnalysis } from '../../psychometric/domain/PsychometricAnalysis';
import {
  MOCK_CREATOR_PROFILES,
  SAMPLE_BRAND_CULTURE_PROFILE,
} from '../../psychometric/infrastructure/mockCreatorProfiles';
import type {
  CampaignProposal,
  HiringRepository,
  Match,
} from '../domain/HiringModels';

function toMatch(handle: string, approvedAt: string): Match {
  const record = MOCK_CREATOR_PROFILES.find((item) => item.handle === handle);

  if (!record) {
    throw new Error(`No existe el perfil mock ${handle}.`);
  }

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
    approvedAt,
  };
}

/** Matches aprobados de ejemplo, derivados de los perfiles psicométricos. */
export const SEED_MATCHES: readonly Match[] = [
  toMatch('@diegolopez', '2026-11-14T10:00:00.000Z'),
  toMatch('@sofiamartinez', '2026-11-14T10:05:00.000Z'),
];

/** Repositorio mock en memoria para Expo Go. */
export class MockHiringRepository implements HiringRepository {
  private readonly matches: Map<string, Match>;
  private readonly proposals: CampaignProposal[] = [];

  constructor(matches: readonly Match[] = SEED_MATCHES) {
    this.matches = new Map(matches.map((match) => [match.creatorId, match]));
  }

  async listMatches(): Promise<Match[]> {
    return [...this.matches.values()];
  }

  async findMatch(creatorId: string): Promise<Match | null> {
    return this.matches.get(creatorId.trim()) ?? null;
  }

  async saveProposal(proposal: CampaignProposal): Promise<CampaignProposal> {
    this.proposals.push(proposal);
    return proposal;
  }

  async listProposals(): Promise<CampaignProposal[]> {
    return [...this.proposals];
  }
}
