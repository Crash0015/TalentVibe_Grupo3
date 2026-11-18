import type { ReactNode } from 'react';
import { StyleSheet, View, type TextInputProps } from 'react-native';

import {
  borderWidths,
  colors,
  iconSizes,
  radii,
  spacing,
} from '../../theme';
import { AppInput } from '../atoms';

export interface SearchBarProps extends TextInputProps {
  /** Reemplaza el ícono de lupa por defecto. */
  leftIcon?: ReactNode;
}

/** Lupa dibujada con vistas (el prototipo no incluye librería de íconos). */
function SearchGlyph() {
  return (
    <View style={styles.glyph} accessible={false}>
      <View style={styles.lens} />
      <View style={styles.handle} />
    </View>
  );
}

/**
 * Barra de búsqueda (0:1 · "Barra de búsqueda").
 *
 * Altura 46, radio 12, borde 1px #E5E7EB, padding 14, gap 10,
 * placeholder 14 Regular #6B7280 e ícono de 18px.
 */
export function SearchBar({
  placeholder = 'Buscar talento...',
  leftIcon,
  ...rest
}: SearchBarProps) {
  return (
    <AppInput
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="search"
      {...rest}
      leftIcon={leftIcon ?? <SearchGlyph />}
      placeholder={placeholder}
    />
  );
}

const styles = StyleSheet.create({
  glyph: {
    width: iconSizes.xlWide,
    height: iconSizes.xlWide,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lens: {
    width: iconSizes.sm,
    height: iconSizes.sm,
    borderRadius: radii.full,
    borderWidth: borderWidths.hairline,
    borderColor: colors.textSubtle,
  },
  handle: {
    position: 'absolute',
    right: spacing.xxs,
    bottom: spacing.xxs,
    width: borderWidths.thick,
    height: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.textSubtle,
    transform: [{ rotate: '-45deg' }],
  },
});
