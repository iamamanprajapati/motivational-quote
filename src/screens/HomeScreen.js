import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Clipboard from '@react-native-clipboard/clipboard';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Animated, { FadeIn } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import ShareSheet from '../components/ShareSheet';
import QuoteShareCard from '../components/QuoteShareCard';
import { shareImageSystemSheet, shareTargets } from '../utils/shareImage';

const { height: SCREEN_H } = Dimensions.get('window');

export default function HomeScreen() {
  const {
    colors, isDark,
    dailyQuote, dailyQuoteIndex, imageForIndex,
    toggleFavorite, isFavorite, registerQuoteViewed,
    streak, allQuotes, seenQuoteIds,
  } = useApp();

  const [shuffleQuote, setShuffleQuote] = useState(null);
  const [shareVisible, setShareVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const shotRef = useRef(null);
  const insets = useSafeAreaInsets();

  const activeQuote = shuffleQuote || dailyQuote;
  const quoteListIndex = useMemo(() => {
    if (shuffleQuote) {
      const i = allQuotes.findIndex(q => q.id === shuffleQuote.id);
      return i >= 0 ? i : dailyQuoteIndex;
    }
    return dailyQuoteIndex;
  }, [shuffleQuote, dailyQuoteIndex, allQuotes]);

  const bg = useMemo(
    () => imageForIndex(quoteListIndex),
    [quoteListIndex, imageForIndex],
  );

  useFocusEffect(
    useCallback(() => {
      registerQuoteViewed(activeQuote.id);
    }, [registerQuoteViewed, activeQuote.id]),
  );

  const fav = isFavorite(activeQuote.id);

  const progressPct = allQuotes.length
    ? Math.min(100, Math.round((seenQuoteIds.length / allQuotes.length) * 100))
    : 0;

  /* ── capture ── */
  const capturePath = async () =>
    captureRef(shotRef, { format: 'png', quality: 1, result: 'tmpfile' });

  const ensureAndroidSavePermission = async () => {
    if (Platform.OS !== 'android') { return true; }
    if (Platform.Version >= 33) {
      const r = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      );
      return r === PermissionsAndroid.RESULTS.GRANTED;
    }
    if (Platform.Version <= 28) {
      const r = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      return r === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  /* ── actions ── */
  const onShuffle = () => {
    const pool = allQuotes.length ? allQuotes : [dailyQuote];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setShuffleQuote(pick);
    registerQuoteViewed(pick.id);
  };

  const onResetDaily = () => setShuffleQuote(null);

  const onCopy = () => {
    const t = activeQuote.author
      ? `"${activeQuote.text}" — ${activeQuote.author}`
      : `"${activeQuote.text}"`;
    Clipboard.setString(t);
    Alert.alert('Copied', 'Quote copied to clipboard.');
  };

  const onDownload = async () => {
    try {
      setBusy(true);
      const ok = await ensureAndroidSavePermission();
      if (!ok) { Alert.alert('Permission', 'Photo access needed.'); return; }
      const uri = await capturePath();
      await CameraRoll.saveAsset(uri, { type: 'photo', album: 'Daily Motivation' });
      Alert.alert('Saved', 'Quote image saved to gallery.');
    } catch (e) {
      Alert.alert('Error', e?.message || 'Save failed.');
    } finally {
      setBusy(false);
    }
  };

  const onShare = async (platform) => {
    try {
      setBusy(true);
      const uri = await capturePath();
      if (platform === 'system') {
        await shareImageSystemSheet(uri);
      } else if (shareTargets[platform]) {
        await shareTargets[platform](uri);
      }
    } catch (e) {
      Alert.alert('Share', e?.message || 'Could not share.');
    } finally {
      setBusy(false);
      setShareVisible(false);
    }
  };

  /* ── render ── */
  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={bg}
        style={styles.fill}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.18)', 'rgba(0,0,0,0.52)', 'rgba(0,0,0,0.94)']}
          locations={[0, 0.5, 1]}
          style={styles.fill}>

          {/* ── top app bar ── */}
          <View style={[styles.appBar, { paddingTop: insets.top + 12 }]}>
            <View style={styles.appBarLeft}>
              <Icon name="lightning-bolt" size={20} color={colors.secondary} />
              <Text style={styles.appBarTitle}>Daily Motivation</Text>
            </View>
            <View style={[styles.streakChip, { borderColor: 'rgba(255,255,255,0.28)' }]}>
              <Icon name="fire" size={16} color={colors.secondary} />
              <Text style={[styles.streakCount, { color: colors.secondary }]}>
                {streak}
              </Text>
              <Text style={styles.streakLabel}>day{streak === 1 ? '' : 's'}</Text>
            </View>
          </View>

          {/* ── quote card (ViewShot) ── */}
          <View style={styles.quoteArea}>
            <Animated.View entering={FadeIn.duration(800)}>
              <ViewShot
                ref={shotRef}
                options={{ format: 'png', quality: 1, result: 'tmpfile' }}>
                <QuoteShareCard quote={activeQuote} imageSource={bg} />
              </ViewShot>
            </Animated.View>
          </View>

          {/* ── action panel ── */}
          <View
            style={[
              styles.actionPanel,
              { paddingBottom: insets.bottom + 16 },
            ]}>
            {/* category + shuffle/daily toggle */}
            <View style={styles.metaRow}>
              <View style={styles.catPill}>
                <Icon name="tag-outline" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.catTxt}>
                  {activeQuote.category || 'General'}
                </Text>
              </View>
              {shuffleQuote ? (
                <TouchableOpacity
                  style={styles.todayBtn}
                  onPress={onResetDaily}>
                  <Icon name="calendar-today" size={14} color={colors.secondary} />
                  <Text style={[styles.todayTxt, { color: colors.secondary }]}>
                    Today's Quote
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* progress bar */}
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressPct}%`,
                      backgroundColor: colors.secondary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressTxt}>
                {progressPct}% explored
              </Text>
            </View>

            {/* primary actions */}
            <View style={styles.actionsRow}>
              <ActionBtn
                icon={fav ? 'heart' : 'heart-outline'}
                label={fav ? 'Saved' : 'Save'}
                iconColor={fav ? '#FF6B8A' : 'rgba(255,255,255,0.9)'}
                onPress={() => toggleFavorite(activeQuote.id)}
              />
              <ActionBtn
                icon="shuffle-variant"
                label="Shuffle"
                onPress={onShuffle}
              />
              <ActionBtn
                icon="content-copy"
                label="Copy"
                onPress={onCopy}
              />
              <ActionBtn
                icon="share-variant"
                label="Share"
                iconColor={colors.secondary}
                onPress={() => setShareVisible(true)}
              />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* ── share bottom sheet ── */}
      <ShareSheet
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        onShare={onShare}
        onDownload={() => { setShareVisible(false); onDownload(); }}
        onCopy={() => { setShareVisible(false); onCopy(); }}
        loading={busy}
        colors={colors}
      />
    </View>
  );
}

/* ── tiny sub-component: icon action button ── */
function ActionBtn({ icon, label, iconColor, onPress }) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <View style={styles.actionCircle}>
        <Icon
          name={icon}
          size={24}
          color={iconColor || 'rgba(255,255,255,0.92)'}
        />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  fill: { flex: 1 },

  /* app bar */
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  appBarTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  streakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  streakCount: { fontSize: 15, fontWeight: '900' },
  streakLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },

  /* quote area */
  quoteArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  /* action panel */
  actionPanel: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  catTxt: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 12,
    fontWeight: '700',
  },
  todayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  todayTxt: { fontSize: 12, fontWeight: '700' },

  /* progress */
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  progressTxt: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'right',
  },

  /* icon actions */
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: { alignItems: 'center', gap: 6, minWidth: 64 },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '600',
  },
});
