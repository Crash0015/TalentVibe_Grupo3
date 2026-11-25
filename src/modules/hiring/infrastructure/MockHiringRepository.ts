import type { CreatorPsychometricRecord } from '../../psychometric/domain/PsychometricRepository';
import { PsychometricAnalysis } from '../../psychometric/domain/PsychometricAnalysis';
import { SAMPLE_BRAND_CULTURE_PROFILE } from '../../psychometric/infrastructure/mockCreatorProfiles';
import { SCRAPED_CREATOR_RECORDS } from '../../psychometric/infrastructure/tiktokHeuristics';
import type {
  CampaignProposal,
  HiringRepository,
  Match,
} from '../domain/HiringModels';

function toMatch(
  record: CreatorPsychometricRecord,
  approvedAt: string,
): Match {
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

const SEED_APPROVED_AT = [
  '2026-11-25T20:30:00.000Z',
  '2026-11-25T20:31:00.000Z',
];

/**
 * Matches aprobados de ejemplo, derivados del mismo dataset real de TikTok
 * que usa psychometric (los dos primeros perfiles del JSON).
 */
export const SEED_MATCHES: readonly Match[] = SCRAPED_CREATOR_RECORDS.slice(
  0,
  2,
).map((record, index) => toMatch(record, SEED_APPROVED_AT[index]));

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
