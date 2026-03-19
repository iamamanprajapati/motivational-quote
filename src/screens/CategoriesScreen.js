import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';

const CATEGORY_ICONS = {
  Success: 'trophy-outline',
  Discipline: 'dumbbell',
  Life: 'leaf-maple',
  Mindset: 'brain',
  Growth: 'sprout-outline',
  Focus: 'target',
  Resilience: 'shield-star-outline',
  Leadership: 'crown-outline',
  General: 'lightbulb-outline',
};

export default function CategoriesScreen() {
  const { colors, categories, allQuotes } = useApp();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const counts = useMemo(() => {
    const m = {};
    allQuotes.forEach(q => { m[q.category || 'General'] = (m[q.category || 'General'] || 0) + 1; });
    return m;
  }, [allQuotes]);

  const onSearch = () => {
    const q = query.trim();
    if (!q) { return; }
    navigation.navigate('QuoteList', { title: `"${q}"`, query: q });
  };

  const clearSearch = () => setQuery('');

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* ── top bar ── */}
      <View style={[styles.topBar, { borderBottomColor: colors.divider }]}>
        <Text style={[styles.screenTitle, { color: colors.onBackground }]}>
          Discover
        </Text>
      </View>

      {/* ── search bar ── */}
      <View style={[styles.searchContainer, { paddingHorizontal: 16, marginBottom: 8 }]}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: focused ? colors.primary : 'transparent',
            },
          ]}>
          <Icon name="magnify" size={22} color={focused ? colors.primary : colors.onSurfaceVariant} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search quotes, authors, categories…"
            placeholderTextColor={colors.onSurfaceVariant}
            style={[styles.searchInput, { color: colors.onSurface }]}
            returnKeyType="search"
            onSubmitEditing={onSearch}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Icon name="close-circle" size={18} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
        </View>
        {query.length > 0 && (
          <TouchableOpacity
            style={[styles.searchBtn, { backgroundColor: colors.primary }]}
            onPress={onSearch}>
            <Text style={[styles.searchBtnTxt, { color: colors.onPrimary }]}>
              Search
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── categories ── */}
      <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant, marginLeft: 16 }]}>
        CATEGORIES
      </Text>
      <FlatList
        data={categories}
        keyExtractor={item => item}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 32,
        }}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.columnWrap}
        renderItem={({ item }) => {
          const iconName = CATEGORY_ICONS[item] || 'bookmark-outline';
          const count = counts[item] || 0;
          return (
            <TouchableOpacity
              style={[
                styles.catCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.outline,
                },
              ]}
              onPress={() =>
                navigation.navigate('QuoteList', { title: item, category: item })
              }
              activeOpacity={0.75}>
              <View
                style={[
                  styles.catIconWrap,
                  { backgroundColor: colors.primaryContainer },
                ]}>
                <Icon name={iconName} size={24} color={colors.primary} />
              </View>
              <Text style={[styles.catName, { color: colors.onSurface }]} numberOfLines={1}>
                {item}
              </Text>
              <Text style={[styles.catCount, { color: colors.onSurfaceVariant }]}>
                {count} quotes
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 28,
    borderWidth: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    padding: 0,
  },
  searchBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
  },
  searchBtnTxt: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 16,
  },
  columnWrap: {
    gap: 12,
    marginBottom: 12,
  },
  catCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    minHeight: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  catIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  catName: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  catCount: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
