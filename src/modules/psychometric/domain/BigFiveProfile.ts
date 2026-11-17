import { PsychometricError } from './PsychometricError';

/**
 * Rasgos del modelo Big Five (OCEAN) expresados con el lenguaje de producto
 * de TalentVibe. Cada rasgo se mide de 0 a 100.
 */
export interface BigFiveTraits {
  /** Innovación · apertura a la experiencia. */
  innovation: number;
  /** Autogestión · responsabilidad y disciplina. */
  selfManagement: number;
  /** Comunicación · extraversión y claridad al expresarse. */
  communication: number;
  /** Empatía · amabilidad y colaboración. */
  empathy: number;
  /** Resiliencia · estabilidad emocional. */
  resilience: number;
}

export const BIG_FIVE_TRAITS = [
  'innovation',
  'selfManagement',
  'communication',
  'empathy',
  'resilience',
] as const;

export type BigFiveTrait = (typeof BIG_FIVE_TRAITS)[number];

const MIN_TRAIT_VALUE = 0;
const MAX_TRAIT_VALUE = 100;

/**
 * Value Object BigFiveProfile.
 *
 * Invariantes: los 5 rasgos existen y son enteros entre 0 y 100.
 */
export class BigFiveProfile {
  private constructor(private readonly traits: BigFiveTraits) {}

  static create(input: BigFiveTraits): BigFiveProfile {
    BIG_FIVE_TRAITS.forEach((trait) => {
      const value = input[trait];

      if (
        !Number.isInteger(value) ||
        value < MIN_TRAIT_VALUE ||
        value > MAX_TRAIT_VALUE
      ) {
        throw new PsychometricError(
          'INVALID_PROFILE',
          `El rasgo "${trait}" debe ser un entero entre 0 y 100 (recibido: ${value}).`,
        );
      }
    });

    return new BigFiveProfile({ ...input });
  }

  static fromPrimitives(input: BigFiveTraits): BigFiveProfile {
    return BigFiveProfile.create(input);
  }

  get innovation(): number {
    return this.traits.innovation;
  }

  get selfManagement(): number {
    return this.traits.selfManagement;
  }

  get communication(): number {
    return this.traits.communication;
  }

  get empathy(): number {
    return this.traits.empathy;
  }

  get resilience(): number {
    return this.traits.resilience;
  }

  /** Copia inmutable de los rasgos. */
  get value(): BigFiveTraits {
    return { ...this.traits };
  }

  get average(): number {
    const total = BIG_FIVE_TRAITS.reduce(
      (sum, trait) => sum + this.traits[trait],
      0,
    );

    return total / BIG_FIVE_TRAITS.length;
  }

  get dominantTrait(): BigFiveTrait {
    return BIG_FIVE_TRAITS.reduce((best, trait) =>
      this.traits[trait] > this.traits[best] ? trait : best,
    );
  }

  /**
   * Distancia media absoluta entre dos perfiles (0 = idénticos, 100 = opuestos).
   * Regla pura, sin dependencias externas.
   */
  distanceTo(other: BigFiveProfile): number {
    const total = BIG_FIVE_TRAITS.reduce(
      (sum, trait) => sum + Math.abs(this.traits[trait] - other.traits[trait]),
      0,
    );

    return total / BIG_FIVE_TRAITS.length;
  }

  /**
   * Afinidad (0-100) entre este perfil y el perfil cultural de una marca.
   * 100 significa coincidencia exacta en los 5 rasgos.
   */
  affinityWith(target: BigFiveProfile): number {
    return Math.round(MAX_TRAIT_VALUE - this.distanceTo(target));
  }

  equals(other: BigFiveProfile): boolean {
    return BIG_FIVE_TRAITS.every(
      (trait) => this.traits[trait] === other.traits[trait],
    );
  }

  toPrimitives(): BigFiveTraits {
    return { ...this.traits };
  }
}
