import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import QuoteShareCard from '../components/QuoteShareCard';

const APP_STORE_LINK = 'https://play.google.com/store/apps/details?id=com.kwikitt.dailymotivation';

export default function SettingsScreen() {
  const {
    colors,
    reminder, setReminder,
    streak, seenQuoteIds,
    dailyQuote, imageForIndex, dailyQuoteIndex,
  } = useApp();
  const insets = useSafeAreaInsets();
  const shotRef = useRef(null);
  const [sharing, setSharing] = useState(false);

  /* ── share app ── */
  const onShareApp = async () => {
    try {
      setSharing(true);
      const uri = await captureRef(shotRef, { format: 'png', quality: 1, result: 'tmpfile' });
      await Share.open({
        title: 'Daily Motivation',
        message: `"${dailyQuote.text}"\n\nStay inspired every day! 🌟\nDownload Daily Motivation:\n${APP_STORE_LINK}`,
        url: `file://${uri}`,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (e) {
      if (e?.message !== 'User did not share') {
        Alert.alert('Oops', 'Could not open share sheet. Please try again.');
      }
    } finally {
      setSharing(false);
    }
  };

  /* ── reset streak ── */
  const confirmResetStreak = () => {
    Alert.alert(
      'Reset Streak',
      'Are you sure you want to reset your streak to 0?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => {} },
      ],
    );
  };

  const bgImage = imageForIndex(dailyQuoteIndex);

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      showsVerticalScrollIndicator={false}>

      {/* ── hidden quote card for share capture ── */}
      <View style={styles.hiddenCapture} pointerEvents="none">
        <ViewShot ref={shotRef} options={{ format: 'png', quality: 1 }}>
          <QuoteShareCard quote={dailyQuote} imageSource={bgImage} />
        </ViewShot>
      </View>

      {/* ── hero header ── */}
      <LinearGradient
        colors={['#2D2A6E', '#1A1240', '#09090F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <View style={styles.heroIconWrap}>
          <Icon name="lightning-bolt" size={28} color="#FFD166" />
        </View>
        <Text style={styles.heroTitle}>Daily Motivation</Text>
        <Text style={styles.heroSub}>Stay consistent. Stay inspired.</Text>
      </LinearGradient>

      {/* ── YOUR JOURNEY ── */}
      <SectionLabel label="YOUR JOURNEY" colors={colors} />
      <View style={[styles.statsRow, { paddingHorizontal: 16 }]}>
        <StatCard
          icon="fire"
          iconColor="#FF6B35"
          label="Day Streak"
          value={String(streak)}
          gradientColors={['rgba(255,107,53,0.18)', 'rgba(255,107,53,0.06)']}
          colors={colors}
        />
        <StatCard
          icon="eye-check-outline"
          iconColor={colors.primary}
          label="Explored"
          value={String(seenQuoteIds.length)}
          gradientColors={['rgba(160,156,255,0.18)', 'rgba(160,156,255,0.06)']}
          colors={colors}
        />
      </View>

      {/* ── NOTIFICATIONS ── */}
      <SectionLabel label="NOTIFICATIONS" colors={colors} />
      <View style={[styles.section, { borderColor: colors.outline }]}>
        <SettingsRow
          icon="bell-ring-outline"
          iconBg="rgba(160,156,255,0.14)"
          iconColor={colors.primary}
          label="Daily Reminder"
          sub="Get a motivational push every morning"
          colors={colors}>
          <Switch
            value={reminder}
            onValueChange={setReminder}
            trackColor={{ false: colors.outlineVariant, true: colors.primaryContainer }}
            thumbColor={reminder ? colors.primary : colors.surfaceVariant}
          />
        </SettingsRow>
      </View>

      {/* ── SHARE & INVITE ── */}
      <SectionLabel label="SHARE & INVITE" colors={colors} />
      <TouchableOpacity
        style={styles.shareCard}
        onPress={onShareApp}
        activeOpacity={0.85}
        disabled={sharing}>
        <LinearGradient
          colors={['#4C46B8', '#7B78FF', '#A09CFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.shareCardGradient}>
          <View style={styles.shareCardLeft}>
            <View style={styles.shareIconCircle}>
              {sharing
                ? <ActivityIndicator size="small" color="#fff" />
                : <Icon name="share-variant" size={22} color="#fff" />}
            </View>
            <View style={styles.shareCardText}>
              <Text style={styles.shareCardTitle}>Share Daily Motivation</Text>
              <Text style={styles.shareCardSub}>
                Inspire your friends with today's quote
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.70)" />
        </LinearGradient>
      </TouchableOpacity>

      {/* ── ABOUT ── */}
      <SectionLabel label="ABOUT" colors={colors} />
      <View style={[styles.section, { borderColor: colors.outline }]}>
        <SettingsRow
          icon="information-outline"
          iconBg="rgba(160,156,255,0.14)"
          iconColor={colors.primary}
          label="Version"
          sub="1.0.0"
          colors={colors}
        />
        <Divider colors={colors} />
        <SettingsRow
          icon="format-quote-open"
          iconBg="rgba(255,209,102,0.14)"
          iconColor="#FFD166"
          label="Motivational Quotes"
          sub="Handpicked collection, fully offline"
          colors={colors}
        />
        <Divider colors={colors} />
        <SettingsRow
          icon="image-multiple-outline"
          iconBg="rgba(139,213,176,0.14)"
          iconColor="#8BD5B0"
          label="Beautiful Backgrounds"
          sub="Stunning imagery, built in"
          colors={colors}
        />
        <Divider colors={colors} />
        <SettingsRow
          icon="wifi-off"
          iconBg="rgba(100,200,255,0.14)"
          iconColor="#64C8FF"
          label="100% Offline"
          sub="No account or internet required"
          colors={colors}
        />
      </View>

      {/* ── DATA ── */}
      <SectionLabel label="DATA" colors={colors} />
      <View style={[styles.section, { borderColor: colors.outline }]}>
        <TouchableOpacity style={styles.dangerRow} onPress={confirmResetStreak}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconWrap, { backgroundColor: 'rgba(211,47,47,0.12)' }]}>
              <Icon name="restart" size={20} color="#D32F2F" />
            </View>
            <View>
              <Text style={[styles.rowLabel, { color: '#D32F2F' }]}>Reset Streak</Text>
              <Text style={[styles.rowSub, { color: colors.onSurfaceVariant }]}>
                Start over from day 0
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* ── footer ── */}
      <View style={styles.footer}>
        <Icon name="heart" size={14} color={colors.primary} />
        <Text style={[styles.footerTxt, { color: colors.onSurfaceVariant }]}>
          Made with love for those who grind
        </Text>
      </View>
    </ScrollView>
  );
}

/* ── sub-components ── */

function SectionLabel({ label, colors }) {
  return (
    <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>
      {label}
    </Text>
  );
}

function StatCard({ icon, iconColor, label, value, gradientColors, colors }) {
  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.statCard, { borderColor: colors.outline }]}>
      <View style={[styles.statIconWrap, { backgroundColor: colors.surface }]}>
        <Icon name={icon} size={22} color={iconColor} />
      </View>
      <Text style={[styles.statValue, { color: colors.onSurface }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
    </LinearGradient>
  );
}

