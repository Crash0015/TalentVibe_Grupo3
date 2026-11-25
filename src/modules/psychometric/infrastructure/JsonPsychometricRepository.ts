import { MockPsychometricRepository } from './MockPsychometricRepository';
import {
  buildScrapedCreatorRecords,
  SCRAPED_TIKTOK_PROFILES,
  type ScrapedTikTokProfile,
} from './tiktokHeuristics';

/**
 * Adaptador del dataset real scrapeado de TikTok (20 perfiles de Ecuador).
 *
 * El JSON se transforma en `CreatorPsychometricRecord` usando heurísticas
 * deterministas de infraestructura; los cálculos de afinidad y riesgo
 * siguen viviendo exclusivamente en `domain/`.
 *
 * Hereda de `MockPsychometricRepository` para reutilizar la búsqueda en
 * memoria por handle/id, pero su fuente por defecto es el JSON scrapeado.
 */
export class JsonPsychometricRepository extends MockPsychometricRepository {
  constructor(
    profiles: readonly ScrapedTikTokProfile[] = SCRAPED_TIKTOK_PROFILES,
  ) {
    super(buildScrapedCreatorRecords(profiles));
  }
}
