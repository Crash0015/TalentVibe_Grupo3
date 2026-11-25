import type { ImageSourcePropType } from 'react-native';

/**
 * Registro estático de avatares para Metro.
 *
 * Metro no permite `require()` dinámicos, así que cada imagen descargada
 * se declara explícitamente y se indexa por handle normalizado (sin `@`).
 */
export const AVATAR_REGISTRY: Record<string, ImageSourcePropType> = {
  _frasess57: require('../../../assets/avatars/_frasess57.jpg'),
  alejandrogavilan8: require('../../../assets/avatars/alejandrogavilan8.jpg'),
  'axder.music': require('../../../assets/avatars/axder.music.jpg'),
  busta_brothers: require('../../../assets/avatars/busta_brothers.jpg'),
  'chihuahuas.clan': require('../../../assets/avatars/chihuahuas.clan.jpg'),
  chrisxx_13: require('../../../assets/avatars/chrisxx_13.jpg'),
  'crstiann.x': require('../../../assets/avatars/crstiann.x.jpg'),
  ginaalopeez: require('../../../assets/avatars/ginaalopeez.jpg'),
  jhonnycevalloss: require('../../../assets/avatars/jhonnycevalloss.jpg'),
  joninolarrea: require('../../../assets/avatars/joninolarrea.jpg'),
  kevdanvg: require('../../../assets/avatars/kevdanvg.jpg'),
  'kleverrmaciass2.0': require('../../../assets/avatars/kleverrmaciass2.0.jpg'),
  leitogranda: require('../../../assets/avatars/leitogranda.jpg'),
  melissaendara: require('../../../assets/avatars/melissaendara.jpg'),
  meymeyl19: require('../../../assets/avatars/meymeyl19.jpg'),
  santiagofajardop: require('../../../assets/avatars/santiagofajardop.jpg'),
  soyalan_ec: require('../../../assets/avatars/soyalan_ec.jpg'),
  soysuco: require('../../../assets/avatars/soysuco.jpg'),
  usariodesconocido875: require('../../../assets/avatars/usariodesconocido875.jpg'),
  yildabanchon: require('../../../assets/avatars/yildabanchon.jpg'),
};

/** Normaliza un handle (`@Soysuco` → `soysuco`). */
export function normalizeAvatarHandle(handle: string): string {
  return handle.trim().replace(/^@+/, '').toLowerCase();
}

/** Devuelve el require estático del avatar o `undefined` si no existe. */
export function getAvatarSource(
  handle?: string | null,
): ImageSourcePropType | undefined {
  if (!handle) {
    return undefined;
  }

  return AVATAR_REGISTRY[normalizeAvatarHandle(handle)];
}
