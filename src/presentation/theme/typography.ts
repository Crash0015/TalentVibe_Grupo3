/**
 * Tokens tipográficos extraídos dinámicamente desde el MCP de Figma.
 *
 * Archivo: uo8Zwg8EMhe8CWq1HBwRu2
 * Nodos inspeccionados: 35:6 "Línea Gráfica" (escala oficial) y 0:1 "Prototipo" (UI real)
 *
 * En Figma los `lineHeight` y `letterSpacing` vienen en `em`; aquí se convierten
 * a píxeles con la fórmula: valor * fontSize.
 */

/** Única familia tipográfica del sistema de diseño. */
export const fontFamily = 'Inter';

export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

/** Escala de tamaños presente en los dos nodos. */
export const fontSizes = {
  /** 0:1 · reloj de la barra de estado del wireframe. */
  micro: 9,
  /** 35:6 · "TARJETA DE CANDIDATO", badges ("Alto Match"). */
  tiny: 10,
  /** 35:6 · overlines corporativas y especificaciones. */
  caption: 11,
  /** 35:6 · etiquetas (12pt - Bold), subtítulos de tarjeta. */
  label: 12,
  /** 35:6 · pie de presentación; 0:1 · placeholder de búsqueda. */
  footnote: 13,
  /** 35:6 · cuerpo de texto (14pt - Regular). */
  body: 14,
  /** 35:6 · párrafo de propósito de marca (15pt). */
  bodyRelaxed: 15,
  /** 35:6 · porcentaje de compatibilidad en tarjeta. */
  bodyLarge: 16,
  /** 35:6 · H2 Subtítulo (18pt - Medium). */
  headline: 18,
  /** 35:6 · nombre del color; 0:1 · título de pantalla "Candidatos". */
  title: 20,
  /** 35:6 · H1 Título (24pt - Bold). */
  display: 24,
  /** 35:6 · logotipo "TalentVibe". */
  logo: 30,
  /** 35:6 · titular del sistema de diseño (43pt). */
  brand: 43,
  /** 35:6 · glifo "Aa" del carácter tipográfico (61pt). */
  glyph: 61,
} as const;

/** Interlineados exactos declarados en Figma. */
export const lineHeights = {
  display: 32.4, // 24 * 1.35em
  brand: 48.16, // 43 * 1.12em
  headline: 24.3, // 18 * 1.35em
  body: 18.9, // 14 * 1.35em
  bodyRelaxed: 24, // 15 * 1.6em
  label: 16.2, // 12 * 1.35em
  captionRelaxed: 18, // 12 * 1.5em
  candidateName: 17.5, // 14 * 1.25em
  candidateMeta: 16.8, // 12 * 1.4em
  glyph: 61, // 61 * 1em
} as const;

/** Tracking declarado en Figma, convertido de em a px. */
export const letterSpacings = {
  tight: -1.6, // 43pt · -0.0372em
  logo: -1.2, // 30pt · -0.04em
  glyph: -3, // 61pt · -0.0492em
  overline: 1, // 11pt · 0.0909em
  eyebrow: 1.3, // 11pt · 0.1182em
  sectionEyebrow: 0.7, // 10pt · 0.07em
  specCode: 0.4, // 14pt · 0.0286em
  specValue: 0.7, // 12pt · 0.0583em
} as const;

/**
 * Presets listos para `StyleSheet.create`.
 * Cada preset referencia un texto real de los nodos 35:6 y 0:1.
 */
