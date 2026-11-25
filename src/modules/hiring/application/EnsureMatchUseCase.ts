import {
  HiringError,
  type HiringRepository,
  type Match,
} from '../domain/HiringModels';

/**
 * Asegura que un creador esté en la lista de aprobados antes de enviarle
 * una propuesta. Si ya existe, conserva el match original.
 */
export class EnsureMatchUseCase {
  constructor(private readonly repository: HiringRepository) {}

  async execute(match: Match): Promise<Match> {
    const creatorId = match.creatorId.trim();

    if (!creatorId) {
      throw new HiringError(
        'MATCH_NOT_FOUND',
        'Debes seleccionar un creador para la propuesta.',
      );
    }

    const existing = await this.repository.findMatch(creatorId);

    if (existing) {
      return existing;
    }

    return this.repository.saveMatch({ ...match, creatorId });
  }
}
