import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import {
  borderWidths,
  colors,
  radii,
  sizes,
  spacing,
  textStyles,
} from '../../theme';
import { AppText } from './AppText';

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
}

/**
 * Campo de texto (0:1 · "Barra de búsqueda").
 *
 * - Altura 46, radio 12, borde 1px #E5E7EB, padding horizontal 14, gap 10.
 * - Texto 14 Regular #111827 y placeholder #6B7280.
 */
export function AppInput({
  label,
  error,
  leftIcon,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: AppInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={containerStyle}>
      {label ? (
        <AppText variant="caption" color="textSecondary" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.field,
          isFocused && styles.fieldFocused,
          error ? styles.fieldError : null,
        ]}
      >
        {leftIcon}
        <TextInput
          {...rest}
          accessibilityLabel={rest.accessibilityLabel ?? label}
          placeholderTextColor={colors.textSubtle}
          style={[textStyles.body, styles.input, style]}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
        />
      </View>

      {error ? (
        <AppText variant="caption" color="textPrimary" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.sm,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    height: sizes.searchBar,
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.surface,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    borderRadius: radii.lg,
  },
  fieldFocused: {
    borderColor: colors.primary,
  },
  /** Figma no define estado de error: se reutiliza el token de tinta. */
  fieldError: {
    borderColor: colors.textPrimary,
  },
  input: {
    flex: 1,
    padding: 0,
    paddingVertical: 0,
    color: colors.textStrong,
  },
  error: {
    marginTop: spacing.sm,
  },
});
