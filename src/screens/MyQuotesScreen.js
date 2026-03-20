import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Clipboard from '@react-native-clipboard/clipboard';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import ShareSheet from '../components/ShareSheet';
import QuoteShareCard from '../components/QuoteShareCard';
import { shareImageSystemSheet, shareTargets } from '../utils/shareImage';

const CATEGORY_COLORS = {
  Personal:   { bg: 'rgba(160,156,255,0.18)', text: '#A09CFF' },
  Success:    { bg: 'rgba(255,209,102,0.18)', text: '#FFD166' },
  Discipline: { bg: 'rgba(255,107,138,0.18)', text: '#FF6B8A' },
  Life:       { bg: 'rgba(139,213,176,0.18)', text: '#8BD5B0' },
  Mindset:    { bg: 'rgba(100,200,255,0.18)', text: '#64C8FF' },
  Growth:     { bg: 'rgba(255,160,80,0.18)',  text: '#FFA050' },
  Focus:      { bg: 'rgba(180,100,255,0.18)', text: '#B464FF' },
  Resilience: { bg: 'rgba(80,220,200,0.18)',  text: '#50DCC8' },
  Leadership: { bg: 'rgba(255,140,100,0.18)', text: '#FF8C64' },
};

function categoryStyle(cat) {
  return CATEGORY_COLORS[cat] || { bg: 'rgba(160,156,255,0.15)', text: '#A09CFF' };
}

