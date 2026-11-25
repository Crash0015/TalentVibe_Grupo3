import {
  FlatList,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { fontWeights, spacing } from '../../theme';
import { AppText } from '../atoms';
import { CandidateCard } from '../molecules';

export interface CandidateListItem {
  creatorId: string;
  name: string;
  /** Carrera o categoría mostrada bajo el nombre. */
  subtitle: string;
  affinityScore: number;
  avatarUri?: string | null;
  /** @handle para resolver la foto local del registro de avatares. */
  handle?: string | null;
}

export interface CandidateListProps {
  candidates: readonly CandidateListItem[];
  onSelect?: (candidate: CandidateListItem) => void;
  emptyMessage?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Directorio de candidatos (0:1 · "Directorio").
 *
 * Resumen de resultados (12 Regular #6B7280 + "Mayor match" 12 Medium
 * #1E3A8A) seguido de las tarjetas separadas por 12px.
 */
export function CandidateList({
  candidates,
  onSelect,
  emptyMessage = 'No hay candidatos con estos filtros.',
  style,
}: CandidateListProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const numColumns = isLandscape ? 2 : 1;

  return (
    <FlatList
      key={`candidates-${numColumns}`}
      numColumns={numColumns}
      columnWrapperStyle={isLandscape ? styles.column : undefined}
      data={[...candidates]}
      keyExtractor={(item) => item.creatorId}
      renderItem={({ item }) => (
        <CandidateCard
          name={item.name}
          subtitle={item.subtitle}
          affinityScore={item.affinityScore}
          avatarUri={item.avatarUri}
          handle={item.handle}
          onPress={onSelect ? () => onSelect(item) : undefined}
          style={isLandscape ? styles.cardLandscape : undefined}
        />
      )}
      ItemSeparatorComponent={
        isLandscape ? undefined : () => <View style={styles.separator} />
      }
      ListHeaderComponent={
        <View style={styles.summary}>
          <AppText variant="caption" color="textSubtle">
            {`${candidates.length} candidatos`}
          </AppText>
          <AppText variant="caption" color="primary" style={styles.sortLabel}>
            Mayor match
          </AppText>
        </View>
      }
      ListEmptyComponent={
        <AppText variant="body" color="textSecondary" style={styles.empty}>
          {emptyMessage}
        </AppText>
      }
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxxlWide,
  },
  column: {
    gap: spacing.xlPlus,
    marginBottom: spacing.xlPlus,
  },
  cardLandscape: {
    flex: 1,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  sortLabel: {
    fontWeight: fontWeights.medium,
  },
  separator: {
    height: spacing.xlPlus,
  },
  empty: {
    paddingVertical: spacing.canvas,
    textAlign: 'center',
  },
});
