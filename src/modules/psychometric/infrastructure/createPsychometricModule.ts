import { AnalyzeTikTokCreatorUseCase } from '../application/AnalyzeTikTokCreatorUseCase';
import { GetCreatorPsychometricReportUseCase } from '../application/GetCreatorPsychometricReportUseCase';
import type { PsychometricRepository } from '../domain/PsychometricRepository';
import { MockPsychometricRepository } from './MockPsychometricRepository';

/** Casos de uso del módulo `psychometric` listos para presentación. */
export interface PsychometricModule {
  repository: PsychometricRepository;
  analyzeCreator: AnalyzeTikTokCreatorUseCase;
  getCreatorReport: GetCreatorPsychometricReportUseCase;
}

/**
 * Composition root del Bounded Context `psychometric`.
 *
 * Permite inyectar otro repositorio (API real, tests) sin tocar los casos
 * de uso. Por defecto usa el mock en memoria para Expo Go.
 */
export function createPsychometricModule(
  repository: PsychometricRepository = new MockPsychometricRepository(),
): PsychometricModule {
  return {
    repository,
    analyzeCreator: new AnalyzeTikTokCreatorUseCase(repository),
    getCreatorReport: new GetCreatorPsychometricReportUseCase(repository),
  };
}
