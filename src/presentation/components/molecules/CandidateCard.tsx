import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {
  borderWidths,
  colors,
  fontWeights,
  radii,
  shadows,
  spacing,
} from '../../theme';
import { AppText, Avatar } from '../atoms';
import { MatchStat } from './MatchStat';

export type CandidateCardVariant = 'default' | 'compact';

export interface CandidateCardProps {
  name: string;
  /** Carrera o categoría del creador. */
  subtitle: string;
  /** Compatibilidad calculada por psychometric (0-100). */
  affinityScore: number;
  avatarUri?: string | null;
  /**
   * `default` = tarjeta del prototipo 0:1 (48px, píldora de match).
   * `compact` = tarjeta del directorio 35:6 (34px, badge "Alto Match").
   */
  variant?: CandidateCardVariant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Tarjeta de candidato.
 *
 * Reutiliza los estilos exactos de los dos nodos de Figma:
 * - 0:1: fila, padding 14, gap 12, radio 12, sombra 0 2 8 rgba(17,24,39,.02).
 * - 35:6: columna, padding 10, gap 7, borde 1px #E5E7EB, radio 12.
 */
export function CandidateCard({
  name,
  subtitle,
  affinityScore,
  avatarUri,
  variant = 'default',
  onPress,
  style,
}: CandidateCardProps) {
  const isCompact = variant === 'compact';

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${name}, ${affinityScore}% de compatibilidad`}
      style={({ pressed }) => [
        styles.card,
        isCompact ? styles.compactCard : styles.defaultCard,
        pressed && onPress ? styles.pressed : null,
        style,
      ]}
    >
      {isCompact ? (
        <View style={styles.compactContent}>
          <View style={styles.identityRow}>
            <Avatar uri={avatarUri} name={name} size="sm" />
            <View style={styles.compactInfo}>
              <AppText
                variant="iconLabel"
                color="textPrimary"
                style={styles.compactName}
              >
                {name}
              </AppText>
              <AppText
                variant="micro"
                color="textSecondary"
                style={styles.compactMeta}
              >
                {subtitle}
              </AppText>
            </View>
          </View>

          <MatchStat score={affinityScore} size="sm" />
        </View>
      ) : (
        <>
          <Avatar uri={avatarUri} name={name} size="lg" />

          <View style={styles.info}>
            <AppText variant="candidateName" color="textStrong">
              {name}
            </AppText>
            <AppText variant="candidateMeta" color="textSubtle">
              {subtitle}
            </AppText>
          </View>

          <View style={styles.scorePill}>
            <AppText variant="statisticLarge" color="success">
              {`${affinityScore}%`}
            </AppText>
            <AppText variant="badge" color="success">
              Match
            </AppText>
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
  },
  defaultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xlPlus,
    padding: spacing.xxl,
    ...shadows.card,
  },
  compactCard: {
    flexDirection: 'column',
    gap: spacing.mdPlus,
    padding: spacing.xl,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  compactContent: {
    gap: spacing.mdPlus,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  compactInfo: {
    flex: 1,
    gap: spacing.sm,
  },
  compactName: {
    fontWeight: fontWeights.semiBold,
  },
  compactMeta: {
    fontWeight: fontWeights.regular,
  },
  info: {
    flex: 1,
    gap: spacing.smPlus,
  },
  scorePill: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.successSoft,
    borderRadius: radii.md,
  },
  /** Feedback táctil (Figma no define estado pressed). */
  pressed: {
    opacity: 0.85,
  },
});
