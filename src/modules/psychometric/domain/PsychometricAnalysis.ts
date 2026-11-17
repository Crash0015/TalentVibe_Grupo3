import type { BigFiveProfile, BigFiveTraits } from './BigFiveProfile';
import { PsychometricError } from './PsychometricError';
import {
  assessTikTokRisk,
  ensureValidRiskSignals,
  type RiskLevel,
  type TikTokRiskSignals,
} from './riskAssessment';

export interface PsychometricAnalysisProps {
  creatorId: string;
  profile: BigFiveProfile;
  signals: TikTokRiskSignals;
}

export interface PsychometricAnalysisPrimitives {
  creatorId: string;
  profile: BigFiveTraits;
  signals: TikTokRiskSignals;
  riskScore: number;
  riskLevel: RiskLevel;
}

interface AnalysisState extends PsychometricAnalysisProps {
  riskScore: number;
  riskLevel: RiskLevel;
}

/**
 * Entidad PsychometricAnalysis.
 *
 * Encapsula el resultado del análisis Big Five de un creador y su nivel de
 * riesgo/controversia en TikTok. El riesgo se calcula al construir la
 * entidad con la regla pura de `riskAssessment.ts`, por lo que un análisis
 * nunca puede existir con un nivel de riesgo incoherente.
 */
export class PsychometricAnalysis {
  private constructor(private readonly state: AnalysisState) {}

  static create(props: PsychometricAnalysisProps): PsychometricAnalysis {
    const creatorId = props.creatorId.trim();

    if (!creatorId) {
      throw new PsychometricError(
        'INVALID_ANALYSIS',
        'El id del creador es obligatorio para crear un análisis.',
      );
    }

    ensureValidRiskSignals(props.signals);

    const { score, level } = assessTikTokRisk(props.profile, props.signals);

    return new PsychometricAnalysis({
      creatorId,
      profile: props.profile,
      signals: { ...props.signals },
      riskScore: score,
      riskLevel: level,
    });
  }

  get creatorId(): string {
    return this.state.creatorId;
  }

  get profile(): BigFiveProfile {
    return this.state.profile;
  }

  get signals(): TikTokRiskSignals {
    return { ...this.state.signals };
  }

  get riskScore(): number {
    return this.state.riskScore;
  }

  get riskLevel(): RiskLevel {
    return this.state.riskLevel;
  }

  /**
   * Afinidad (0-100) del creador con el perfil cultural de una marca.
   * Es una regla pura del dominio: no depende de la marca concreta.
   */
  calculateAffinity(targetProfile: BigFiveProfile): number {
    return this.state.profile.affinityWith(targetProfile);
  }

  isHighRisk(): boolean {
    return this.state.riskLevel === 'HIGH_RISK';
  }

  /** Una marca solo puede contratar perfiles LOW o MEDIUM. */
  isBrandSafe(): boolean {
    return !this.isHighRisk();
  }

  toPrimitives(): PsychometricAnalysisPrimitives {
    return {
      creatorId: this.state.creatorId,
      profile: this.state.profile.toPrimitives(),
      signals: { ...this.state.signals },
      riskScore: this.state.riskScore,
      riskLevel: this.state.riskLevel,
    };
  }
}
