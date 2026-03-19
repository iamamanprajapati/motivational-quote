import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width: W } = Dimensions.get('window');
export const CARD_WIDTH = Math.min(W - 32, 400);
export const CARD_HEIGHT = CARD_WIDTH * 1.25;

/**
 * Instagram-style shareable card (white text on image + gradient).
 * Kept visually consistent in both app themes for social sharing.
 */
export default function QuoteShareCard({ quote, imageSource }) {
  const author = quote?.author ? `— ${quote.author}` : '';
  const category = quote?.category || null;

  const inner = (
    <LinearGradient
      colors={['rgba(0,0,0,0.10)', 'rgba(0,0,0,0.45)', 'rgba(0,0,0,0.92)']}
      style={styles.gradient}>
      <View style={styles.topRow}>
        {category ? (
          <View style={styles.badge}>
            <Text style={styles.badgeTxt}>{category}</Text>
          </View>
        ) : null}
        <Text style={styles.brand}>Daily Motivation</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.quote} numberOfLines={6}>
          {quote?.text || ''}
        </Text>
        {author ? <Text style={styles.author}>{author}</Text> : null}
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.shadow}>
      {imageSource ? (
        <ImageBackground
          source={imageSource}
          style={styles.image}
          imageStyle={styles.imageInner}
          resizeMode="cover">
          {inner}
        </ImageBackground>
      ) : (
        <View style={[styles.image, styles.fallbackBg]}>{inner}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111',
    elevation: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
  },
  fallbackBg: {
    backgroundColor: '#2a2a35',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageInner: {
    borderRadius: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 22,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.20)',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    maxWidth: '58%',
  },
  badgeTxt: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '800',
    fontSize: 12,
  },
  brand: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  textBlock: {
    marginBottom: 10,
  },
  quote: {
    color: '#fff',
    fontSize: 22,
    lineHeight: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  author: {
    marginTop: 14,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '600',
  },
});
