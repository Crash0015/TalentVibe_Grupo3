import { AnalyzeTikTokCreatorUseCase } from '../application/AnalyzeTikTokCreatorUseCase';
import { GetCreatorPsychometricReportUseCase } from '../application/GetCreatorPsychometricReportUseCase';
import { SearchCreatorsUseCase } from '../application/SearchCreatorsUseCase';
import type { PsychometricRepository } from '../domain/PsychometricRepository';
import { JsonPsychometricRepository } from './JsonPsychometricRepository';

/** Casos de uso del módulo `psychometric` listos para presentación. */
export interface PsychometricModule {
  repository: PsychometricRepository;
  analyzeCreator: AnalyzeTikTokCreatorUseCase;
  getCreatorReport: GetCreatorPsychometricReportUseCase;
  searchCreators: SearchCreatorsUseCase;
}

/**
 * Composition root del Bounded Context `psychometric`.
 *
 * Por defecto usa `JsonPsychometricRepository`, que convierte el dataset
 * real scrapeado de TikTok en registros psicométricos. En tests se puede
 * inyectar `MockPsychometricRepository` sin tocar los casos de uso.
 */
export function createPsychometricModule(
  repository: PsychometricRepository = new JsonPsychometricRepository(),
): PsychometricModule {
  return {
    repository,
    analyzeCreator: new AnalyzeTikTokCreatorUseCase(repository),
    getCreatorReport: new GetCreatorPsychometricReportUseCase(repository),
    searchCreators: new SearchCreatorsUseCase(repository),
  };
}
