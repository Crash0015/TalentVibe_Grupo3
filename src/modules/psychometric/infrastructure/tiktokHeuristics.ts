import { BigFiveProfile, type BigFiveTraits } from '../domain/BigFiveProfile';
import type { CreatorPsychometricRecord } from '../domain/PsychometricRepository';
import type { TikTokRiskSignals } from '../domain/riskAssessment';
import scrapedProfiles from './scrapedTikTokProfiles.json';

/**
 * Perfil scrapeado de TikTok (JSON real del dataset).
 * Vive solo en infraestructura: el dominio nunca importa este archivo.
 */
export interface ScrapedTikTokProfile {
  handle: string;
  displayName: string;
  bio: string;
  accountType: string;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  videosCount: number;
  recentCaptions: string[];
  avatarUrl: string;
  localAvatar: string;
  scrapedAt: string;
}

/** Puntajes OCEAN derivados heurísticamente (0-100). */
export interface OceanScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

const RAW_PROFILES = scrapedProfiles as readonly ScrapedTikTokProfile[];

/** Dataset real de 20 perfiles de Ecuador. */
export const SCRAPED_TIKTOK_PROFILES: readonly ScrapedTikTokProfile[] =
  RAW_PROFILES;

/**
 * Términos de conflicto reputacional. Se buscan sobre texto normalizado
 * (minúsculas y sin tildes) y por palabra completa.
 */
const RISK_TERMS: readonly string[] = [
  'polemica',
  'drama',
  'escandalo',
  'controversia',
  'conflicto',
  'pelea',
  'insulto',
  'odio',
  'fraude',
  'estafa',
  'mentira',
  'demanda',
  'acusacion',
  'cancelado',
  'violencia',
  'arma',
  'droga',
  'acoso',
  'discriminacion',
  'racismo',
  'xenofobia',
  'corrupcion',
  'robo',
  'amenaza',
  'agresion',
];

/** Términos de alta severidad para seguridad de marca. */
const BRAND_SAFETY_TERMS: readonly string[] = [
  'fraude',
  'estafa',
  'droga',
  'arma',
  'violencia',
  'acoso',
  'discriminacion',
  'racismo',
  'xenofobia',
  'corrupcion',
  'robo',
  'amenaza',
  'agresion',
];

/** Términos positivos usados como señal de afabilidad. */
const POSITIVE_TERMS: readonly string[] = [
  'amor',
  'gracias',
  'familia',
  'amigo',
  'amiga',
  'feliz',
  'ayuda',
  'respeto',
  'empatia',
  'comparte',
  'bendicion',
  'orgullo',
  'sueno',
  'apoyo',
];

function toCount(value: number): number {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

/** Normaliza texto sin depender de `String.normalize` (compatibilidad Hermes). */
function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[áàäâã]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöôõ]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n');
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function roundScore(value: number): number {
  return Math.round(clamp(value));
}

/** Escala logarítmica 0-1 para métricas de alcance muy dispares. */
function normalizedLog(value: number, upperBound: number): number {
  if (value <= 0) {
    return 0;
  }

  return Math.min(1, Math.log10(1 + value) / Math.log10(1 + upperBound));
}

/** Cuenta apariciones de un término y sus plurales simples. */
function countTerm(text: string, term: string): number {
  const matches = text.match(new RegExp(`\\b${term}(?:s|es)?\\b`, 'g'));
  return matches ? matches.length : 0;
}

function countTerms(text: string, terms: readonly string[]): number {
  return terms.reduce((total, term) => total + countTerm(text, term), 0);
}

function getCaptionCorpus(profile: ScrapedTikTokProfile): string[] {
  return (profile.recentCaptions ?? [])
    .slice(0, 8)
    .map((caption) => normalizeText(caption ?? ''));
}

function getFullCorpus(profile: ScrapedTikTokProfile): string {
  return [normalizeText(profile.bio ?? ''), ...getCaptionCorpus(profile)].join(
    ' ',
  );
}

/**
 * Señales de riesgo deterministas a partir de bio y captions.
 *
 * - `flaggedPosts`: captions que contienen al menos un término de conflicto.
 * - `controversyMentions`: total de apariciones de esos términos.
 * - `brandSafetyReports`: apariciones de términos de alta severidad (máx. 3).
 */
export function deriveTikTokRiskSignals(
  profile: ScrapedTikTokProfile,
): TikTokRiskSignals {
  const captions = getCaptionCorpus(profile);
  const fullCorpus = getFullCorpus(profile);

  const flaggedPosts = captions.filter(
    (caption) => countTerms(caption, RISK_TERMS) > 0,
  ).length;

  return {
    flaggedPosts,
    controversyMentions: countTerms(fullCorpus, RISK_TERMS),
    brandSafetyReports: Math.min(
      3,
      countTerms(fullCorpus, BRAND_SAFETY_TERMS),
    ),
  };
}

