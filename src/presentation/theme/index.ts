/**
 * Punto de entrada del tema de TalentVibe.
 *
 * Todos los tokens provienen del MCP de Figma:
 * archivo uo8Zwg8EMhe8CWq1HBwRu2, nodos 35:6 "Línea Gráfica" y 0:1 "Prototipo".
 */

export { palette, colors } from './colors';
export type { ColorName } from './colors';

export {
  fontFamily,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacings,
  textStyles,
} from './typography';
export type { TextStyleName } from './typography';

export {
  spacing,
  radii,
  borderWidths,
  sizes,
  iconSizes,
  shadows,
} from './spacing';
export type { SpacingName, RadiusName } from './spacing';

import { colors } from './colors';
import {
  fontFamily,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  textStyles,
} from './typography';
import {
  borderWidths,
  iconSizes,
  radii,
  shadows,
  sizes,
  spacing,
} from './spacing';

/** Acceso agrupado al tema, útil para providers o Storybook. */
export const theme = {
  colors,
  spacing,
  radii,
  borderWidths,
  sizes,
  iconSizes,
  shadows,
  typography: {
    fontFamily,
    fontWeights,
    fontSizes,
    lineHeights,
    letterSpacings,
    textStyles,
  },
} as const;

export type Theme = typeof theme;
