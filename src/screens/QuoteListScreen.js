import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';

export default function QuoteListScreen() {
  const {
    colors, allQuotes,
    toggleFavorite, isFavorite,
    dailyQuoteIndex, imageForIndex,
  } = useApp();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const category = route.params?.category;
  const query = (route.params?.query || '').trim().toLowerCase();

  const data = useMemo(() => {
    let list = allQuotes;
    if (category) {
      list = list.filter(q => (q.category || 'General') === category);
    }
    if (query) {
      list = list.filter(q => {
        const t = (q.text || '').toLowerCase();
        const a = (q.author || '').toLowerCase();
        const c = (q.category || '').toLowerCase();
        return t.includes(query) || a.includes(query) || c.includes(query);
      });
    }
    return list;
  }, [allQuotes, category, query]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <FlatList
        data={data}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{
          padding: 12,
          paddingBottom: insets.bottom + 116,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Icon name="text-search" size={48} color={colors.onSurfaceVariant} />
            <Text style={[styles.emptyTxt, { color: colors.onSurfaceVariant }]}>
              No quotes match your filters.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const fav = isFavorite(item.id);
          const itemIndex = allQuotes.findIndex(q => q.id === item.id);
          const thumb = imageForIndex(itemIndex >= 0 ? itemIndex : dailyQuoteIndex);
          return (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.outline,
                },
              ]}>
              {/* thumbnail */}
              <View style={styles.thumbWrap}>
                <ImageBackground
                  source={thumb}
                  style={styles.thumb}
                  imageStyle={styles.thumbRadius}
                  resizeMode="cover">
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.55)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.thumbCatPill}>
                    <Text style={styles.thumbCatTxt} numberOfLines={1}>
                      {item.category || 'General'}
                    </Text>
                  </View>
                </ImageBackground>
              </View>

              {/* text body */}
              <View style={styles.cardBody}>
                <Text
                  style={[styles.quoteText, { color: colors.onSurface }]}
                  numberOfLines={4}>
                  {item.text}
                </Text>
                {item.author ? (
                  <View style={styles.authorRow}>
                    <Icon name="account-circle-outline" size={14} color={colors.onSurfaceVariant} />
                    <Text style={[styles.authorTxt, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                      {item.author}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* favorite button */}
              <TouchableOpacity
                onPress={() => toggleFavorite(item.id)}
                style={[
                  styles.favBtn,
                  {
                    backgroundColor: fav
                      ? 'rgba(255,107,138,0.12)'
                      : colors.surfaceVariant,
                    borderColor: fav ? 'rgba(255,107,138,0.40)' : colors.outline,
                  },
                ]}>
                <Icon
                  name={fav ? 'heart' : 'heart-outline'}
                  size={20}
                  color={fav ? '#FF6B8A' : colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 16,
  },
  emptyTxt: {
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  thumbWrap: {
    width: 88,
    height: 100,
  },
  thumb: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  thumbRadius: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  thumbCatPill: {
    margin: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  thumbCatTxt: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    maxWidth: 70,
  },
  cardBody: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 8,
  },
  quoteText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  authorTxt: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  favBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