export const textStyles = {
  /** 35:6 · "Sistema de Diseño y Arquitectura Visual". */
  brandDisplay: {
    fontFamily,
    fontSize: fontSizes.brand,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.brand,
    letterSpacing: letterSpacings.tight,
  },
  /** 35:6 · logotipo "TalentVibe". */
  logotype: {
    fontFamily,
    fontSize: fontSizes.logo,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacings.logo,
  },
  /** 0:1 · encabezado de pantalla "Candidatos". */
  screenTitle: {
    fontFamily,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    lineHeight: 32.4,
  },
  /** 35:6 · H1 Título "Encuentra el talento ideal". */
  h1: {
    fontFamily,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.display,
  },
  /** 35:6 · H2 Subtítulo "Directorio de candidatos". */
  h2: {
    fontFamily,
    fontSize: fontSizes.headline,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.headline,
  },
  /** 35:6 · títulos de tarjeta de sección ("Tipografía - Inter", "Azul Marino"). */
  sectionTitle: {
    fontFamily,
    fontSize: fontSizes.title,
    fontWeight: fontWeights.semiBold,
  },
  /** 35:6 · cuerpo de texto ("14pt - Regular"). */
  body: {
    fontFamily,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.body,
  },
  /** 35:6 · párrafo de propósito de marca (15pt / 1.6em). */
  bodyRelaxed: {
    fontFamily,
    fontSize: fontSizes.bodyRelaxed,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.bodyRelaxed,
  },
  /** 35:6 · etiquetas ("12pt - Bold", "90% COMPATIBILIDAD"). */
  label: {
    fontFamily,
    fontSize: fontSizes.label,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.label,
  },
  /** 35:6 · descripciones de color y de átomos (12pt / 1.5em). */
  caption: {
    fontFamily,
    fontSize: fontSizes.label,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.captionRelaxed,
  },
  /** 35:6 · overline "RECURSOS HUMANOS · B2B". */
  overline: {
    fontFamily,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacings.overline,
  },
  /** 35:6 · eyebrow "TALENTO + CULTURA". */
  eyebrow: {
    fontFamily,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacings.eyebrow,
  },
  /** 35:6 · etiqueta de tarjeta "TARJETA DE CANDIDATO" / "BIG FIVE · PERFIL DE AFINIDAD". */
  cardEyebrow: {
    fontFamily,
    fontSize: fontSizes.tiny,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacings.sectionEyebrow,
  },
  /** 35:6 · código de color "#1E3A8A". */
  specCode: {
    fontFamily,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacings.specCode,
  },
  /** 35:6 · nombre de nivel "H1 Título". */
  specLabel: {
    fontFamily,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.medium,
  },
  /** 35:6 · medida de nivel "24pt - Bold"; 0:1 · placeholder "Buscar talento...". */
  specValue: {
    fontFamily,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
  },
  /** 35:6 · rasgos Big Five ("Innovación", "Autogestión"). */
  traitLabel: {
    fontFamily,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
  },
  /** 35:6 · porcentaje grande de match (16pt - Bold). */
  statistic: {
    fontFamily,
    fontSize: fontSizes.bodyLarge,
    fontWeight: fontWeights.bold,
  },
  /** 0:1 · porcentaje de compatibilidad de cada tarjeta (20pt - Bold). */
  statisticLarge: {
    fontFamily,
    fontSize: fontSizes.title,
    fontWeight: fontWeights.bold,
  },
  /** 35:6 · valor numérico de cada rasgo en el perfil Big Five. */
  statisticSmall: {
    fontFamily,
    fontSize: fontSizes.label,
    fontWeight: fontWeights.semiBold,
  },
  /** 35:6 · badge "Alto Match" / 0:1 · "Match". */
  badge: {
    fontFamily,
    fontSize: fontSizes.tiny,
    fontWeight: fontWeights.semiBold,
  },
  /** 0:1 · nombre del candidato (14pt / 1.25em). */
  candidateName: {
    fontFamily,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.candidateName,
  },
  /** 0:1 · carrera del candidato (12pt / 1.4em). */
  candidateMeta: {
    fontFamily,
    fontSize: fontSizes.label,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.candidateMeta,
  },
  /** 35:6 · etiqueta de botón "Ver Perfil" (13pt - Semi Bold). */
  buttonLabel: {
    fontFamily,
    fontSize: fontSizes.footnote,
    fontWeight: fontWeights.semiBold,
  },
  /** 35:6 · leyendas bajo átomos ("Acción primaria", "Identidad"). */
  iconLabel: {
    fontFamily,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
  },
  /** 0:1 · reloj de la barra de estado. */
  statusBar: {
    fontFamily,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semiBold,
  },
  /** 0:1 · reloj del wireframe dentro de la línea gráfica. */
  micro: {
    fontFamily,
    fontSize: fontSizes.micro,
    fontWeight: fontWeights.semiBold,
  },
  /** 0:1 · badge de tipo de cuenta "EMPRESAS". */
  roleBadge: {
    fontFamily,
    fontSize: fontSizes.tiny,
    fontWeight: fontWeights.semiBold,
  },
  /** 35:6 · pie de presentación (13pt - Regular). */
  footer: {
    fontFamily,
    fontSize: fontSizes.footnote,
    fontWeight: fontWeights.regular,
  },
} as const;

export type TextStyleName = keyof typeof textStyles;
