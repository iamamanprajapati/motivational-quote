import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function ActionChip({
  label,
  onPress,
  colors,
  outline,
  loading,
  disabled,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.btn,
        outline
          ? { borderColor: colors.accent, borderWidth: 1.5 }
          : { backgroundColor: colors.accent },
      ]}>
      {loading ? (
        <ActivityIndicator color={outline ? colors.accent : '#111'} />
      ) : (
        <Text
          style={[
            styles.txt,
            { color: outline ? colors.accent : '#111' },
          ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 88,
    alignItems: 'center',
  },
  txt: {
    fontWeight: '700',
    fontSize: 13,
  },
});
