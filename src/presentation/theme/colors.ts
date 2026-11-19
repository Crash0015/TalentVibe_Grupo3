/**
 * Tokens de color extraídos dinámicamente desde el MCP de Figma.
 *
 * Archivo: uo8Zwg8EMhe8CWq1HBwRu2
 * Nodos inspeccionados: 35:6 "Línea Gráfica" y 0:1 "Prototipo"
 *
 * Regla del proyecto: no inventar ni ajustar valores a mano.
 * Cualquier cambio visual debe volver a extraerse del archivo Figma.
 */

/** Colores brutos tal como aparecen en Figma. */
export const palette = {
  /** 35:6 · color principal "Azul Marino" (#1E3A8A). */
  navy: '#0e2c80',
  /** 35:6 · color secundario "Verde Esmeralda" (#10B981), éxito y match. */
  emerald: '#10B981',
  /** 35:6 · "Blanco Puro" (#FFFFFF), superficies de tarjetas. */
  white: '#FFFFFF',
  /** 35:6 · "Gris Perla" (#F3F4F6), fondos y separadores sutiles. */
  pearl: '#F3F4F6',
  /** 35:6 · fondo del lienzo / app (#F9FAFB). */
  canvas: '#F9FAFB',
  /** 35:6 · bordes de tarjetas y separadores (#E5E7EB). */
  border: '#E5E7EB',
  /** 35:6 · texto principal de la línea gráfica (#17243B). */
  ink: '#17243B',
  /** 35:6 · texto secundario de la línea gráfica (#657185). */
  inkMuted: '#657185',
  /** 35:6 · texto verde oscuro del badge "Alto Match" (#047857). */
  emeraldDeep: '#047857',
  /** 35:6 · fondo del badge de compatibilidad (#ECFDF5). */
  emeraldSoft: '#ECFDF5',
  /** 35:6 · fondo del panel "Organismo / Plantilla" (#EFF3FC). */
  navyTint: '#EFF3FC',
  /** 0:1 · fondo del badge de tipo de cuenta (#EEF2FA). */
  navyTintSoft: '#EEF2FA',
  /** 0:1 · texto principal del prototipo (#111827). */
  inkStrong: '#111827',
  /** 0:1 · texto secundario/muted del prototipo (#6B7280). */
  gray: '#6B7280',
  /** 0:1 · pista de las barras de progreso Big Five (#EDF0F5). */
  track: '#EDF0F5',
} as const;

/** Roles semánticos usados por la UI de TalentVibe. */
export const colors = {
  // Marca
  primary: palette.navy,
  primaryContrast: palette.white,
  primarySoft: palette.navyTintSoft,
  secondary: palette.emerald,
  secondaryContrast: palette.white,
  /** Empleado por la etiqueta "Talent" del logotipo. */
  brandAccent: palette.emerald,

  // Estados
  success: palette.emerald,
  successStrong: palette.emeraldDeep,
  successSoft: palette.emeraldSoft,

  // Superficies
  background: palette.canvas,
  surface: palette.white,
  surfaceMuted: palette.pearl,
  surfaceElevated: palette.white,
  surfaceTint: palette.navyTint,
  surfaceBadge: palette.emeraldSoft,
  surfaceRoleBadge: palette.navyTintSoft,

  // Texto
  textPrimary: palette.ink,
  textStrong: palette.inkStrong,
  textSecondary: palette.inkMuted,
  textSubtle: palette.gray,
  textOnPrimary: palette.white,

  // Bordes y divisores
  border: palette.border,
  borderStrong: palette.ink,
  /** 35:6 · borde de la muestra puntual de color (rgba(255,255,255,0.4)). */
  borderOnImage: 'rgba(255, 255, 255, 0.4)',

  // Datos
  progressTrack: palette.track,
  progressFill: palette.emerald,

  // Sombra (0:1 · boxShadow rgba(17,24,39,0.02))
  shadow: 'rgba(17, 24, 39, 0.02)',
} as const;

export type ColorName = keyof typeof colors;
