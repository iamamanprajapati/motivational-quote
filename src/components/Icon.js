import React from 'react';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Thin wrapper around MaterialCommunityIcons.
 * name examples: 'heart', 'heart-outline', 'share-variant',
 *   'download', 'content-copy', 'shuffle-variant',
 *   'whatsapp', 'instagram', 'facebook', 'twitter', 'telegram',
 *   'home', 'home-outline', 'compass', 'compass-outline',
 *   'cog', 'cog-outline', 'fire', 'magnify', 'arrow-left'
 */
export default function Icon({ name, size = 24, color = '#fff', style }) {
  return <MCIcon name={name} size={size} color={color} style={style} />;
}
