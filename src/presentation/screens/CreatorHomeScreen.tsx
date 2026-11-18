import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import type { CreatorPsychometricReport } from '../../modules/psychometric/application/CreatorPsychometricReport';
import { createPsychometricModule } from '../../modules/psychometric/infrastructure/createPsychometricModule';
import { SAMPLE_BRAND_CULTURE_PROFILE } from '../../modules/psychometric/infrastructure/mockCreatorProfiles';
import { useAuth } from '../context/AuthContext';
import {
  borderWidths,
  colors,
  fontWeights,
  radii,
  sizes,
  spacing,
} from '../theme';
import { AppButton, AppText, Avatar, Badge } from '../components/atoms';
import { BigFiveReportCard } from '../components/organisms';

function riskLabel(level: CreatorPsychometricReport['riskLevel']): string {
  if (level === 'LOW_RISK') {
    return 'Bajo riesgo';
  }

  if (level === 'MEDIUM_RISK') {
    return 'Riesgo medio';
  }

  return 'Alto riesgo';
}

/**
 * Home del rol Creador.
 *
 * Muestra el estado de sincronización con TikTok, permite recalcular el
 * análisis Big Five y presenta el reporte personal del creador.
 */
export function CreatorHomeScreen() {
  const { user, logout } = useAuth();
  const psychometric = useMemo(() => createPsychometricModule(), []);

  const [report, setReport] = useState<CreatorPsychometricReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoadingReport(false);
      return;
    }

    let isActive = true;

    const loadReport = async () => {
      try {
        const detail = await psychometric.analyzeCreator.execute({
          handle: user.handleOrCompany,
          targetProfile: SAMPLE_BRAND_CULTURE_PROFILE,
        });

        if (isActive) {
          setReport(detail);
        }
      } catch {
        try {
          const stored = await psychometric.getCreatorReport.execute(user.id);

          if (isActive) {
            setReport(stored);
          }
        } catch {
          // Cuenta nueva sin análisis previo: se genera al sincronizar.
        }
      } finally {
        if (isActive) {
          setIsLoadingReport(false);
        }
      }
    };

    void loadReport();

    return () => {
      isActive = false;
    };
  }, [psychometric, user]);

  const handleSync = async () => {
    if (!user) {
      return;
    }

    setIsSyncing(true);
    setError(null);

    try {
      const detail = await psychometric.analyzeCreator.execute({
        handle: user.handleOrCompany,
        targetProfile: SAMPLE_BRAND_CULTURE_PROFILE,
      });
      setReport(detail);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No pudimos analizar tu perfil de TikTok.',
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // El repositorio mock no falla al cerrar sesión.
    }
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <AppText variant="badge" color="textOnPrimary">
              TV
            </AppText>
          </View>
          <AppText variant="h2" style={styles.brandName}>
            TalentVibe
          </AppText>
        </View>

        <Badge label="CREADOR" tone="primary" />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Avatar name={user.name} size="lg" />

          <View style={styles.identity}>
            <AppText variant="h1">{user.name}</AppText>
            <AppText variant="candidateMeta" color="textSecondary">
              {user.handleOrCompany}
            </AppText>
          </View>
        </View>

        <View style={styles.syncCard}>
          <View style={styles.syncHeader}>
            <View style={styles.identity}>
              <AppText variant="sectionTitle">
                Sincronización con TikTok
              </AppText>
              <AppText variant="candidateMeta" color="textSecondary">
                {user.emailAddress}
              </AppText>
            </View>

            <Badge
              label={report ? 'Sincronizado' : 'Pendiente'}
              tone={report ? 'success' : 'primary'}
            />
          </View>

          <AppButton
            label={report ? 'Volver a analizar' : 'Sincronizar perfil'}
            variant={report ? 'secondary' : 'primary'}
            onPress={handleSync}
            loading={isSyncing}
            fullWidth
          />

          {error ? (
            <AppText variant="caption" color="textPrimary">
              {error}
            </AppText>
          ) : null}
        </View>

        {isLoadingReport ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : report ? (
          <>
            <View style={styles.reportSummary}>
              <View style={styles.stat}>
                <AppText variant="caption" color="textSecondary">
                  Compatibilidad
                </AppText>
                <AppText variant="statisticLarge" color="success">
                  {report.affinityScore === null
                    ? '—'
                    : `${report.affinityScore}%`}
                </AppText>
              </View>

              <View style={styles.stat}>
                <AppText variant="caption" color="textSecondary">
                  Riesgo TikTok
                </AppText>
                <Badge
                  label={riskLabel(report.riskLevel)}
                  tone={
                    report.riskLevel === 'LOW_RISK' ? 'success' : 'primary'
                  }
                />
              </View>

              <View style={styles.stat}>
                <AppText variant="caption" color="textSecondary">
                  Puntaje de riesgo
                </AppText>
                <AppText variant="statisticSmall" color="textPrimary">
                  {`${report.riskScore}/100`}
                </AppText>
              </View>
            </View>

            <BigFiveReportCard
              traits={report.profile}
              title="TU PERFIL BIG FIVE"
            />
          </>
        ) : (
          <View style={styles.emptyCard}>
            <AppText variant="sectionTitle">Aún no hay análisis</AppText>
            <AppText variant="body" color="textSecondary">
              Sincroniza tu usuario de TikTok para generar tu perfil Big Five
              y conocer tu compatibilidad con las marcas.
            </AppText>
          </View>
        )}

        <AppButton
          label="Cerrar sesión"
          variant="secondary"
          onPress={handleLogout}
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxxlWide,
    paddingVertical: spacing.xl,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.mdInset,
  },
  brandMark: {
    width: sizes.logoMark,
    height: sizes.logoMark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
  },
  brandName: {
    fontWeight: fontWeights.bold,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xxxlWide,
    gap: spacing.xxxlWide,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xlPlus,
  },
  identity: {
    flex: 1,
    gap: spacing.sm,
  },
  syncCard: {
    gap: spacing.xxlWide,
    padding: spacing.xxxlPlus,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.xl,
  },
  loading: {
    paddingVertical: spacing.canvas,
    alignItems: 'center',
  },
  reportSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xl,
    padding: spacing.xxxlPlus,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  stat: {
    flex: 1,
    gap: spacing.sm,
  },
  emptyCard: {
    gap: spacing.xl,
    padding: spacing.xxxlPlus,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
});