/**
 * Heurística determinista de personalidad OCEAN.
 *
 * No es un test psicométrico validado: es una aproximación reproducible
 * basada en señales públicas (alcance, consistencia, engagement, longitud
 * de contenido, hashtags y densidad de conflicto). El objetivo es que la
 * app tenga datos derivados reales mientras el prototipo no cuente con
 * un instrumento psicológico aplicado.
 */
export function deriveOceanScores(
  profile: ScrapedTikTokProfile,
): OceanScores {
  const followers = toCount(profile.followersCount);
  const following = Math.max(1, toCount(profile.followingCount));
  const likes = toCount(profile.likesCount);
  const videos = toCount(profile.videosCount);
  const captions = (profile.recentCaptions ?? []).slice(0, 8);
  const fullCorpus = getFullCorpus(profile);
  const signals = deriveTikTokRiskSignals(profile);

  const averageCaptionLength =
    captions.reduce((total, caption) => total + caption.length, 0) /
    Math.max(1, captions.length);
  const hashtagCount = (fullCorpus.match(/#/g) ?? []).length;
  const positiveMentions = countTerms(fullCorpus, POSITIVE_TERMS);

  const reach = normalizedLog(followers, 50_000_000);
  const engagement = normalizedLog(
    videos > 0 ? likes / videos : likes,
    1_000_000,
  );
  const consistency = normalizedLog(videos, 3000);
  const socialRatio = normalizedLog(followers / following, 100_000);
  const captionDepth = clamp(averageCaptionLength / 180, 0, 1);
  const hashtagDensity = clamp(hashtagCount / 15, 0, 1);
  const positiveDensity = clamp(
    positiveMentions / Math.max(1, captions.length * 3),
    0,
    1,
  );
  const riskDensity = clamp(
    signals.controversyMentions / Math.max(1, captions.length * 4),
    0,
    1,
  );

  return {
    openness: roundScore(
      30 + 35 * captionDepth + 20 * consistency + 15 * hashtagDensity,
    ),
    conscientiousness: roundScore(
      25 +
        55 * consistency +
        20 * normalizedLog(videos, 1000),
    ),
    extraversion: roundScore(25 + 45 * reach + 30 * socialRatio),
    agreeableness: roundScore(
      30 +
        40 * engagement +
        20 * positiveDensity +
        10 * (1 - riskDensity) -
        20 * riskDensity,
    ),
    neuroticism: roundScore(
      20 +
        50 * riskDensity +
        15 * (1 - consistency) +
        15 * (1 - socialRatio),
    ),
  };
}

/**
 * Puente OCEAN → rasgos del dominio.
 *
 * El dominio nombra `resilience` a la estabilidad emocional; por eso se
 * invierte el neuroticismo (100 - neuroticism).
 */
export function toBigFiveTraits(ocean: OceanScores): BigFiveTraits {
  return {
    innovation: ocean.openness,
    selfManagement: ocean.conscientiousness,
    communication: ocean.extraversion,
    empathy: ocean.agreeableness,
    resilience: 100 - ocean.neuroticism,
  };
}

function createCreatorId(handle: string): string {
  const slug = handle
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_');

  return `usr_scraped_${slug}`;
}

function normalizeHandle(handle: string): string {
  const clean = handle.trim().replace(/^@+/, '');
  return clean ? `@${clean}` : '@unknown';
}

/** Transforma el JSON scrapeado en registros del puerto psychometric. */
export function buildScrapedCreatorRecords(
  profiles: readonly ScrapedTikTokProfile[] = SCRAPED_TIKTOK_PROFILES,
): CreatorPsychometricRecord[] {
  return profiles
    .filter((profile) => Boolean(profile?.handle?.trim()))
    .map((profile) => {
      const ocean = deriveOceanScores(profile);

      return {
        creatorId: createCreatorId(profile.handle),
        handle: normalizeHandle(profile.handle),
        displayName: profile.displayName?.trim() || normalizeHandle(profile.handle),
        profile: BigFiveProfile.create(toBigFiveTraits(ocean)),
        signals: deriveTikTokRiskSignals(profile),
        updatedAt:
          profile.scrapedAt?.trim() || new Date(0).toISOString(),
      };
    });
}

/** Registros memoizados para no recalcular en cada consulta. */
export const SCRAPED_CREATOR_RECORDS: readonly CreatorPsychometricRecord[] =
  buildScrapedCreatorRecords();
