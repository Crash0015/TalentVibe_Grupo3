/**
 * Modelos del Bounded Context `hiring`.
 *
 * Creadores aprobados (matches) y propuestas de campaña simuladas.
 * Sin imports de React/Expo.
 */

export type HiringRiskLevel = 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';

/** Creador aprobado tras un swipe a la derecha. */
export interface Match {
  creatorId: string;
  displayName: string;
  handle: string;
  affinityScore: number;
  riskLevel: HiringRiskLevel;
  approvedAt: string;
}

export type ProposalStatus = 'SENT';

/** Propuesta de campaña enviada a un creador aprobado. */
export interface CampaignProposal {
  id: string;
  creatorId: string;
  campaignName: string;
  message: string;
  status: ProposalStatus;
  sentAt: string;
}

export interface SendProposalInput {
  creatorId: string;
  campaignName: string;
  message: string;
}

export interface HiringRepository {
  listMatches(): Promise<Match[]>;
  findMatch(creatorId: string): Promise<Match | null>;
  saveProposal(proposal: CampaignProposal): Promise<CampaignProposal>;
  listProposals(): Promise<CampaignProposal[]>;
}

export type HiringErrorCode = 'MATCH_NOT_FOUND' | 'INVALID_PROPOSAL';

export class HiringError extends Error {
  constructor(
    readonly code: HiringErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'HiringError';
  }
}
