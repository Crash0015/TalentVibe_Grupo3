import {
  Image,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radii, sizes } from '../../theme';
import { AppText } from './AppText';

export type AvatarSize = 'sm' | 'md' | 'lg';

const AVATAR_DIMENSIONS: Record<AvatarSize, number> = {
  sm: sizes.avatarSm,
  md: sizes.avatarMd,
  lg: sizes.avatarLg,
};

const AVATAR_TEXT_VARIANTS = {
  sm: 'caption',
  md: 'caption',
  lg: 'body',
} as const;

export interface AvatarProps {
  /** Foto del creador; si falta se muestran iniciales. */
  uri?: string | null;
  name?: string;
  initials?: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

function resolveInitials(initials?: string, name?: string): string {
  if (initials) {
    return initials.slice(0, 2).toUpperCase();
  }

  const words = (name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return '';
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

/**
 * Avatar circular.
 *
 * Medidas de Figma: 34 (wireframe), 44 (átomo / tarjeta) y 48 (prototipo).
 * Fondo #E5E7EB y radio 999.
 */
export function Avatar({
  uri,
  name,
  initials,
  size = 'md',
  style,
  accessibilityLabel,
}: AvatarProps) {
  const dimension = AVATAR_DIMENSIONS[size];

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? name ?? 'Avatar'}
      style={[
        styles.base,
        { width: dimension, height: dimension },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          resizeMode="cover"
          accessible={false}
          style={styles.image}
        />
      ) : (
        <AppText
          variant={AVATAR_TEXT_VARIANTS[size]}
          color="textSecondary"
        >
          {resolveInitials(initials, name)}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.border,
    borderRadius: radii.full,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
