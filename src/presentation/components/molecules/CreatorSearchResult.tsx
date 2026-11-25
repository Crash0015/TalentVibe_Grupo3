import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {
  borderWidths,
  colors,
  radii,
  spacing,
} from '../../theme';
import { AppText, Avatar, Badge } from '../atoms';

export interface CreatorSearchResultProps {
  displayName: string;
  handle: string;
  bio?: string;
  accountType?: string;
  followersCount?: number;
  likesCount?: number;
  affinityScore?: number | null;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

function formatCount(value: number | undefined): string {
  const count = Number.isFinite(value) ? (value as number) : 0;

  if (count >= 1_000_000_000) {
    return `${(count / 1_000_000_000).toFixed(1).replace('.0', '')}B`;
  }

  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace('.0', '')}M`;
  }

  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace('.0', '')}K`;
  }

  return `${count}`;
}

/**
 * Fila de resultado de búsqueda global. Muestra la foto local por handle,
 * métricas públicas y el tipo de cuenta del dataset.
 */
export function CreatorSearchResult({
  displayName,
  handle,
  bio,
  accountType,
  followersCount,
  likesCount,
  affinityScore,
  onPress,
  style,
}: CreatorSearchResultProps) {
  const isInfluencer = accountType === 'influencer';
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${displayName}, ${handle}`}
      style={({ pressed }) => [
        styles.card,
        isLandscape && styles.cardLandscape,
        pressed && onPress ? styles.pressed : null,
        style,
      ]}
    >
      <Avatar name={displayName} handle={handle} size="md" />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <AppText
            variant="candidateName"
            color="textStrong"
            numberOfLines={1}
            style={styles.name}
          >
            {displayName}
          </AppText>

          <Badge
            label={isInfluencer ? 'Influencer' : 'Creador'}
            tone="primary"
          />
        </View>

        <AppText variant="candidateMeta" color="textSecondary">
          {handle}
        </AppText>

        {bio ? (
          <AppText
            variant="caption"
            color="textSubtle"
            numberOfLines={1}
          >
            {bio}
          </AppText>
        ) : null}

        <AppText variant="caption" color="textSubtle">
          {`${formatCount(followersCount)} seguidores · ${formatCount(
            likesCount,
          )} likes`}
        </AppText>
      </View>

      {affinityScore !== null && affinityScore !== undefined ? (
        <View style={styles.score}>
          <AppText variant="statistic" color="success">
            {`${affinityScore}%`}
          </AppText>
          <AppText variant="badge" color="success">
            Match
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xlPlus,
    padding: spacing.xxl,
    backgroundColor: colors.surface,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    borderRadius: radii.lg,
  },
  cardLandscape: {
    padding: spacing.xl,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  name: {
    flex: 1,
  },
  score: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  pressed: {
    opacity: 0.85,
  },
});
