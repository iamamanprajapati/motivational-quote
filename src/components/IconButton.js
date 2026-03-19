import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

export default function IconButton({
  icon,
  label,
  onPress,
  colors,
  outline,
  disabled,
  loading,
}) {
  const isOutline = !!outline;
  const tint = isOutline ? colors.accent : '#111';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.wrap,
        isOutline
          ? {
              borderColor: colors.accent,
              backgroundColor: 'rgba(255,255,255,0.02)',
            }
          : { backgroundColor: colors.accentSoft },
      ]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.circle,
          isOutline ? { borderColor: colors.accent } : { backgroundColor: colors.accent },
        ]}>
        {loading ? (
          <ActivityIndicator size="small" color={isOutline ? colors.accent : '#111'} />
        ) : (
          <Text style={[styles.icon, { color: tint }]}>{icon}</Text>
        )}
      </TouchableOpacity>
      <Text
        style={[
          styles.label,
          {
            color: isOutline ? colors.textMuted : colors.textMuted,
          },
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 92,
    alignItems: 'center',
    marginBottom: 12,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  icon: {
    fontSize: 20,
    fontWeight: '800',
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
  },
});

