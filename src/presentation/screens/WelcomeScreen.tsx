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
 * Pantalla de bienvenida (35:6 · "Identidad de TalentVibe").
 *
 * Fondo #F9FAFB, logotipo Talent (navy) + Vibe (esmeralda),
 * eyebrow "TALENTO + CULTURA" y titular 43 Regular.
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
              TALENTO + CULTURA
            </AppText>
          </View>
        </View>

        <View style={styles.hero}>
          <AppText variant="brandDisplay" color="textPrimary">
            Conecta talento con cultura.
          </AppText>
          <AppText variant="bodyRelaxed" color="textSecondary">
            Evaluamos la personalidad de creadores de TikTok con el modelo
            Big Five (OCEAN) para que tu marca encuentre compatibilidad real y
            descarte perfiles polémicos.
          </AppText>
        </View>

        <View style={styles.actions}>
          <AppButton
            label="Iniciar sesión"
            onPress={onLogin}
            fullWidth
          />
          <AppButton
            label="Crear cuenta"
            variant="secondary"
            onPress={onRegister}
            fullWidth
          />
          <AppText variant="caption" color="textSubtle" style={styles.legal}>
            Proyecto de Titulación · Ingeniería en Sistemas de Información
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
