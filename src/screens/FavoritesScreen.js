import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';

export default function FavoritesScreen() {
  const {
    colors,
    favorites,
    allQuotes,
    toggleFavorite,
    dailyQuoteIndex,
    imageForIndex,
  } = useApp();
  const insets = useSafeAreaInsets();

  const favQuotes = allQuotes.filter(q => favorites.includes(q.id));

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── header info ── */}
      <View
        style={[
          styles.headerCard,
          {
            backgroundColor: colors.primaryContainer,
            marginHorizontal: 16,
            marginBottom: 4,
          },
        ]}>
        <View style={styles.headerRow}>
          <Icon name="heart" size={22} color={colors.primary} />
          <Text style={[styles.headerCount, { color: colors.onPrimaryContainer }]}>
            {favQuotes.length} saved
          </Text>
        </View>
        <Text style={[styles.headerSub, { color: colors.onPrimaryContainer }]}>
          Your personal collection of inspirations.
        </Text>
      </View>

      <FlatList
        data={favQuotes}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 32,
          paddingTop: 12,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Icon name="heart-outline" size={64} color={colors.onSurfaceVariant} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
              No favorites yet
            </Text>
            <Text style={[styles.emptyBody, { color: colors.onSurfaceVariant }]}>
              Tap the heart icon on any quote to save it here.
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const thumb = imageForIndex((dailyQuoteIndex + index) % Math.max(1, allQuotes.length));
          return (
            <FavCard
              item={item}
              thumb={thumb}
              colors={colors}
              onRemove={() => toggleFavorite(item.id)}
            />
          );
        }}
      />
    </View>
  );
}

function FavCard({ item, thumb, colors, onRemove }) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.outline },
      ]}>
      {/* image thumbnail */}
      <ImageBackground
        source={thumb}
        style={styles.cardImg}
        imageStyle={styles.cardImgRadius}
        resizeMode="cover">
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.60)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.catBadge}>
          <Text style={styles.catBadgeTxt}>{item.category || 'General'}</Text>
        </View>
      </ImageBackground>

      {/* text content */}
      <View style={styles.cardContent}>
        <Text
          style={[styles.quoteText, { color: colors.onSurface }]}
          numberOfLines={4}>
          {item.text}
        </Text>
        {item.author ? (
          <View style={styles.authorRow}>
            <View
              style={[styles.authorDot, { backgroundColor: colors.primary }]}
            />
            <Text
              style={[styles.authorTxt, { color: colors.onSurfaceVariant }]}
              numberOfLines={1}>
              {item.author}
            </Text>
          </View>
        ) : null}

        {/* remove button */}
        <TouchableOpacity
          style={[
            styles.removeBtn,
            { backgroundColor: 'rgba(255,107,138,0.10)', borderColor: 'rgba(255,107,138,0.35)' },
          ]}
          onPress={onRemove}>
          <Icon name="heart-off-outline" size={14} color="#FF6B8A" />
          <Text style={[styles.removeTxt, { color: '#FF6B8A' }]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  headerCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  headerCount: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.8,
  },

  emptyWrap: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyBody: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardImg: {
    height: 120,
    justifyContent: 'flex-end',
    padding: 10,
  },
  cardImgRadius: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  catBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  catBadgeTxt: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardContent: {
    padding: 14,
    gap: 10,
  },
  quoteText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  authorTxt: {
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  removeTxt: {
    fontSize: 12,
    fontWeight: '700',
  },
});
