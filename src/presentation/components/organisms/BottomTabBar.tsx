import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {
  borderWidths,
  colors,
  fontWeights,
  iconSizes,
  radii,
  sizes,
  spacing,
} from '../../theme';
import { AppText } from '../atoms';

export type TabId = 'home' | 'discovery' | 'matches' | 'profile';

export interface TabItem {
  id: TabId;
  label: string;
}

export const DEFAULT_TABS: readonly TabItem[] = [
  { id: 'home', label: 'Inicio' },
  { id: 'discovery', label: 'Descubrir' },
  { id: 'matches', label: 'Matches' },
  { id: 'profile', label: 'Perfil' },
];

export interface BottomTabBarProps {
  activeTab: TabId;
  onTabPress: (tab: TabId) => void;
  tabs?: readonly TabItem[];
  style?: StyleProp<ViewStyle>;
}

/**
 * Íconos dibujados con `View`: el prototipo no incluye librería de íconos,
 * así se mantiene compatibilidad total con Expo Go sin dependencias extra.
 */
function TabIcon({ id, color }: { id: TabId; color: string }) {
  if (id === 'discovery') {
    return (
      <View style={styles.icon}>
        <View style={[styles.cardBack, { borderColor: color }]} />
        <View style={[styles.cardFront, { borderColor: color }]} />
      </View>
    );
  }

  if (id === 'matches') {
    return (
      <View style={styles.icon}>
        <View
          style={[styles.heartLobe, { backgroundColor: color, left: spacing.xxs }]}
        />
        <View
          style={[styles.heartLobe, { backgroundColor: color, right: spacing.xxs }]}
        />
        <View style={[styles.heartPoint, { backgroundColor: color }]} />
      </View>
    );
  }

  if (id === 'profile') {
    return (
      <View style={styles.icon}>
        <View style={[styles.profileHead, { borderColor: color }]} />
        <View style={[styles.profileBody, { borderColor: color }]} />
      </View>
    );
  }

  return (
    <View style={styles.icon}>
      <View style={[styles.homeRoof, { borderColor: color }]} />
      <View style={[styles.homeBase, { borderColor: color }]} />
    </View>
  );
}

/**
 * Barra de navegación inferior (0:1 · "Tab bar").
 *
 * Altura 64, borde superior 1px #E5E7EB, padding horizontal 12,
 * ícono de 23px y etiqueta de 11px.
 */
export function BottomTabBar({
  activeTab,
  onTabPress,
  tabs = DEFAULT_TABS,
  style,
}: BottomTabBarProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <View style={[styles.bar, isLandscape && styles.barLandscape, style]}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const color = isActive ? colors.primary : colors.textSubtle;

        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            onPress={() => onTabPress(tab.id)}
            style={styles.item}
          >
            <TabIcon id={tab.id} color={color} />
            <AppText
              variant="iconLabel"
              color={isActive ? 'primary' : 'textSubtle'}
              style={isActive ? styles.activeLabel : null}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: sizes.tabBar,
    paddingHorizontal: spacing.xlPlus,
    backgroundColor: colors.surface,
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
  },
  barLandscape: {
    height: sizes.button + spacing.xlPlus,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  activeLabel: {
    fontWeight: fontWeights.semiBold,
  },
  icon: {
    width: iconSizes.nav,
    height: iconSizes.nav,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.xs,
    width: spacing.xl,
    height: spacing.xlPlus,
    borderWidth: borderWidths.thick,
    borderRadius: radii.xs,
  },
  cardFront: {
    position: 'absolute',
    right: spacing.xs,
    bottom: spacing.sm,
    width: spacing.xl,
    height: spacing.xlPlus,
    borderWidth: borderWidths.thick,
    borderRadius: radii.xs,
    backgroundColor: colors.surface,
  },
  heartLobe: {
    position: 'absolute',
    top: spacing.sm,
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: radii.full,
  },
  heartPoint: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.mdPlus,
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: radii.xs,
    transform: [{ rotate: '45deg' }],
  },
  profileHead: {
    position: 'absolute',
    top: spacing.sm,
    width: spacing.lg,
    height: spacing.lg,
    borderWidth: borderWidths.thick,
    borderRadius: radii.full,
  },
  profileBody: {
    position: 'absolute',
    bottom: spacing.sm,
    width: spacing.xxl,
    height: spacing.md,
    borderWidth: borderWidths.thick,
    borderRadius: radii.pill,
  },
  homeRoof: {
    position: 'absolute',
    top: spacing.xs,
    width: spacing.xl,
    height: spacing.xl,
    borderWidth: borderWidths.thick,
    borderRadius: radii.xs,
    transform: [{ rotate: '45deg' }],
  },
  homeBase: {
    position: 'absolute',
    bottom: spacing.sm,
    width: spacing.xl,
    height: spacing.lg,
    borderWidth: borderWidths.thick,
    borderRadius: radii.xs,
  },
});
