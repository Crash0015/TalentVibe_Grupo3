import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import type {
  DiscoveryCandidate,
  SwipeDirection,
} from '../../modules/discovery/domain/DiscoveryModels';
import { createDiscoveryModule } from '../../modules/discovery/infrastructure/createDiscoveryModule';
import type { Match } from '../../modules/hiring/domain/HiringModels';
import { createHiringModule } from '../../modules/hiring/infrastructure/createHiringModule';
import type { CreatorPsychometricReport } from '../../modules/psychometric/application/CreatorPsychometricReport';
import { createPsychometricModule } from '../../modules/psychometric/infrastructure/createPsychometricModule';
import { useAuth } from '../context/AuthContext';
import {
  borderWidths,
  colors,
  fontWeights,
  radii,
  sizes,
  spacing,
} from '../theme';
import { AppButton, AppInput, AppText, Avatar, Badge } from '../components/atoms';
import {
  BigFiveReportCard,
  BottomTabBar,
  CandidateList,
  SwipeDeckView,
  type CandidateListItem,
  type TabId,
  type TabItem,
} from '../components/organisms';

type CompanyTab = Extract<TabId, 'discovery' | 'matches' | 'profile'>;

const COMPANY_TABS: readonly TabItem[] = [
  { id: 'discovery', label: 'Explorar' },
  { id: 'matches', label: 'Matches' },
  { id: 'profile', label: 'Perfil' },
];

function riskLabel(level: Match['riskLevel']): string {
  if (level === 'LOW_RISK') {
    return 'Bajo riesgo';
  }

  if (level === 'MEDIUM_RISK') {
    return 'Riesgo medio';
  }

  return 'Alto riesgo';
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <AppText variant="caption" color="textSecondary">
        {label}
      </AppText>
      <AppText variant="body" color="textPrimary" style={styles.infoValue}>
        {value}
      </AppText>
    </View>
  );
}

/**
 * Home del rol Marca (0:1 · "TalentVibe · Candidatos").
 *
 * Pestañas: Explorar (mazo con swipe), Matches (lista + detalle Big Five +
 * propuesta) y Perfil (datos de la marca y cierre de sesión).
 */