function SettingsRow({ icon, iconBg, iconColor, label, sub, colors, children }) {
  return (
    <View style={styles.settingsRow}>
      <View style={styles.rowLeft}>
        <View style={[styles.iconWrap, { backgroundColor: iconBg || colors.surfaceVariant }]}>
          <Icon name={icon} size={20} color={iconColor || colors.primary} />
        </View>
        <View style={styles.rowTextWrap}>
          <Text style={[styles.rowLabel, { color: colors.onSurface }]}>{label}</Text>
          {sub ? (
            <Text style={[styles.rowSub, { color: colors.onSurfaceVariant }]}>{sub}</Text>
          ) : null}
        </View>
      </View>
      {children || null}
    </View>
  );
}

function Divider({ colors }) {
  return <View style={[styles.divider, { backgroundColor: colors.divider }]} />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  hiddenCapture: {
    position: 'absolute',
    top: -2000,
    left: 0,
    opacity: 0,
  },

  /* hero */
  hero: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,209,102,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  /* section label */
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 10,
  },

  /* stats */
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 36,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  /* settings section */
  section: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextWrap: { flex: 1 },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 66,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  /* share card */
  shareCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#7B78FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 16,
  },
  shareCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  shareCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  shareIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareCardText: { flex: 1 },
  shareCardTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  shareCardSub: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },

  /* footer */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 32,
    marginBottom: 8,
  },
  footerTxt: {
    fontSize: 12,
    fontWeight: '500',
  },
});
