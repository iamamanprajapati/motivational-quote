import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

/**
 * Full-screen photo + gradient overlay so UI stays readable in light/dark themes.
 * Background is position-fixed while children scroll (absolute fill image).
 */
export default function MotivationalBackground({
  source,
  isDark,
  children,
  style,
}) {
  const gradientColors = isDark
    ? [
        'rgba(6,6,10,0.42)',
        'rgba(6,6,10,0.78)',
        'rgba(6,6,10,0.93)',
      ]
    : [
        'rgba(255,252,248,0.78)',
        'rgba(255,252,248,0.9)',
        'rgba(246,244,239,0.96)',
      ];

  const fallbackBg = isDark ? '#050508' : '#ece8e0';

  if (!source) {
    return (
      <View style={[styles.fill, { backgroundColor: fallbackBg }, style]}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.fill, style]}>
      <ImageBackground
        source={source}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <LinearGradient
        colors={gradientColors}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.content} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
