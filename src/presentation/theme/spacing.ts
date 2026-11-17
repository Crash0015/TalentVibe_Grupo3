/**
 * Tokens de espaciado, radios, tamaños y elevación extraídos desde el MCP de Figma.
 *
 * Archivo: uo8Zwg8EMhe8CWq1HBwRu2
 * Nodos inspeccionados: 35:6 "Línea Gráfica" y 0:1 "Prototipo"
 *
 * Solo se incluyen valores que existen en Figma (padding, gap, width, height,
 * borderRadius, strokeWeight y boxShadow). No añadir medidas a mano.
 */

/** Escala de espaciado (padding y gap) tomada de los contenedores de Figma. */
export const spacing = {
  none: 0,
  /** 0:1 · gap de la barra de navegación inferior. */
  xxs: 2,
  /** 0:1 · gap entre íconos de conectividad. */
  xs: 3,
  /** 35:6 · gap interno de "Familia" y separaciones de 4px. */
  sm: 4,
  /** 35:6 · gap entre ícono y badge "9px / 5px". */
  smPlus: 5,
  /** 35:6 · gap de "Familia" y padding del badge de estado. */
  md: 6,
  /** 35:6 · gap de "Indicador corporativo"; 0:1 · gap de lista. */
  mdPlus: 7,
  /** 35:6 · padding de tarjetas internas y gaps de 8px. */
  lg: 8,
  /** 35:6 · padding del indicador de compatibilidad (5px 9px). */
  mdInset: 9,
  /** 35:6 · padding de tarjetas pequeñas y gaps de 10px. */
  xl: 10,
  /** 35:6 · gap de "Identidad"; 0:1 · gap de encabezado de tarjeta. */
  xlPlus: 12,
  /** 35:6 · gap de "Propósito de marca". */
  xlWide: 13,
  /** 0:1 · padding de las tarjetas de candidato. */
  xxl: 14,
  /** 35:6 · gap de "Perfil Big Five". */
  xxlPlus: 15,
  /** 35:6 · gap de "Tarjeta de candidato" y "Organismo". */
  xxlWide: 16,
  /** 35:6 · padding vertical de la especificación de color. */
  xxxl: 17,
  /** 35:6 · padding de la tarjeta de candidato. */
  xxxlPlus: 18,
  /** 35:6 · gap de "Organismo" y margen de 20px. */
  xxxlWide: 20,
  /** 35:6 · padding horizontal del "Color de identidad". */
  huge: 22,
  /** 35:6 · gap de "Moléculas". */
  hugePlus: 23,
  /** 35:6 · gap base de la línea gráfica y de sus secciones. */
  hugeWide: 24,
  /** 35:6 · gap de "Átomos". */
  giant: 25,
  /** 35:6 · padding de las tarjetas de tipografía y átomos. */
  giantPlus: 28,
  /** 35:6 · gap de "Arquitectura visual". */
  giantWide: 32,
  /** 35:6 · padding del lienzo "Línea Gráfica". */
  canvas: 48,
} as const;

/** Radios de borde declarados en Figma. */
export const radii = {
  /** 35:6 · muestra puntual de color. */
  xs: 4,
  /** 0:1 · badge de tipo de cuenta "EMPRESAS". */
  sm: 6,
  /** 35:6 · campo de búsqueda del wireframe. */
  smPlus: 7,
  /** 35:6 · botones y símbolo del logotipo. */
  md: 8,
  /** 35:6 · tarjetas pequeñas y barra de búsqueda del prototipo. */
  lg: 12,
  /** 35:6 · tarjetas del sistema de diseño. */
  xl: 20,
  /** 35:6 · marco del wireframe de iPhone. */
  xxl: 32,
  /** 35:6 · avatares e indicadores pill. */
  pill: 100,
  /** 0:1 · barra de progreso y foto de perfil. */
  full: 999,
} as const;

/** Grosores de trazo. */
export const borderWidths = {
  /** Bordes de tarjetas, campos y separadores. */
  hairline: 1,
  /** 35:6 · marco del wireframe de iPhone. */
  thick: 2,
} as const;

/** Alturas, anchos y tamaños de componentes presentes en Figma. */
export const sizes = {
  /** 0:1 · barra de estado del dispositivo. */
  statusBar: 48,
  /** 35:6 · barra de estado del wireframe. */
  statusBarCompact: 18,
  /** 35:6 · cabecera "Color de identidad". */
  colorHeader: 100,
  /** 0:1 · barra de navegación inferior. */
  tabBar: 64,
  /** 35:6 · alto del botón "Ver Perfil" / "Guardar". */
  button: 44,
  /** 0:1 · alto de la barra de búsqueda del prototipo. */
  searchBar: 46,
  /** 35:6 · alto del campo de búsqueda del wireframe. */
  searchBarCompact: 28,
  /** Área táctil mínima recomendada en móvil. */
  touchTarget: 44,

  /** 0:1 · símbolo del logotipo (28x28). */
  logoMark: 28,
  /** 35:6 · avatar del wireframe del directorio. */
  avatarSm: 34,
  /** 35:6 · avatar de la biblioteca de átomos y tarjeta de candidato. */
  avatarMd: 44,
  /** 0:1 · foto de perfil de las tarjetas. */
  avatarLg: 48,

  /** 35:6 · ancho de la tarjeta "Identidad del candidato". */
  candidateCardWidth: 330,
  /** 35:6 · ancho del wireframe de iPhone. */
  wireframeWidth: 286,
  /** 0:1 · ancho del frame del prototipo. */
  screenWidth: 390,

  /** 35:6 · alto de la pista de progreso Big Five. */
  progressTrack: 5,
  /** 35:6 · separador horizontal de las tarjetas. */
  separator: 1,
  /** 35:6 · ancho de la muestra de acento corporativo. */
  accentMark: 20,
  /** 35:6 · alto de la muestra de acento corporativo. */
  accentMarkHeight: 3,
  /** 0:1 · indicador de inicio del iPhone. */
  homeIndicator: 4,
  /** 35:6 · indicador de inicio del wireframe. */
  homeIndicatorCompact: 3,
} as const;

/** Tamaños de íconos declarados en Figma. */
export const iconSizes = {
  xs: 10,
  sm: 11,
  md: 12,
  mdPlus: 13,
  lg: 14,
  lgPlus: 15,
  xl: 16,
  xlWide: 18,
  xxl: 20,
  /** 35:6 · ícono "user-round" del avatar de 44px. */
  avatarIcon: 21.12,
  /** 0:1 · íconos de la barra de navegación inferior. */
  nav: 23,
} as const;

/**
 * Elevación de las tarjetas del prototipo (0:1):
 * boxShadow 0px 2px 8px 0px rgba(17, 24, 39, 0.02).
 */
export const shadows = {
  card: {
    shadowColor: 'rgba(17, 24, 39, 0.02)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    /** Android no soporta el alpha del boxShadow; 8px de blur ≈ elevation 1. */
    elevation: 1,
  },
} as const;

export type SpacingName = keyof typeof spacing;
export type RadiusName = keyof typeof radii;
