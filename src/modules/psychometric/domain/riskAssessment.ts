import type { BigFiveProfile } from './BigFiveProfile';
import { PsychometricError } from './PsychometricError';

/** Niveles de riesgo/controversia de un creador en TikTok. */
export type RiskLevel = 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';

export const RISK_LEVELS: readonly RiskLevel[] = [
  'LOW_RISK',
  'MEDIUM_RISK',
  'HIGH_RISK',
];

/**
 * Señales de riesgo observadas en TikTok.
 * Las cantidades son conteos de eventos, no porcentajes.
 */
export interface TikTokRiskSignals {
  /** Publicaciones con lenguaje polémico detectado. */
  flaggedPosts: number;
  /** Apariciones en contenido de drama/controversia de terceros. */
  controversyMentions: number;
  /** Reportes de seguridad de marca recibidos. */
  brandSafetyReports: number;
}

/** Puntos de riesgo por cada evento detectado. */
const SIGNAL_WEIGHTS = {
  flaggedPost: 8,
  controversyMention: 5,
  brandSafetyReport: 20,
} as const;

/** Piso de rasgo saludable: por debajo de 30 se suma riesgo emocional. */
const HEALTHY_TRAIT_FLOOR = 30;

/** Penalizaciones por rasgo, por punto por debajo del piso saludable. */
const TRAIT_PENALTIES = {
  empathy: 0.6,
  selfManagement: 0.5,
  resilience: 0.3,
} as const;

/** Umbrales de clasificación sobre el score final (0-100). */
export const RISK_THRESHOLDS = {
  medium: 25,
  high: 55,
} as const;

const MAX_RISK_SCORE = 100;

export function ensureValidRiskSignals(signals: TikTokRiskSignals): void {
  const entries: Array<[keyof TikTokRiskSignals, number]> = [
    ['flaggedPosts', signals.flaggedPosts],
    ['controversyMentions', signals.controversyMentions],
    ['brandSafetyReports', signals.brandSafetyReports],
  ];

  entries.forEach(([name, value]) => {
    if (!Number.isInteger(value) || value < 0) {
      throw new PsychometricError(
        'INVALID_SIGNALS',
        `La señal "${name}" debe ser un entero mayor o igual a 0 (recibido: ${value}).`,
      );
    }
  });
}

/**
 * Score de riesgo (0-100) combinando señales de TikTok y rasgos Big Five.
 *
 * Regla pura:
 *   score = flaggedPosts*8 + controversyMentions*5 + brandSafetyReports*20
 *         + (30 - empathy)*0.6     si empathy < 30
 *         + (30 - selfManagement)*0.5 si selfManagement < 30
 *         + (30 - resilience)*0.3  si resilience < 30
 *   score = min(100, round(score))
 */
export function calculateRiskScore(
  profile: BigFiveProfile,
  signals: TikTokRiskSignals,
): number {
  ensureValidRiskSignals(signals);

  const signalScore =
    signals.flaggedPosts * SIGNAL_WEIGHTS.flaggedPost +
    signals.controversyMentions * SIGNAL_WEIGHTS.controversyMention +
    signals.brandSafetyReports * SIGNAL_WEIGHTS.brandSafetyReport;

  const empathyGap = Math.max(0, HEALTHY_TRAIT_FLOOR - profile.empathy);
  const selfManagementGap = Math.max(
    0,
    HEALTHY_TRAIT_FLOOR - profile.selfManagement,
  );
  const resilienceGap = Math.max(0, HEALTHY_TRAIT_FLOOR - profile.resilience);

  const traitScore =
    empathyGap * TRAIT_PENALTIES.empathy +
    selfManagementGap * TRAIT_PENALTIES.selfManagement +
    resilienceGap * TRAIT_PENALTIES.resilience;

  return Math.min(MAX_RISK_SCORE, Math.round(signalScore + traitScore));
}

/** Traduce el score numérico al nivel de riesgo de negocio. */
export function resolveRiskLevel(score: number): RiskLevel {
  if (score >= RISK_THRESHOLDS.high) {
    return 'HIGH_RISK';
  }

  if (score >= RISK_THRESHOLDS.medium) {
    return 'MEDIUM_RISK';
  }

  return 'LOW_RISK';
}

/** Evaluación completa (score + nivel) a partir del perfil y las señales. */
export function assessTikTokRisk(
  profile: BigFiveProfile,
  signals: TikTokRiskSignals,
): { score: number; level: RiskLevel } {
  const score = calculateRiskScore(profile, signals);

  return { score, level: resolveRiskLevel(score) };
}
