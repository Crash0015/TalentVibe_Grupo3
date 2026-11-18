import { StyleSheet, View } from 'react-native';

import { spacing } from '../../theme';
import { AppText, ProgressBar } from '../atoms';

export interface BigFiveTraitRowProps {
  /** Nombre del rasgo OCEAN (Innovación, Empatía, etc.). */
  label: string;
  /** Valor del rasgo entre 0 y 100. */
  value: number;
}

/**
 * Fila de rasgo Big Five (35:6 · "Rasgo" en "Perfil Big Five").
 *
 * Etiqueta 11 Regular #657185 · barra de 5px que ocupa el espacio disponible
 * · valor 10 Semi Bold #047857.
 */
export function BigFiveTraitRow({ label, value }: BigFiveTraitRowProps) {
  return (
    <View style={styles.row}>
      <AppText variant="traitLabel" color="textSecondary">
        {label}
      </AppText>

      <View style={styles.bar}>
        <ProgressBar value={value} label={label} />
      </View>

      <AppText variant="badge" color="successStrong">
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xlPlus,
  },
  bar: {
    flex: 1,
  },
});
