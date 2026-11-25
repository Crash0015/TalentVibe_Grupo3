import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { borderWidths, colors, radii, spacing } from '../theme';
import { AppButton, AppInput, AppText } from '../components/atoms';

export interface LoginScreenProps {
  onBack: () => void;
  onRegister: () => void;
}

/**
 * Login con formulario y accesos demo.
 *
 * En horizontal se separa el mensaje del formulario para que el teclado
 * no tape los campos ni el botón principal.
 */
export function LoginScreen({ onBack, onRegister }: LoginScreenProps) {
  const { login, demoCredentials } = useAuth();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fillCredentials = (account: 'company' | 'creator') => {
    setEmail(demoCredentials[account].email);
    setPassword(demoCredentials[account].password);
    setError(null);
  };

  const handleLogin = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No pudimos iniciar sesión. Inténtalo de nuevo.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            isLandscape && styles.contentLandscape,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Volver a la bienvenida"
          >
            <AppText variant="buttonLabel" color="primary">
              Volver
            </AppText>
          </Pressable>

          <View
            style={[styles.columns, isLandscape && styles.columnsLandscape]}
          >
            <View style={[styles.column, isLandscape && styles.columnLandscape]}>
              <View style={styles.heading}>
                <View style={styles.brand}>
                  <View style={styles.brandMark}>
                    <AppText variant="badge" color="textOnPrimary">
                      TV
                    </AppText>
                  </View>

                  <AppText variant="h2">TalentVibe</AppText>
                </View>

                <View style={styles.headingText}>
                  <AppText variant="caption" color="textSecondary">
                    TU ESPACIO CREATIVO
                  </AppText>

                  <AppText variant="h1">Bienvenido de nuevo</AppText>

                  <AppText variant="body" color="textSecondary">
                    Inicia sesión y continúa conectando con oportunidades,
                    creadores y marcas.
                  </AppText>
                </View>
              </View>
            </View>

            <View style={[styles.column, isLandscape && styles.columnLandscape]}>
              <View style={styles.form}>
                <AppInput
                  label="Correo"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@correo.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                />
                <AppInput
                  label="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                />

                {error ? (
                  <AppText variant="caption" color="textPrimary">
                    {error}
                  </AppText>
                ) : null}

                <AppButton
                  label="Iniciar sesión"
                  onPress={handleLogin}
                  loading={isSubmitting}
                  fullWidth
                />
              </View>

              <View style={styles.demo}>
                <AppText variant="cardEyebrow" color="textSecondary">
                  CUENTAS DEMO
                </AppText>

                <View style={styles.demoButtons}>
                  <AppButton
                    label="Rellenar marca"
                    variant="secondary"
                    onPress={() => fillCredentials('company')}
                    style={styles.demoButton}
                  />
                  <AppButton
                    label="Rellenar creador"
                    variant="secondary"
                    onPress={() => fillCredentials('creator')}
                    style={styles.demoButton}
                  />
                </View>
              </View>

              <View style={styles.footer}>
                <AppText variant="caption" color="textSecondary">
                  ¿No tienes cuenta?
                </AppText>
                <Pressable onPress={onRegister} accessibilityRole="button">
                  <AppText variant="buttonLabel" color="primary">
                    Crear cuenta
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.hugeWide,
    gap: spacing.hugeWide,
  },
  contentLandscape: {
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.canvas,
    paddingVertical: spacing.xxxlWide,
  },
  columns: {
    flexGrow: 1,
    gap: spacing.hugeWide,
  },
  columnsLandscape: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {
    gap: spacing.hugeWide,
  },
  columnLandscape: {
    flex: 1,
  },
  heading: {
    gap: spacing.md,
  },
  headingText: {
    gap: spacing.md,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.mdInset,
  },
  brandMark: {
    width: spacing.hugeWide + spacing.xxxlWide,
    height: spacing.hugeWide + spacing.xxxlWide,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
  },
  form: {
    gap: spacing.xxlWide,
  },
  demo: {
    gap: spacing.xl,
    padding: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  demoButtons: {
    flexDirection: 'row',
    gap: spacing.xlPlus,
  },
  demoButton: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
});
