import {
  StyleSheet,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {
  borderWidths,
  colors,
  radii,
  spacing,
} from '../../theme';
import { AppText, Avatar } from '../atoms';
import { BigFiveTraitRow } from '../molecules';

export interface BigFiveTraitsInput {
  innovation: number;
  selfManagement: number;
  communication: number;
  empathy: number;
  resilience: number;
}

export interface BigFiveReportCardProps {
  traits: BigFiveTraitsInput;
  /** Eyebrow superior; por defecto el del nodo 35:6. */
  title?: string;
  name?: string;
  /** @handle para resolver la foto local del registro de avatares. */
  handle?: string | null;
  imageSource?: ImageSourcePropType | null;
  style?: StyleProp<ViewStyle>;
}

const TRAIT_ROWS: ReadonlyArray<{
  key: keyof BigFiveTraitsInput;
  label: string;
}> = [
  { key: 'innovation', label: 'Innovación' },
  { key: 'selfManagement', label: 'Autogestión' },
  { key: 'communication', label: 'Comunicación' },
  { key: 'empathy', label: 'Empatía' },
  { key: 'resilience', label: 'Resiliencia' },
];

/**
 * Reporte Big Five de un creador (35:6 · "Perfil Big Five").
 *
 * Si recibe `name`/`handle`/`imageSource`, muestra la identidad con foto
 * real encima de los rasgos. Eyebrow 10 Semi Bold con tracking 0.07em,
 * tarjeta blanca con borde #E5E7EB, radio 12 y filas separadas por 13px.
 */
export function BigFiveReportCard({
  traits,
  title = 'BIG FIVE · PERFIL DE AFINIDAD',
  name,
  handle,
  imageSource,
  style,
}: BigFiveReportCardProps) {
  const showIdentity = Boolean(name || handle || imageSource);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <View
      style={[styles.card, isLandscape && styles.cardLandscape, style]}
    >
      {showIdentity ? (
        <View style={styles.header}>
          <Avatar
            name={name}
            handle={handle}
            imageSource={imageSource}
            size="md"
          />

          <View style={styles.headerText}>
            <AppText variant="cardEyebrow" color="textSecondary">
              {title}
            </AppText>

            {name ? (
              <AppText variant="sectionTitle" color="textPrimary">
                {name}
              </AppText>
            ) : null}

            {handle ? (
              <AppText variant="candidateMeta" color="textSecondary">
                {handle}
              </AppText>
            ) : null}
          </View>
        </View>
      ) : (
        <AppText variant="cardEyebrow" color="textSecondary">
          {title}
        </AppText>
      )}

      <View style={[styles.traits, isLandscape && styles.traitsLandscape]}>
        {TRAIT_ROWS.map((trait) => (
          <View
            key={trait.key}
            style={isLandscape ? styles.traitLandscape : undefined}
          >
            <BigFiveTraitRow
              label={trait.label}
              value={traits[trait.key]}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xlWide,
    padding: spacing.xxxlPlus,
    backgroundColor: colors.surface,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    borderRadius: radii.lg,
  },
  cardLandscape: {
    padding: spacing.xxlWide,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xlPlus,
  },
  headerText: {
    flex: 1,
    gap: spacing.sm,
  },
  traits: {
    gap: spacing.xlWide,
  },
  traitsLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xlPlus,
  },
  traitLandscape: {
    width: '48%',
  },
});
