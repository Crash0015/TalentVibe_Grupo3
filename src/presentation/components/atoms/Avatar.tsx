import { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { getAvatarSource } from '../../assets/avatarRegistry';
import { colors, radii, sizes, type ColorName } from '../../theme';
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

const INITIALS_PALETTES: ReadonlyArray<{
  backgroundColor: string;
  textColor: ColorName;
}> = [
  { backgroundColor: colors.primarySoft, textColor: 'primary' },
  { backgroundColor: colors.successSoft, textColor: 'successStrong' },
  { backgroundColor: colors.surfaceTint, textColor: 'primary' },
  { backgroundColor: colors.surfaceMuted, textColor: 'textSecondary' },
];

export interface AvatarProps {
  /** Foto remota (fallback si no hay `imageSource` ni registro local). */
  uri?: string | null;
  /** Fuente estática proveniente de `avatarRegistry`. */
  imageSource?: ImageSourcePropType | null;
  /** @handle para resolver el avatar local automáticamente. */
  handle?: string | null;
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

function hashValue(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function sourceKeyOf(source: ImageSourcePropType | null): string {
  if (source == null) {
    return 'none';
  }

  if (typeof source === 'number') {
    return `asset:${source}`;
  }

  if (Array.isArray(source)) {
    return `array:${source.map((item) => item.uri ?? '').join('|')}`;
  }

  return 'uri' in source ? source.uri ?? 'object' : 'object';
}

/**
 * Avatar circular con foto real o iniciales de respaldo.
 *
 * Resolución de fuente:
 * `imageSource` → avatar local por `handle` → `uri` remota → iniciales.
 * Si la imagen falla al cargar, cae automáticamente a las iniciales con
 * un color determinista derivado del nombre/handle.
 */
export function Avatar({
  uri,
  imageSource,
  handle,
  name,
  initials,
  size = 'md',
  style,
  accessibilityLabel,
}: AvatarProps) {
  const dimension = AVATAR_DIMENSIONS[size];
  const source =
    imageSource ?? getAvatarSource(handle) ?? (uri ? { uri } : null);
  const sourceKey = sourceKeyOf(source);
  const [failedSourceKey, setFailedSourceKey] = useState<string | null>(null);
  const showImage = source !== null && failedSourceKey !== sourceKey;

  useEffect(() => {
    setFailedSourceKey(null);
  }, [sourceKey]);

  const palette =
    INITIALS_PALETTES[
      hashValue(name ?? handle ?? initials ?? 'avatar') %
        INITIALS_PALETTES.length
    ];

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? name ?? handle ?? 'Avatar'}
      style={[
        styles.base,
        {
          width: dimension,
          height: dimension,
          backgroundColor: palette.backgroundColor,
        },
        style,
      ]}
    >
      {showImage && source ? (
        <Image
          source={source}
          resizeMode="cover"
          accessible={false}
          style={styles.image}
          onError={() => setFailedSourceKey(sourceKey)}
        />
      ) : (
        <AppText
          variant={AVATAR_TEXT_VARIANTS[size]}
          color={palette.textColor}
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
    borderRadius: radii.full,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
