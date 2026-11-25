import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import {
  CreatorSearchResult,
  SearchBar,
} from '../components/molecules';

type CompanyTab = Extract<TabId, 'discovery' | 'matches' | 'profile'>;

const COMPANY_TABS: readonly TabItem[] = [
  { id: 'discovery', label: 'Explorar' },
  { id: 'matches', label: 'Matches' },
  { id: 'profile', label: 'Perfil' },
];

function riskLabel(level: CreatorPsychometricReport['riskLevel']): string {
  if (level === 'LOW_RISK') {
    return 'Bajo riesgo';
  }

  if (level === 'MEDIUM_RISK') {
    return 'Riesgo medio';
  }

  return 'Alto riesgo';
}

function formatCount(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1).replace('.0', '')}B`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace('.0', '')}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace('.0', '')}K`;
  }

  return `${value}`;
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
 * Home del rol Marca.
 *
 * Explorar mantiene el mazo; la búsqueda superior consulta el repositorio
 * completo, incluidos perfiles ya swipeados o fuera de los filtros actuales.
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
  const [detail, setDetail] = useState<CreatorPsychometricReport | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    CreatorPsychometricReport[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [proposalFeedback, setProposalFeedback] = useState<string | null>(null);
  const [isSendingProposal, setIsSendingProposal] = useState(false);
  const detailRequestId = useRef(0);

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

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isActive = true;
    setIsSearching(true);

    psychometric.searchCreators
      .execute({ query, targetProfile: SAMPLE_BRAND_CULTURE_PROFILE })
      .then((results) => {
        if (isActive) {
          setSearchResults(results);
        }
      })
      .catch(() => {
        if (isActive) {
          setSearchResults([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsSearching(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [psychometric, searchQuery]);

  const openMatch = useCallback(
    async (match: Match) => {
      const requestId = detailRequestId.current + 1;
      detailRequestId.current = requestId;

      setDetail(null);
      setProposalFeedback(null);
      setCampaignName('');
      setMessage('');
      setIsLoadingDetail(true);

      try {
        const report = await psychometric.analyzeCreator.execute({
          handle: match.handle,
          targetProfile: SAMPLE_BRAND_CULTURE_PROFILE,
        });

        if (detailRequestId.current === requestId) {
          setDetail(report);
        }
      } catch {
        if (detailRequestId.current === requestId) {
          setDetail(null);
        }
      } finally {
        if (detailRequestId.current === requestId) {
          setIsLoadingDetail(false);
        }
      }
    },
    [psychometric],
  );

  const closeDetail = () => {
    detailRequestId.current += 1;
    setDetail(null);
    setIsLoadingDetail(false);
  };

  const openSearchResult = (report: CreatorPsychometricReport) => {
    detailRequestId.current += 1;
    setDetail(report);
    setProposalFeedback(null);
    setCampaignName('');
    setMessage('');
  };

  const handleSwipe = useCallback(
    (direction: SwipeDirection, candidate: DiscoveryCandidate) => {
      discovery.swipe
        .execute({ creatorId: candidate.creatorId, direction })
        .catch(() => {
          // El mock no falla; no bloqueamos el mazo por un swipe.
        });
    },
    [discovery],
  );

  const handleSendProposal = async () => {
    if (!detail) {
      return;
    }

    setIsSendingProposal(true);
    setProposalFeedback(null);

    try {
      // Un perfil buscado puede no venir del mazo: lo aprobamos al proponer.
      await hiring.ensureMatch.execute({
        creatorId: detail.creatorId,
        displayName: detail.displayName,
        handle: detail.handle,
        affinityScore: detail.affinityScore ?? 0,
        riskLevel: detail.riskLevel,
        approvedAt: new Date().toISOString(),
      });

      await hiring.sendProposal.execute({
        creatorId: detail.creatorId,
        campaignName,
        message,
      });

      setProposalFeedback('Propuesta enviada. El creador podrá revisarla.');
      setCampaignName('');
      setMessage('');

      const updatedMatches = await hiring.getApprovedMatches.execute();
      setMatches(updatedMatches);
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
    handle: match.handle,
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
      <View style={styles.exploreIntro}>
        <View style={styles.exploreIntroText}>
          <AppText variant="caption" color="textSecondary">
            PANEL DE EMPRESA
          </AppText>

          <AppText variant="h1">¡Hola, {user.name}!</AppText>

          <AppText variant="body" color="textSecondary">
            Descubre creadores y encuentra perfiles que conecten con tu marca.
          </AppText>
        </View>

        <Badge label="Descubrimiento" tone="primary" />
      </View>

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

  const renderSearchResults = () => (
    <ScrollView
      style={styles.body}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.matchesHeading}>
        <View style={styles.sectionHeading}>
          <AppText variant="screenTitle">Búsqueda global</AppText>

          <AppText variant="caption" color="textSubtle">
            {isSearching
              ? 'Buscando perfiles...'
              : `${searchResults.length} perfiles encontrados`}
          </AppText>
        </View>

        <Badge label="Todos" tone="primary" />
      </View>

      {isSearching ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : searchResults.length > 0 ? (
        <View style={styles.searchResults}>
          {searchResults.map((report) => (
            <CreatorSearchResult
              key={report.creatorId}
              displayName={report.displayName}
              handle={report.handle}
              bio={report.bio}
              accountType={report.accountType}
              followersCount={report.followersCount}
              likesCount={report.likesCount}
              affinityScore={report.affinityScore}
              onPress={() => openSearchResult(report)}
            />
          ))}
        </View>
      ) : (
        <AppText variant="body" color="textSecondary" style={styles.empty}>
          No encontramos perfiles con ese texto.
        </AppText>
      )}
    </ScrollView>
  );

  const renderDetail = () => {
    if (isLoadingDetail && !detail) {
      return (
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.scrollContent}
        >
          <Pressable onPress={closeDetail} accessibilityRole="button">
            <AppText variant="buttonLabel" color="primary">
              Volver
            </AppText>
          </Pressable>

          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        </ScrollView>
      );
    }

    if (!detail) {
      return null;
    }

    return (
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => setDetail(null)} accessibilityRole="button">
          <AppText variant="buttonLabel" color="primary">
            Volver
          </AppText>
        </Pressable>

        <View style={styles.detailHeader}>
          <Avatar
            name={detail.displayName}
            handle={detail.handle}
            size="lg"
          />

          <View style={styles.detailIdentity}>
            <AppText variant="h1">{detail.displayName}</AppText>
            <AppText variant="candidateMeta" color="textSecondary">
              {detail.handle}
            </AppText>
          </View>

          <View style={styles.detailScore}>
            <AppText variant="statisticLarge" color="success">
              {`${detail.affinityScore ?? 0}%`}
            </AppText>
            <AppText variant="badge" color="success">
              Match
            </AppText>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <Badge
            label={riskLabel(detail.riskLevel)}
            tone={detail.riskLevel === 'LOW_RISK' ? 'success' : 'primary'}
          />
          <AppText variant="caption" color="textSubtle">
            {detail.accountType === 'influencer' ? 'Influencer' : 'Creador'} ·{' '}
            {`${formatCount(detail.followersCount)} seguidores`}
          </AppText>
        </View>

        <BigFiveReportCard
          traits={detail.profile}
          name={detail.displayName}
          handle={detail.handle}
        />

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

  const renderMatches = () => (
    <View style={styles.listBody}>
      <View style={styles.matchesHeading}>
        <View style={styles.sectionHeading}>
          <AppText variant="screenTitle">Candidatos aprobados</AppText>

          <AppText variant="caption" color="textSubtle">
            Consulta los perfiles y revisa su compatibilidad.
          </AppText>
        </View>

        <Badge label={`${matches.length} perfiles`} tone="primary" />
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

  const showSearch = Boolean(searchQuery.trim());

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

      {detail || isLoadingDetail ? null : (
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por @usuario, nombre o bio"
          />
        </View>
      )}

      {detail || isLoadingDetail
        ? renderDetail()
        : showSearch
          ? renderSearchResults()
          : tab === 'discovery'
            ? renderExplore()
            : tab === 'matches'
              ? renderMatches()
              : renderProfile()}

      <BottomTabBar
        activeTab={tab}
        tabs={COMPANY_TABS}
        onTabPress={(nextTab) => {
          setSearchQuery('');
          closeDetail();
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
  searchContainer: {
    paddingHorizontal: spacing.xxxlWide,
    paddingBottom: spacing.xl,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xxxlWide,
    gap: spacing.xxxlWide,
  },
  exploreIntro: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.xl,
  },
  exploreIntroText: {
    flex: 1,
    gap: spacing.sm,
  },
  listBody: {
    flex: 1,
    paddingHorizontal: spacing.xxxlWide,
    paddingTop: spacing.xxxlWide,
  },
  matchesHeading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.xl,
    marginBottom: spacing.xxxlWide,
  },
  sectionHeading: {
    gap: spacing.sm,
  },
  searchResults: {
    gap: spacing.xlPlus,
  },
  empty: {
    paddingVertical: spacing.canvas,
    textAlign: 'center',
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
