import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import {
  borderWidths,
  colors,
  radii,
  spacing,
} from '../../theme';
import { AppText } from '../atoms';
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
 * Eyebrow 10 Semi Bold con tracking 0.07em, tarjeta blanca con borde
 * #E5E7EB, radio 12 y filas de rasgo separadas por 13px.
 */
export function BigFiveReportCard({
  traits,
  title = 'BIG FIVE · PERFIL DE AFINIDAD',
  style,
}: BigFiveReportCardProps) {
  return (
    <View style={[styles.card, style]}>
      <AppText variant="cardEyebrow" color="textSecondary">
        {title}
      </AppText>

      <View style={styles.traits}>
        {TRAIT_ROWS.map((trait) => (
          <BigFiveTraitRow
            key={trait.key}
            label={trait.label}
            value={traits[trait.key]}
          />
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
  traits: {
    gap: spacing.xlWide,
  },
});
