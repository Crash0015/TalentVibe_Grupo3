
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { colors, radii, spacing } from '../theme';
import { AppButton, AppText } from '../components/atoms';

export interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

/**
 * Pantalla de bienvenida de TalentVibe.
 *
 * Presenta la propuesta de valor de la plataforma
 * y permite acceder al inicio de sesión o registro.
 */
export function WelcomeScreen({ onLogin, onRegister }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandBlock}>
          <View style={styles.logoRow}>
            <AppText variant="logotype" color="primary">
              Talent
            </AppText>
            <AppText variant="logotype" color="brandAccent">
              Vibe
            </AppText>
          </View>

          <View style={styles.corporate}>
            <View style={styles.accent} />
            <AppText variant="eyebrow" color="textSecondary">
              INTELIGENCIA DE TALENTO DIGITAL
            </AppText>
          </View>
        </View>

        <View style={styles.hero}>
          <AppText variant="brandDisplay" color="textPrimary">
            Conectamos marcas con talento compatible.
          </AppText>

          <AppText variant="bodyRelaxed" color="textSecondary">
            Identificamos afinidades entre marcas y creadores mediante
            análisis psicométrico basado en el modelo Big Five (OCEAN),
            facilitando decisiones de colaboración fundamentadas en datos.
          </AppText>
        </View>

        <View style={styles.actions}>
          <AppButton
            label="Acceder a la plataforma"
            onPress={onLogin}
            fullWidth
          />

          <AppButton
            label="Registrar una cuenta"
            variant="secondary"
            onPress={onRegister}
            fullWidth
          />

          <AppText variant="caption" color="textSubtle" style={styles.legal}>
            Una plataforma de análisis y conexión de talento digital
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: spacing.hugeWide,
    gap: spacing.hugeWide,
  },
  brandBlock: {
    gap: spacing.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  corporate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.mdPlus,
  },
  accent: {
    width: spacing.xxxlWide,
    height: spacing.xs,
    borderRadius: radii.xs,
    backgroundColor: colors.secondary,
  },
  hero: {
    flex: 1,
    gap: spacing.xlWide,
    justifyContent: 'center',
  },
  actions: {
    gap: spacing.xlPlus,
  },
  legal: {
    textAlign: 'center',
  },
});
