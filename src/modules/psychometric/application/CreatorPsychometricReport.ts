import type { BigFiveProfile, BigFiveTraits } from '../domain/BigFiveProfile';
import type { PsychometricAnalysis } from '../domain/PsychometricAnalysis';
import type { CreatorPsychometricRecord } from '../domain/PsychometricRepository';
import type { RiskLevel, TikTokRiskSignals } from '../domain/riskAssessment';

/**
 * DTO de salida del Bounded Context `psychometric`.
 *
 * Es lo que consumen los casos de uso y, más adelante, la capa de
 * presentación: datos planos, sin entidades ni Value Objects.
 */
export interface CreatorPsychometricReport {
  creatorId: string;
  handle: string;
  displayName: string;
  profile: BigFiveTraits;
  riskLevel: RiskLevel;
  riskScore: number;
  /** `null` cuando la marca no envió su perfil cultural objetivo. */
  affinityScore: number | null;
  signals: TikTokRiskSignals;
  /** Ruta local de la foto (assets/avatars/...); puede ser `null`. */
  localAvatar: string | null;
  /** URL remota original de TikTok; puede ser `null`. */
  avatarUrl: string | null;
  updatedAt: string;
}

/**
 * Mapea registro + análisis (y opcionalmente el perfil cultural de la marca)
 * al DTO de reporte.
 */
export function buildCreatorPsychometricReport(
  record: CreatorPsychometricRecord,
  analysis: PsychometricAnalysis,
  targetProfile: BigFiveProfile | null = null,
): CreatorPsychometricReport {
  return {
    creatorId: record.creatorId,
    handle: record.handle,
    displayName: record.displayName,
    profile: analysis.profile.toPrimitives(),
    riskLevel: analysis.riskLevel,
    riskScore: analysis.riskScore,
    affinityScore:
      targetProfile === null
        ? null
        : analysis.calculateAffinity(targetProfile),
    signals: analysis.signals,
    localAvatar: record.localAvatar ?? null,
    avatarUrl: record.avatarUrl ?? null,
    updatedAt: record.updatedAt,
  };
}
