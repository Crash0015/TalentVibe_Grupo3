import { BigFiveProfile } from '../domain/BigFiveProfile';
import type { CreatorPsychometricRecord } from '../domain/PsychometricRepository';

/**
 * Perfil cultural de referencia usado en demos y pruebas para calcular
 * afinidad. No es una regla de dominio: cada marca puede enviar el suyo.
 */
export const SAMPLE_BRAND_CULTURE_PROFILE = BigFiveProfile.create({
  innovation: 88,
  selfManagement: 84,
  communication: 90,
  empathy: 88,
  resilience: 80,
});

/**
 * Perfiles mock de creadores de TikTok.
 *
 * Incluye:
 * - Perfiles seguros de alta afinidad (Sofía, Diego).
 * - Perfiles con señales moderadas (Valentina, Mateo) → MEDIUM_RISK.
 * - Perfiles polémicos con baja empatía/autogestión y muchas señales
 *   (Andrés, Karla) → HIGH_RISK.
 */
export const MOCK_CREATOR_PROFILES: readonly CreatorPsychometricRecord[] = [
  {
    creatorId: 'usr_creator_demo',
    handle: '@sofiamartinez',
    displayName: 'Sofía Martínez',
    profile: BigFiveProfile.create({
      innovation: 90,
      selfManagement: 82,
      communication: 88,
      empathy: 94,
      resilience: 85,
    }),
    signals: {
      flaggedPosts: 0,
      controversyMentions: 0,
      brandSafetyReports: 0,
    },
    updatedAt: '2026-11-12T09:30:00.000Z',
  },
  {
    creatorId: 'usr_creator_diego',
    handle: '@diegolopez',
    displayName: 'Diego López',
    profile: BigFiveProfile.create({
      innovation: 84,
      selfManagement: 88,
      communication: 90,
      empathy: 86,
      resilience: 80,
    }),
    signals: {
      flaggedPosts: 0,
      controversyMentions: 0,
      brandSafetyReports: 0,
    },
    updatedAt: '2026-11-11T16:10:00.000Z',
  },
  {
    creatorId: 'usr_creator_valentina',
    handle: '@valentinaruiz',
    displayName: 'Valentina Ruiz',
    profile: BigFiveProfile.create({
      innovation: 92,
      selfManagement: 75,
      communication: 87,
      empathy: 90,
      resilience: 78,
    }),
    signals: {
      flaggedPosts: 2,
      controversyMentions: 2,
      brandSafetyReports: 0,
    },
    updatedAt: '2026-11-10T12:45:00.000Z',
  },
  {
    creatorId: 'usr_creator_mateo',
    handle: '@mateofdez',
    displayName: 'Mateo Fernández',
    profile: BigFiveProfile.create({
      innovation: 76,
      selfManagement: 58,
      communication: 84,
      empathy: 60,
      resilience: 55,
    }),
    signals: {
      flaggedPosts: 2,
      controversyMentions: 3,
      brandSafetyReports: 0,
    },
    updatedAt: '2026-11-09T19:05:00.000Z',
  },
  {
    creatorId: 'usr_creator_andres',
    handle: '@andresgarciaclip',
    displayName: 'Andrés García',
    profile: BigFiveProfile.create({
      innovation: 55,
      selfManagement: 22,
      communication: 48,
      empathy: 18,
      resilience: 30,
    }),
    signals: {
      flaggedPosts: 7,
      controversyMentions: 9,
      brandSafetyReports: 2,
    },
    updatedAt: '2026-11-13T21:20:00.000Z',
  },
  {
    creatorId: 'usr_creator_karla',
    handle: '@karladrama',
    displayName: 'Karla Méndez',
    profile: BigFiveProfile.create({
      innovation: 70,
      selfManagement: 35,
      communication: 80,
      empathy: 28,
      resilience: 40,
    }),
    signals: {
      flaggedPosts: 5,
      controversyMentions: 6,
      brandSafetyReports: 1,
    },
    updatedAt: '2026-11-08T08:15:00.000Z',
  },
];