function formatDate(isoString) {
  if (!isoString) { return ''; }
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function QuoteCard({ item, colors, imageSource, onEdit, onDelete, onShare }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
      {/* ── background image header ── */}
      <ImageBackground
        source={imageSource}
        style={styles.cardImg}
        imageStyle={styles.cardImgRadius}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.82)']}
          style={StyleSheet.absoluteFill}
        />
        {/* category + date overlay */}
        <View style={styles.imgTopRow}>
          <View style={styles.catBadge}>
            <Text style={styles.catTxt}>{item.category}</Text>
          </View>
          <Text style={styles.dateTxt}>
            {item.updatedAt ? `Edited ${formatDate(item.updatedAt)}` : formatDate(item.createdAt)}
          </Text>
        </View>
        {/* quote preview on image */}
        <Text style={styles.imgQuotePreview} numberOfLines={2}>
          "{item.text}"
        </Text>
      </ImageBackground>

      {/* ── content below image ── */}
      <View style={[styles.cardBody, { backgroundColor: colors.surface }]}>
        {item.author ? (
          <View style={styles.authorRow}>
            <View style={[styles.authorDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.authorTxt, { color: colors.onSurfaceVariant }]}>
              {item.author}
            </Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: 'rgba(160,156,255,0.12)', borderColor: 'rgba(160,156,255,0.30)' }]}
            onPress={() => onShare(item)}>
            <Icon name="share-variant-outline" size={14} color={colors.primary} />
            <Text style={[styles.actionTxt, { color: colors.primary }]}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.surfaceVariant, borderColor: colors.outline }]}
            onPress={() => onEdit(item)}>
            <Icon name="pencil-outline" size={14} color={colors.primary} />
            <Text style={[styles.actionTxt, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: 'rgba(255,107,138,0.10)', borderColor: 'rgba(255,107,138,0.35)' }]}
            onPress={() => onDelete(item)}>
            <Icon name="trash-can-outline" size={14} color="#FF6B8A" />
            <Text style={[styles.actionTxt, { color: '#FF6B8A' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function MyQuotesScreen() {
  const { colors, customQuotes, deleteCustomQuote, imageForIndex } = useApp();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const shotRef = useRef(null);

  const [filter, setFilter] = useState('All');
  const [shareVisible, setShareVisible] = useState(false);
  const [sharingQuote, setSharingQuote] = useState(null);
  const [sharingBg, setSharingBg] = useState(null);
  const [busy, setBusy] = useState(false);

  const categories = ['All', ...Array.from(new Set(customQuotes.map(q => q.category))).sort()];
  const filtered = filter === 'All' ? customQuotes : customQuotes.filter(q => q.category === filter);

  /* ── share helpers (same pattern as HomeScreen) ── */
  const capturePath = async () =>
    captureRef(shotRef, { format: 'png', quality: 1, result: 'tmpfile' });

  const ensureAndroidSavePermission = async () => {
    if (Platform.OS !== 'android') { return true; }
    if (Platform.Version >= 33) {
      const r = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
      return r === PermissionsAndroid.RESULTS.GRANTED;
    }
    if (Platform.Version <= 28) {
      const r = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      return r === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const onCopy = () => {
    if (!sharingQuote) { return; }
    const t = sharingQuote.author
      ? `"${sharingQuote.text}" — ${sharingQuote.author}`
      : `"${sharingQuote.text}"`;
    Clipboard.setString(t);
    setShareVisible(false);
    Alert.alert('Copied', 'Quote copied to clipboard.');
  };

  const onDownload = async () => {
    try {
      setBusy(true);
      const ok = await ensureAndroidSavePermission();
      if (!ok) { Alert.alert('Permission denied', 'Storage permission is required to save images.'); return; }
      const path = await capturePath();
      await CameraRoll.saveAsset(`file://${path}`, { type: 'photo' });
      setShareVisible(false);
      Alert.alert('Saved', 'Quote image saved to your gallery.');
    } catch (e) {
      Alert.alert('Error', 'Could not save the image. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const onShare = async (target) => {
    try {
      setBusy(true);
      const path = await capturePath();
      if (target === 'system') {
        await shareImageSystemSheet(path);
      } else if (shareTargets[target]) {
        await shareTargets[target](path);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not share the image. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  /* ── open share sheet for a specific quote ── */
  function handleShare(item) {
    const idx = customQuotes.indexOf(item);
    // offset by 17 so custom quotes get different backgrounds from the regular quote index 0
    const bg = imageForIndex(17 + idx);
    setSharingQuote(item);
    setSharingBg(bg);
    setShareVisible(true);
  }

  function handleDelete(item) {
    Alert.alert(
      'Delete Quote',
      'Are you sure you want to delete this quote? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCustomQuote(item.id) },
      ],
    );
  }

  function handleEdit(item) {
    navigation.navigate('CustomQuoteForm', { quote: item });
  }

  function handleCreate() {
    navigation.navigate('CustomQuoteForm', {});
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── hidden share card (off-screen, captured by ViewShot) ── */}
      <View style={styles.hiddenCapture} pointerEvents="none">
        <ViewShot ref={shotRef} options={{ format: 'png', quality: 1 }}>
          {sharingQuote ? (
            <QuoteShareCard quote={sharingQuote} imageSource={sharingBg} />
          ) : null}
        </ViewShot>
      </View>

      {/* ── header card ── */}
      <View style={[styles.headerCard, { backgroundColor: colors.primaryContainer, marginHorizontal: 16 }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeft}>
            <Icon name="pencil-box-multiple-outline" size={22} color={colors.primary} />
            <Text style={[styles.headerCount, { color: colors.onPrimaryContainer }]}>
              {customQuotes.length} {customQuotes.length === 1 ? 'quote' : 'quotes'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.createBtn, { backgroundColor: colors.primary }]}
            onPress={handleCreate}
            activeOpacity={0.8}>
            <Icon name="plus" size={16} color={colors.onPrimary} />
            <Text style={[styles.createBtnTxt, { color: colors.onPrimary }]}>New Quote</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerSub, { color: colors.onPrimaryContainer }]}>
          Write and keep your own words of wisdom.
        </Text>
      </View>

      {/* ── category filter chips (fixed-height horizontal scroll) ── */}
      {customQuotes.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={styles.filterScroll}>
          {categories.map(cat => {
            const active = cat === filter;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  active
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.surfaceVariant, borderColor: colors.outline, borderWidth: 1 },
                ]}
                onPress={() => setFilter(cat)}
                activeOpacity={0.75}>
                <Text style={[styles.chipTxt, { color: active ? colors.onPrimary : colors.onSurfaceVariant }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* ── quote list ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Icon name="pencil-plus-outline" size={64} color={colors.onSurfaceVariant} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
              No custom quotes yet
            </Text>
            <Text style={[styles.emptyBody, { color: colors.onSurfaceVariant }]}>
              Tap "New Quote" to write your first quote.
            </Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
              onPress={handleCreate}
              activeOpacity={0.8}>
              <Icon name="plus" size={16} color={colors.onPrimary} />
              <Text style={[styles.emptyBtnTxt, { color: colors.onPrimary }]}>Create My First Quote</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item, index }) => (
          <QuoteCard
            item={item}
            colors={colors}
            imageSource={imageForIndex(17 + index)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShare={handleShare}
          />
        )}
      />

      {/* ── share bottom sheet ── */}
      <ShareSheet
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        onShare={onShare}
        onDownload={onDownload}
        onCopy={onCopy}
        loading={busy}
        colors={colors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  hiddenCapture: {
    position: 'absolute',
    top: -2000,
    left: 0,
    opacity: 0,
  },

  headerCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 4,
    gap: 6,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createBtnTxt: {
    fontSize: 13,
    fontWeight: '700',
  },

  filterScroll: {
    flexGrow: 0,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipTxt: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 12,
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
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyBtnTxt: {
    fontSize: 14,
    fontWeight: '700',
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
  },
  cardImg: {
    height: 150,
    justifyContent: 'space-between',
    padding: 12,
  },
  cardImgRadius: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imgTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catBadge: {
    backgroundColor: 'rgba(0,0,0,0.40)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  catTxt: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  dateTxt: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 11,
    fontWeight: '500',
  },
  imgQuotePreview: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  cardBody: {
    padding: 14,
    gap: 10,
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
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionTxt: {
    fontSize: 12,
    fontWeight: '700',
  },
});