export function CompanyHomeScreen() {
  const { user, logout } = useAuth();
  const discovery = useMemo(() => createDiscoveryModule(), []);
  const hiring = useMemo(() => createHiringModule(), []);
  const psychometric = useMemo(() => createPsychometricModule(), []);

  const [tab, setTab] = useState<CompanyTab>('discovery');
  const [deck, setDeck] = useState<DiscoveryCandidate[]>([]);
  const [isLoadingDeck, setIsLoadingDeck] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [report, setReport] = useState<CreatorPsychometricReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [proposalFeedback, setProposalFeedback] = useState<string | null>(null);
  const [isSendingProposal, setIsSendingProposal] = useState(false);

  useEffect(() => {
    let isActive = true;

    discovery.getDeck
      .execute()
      .then((candidates) => {
        if (isActive) {
          setDeck(candidates);
        }
      })
      .catch(() => {
        if (isActive) {
          setDeck([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingDeck(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [discovery]);

  useEffect(() => {
    let isActive = true;

    hiring.getApprovedMatches
      .execute()
      .then((approved) => {
        if (isActive) {
          setMatches(approved);
        }
      })
      .catch(() => {
        if (isActive) {
          setMatches([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingMatches(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [hiring]);

  const openMatch = useCallback(
    async (match: Match) => {
      setSelectedMatch(match);
      setReport(null);
      setProposalFeedback(null);
      setCampaignName('');
      setMessage('');
      setIsLoadingReport(true);

      try {
        const detail = await psychometric.getCreatorReport.execute(
          match.creatorId,
        );
        setReport(detail);
      } catch {
        setReport(null);
      } finally {
        setIsLoadingReport(false);
      }
    },
    [psychometric],
  );

  const handleSwipe = useCallback(
    (direction: SwipeDirection, candidate: DiscoveryCandidate) => {
      discovery.swipe
        .execute({ creatorId: candidate.creatorId, direction })
        .catch(() => {
          // El mock no falla; se ignora para no bloquear el mazo.
        });
    },
    [discovery],
  );

  const handleSendProposal = async () => {
    if (!selectedMatch) {
      return;
    }

    setIsSendingProposal(true);
    setProposalFeedback(null);

    try {
      await hiring.sendProposal.execute({
        creatorId: selectedMatch.creatorId,
        campaignName,
        message,
      });
      setProposalFeedback('Propuesta enviada. El creador podrá revisarla.');
      setCampaignName('');
      setMessage('');
    } catch (cause) {
      setProposalFeedback(
        cause instanceof Error
          ? cause.message
          : 'No se pudo enviar la propuesta.',
      );
    } finally {
      setIsSendingProposal(false);
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

  const candidateItems: CandidateListItem[] = matches.map((match) => ({
    creatorId: match.creatorId,
    name: match.displayName,
    subtitle: match.handle,
    affinityScore: match.affinityScore,
  }));

  const handleSelectCandidate = (item: CandidateListItem) => {
    const match = matches.find(
      (candidate) => candidate.creatorId === item.creatorId,
    );

    if (match) {
      void openMatch(match);
    }
  };

  const renderExplore = () => (
    <ScrollView
      style={styles.body}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sectionHeading}>
        <AppText variant="screenTitle">Explorar creadores</AppText>
        <AppText variant="caption" color="textSubtle">
          Desliza a la derecha para guardar un match.
        </AppText>
      </View>

      {isLoadingDeck ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <SwipeDeckView candidates={deck} onSwipe={handleSwipe} />
      )}
    </ScrollView>
  );

  const renderDetail = () => {
    if (!selectedMatch) {
      return null;
    }

    return (
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => setSelectedMatch(null)}
          accessibilityRole="button"
        >
          <AppText variant="buttonLabel" color="primary">
            Volver a matches
          </AppText>
        </Pressable>

        <View style={styles.detailHeader}>
          <Avatar name={selectedMatch.displayName} size="lg" />

          <View style={styles.detailIdentity}>
            <AppText variant="h1">{selectedMatch.displayName}</AppText>
            <AppText variant="candidateMeta" color="textSecondary">
              {selectedMatch.handle}
            </AppText>
          </View>

          <View style={styles.detailScore}>
            <AppText variant="statisticLarge" color="success">
              {`${selectedMatch.affinityScore}%`}
            </AppText>
            <AppText variant="badge" color="success">
              Match
            </AppText>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <Badge
            label={riskLabel(selectedMatch.riskLevel)}
            tone={
              selectedMatch.riskLevel === 'LOW_RISK' ? 'success' : 'primary'
            }
          />
          <AppText variant="caption" color="textSubtle">
            {`Aprobado el ${selectedMatch.approvedAt.slice(0, 10)}`}
          </AppText>
        </View>

        {isLoadingReport ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : report ? (
          <BigFiveReportCard traits={report.profile} />
        ) : (
          <AppText variant="body" color="textSecondary">
            No se pudo cargar el reporte psicométrico.
          </AppText>
        )}

        <View style={styles.proposalCard}>
          <AppText variant="sectionTitle">Enviar propuesta</AppText>

          <AppInput
            label="Nombre de la campaña"
            value={campaignName}
            onChangeText={setCampaignName}
            placeholder="Lanzamiento de verano"
          />
          <AppInput
            label="Mensaje"
            value={message}
            onChangeText={setMessage}
            placeholder="Cuéntale al creador tu idea."
          />

          {proposalFeedback ? (
            <AppText variant="caption" color="textPrimary">
              {proposalFeedback}
            </AppText>
          ) : null}

          <AppButton
            label="Enviar propuesta"
            onPress={handleSendProposal}
            loading={isSendingProposal}
            fullWidth
          />
        </View>
      </ScrollView>
    );
  };

  const renderMatches = () => {
    if (selectedMatch) {
      return renderDetail();
    }

    return (
      <View style={styles.listBody}>
        <View style={styles.sectionHeading}>
          <AppText variant="screenTitle">Candidatos aprobados</AppText>
          <AppText variant="caption" color="textSubtle">
            Abre un match para ver su Big Five y enviar una propuesta.
          </AppText>
        </View>

        {isLoadingMatches ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <CandidateList
            candidates={candidateItems}
            onSelect={handleSelectCandidate}
            style={styles.list}
          />
        )}
      </View>
    );
  };

  const renderProfile = () => (
    <ScrollView
      style={styles.body}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <Avatar name={user.name} size="lg" />
        <View style={styles.detailIdentity}>
          <AppText variant="h1">{user.name}</AppText>
          <AppText variant="candidateMeta" color="textSecondary">
            {user.emailAddress}
          </AppText>
        </View>
      </View>

      <View style={styles.infoCard}>
        <InfoRow label="Rol" value="Marca" />
        <InfoRow label="Empresa" value={user.handleOrCompany} />
        <InfoRow label="Correo" value={user.emailAddress} />
      </View>

      <AppButton
        label="Cerrar sesión"
        variant="secondary"
        onPress={handleLogout}
        fullWidth
      />
    </ScrollView>
  );

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

        <Badge label="EMPRESAS" tone="primary" />
      </View>

      {tab === 'discovery' ? renderExplore() : null}
      {tab === 'matches' ? renderMatches() : null}
      {tab === 'profile' ? renderProfile() : null}

      <BottomTabBar
        activeTab={tab}
        tabs={COMPANY_TABS}
        onTabPress={(nextTab) => {
          setSelectedMatch(null);
          setTab(nextTab as CompanyTab);
        }}
      />
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
  listBody: {
    flex: 1,
    paddingHorizontal: spacing.xxxlWide,
    paddingTop: spacing.xxxlWide,
  },
  sectionHeading: {
    gap: spacing.sm,
  },
  loading: {
    paddingVertical: spacing.canvas,
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xlPlus,
  },
  detailIdentity: {
    flex: 1,
    gap: spacing.sm,
  },
  detailScore: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xl,
  },
  proposalCard: {
    gap: spacing.xxlWide,
    padding: spacing.xxxlPlus,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xlPlus,
  },
  infoCard: {
    gap: spacing.xlPlus,
    padding: spacing.xxxlPlus,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xl,
  },
  infoValue: {
    flexShrink: 1,
    textAlign: 'right',
  },
});
