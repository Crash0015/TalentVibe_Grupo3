import type {
  CreatorPsychometricRecord,
  PsychometricRepository,
} from '../domain/PsychometricRepository';
import { MOCK_CREATOR_PROFILES } from './mockCreatorProfiles';

/** Normaliza handles para comparar con o sin '@' y sin distinguir mayúsculas. */
function normalizeHandle(handle: string): string {
  return handle.trim().replace(/^@+/, '').toLowerCase();
}

/**
 * Repositorio mock del Bounded Context `psychometric`.
 *
 * Mantiene los perfiles en memoria (ideal para Expo Go) y permite inyectar
 * otro conjunto de registros en tests.
 */
export class MockPsychometricRepository implements PsychometricRepository {
  private readonly records: Map<string, CreatorPsychometricRecord>;

  constructor(
    records: readonly CreatorPsychometricRecord[] = MOCK_CREATOR_PROFILES,
  ) {
    this.records = new Map(
      records.map((record) => [record.creatorId, record]),
    );
  }

  async findByHandle(
    handle: string,
  ): Promise<CreatorPsychometricRecord | null> {
    const target = normalizeHandle(handle);

    if (!target) {
      return null;
    }

    for (const record of this.records.values()) {
      if (normalizeHandle(record.handle) === target) {
        return record;
      }
    }

    return null;
  }

  async findByCreatorId(
    creatorId: string,
  ): Promise<CreatorPsychometricRecord | null> {
    return this.records.get(creatorId.trim()) ?? null;
  }

  async list(): Promise<CreatorPsychometricRecord[]> {
    return [...this.records.values()];
  }
}
