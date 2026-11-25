import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type {
  DiscoveryCandidate,
  SwipeDirection,
} from '../../../modules/discovery/domain/DiscoveryModels';
import {
  borderWidths,
  colors,
  radii,
  spacing,
} from '../../theme';
import { AppButton, AppText, Avatar, Badge } from '../atoms';
import { BigFiveTraitRow } from '../molecules';

const SWIPE_DURATION = 220;
const SWIPE_THRESHOLD_RATIO = 0.25;
const ROTATION_DEGREES = 12;

const RISK_LABELS: Record<DiscoveryCandidate['riskLevel'], string> = {
  LOW_RISK: 'Bajo riesgo',
  MEDIUM_RISK: 'Riesgo medio',
  HIGH_RISK: 'Alto riesgo',
};

const TRAIT_ROWS: ReadonlyArray<{
  key: keyof DiscoveryCandidate['traits'];
  label: string;
}> = [
  { key: 'innovation', label: 'Innovación' },
  { key: 'selfManagement', label: 'Autogestión' },
  { key: 'communication', label: 'Comunicación' },
  { key: 'empathy', label: 'Empatía' },
  { key: 'resilience', label: 'Resiliencia' },
];

export interface SwipeDeckViewProps {
  candidates: readonly DiscoveryCandidate[];
  onSwipe?: (direction: SwipeDirection, candidate: DiscoveryCandidate) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Mazo de tarjetas deslizables (35:6 · tarjeta de candidato + Big Five).
 *
 * Gestos con `PanResponder` y `Animated` nativos de React Native: funciona
 * en Expo Go sin dependencias nativas adicionales. También ofrece botones
 * para descartar (izquierda) o mostrar interés (derecha).
 */
export function SwipeDeckView({
  candidates,
  onSwipe,
  style,
}: SwipeDeckViewProps) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;

  const current: DiscoveryCandidate | null = candidates[index] ?? null;

  const swipeOut = useCallback(
    (direction: SwipeDirection) => {
      if (!current || isAnimating) {
        return;
      }

      setIsAnimating(true);
      const targetX = (direction === 'RIGHT' ? 1 : -1) * width;

      Animated.timing(position, {
        toValue: { x: targetX, y: 0 },
        duration: SWIPE_DURATION,
        useNativeDriver: false,
      }).start(() => {
        position.setValue({ x: 0, y: 0 });
        setIsAnimating(false);
        setIndex((previous) => previous + 1);
        onSwipe?.(direction, current);
      });
    },
    [current, isAnimating, onSwipe, position, width],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          !isAnimating &&
          Math.abs(gesture.dx) > spacing.lg &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderMove: (_event, gesture) => {
          position.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (_event, gesture) => {
          const threshold = width * SWIPE_THRESHOLD_RATIO;

          if (gesture.dx > threshold) {
            swipeOut('RIGHT');
            return;
          }

          if (gesture.dx < -threshold) {
            swipeOut('LEFT');
            return;
          }

          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        },
      }),
    [isAnimating, position, swipeOut, width],
  );

  const rotate = position.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [
      `-${ROTATION_DEGREES}deg`,
      '0deg',
      `${ROTATION_DEGREES}deg`,
    ],
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width * SWIPE_THRESHOLD_RATIO],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const discardOpacity = position.x.interpolate({
    inputRange: [-width * SWIPE_THRESHOLD_RATIO, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (!current) {
    return (
      <View style={[styles.empty, style]}>
        <AppText variant="h2" color="textSecondary" style={styles.emptyText}>
          No hay más perfiles por ahora.
        </AppText>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { rotate },
            ],
          },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.overlay, styles.overlayLike, { opacity: likeOpacity }]}
        >
          <Badge label="Me interesa" tone="success" />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.overlay,
            styles.overlayDiscard,
            { opacity: discardOpacity },
          ]}
        >
          <Badge label="Descartar" tone="primary" />
        </Animated.View>

        <View style={styles.header}>
          <Avatar
            name={current.displayName}
            handle={current.handle}
            size="lg"
          />

          <View style={styles.identity}>
            <AppText variant="sectionTitle" color="textPrimary">
              {current.displayName}
            </AppText>
            <AppText variant="candidateMeta" color="textSecondary">
              {current.handle}
            </AppText>
          </View>

          <View style={styles.score}>
            <AppText variant="statisticLarge" color="success">
              {`${current.affinityScore}%`}
            </AppText>
            <AppText variant="badge" color="success">
              Match
            </AppText>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Badge
            label={RISK_LABELS[current.riskLevel]}
            tone={current.riskLevel === 'LOW_RISK' ? 'success' : 'primary'}
          />
          <AppText variant="cardEyebrow" color="textSecondary">
            BIG FIVE · PERFIL DE AFINIDAD
          </AppText>
        </View>

        <View style={styles.traits}>
          {TRAIT_ROWS.map((trait) => (
            <BigFiveTraitRow
              key={trait.key}
              label={trait.label}
              value={current.traits[trait.key]}
            />
          ))}
        </View>
      </Animated.View>

      <View style={styles.actions}>
        <AppButton
          label="Descartar"
          variant="secondary"
          onPress={() => swipeOut('LEFT')}
          disabled={isAnimating}
          style={styles.actionButton}
        />
        <AppButton
          label="Me interesa"
          onPress={() => swipeOut('RIGHT')}
          disabled={isAnimating}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxxlWide,
  },
  card: {
    gap: spacing.xxlWide,
    padding: spacing.xxxlPlus,
    backgroundColor: colors.surface,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    borderRadius: radii.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xlPlus,
  },
  identity: {
    flex: 1,
    gap: spacing.sm,
  },
  score: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xl,
  },
  traits: {
    gap: spacing.xlWide,
  },
  overlay: {
    position: 'absolute',
    top: spacing.huge,
    zIndex: 1,
  },
  overlayLike: {
    left: spacing.huge,
  },
  overlayDiscard: {
    right: spacing.huge,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xlPlus,
  },
  actionButton: {
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.canvas,
  },
  emptyText: {
    textAlign: 'center',
  },
});
