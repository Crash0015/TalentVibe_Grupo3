import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, sizes } from '../../theme';

export interface ProgressBarProps {
  /** Valor entre 0 y 100. */
  value: number;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Barra de progreso de los rasgos Big Five (35:6 · "Rasgo").
 *
 * - Pista: 5px de alto, #EDF0F5, radio 999.
 * - Relleno: #10B981, radio 100.
 */
export function ProgressBar({ value, label, style }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped) }}
      style={[styles.track, style]}
    >
      <View style={[styles.fill, { width: `${clamped}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: sizes.progressTrack,
    backgroundColor: colors.progressTrack,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.progressFill,
    borderRadius: radii.pill,
  },
});
