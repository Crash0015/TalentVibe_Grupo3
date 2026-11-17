import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import {
  colors,
  textStyles,
  type ColorName,
  type TextStyleName,
} from '../../theme';

export interface AppTextProps extends TextProps {
  /** Preset tipográfico extraído de Figma (35:6 / 0:1). */
  variant?: TextStyleName;
  /** Color semántico del tema. */
  color?: ColorName;
  style?: StyleProp<TextStyle>;
}

/**
 * Texto base del sistema de diseño.
 *
 * Todos los tamaños, pesos, interlineados y tracking provienen de
 * `textStyles`, generados desde el nodo 35:6 "Línea Gráfica".
 */
export function AppText({
  variant = 'body',
  color = 'textPrimary',
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      {...rest}
      style={[textStyles[variant], { color: colors[color] }, style]}
    />
  );
}
