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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import ShareSheet from '../components/ShareSheet';
import QuoteShareCard from '../components/QuoteShareCard';
import { shareImageSystemSheet, shareTargets } from '../utils/shareImage';

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = 75;
const ANIM_MS = 280;

export default function HomeScreen() {
  const {
    colors,
    dailyQuote, dailyQuoteIndex,
    imageForIndex,
    toggleFavorite, isFavorite, registerQuoteViewed,
    streak, allQuotes, seenQuoteIds,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(dailyQuoteIndex);
  const [shareVisible, setShareVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const shotRef = useRef(null);
  const insets = useSafeAreaInsets();

  const activeQuote = allQuotes[currentIndex] || dailyQuote;
  const bg = useMemo(() => imageForIndex(currentIndex), [currentIndex, imageForIndex]);
  const fav = isFavorite(activeQuote.id);
  const isDaily = currentIndex === dailyQuoteIndex;

  const progressPct = allQuotes.length
    ? Math.min(100, Math.round((seenQuoteIds.length / allQuotes.length) * 100))
    : 0;

  useFocusEffect(
    useCallback(() => {
      registerQuoteViewed(activeQuote.id);
    }, [registerQuoteViewed, activeQuote.id]),
  );

  /* ─── animation shared values ─── */
  const translateX = useSharedValue(0);

  /**
   * Called on the JS thread after the exit animation finishes.
   * Sets the new index, then slides the new card in from `enterX`.
   */
  const applyIndex = useCallback(
    (newIdx, enterX) => {
      setCurrentIndex(newIdx);
      registerQuoteViewed((allQuotes[newIdx] || dailyQuote).id);
      // Wait one frame so React renders the new quote before the enter animation
      requestAnimationFrame(() => {
        translateX.value = enterX;
        translateX.value = withTiming(0, { duration: ANIM_MS });
      });
    },
    [allQuotes, dailyQuote, registerQuoteViewed, translateX],
  );

  const slideToIndex = useCallback(
    (newIdx, direction) => {
      const exitX = direction === 'next' ? -SCREEN_W * 1.1 : SCREEN_W * 1.1;
      const enterX = direction === 'next' ? SCREEN_W * 1.1 : -SCREEN_W * 1.1;
      translateX.value = withTiming(exitX, { duration: ANIM_MS }, finished => {
        if (finished) { runOnJS(applyIndex)(newIdx, enterX); }
      });
    },
    [applyIndex, translateX],
  );

  const goNext = useCallback(() => {
    slideToIndex((currentIndex + 1) % allQuotes.length, 'next');
  }, [currentIndex, allQuotes.length, slideToIndex]);

  const goPrev = useCallback(() => {
    slideToIndex((currentIndex - 1 + allQuotes.length) % allQuotes.length, 'prev');
  }, [currentIndex, allQuotes.length, slideToIndex]);

  const onShuffle = useCallback(() => {
    if (allQuotes.length <= 1) { return; }
    let newIdx;
    do { newIdx = Math.floor(Math.random() * allQuotes.length); }
    while (newIdx === currentIndex);
    slideToIndex(newIdx, 'next');
  }, [allQuotes.length, currentIndex, slideToIndex]);

  const onResetDaily = useCallback(() => {
    slideToIndex(dailyQuoteIndex, dailyQuoteIndex > currentIndex ? 'next' : 'prev');
  }, [dailyQuoteIndex, currentIndex, slideToIndex]);

  /* ─── pan gesture ─── */
  const panGesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .onUpdate(e => {
      translateX.value = e.translationX;
    })
    .onEnd(e => {
      if (e.translationX < -SWIPE_THRESHOLD) {
        // swipe left → next quote
        const next = (currentIndex + 1) % allQuotes.length;
        translateX.value = withTiming(-SCREEN_W * 1.1, { duration: ANIM_MS }, done => {
          if (done) { runOnJS(applyIndex)(next, SCREEN_W * 1.1); }
        });
      } else if (e.translationX > SWIPE_THRESHOLD) {
        // swipe right → previous quote
        const prev = (currentIndex - 1 + allQuotes.length) % allQuotes.length;
        translateX.value = withTiming(SCREEN_W * 1.1, { duration: ANIM_MS }, done => {
          if (done) { runOnJS(applyIndex)(prev, -SCREEN_W * 1.1); }
        });
      } else {
        // snap back
        translateX.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_W / 2, 0, SCREEN_W / 2],
      [-7, 0, 7],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SCREEN_W * 0.55],
      [1, 0.35],
      Extrapolation.CLAMP,
    );
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  /* ─── capture / share / download ─── */
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

  const onShare = async platform => {
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

  /* ─── render ─── */
  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground source={bg} style={styles.fill} resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.18)', 'rgba(0,0,0,0.52)', 'rgba(0,0,0,0.94)']}
          locations={[0, 0.5, 1]}
          style={styles.fill}>

          {/* ── app bar ── */}
          <View style={[styles.appBar, { paddingTop: insets.top + 12 }]}>
            <View style={styles.appBarLeft}>
              <Icon name="lightning-bolt" size={20} color={colors.secondary} />
              <Text style={styles.appBarTitle}>Daily Motivation</Text>
            </View>
            <View style={[styles.streakChip, { borderColor: 'rgba(255,255,255,0.28)' }]}>
              <Icon name="fire" size={16} color={colors.secondary} />
              <Text style={[styles.streakCount, { color: colors.secondary }]}>{streak}</Text>
              <Text style={styles.streakLabel}>day{streak === 1 ? '' : 's'}</Text>
            </View>
          </View>

          {/* ── swipeable card ── */}
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.quoteArea, cardStyle]}>
              <ViewShot
                ref={shotRef}
                options={{ format: 'png', quality: 1, result: 'tmpfile' }}>
                <QuoteShareCard quote={activeQuote} imageSource={bg} />
              </ViewShot>
            </Animated.View>
          </GestureDetector>

          {/* ── swipe hint ── */}
          <View style={styles.swipeHintRow}>
            <Icon name="chevron-left" size={16} color="rgba(255,255,255,0.30)" />
            <Text style={styles.swipeHintTxt}>swipe to explore</Text>
            <Icon name="chevron-right" size={16} color="rgba(255,255,255,0.30)" />
          </View>

          {/* ── action panel ── */}
          <View style={[styles.actionPanel, { paddingBottom: insets.bottom + 108 }]}>

            {/* meta: category + counter + "Today" reset */}
            <View style={styles.metaRow}>
              <View style={styles.catPill}>
                <Icon name="tag-outline" size={11} color="rgba(255,255,255,0.8)" />
                <Text style={styles.catTxt}>{activeQuote.category || 'General'}</Text>
              </View>

              <Text style={styles.counterTxt}>
                {currentIndex + 1} <Text style={styles.counterTotal}>/ {allQuotes.length}</Text>
              </Text>

              {!isDaily && (
                <TouchableOpacity style={styles.todayBtn} onPress={onResetDaily}>
                  <Icon name="calendar-today" size={13} color={colors.secondary} />
                  <Text style={[styles.todayTxt, { color: colors.secondary }]}>Today</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* progress bar */}
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPct}%`, backgroundColor: colors.secondary },
                  ]}
                />
              </View>
              <Text style={styles.progressTxt}>{progressPct}% explored</Text>
            </View>

            {/* actions: prev + fav + shuffle + copy + share + next */}
            <View style={styles.actionsRow}>
              <ActionBtn icon="chevron-left" label="Prev" onPress={goPrev} />
              <ActionBtn
                icon={fav ? 'heart' : 'heart-outline'}
                label={fav ? 'Saved' : 'Save'}
                iconColor={fav ? '#FF6B8A' : 'rgba(255,255,255,0.9)'}
                onPress={() => toggleFavorite(activeQuote.id)}
              />
              <ActionBtn icon="shuffle-variant" label="Shuffle" onPress={onShuffle} />
              <ActionBtn icon="content-copy" label="Copy" onPress={onCopy} />
              <ActionBtn
                icon="share-variant"
                label="Share"
                iconColor={colors.secondary}
                onPress={() => setShareVisible(true)}
              />
              <ActionBtn icon="chevron-right" label="Next" onPress={goNext} />
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

/* ─── small action button ─── */
function ActionBtn({ icon, label, iconColor, onPress }) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <View style={styles.actionCircle}>
        <Icon name={icon} size={21} color={iconColor || 'rgba(255,255,255,0.92)'} />
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
    paddingBottom: 10,
  },
  appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  appBarTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  streakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 11,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  streakCount: { fontSize: 14, fontWeight: '900' },
  streakLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: '600' },

  /* quote card area */
  quoteArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  /* swipe hint */
  swipeHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 6,
  },
  swipeHintTxt: {
    color: 'rgba(255,255,255,0.28)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
  },

  /* action panel */
  actionPanel: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 9,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  catTxt: { color: 'rgba(255,255,255,0.88)', fontSize: 11, fontWeight: '700' },
  counterTxt: { color: '#fff', fontSize: 14, fontWeight: '800' },
  counterTotal: { color: 'rgba(255,255,255,0.45)', fontWeight: '500' },
  todayBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  todayTxt: { fontSize: 12, fontWeight: '700' },

  /* progress */
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
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
    color: 'rgba(255,255,255,0.50)',
    fontSize: 10,
    fontWeight: '600',
    minWidth: 76,
    textAlign: 'right',
  },

  /* icon action buttons */
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  actionBtn: { alignItems: 'center', gap: 5, flex: 1 },
  actionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
