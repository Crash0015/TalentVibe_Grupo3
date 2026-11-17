import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../../theme';
import { AppText } from './AppText';

export type BadgeTone = 'success' | 'primary';

export interface BadgeProps {
  label: string;
  /** success = match/compatibilidad · primary = tipo de cuenta. */
  tone?: BadgeTone;
  icon?: ReactNode;
}

/**
 * Badge / píldora de estado.
 *
 * - success (35:6 · "Alto Match"): fondo #ECFDF5, texto #047857,
 *   padding 5x9, radio 100.
 * - primary (0:1 · "EMPRESAS"): fondo #EEF2FA, texto #1E3A8A,
 *   padding 5x9, radio 6.
 */
export function Badge({ label, tone = 'success', icon }: BadgeProps) {
  const isSuccess = tone === 'success';

  return (
    <View
      style={[styles.base, isSuccess ? styles.success : styles.primary]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      {icon}
      <AppText
        variant="badge"
        color={isSuccess ? 'successStrong' : 'primary'}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.smPlus,
    paddingHorizontal: spacing.mdInset,
    paddingVertical: spacing.smPlus,
    alignSelf: 'flex-start',
  },
  success: {
    backgroundColor: colors.successSoft,
    borderRadius: radii.pill,
  },
  primary: {
    backgroundColor: colors.surfaceRoleBadge,
    borderRadius: radii.sm,
  },
});
