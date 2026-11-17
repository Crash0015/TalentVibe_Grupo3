import { GetApprovedMatchesUseCase } from '../application/GetApprovedMatchesUseCase';
import { SendCampaignProposalUseCase } from '../application/SendCampaignProposalUseCase';
import type { HiringRepository } from '../domain/HiringModels';
import { MockHiringRepository } from './MockHiringRepository';

export interface HiringModule {
  repository: HiringRepository;
  getApprovedMatches: GetApprovedMatchesUseCase;
  sendProposal: SendCampaignProposalUseCase;
}

/** Composition root del Bounded Context `hiring`. */
export function createHiringModule(
  repository: HiringRepository = new MockHiringRepository(),
): HiringModule {
  return {
    repository,
    getApprovedMatches: new GetApprovedMatchesUseCase(repository),
    sendProposal: new SendCampaignProposalUseCase(repository),
  };
}
