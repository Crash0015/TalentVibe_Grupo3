import {
  HiringError,
  type CampaignProposal,
  type HiringRepository,
  type SendProposalInput,
} from '../domain/HiringModels';

const MIN_CAMPAIGN_NAME_LENGTH = 3;
const MIN_MESSAGE_LENGTH = 10;

/**
 * Caso de uso: enviar (simulado) una propuesta de campaña a un match.
 */
export class SendCampaignProposalUseCase {
  constructor(private readonly repository: HiringRepository) {}

  async execute(input: SendProposalInput): Promise<CampaignProposal> {
    const creatorId = input.creatorId.trim();
    const campaignName = input.campaignName.trim();
    const message = input.message.trim();

    if (!creatorId) {
      throw new HiringError(
        'MATCH_NOT_FOUND',
        'Debes seleccionar un creador aprobado.',
      );
    }

    if (campaignName.length < MIN_CAMPAIGN_NAME_LENGTH) {
      throw new HiringError(
        'INVALID_PROPOSAL',
        `El nombre de la campaña debe tener al menos ${MIN_CAMPAIGN_NAME_LENGTH} caracteres.`,
      );
    }

    if (message.length < MIN_MESSAGE_LENGTH) {
      throw new HiringError(
        'INVALID_PROPOSAL',
        `El mensaje debe tener al menos ${MIN_MESSAGE_LENGTH} caracteres.`,
      );
    }

    const match = await this.repository.findMatch(creatorId);

    if (!match) {
      throw new HiringError(
        'MATCH_NOT_FOUND',
        'El creador no está en la lista de matches aprobados.',
      );
    }

    const proposal: CampaignProposal = {
      id: `proposal_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      creatorId,
      campaignName,
      message,
      status: 'SENT',
      sentAt: new Date().toISOString(),
    };

    return this.repository.saveProposal(proposal);
  }
}
