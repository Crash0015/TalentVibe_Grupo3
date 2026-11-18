import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { borderWidths, colors, radii, spacing } from '../theme';
import { AppButton, AppInput, AppText } from '../components/atoms';

export interface LoginScreenProps {
  onBack: () => void;
  onRegister: () => void;
}

/**
 * Login (0:1 · encabezado + formulario).
 *
 * Incluye botones rápidos que rellenan las credenciales demo expuestas
 * por `AuthContext`.
 */
export function LoginScreen({ onBack, onRegister }: LoginScreenProps) {
  const { login, demoCredentials } = useAuth();
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
          contentContainerStyle={styles.content}
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

          <View style={styles.heading}>
            <AppText variant="h1">Bienvenido de nuevo</AppText>
            <AppText variant="body" color="textSecondary">
              Inicia sesión para revisar creadores, matches y propuestas.
            </AppText>
          </View>

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
  heading: {
    gap: spacing.md,
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
    marginTop: 'auto',
  },
});
