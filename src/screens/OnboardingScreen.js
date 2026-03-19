import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { BACKGROUND_IMAGES } from '../assets/imageMap';

const { width: W, height: H } = Dimensions.get('window');

const SLIDES = [
  {
    icon: 'lightning-bolt',
    iconColor: '#FFD166',
    title: 'Daily Motivation',
    body: 'Start every morning with a powerful quote tailored for your day. 1000 quotes, fully offline.',
    bg: BACKGROUND_IMAGES[0],
  },
  {
    icon: 'heart',
    iconColor: '#FF6B8A',
    title: 'Save Your Favorites',
    body: 'Bookmark quotes that speak to you. Build your personal collection of daily inspiration.',
    bg: BACKGROUND_IMAGES[1],
  },
  {
    icon: 'share-variant',
    iconColor: '#A09CFF',
    title: 'Share & Inspire Others',
    body: 'Create beautiful quote cards and share them on WhatsApp, Instagram, Telegram and more.',
    bg: BACKGROUND_IMAGES[2],
  },
];

export default function OnboardingScreen() {
  const { colors, completeOnboarding } = useApp();
  const insets = useSafeAreaInsets();
  const listRef = useRef(null);
  const [page, setPage] = useState(0);

  const isLast = page === SLIDES.length - 1;

  const next = () => {
    if (isLast) {
      completeOnboarding();
    } else {
      const next = page + 1;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setPage(next);
    }
  };

  const skip = () => completeOnboarding();

  return (
    <View style={styles.root}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(_, i) => String(i)}
        getItemLayout={(_, i) => ({ length: W, offset: W * i, index: i })}
        renderItem={({ item }) => (
          <ImageBackground source={item.bg} style={styles.slide} resizeMode="cover">
            <LinearGradient
              colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.97)']}
              locations={[0, 0.45, 1]}
              style={styles.fill}
            />
            <View style={styles.iconCircle}>
              <Icon name={item.icon} size={42} color={item.iconColor} />
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideBody}>{item.body}</Text>
          </ImageBackground>
        )}
      />

      {/* bottom area */}
      <View
        style={[
          styles.bottomArea,
          { paddingBottom: insets.bottom + 24 },
        ]}>
        {/* dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === page ? '#fff' : 'rgba(255,255,255,0.35)',
                  width: i === page ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: colors.primary }]}
          onPress={next}>
          <Text style={[styles.nextTxt, { color: colors.onPrimary }]}>
            {isLast ? 'Get Started' : 'Continue'}
          </Text>
          <Icon name={isLast ? 'rocket-launch-outline' : 'arrow-right'} size={20} color={colors.onPrimary} />
        </TouchableOpacity>

        {!isLast && (
          <TouchableOpacity style={styles.skipBtn} onPress={skip}>
            <Text style={styles.skipTxt}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  fill: { ...StyleSheet.absoluteFillObject },

  slide: {
    width: W,
    height: H,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  slideTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  slideBody: {
    color: 'rgba(255,255,255,0.80)',
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 180,
  },

  bottomArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 14,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextTxt: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  skipBtn: {
    paddingVertical: 10,
  },
  skipTxt: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
