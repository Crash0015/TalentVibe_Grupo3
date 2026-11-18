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

import type { UserRole } from '../../modules/auth/domain/User';
import { useAuth } from '../context/AuthContext';
import {
  borderWidths,
  colors,
  radii,
  sizes,
  spacing,
} from '../theme';
import { AppButton, AppInput, AppText } from '../components/atoms';

export interface RegisterScreenProps {
  onBack: () => void;
  onLogin: () => void;
}

const ROLE_OPTIONS: ReadonlyArray<{ role: UserRole; label: string }> = [
  { role: 'COMPANY', label: 'Marca' },
  { role: 'CREATOR', label: 'Creador' },
];

/**
 * Registro de cuenta con selección de rol (Marca / Creador).
 *
 * Tras registrarse, el caso de uso abre sesión y `App` navega al home del rol.
 */
export function RegisterScreen({ onBack, onLogin }: RegisterScreenProps) {
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>('COMPANY');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handleOrCompany, setHandleOrCompany] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCompany = role === 'COMPANY';

  const handleRegister = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await register({ name, email, password, role, handleOrCompany });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No pudimos crear la cuenta. Inténtalo de nuevo.',
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
            <AppText variant="h1">Crea tu cuenta</AppText>
            <AppText variant="body" color="textSecondary">
              Elige tu rol para ver la experiencia correspondiente en
              TalentVibe.
            </AppText>
          </View>

          <View style={styles.roleRow}>
            {ROLE_OPTIONS.map((option) => {
              const isActive = role === option.role;

              return (
                <Pressable
                  key={option.role}
                  onPress={() => setRole(option.role)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  style={[
                    styles.roleOption,
                    isActive ? styles.roleOptionActive : null,
                  ]}
                >
                  <AppText
                    variant="buttonLabel"
                    color={isActive ? 'textOnPrimary' : 'textPrimary'}
                  >
                    {option.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.form}>
            <AppInput
              label="Nombre completo"
              value={name}
              onChangeText={setName}
              placeholder="Valentina Rojas"
              autoCapitalize="words"
            />
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
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
            />
            <AppInput
              label={isCompany ? 'Nombre de la empresa' : 'Usuario de TikTok'}
              value={handleOrCompany}
              onChangeText={setHandleOrCompany}
              placeholder={isCompany ? 'Estudio Nova S.A.S.' : '@tuusuario'}
              autoCapitalize="none"
            />

            {error ? (
              <AppText variant="caption" color="textPrimary">
                {error}
              </AppText>
            ) : null}

            <AppButton
              label="Crear cuenta"
              onPress={handleRegister}
              loading={isSubmitting}
              fullWidth
            />
          </View>

          <View style={styles.footer}>
            <AppText variant="caption" color="textSecondary">
              ¿Ya tienes cuenta?
            </AppText>
            <Pressable onPress={onLogin} accessibilityRole="button">
              <AppText variant="buttonLabel" color="primary">
                Iniciar sesión
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
  roleRow: {
    flexDirection: 'row',
    gap: spacing.xlPlus,
  },
  roleOption: {
    flex: 1,
    height: sizes.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  roleOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  form: {
    gap: spacing.xxlWide,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: 'auto',
  },
});
