import { StyleSheet, View } from 'react-native';

import { colors, iconSizes, spacing } from '../../theme';
import { AppText, Badge } from '../atoms';

export interface MatchStatProps {
  /** Porcentaje de compatibilidad (0-100). */
  score: number;
  /** Texto del badge; por defecto "Alto Match". */
  label?: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

/**
 * Indicador de compatibilidad (35:6 · "Compatibilidad").
 *
 * Badge verde "Alto Match" + porcentaje Bold #047857.
 * - md: porcentaje 16 Bold (tarjeta de candidato del sistema de diseño).
 * - sm: porcentaje 12 Bold (tarjeta compacta del wireframe).
 */
export function MatchStat({
  score,
  label = 'Alto Match',
  size = 'md',
  showIcon = true,
}: MatchStatProps) {
  const isSmall = size === 'sm';

  return (
    <View style={styles.row}>
      <Badge
        label={label}
        tone="success"
        icon={
          showIcon ? (
            <AppText variant="badge" color="successStrong" style={styles.check}>
              ✓
            </AppText>
          ) : null
        }
      />

      <AppText
        variant={isSmall ? 'label' : 'statistic'}
        color="successStrong"
      >
        {`${score}%`}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.mdInset,
  },
  check: {
    fontSize: iconSizes.sm,
    lineHeight: iconSizes.sm,
    color: colors.successStrong,
  },
});
