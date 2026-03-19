import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  StatusBar,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { BACKGROUND_IMAGES } from '../assets/imageMap';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_GAP = 14;
const CARD_W = (SCREEN_W - 32 - CARD_GAP) / 2;

/* Per-category config — unique image + accent gradient */
const CATEGORY_META = {
  Success:    { icon: 'trophy',       colors: ['#FFB347', '#FF6B2B'], imageIndex: 0  },
  Discipline: { icon: 'dumbbell',     colors: ['#F7536E', '#C0235B'], imageIndex: 6  },
  Life:       { icon: 'leaf-maple',   colors: ['#43E97B', '#1A8A4A'], imageIndex: 12 },
  Mindset:    { icon: 'brain',        colors: ['#A78BFA', '#6D28D9'], imageIndex: 18 },
  Growth:     { icon: 'sprout',       colors: ['#6EE7B7', '#059669'], imageIndex: 23 },
  Focus:      { icon: 'target',       colors: ['#38BDF8', '#0369A1'], imageIndex: 29 },
  Resilience: { icon: 'shield-star',  colors: ['#FB923C', '#C2410C'], imageIndex: 35 },
  Leadership: { icon: 'crown',        colors: ['#FCD34D', '#B45309'], imageIndex: 41 },
  General:    { icon: 'lightbulb-on', colors: ['#818CF8', '#4338CA'], imageIndex: 47 },
};

/* Hero image for the page background */
const HERO_IMAGE = BACKGROUND_IMAGES[4];

export default function CategoriesScreen() {
  const { categories, allQuotes } = useApp();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content', true);
    }, []),
  );

  const counts = useMemo(() => {
    const m = {};
    allQuotes.forEach(q => {
      m[q.category || 'General'] = (m[q.category || 'General'] || 0) + 1;
    });
    return m;
  }, [allQuotes]);

  const onSearch = () => {
    const q = query.trim();
    if (!q) return;
    navigation.navigate('QuoteList', { title: `"${q}"`, query: q });
  };

  const clearSearch = () => setQuery('');

  const ListHeader = (
    <View>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBar, focused && styles.searchBarFocused]}>
          <Icon name="magnify" size={20} color="rgba(255,255,255,0.70)" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search quotes, authors…"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={onSearch}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="close-circle" size={18} color="rgba(255,255,255,0.55)" />
            </TouchableOpacity>
          )}
        </View>
        {query.length > 0 && (
          <TouchableOpacity style={styles.searchBtn} onPress={onSearch} activeOpacity={0.8}>
            <LinearGradient
              colors={['#A09CFF', '#6D5FE8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.searchBtnGrad}>
              <Icon name="arrow-right" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Section label */}
      <Text style={styles.sectionLabel}>CATEGORIES</Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <ImageBackground source={HERO_IMAGE} style={StyleSheet.absoluteFill} resizeMode="cover" />

      {/* Dark gradient overlay */}
      <LinearGradient
        colors={['rgba(4,3,14,0.55)', 'rgba(4,3,14,0.72)', 'rgba(4,3,14,0.92)']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* ── Hero header ── */}
      <View style={[styles.heroHeader, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.heroEyebrow}>EXPLORE</Text>
        <Text style={styles.heroTitle}>Discover</Text>
        <Text style={styles.heroSub}>Find your next source of inspiration</Text>
      </View>

      {/* ── Scrollable content ── */}
      <FlatList
        data={categories}
        keyExtractor={item => item}
        numColumns={2}
        columnWrapperStyle={styles.columnWrap}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const meta = CATEGORY_META[item] || {
            icon: 'bookmark',
            colors: ['#818CF8', '#4338CA'],
            imageIndex: 0,
          };
          const count = counts[item] || 0;
          const cardImage = BACKGROUND_IMAGES[meta.imageIndex];

          return (
            <TouchableOpacity
              style={styles.catCard}
              onPress={() => navigation.navigate('QuoteList', { title: item, category: item })}
              activeOpacity={0.82}>

              {/* Photo background */}
              <ImageBackground
                source={cardImage}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                imageStyle={{ borderRadius: 22 }}
              />

              {/* Dark scrim so text is always readable */}
              <LinearGradient
                colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.82)']}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
              />

              {/* Accent colour wash */}
              <LinearGradient
                colors={[meta.colors[0] + '44', 'transparent']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
              />

              {/* Icon badge */}
              <LinearGradient
                colors={meta.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconCircle}>
                <Icon name={meta.icon} size={20} color="#fff" />
              </LinearGradient>

              {/* Category name + count */}
              <Text style={styles.catName} numberOfLines={1}>{item}</Text>
              <Text style={styles.catCount}>{count} quotes</Text>

              {/* Arrow */}
              <View style={styles.arrowWrap}>
                <Icon name="chevron-right" size={16} color="rgba(255,255,255,0.60)" />
              </View>

              {/* Border ring */}
              <View style={styles.cardBorder} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#04030E',
  },

  /* ── hero ── */
  heroHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(160,156,255,0.80)',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
    marginTop: 4,
  },

  /* ── search ── */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 22,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  searchBarFocused: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(160,156,255,0.55)',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: '#fff',
    padding: 0,
  },
  searchBtn: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  searchBtnGrad: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },

  /* ── list ── */
  listContent: {
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.40)',
    marginBottom: 14,
  },
  columnWrap: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },

  /* ── category card ── */
  catCard: {
    width: CARD_W,
    minHeight: 148,
    borderRadius: 22,
    padding: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  catName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  catCount: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.50)',
    marginTop: 3,
  },
  arrowWrap: {
    position: 'absolute',
    bottom: 14,
    right: 14,
  },
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
});
