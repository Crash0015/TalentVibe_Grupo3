import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {
  borderWidths,
  colors,
  radii,
  sizes,
  spacing,
} from '../../theme';
import { AppText } from './AppText';

export type AppButtonVariant = 'primary' | 'secondary';

export interface AppButtonProps
  extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: AppButtonVariant;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Botón del sistema de diseño (35:6 · "Acción principal" / "Acción secundaria").
 *
 * - Altura 44, radio 8, padding horizontal 20 y gap 8.
 * - Primario: fondo Azul Marino (#1E3A8A), texto blanco 13 Semi Bold.
 * - Secundario: fondo blanco, borde 1px #E5E7EB, texto #17243B.
 */
export function AppButton({
  label,
  variant = 'primary',
  icon,
  iconPosition = 'right',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: AppButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled === true || loading;

  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? colors.textOnPrimary : colors.textPrimary}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' ? icon : null}
          <AppText
            variant="buttonLabel"
            color={isPrimary ? 'textOnPrimary' : 'textPrimary'}
          >
            {label}
          </AppText>
          {icon && iconPosition === 'right' ? icon : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    height: sizes.button,
    paddingHorizontal: spacing.xxxlWide,
    borderRadius: radii.md,
  },
  primary: {
    backgroundColor: colors.primary,
    borderWidth: borderWidths.hairline,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  /** Feedback táctil: Figma no define un estado pressed. */
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
