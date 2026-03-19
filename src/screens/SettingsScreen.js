import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';

export default function SettingsScreen() {
  const {
    colors, isDark, setTheme,
    reminder, setReminder,
    streak, seenQuoteIds, allQuotes,
  } = useApp();
  const insets = useSafeAreaInsets();

  const progressPct = allQuotes.length
    ? Math.min(100, Math.round((seenQuoteIds.length / allQuotes.length) * 100))
    : 0;

  const confirmResetStreak = useCallback(() => {
    Alert.alert(
      'Reset Streak',
      'Are you sure you want to reset your streak?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => {} },
      ],
    );
  }, []);

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>

      {/* ── stats section ── */}
      <SectionLabel label="YOUR STATS" colors={colors} />
      <View style={[styles.statsGrid, { paddingHorizontal: 16, gap: 10 }]}>
        <StatCard
          icon="fire"
          iconColor="#FF6B35"
          label="Day Streak"
          value={String(streak)}
          colors={colors}
        />
        <StatCard
          icon="eye-check-outline"
          iconColor={colors.primary}
          label="Explored"
          value={`${seenQuoteIds.length}`}
          colors={colors}
        />
        <StatCard
          icon="bookmark-multiple-outline"
          iconColor="#FFD166"
          label="Total Quotes"
          value={String(allQuotes.length)}
          colors={colors}
        />
        <StatCard
          icon="chart-donut"
          iconColor="#8BD5B0"
          label="Progress"
          value={`${progressPct}%`}
          colors={colors}
        />
      </View>

      {/* progress bar */}
      <View style={[styles.progressWrap, { paddingHorizontal: 16, marginTop: 4 }]}>
        <View style={[styles.progressTrack, { backgroundColor: colors.outlineVariant }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPct}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>
        <Text style={[styles.progressLabel, { color: colors.onSurfaceVariant }]}>
          {seenQuoteIds.length} of {allQuotes.length} quotes viewed
        </Text>
      </View>

      {/* ── appearance ── */}
      <SectionLabel label="APPEARANCE" colors={colors} />
      <View style={[styles.section, { borderColor: colors.outline }]}>
        <SettingsRow
          icon="brightness-6"
          label="Dark Mode"
          sub={isDark ? 'Currently dark' : 'Currently light'}
          colors={colors}>
          <Switch
            value={isDark}
            onValueChange={v => setTheme(v ? 'dark' : 'light')}
            trackColor={{ false: colors.outlineVariant, true: colors.primaryContainer }}
            thumbColor={isDark ? colors.primary : colors.surfaceVariant}
          />
        </SettingsRow>
      </View>

      {/* ── notifications ── */}
      <SectionLabel label="NOTIFICATIONS" colors={colors} />
      <View style={[styles.section, { borderColor: colors.outline }]}>
        <SettingsRow
          icon="bell-outline"
          label="Daily Reminder"
          sub="Get a motivational reminder each day"
          colors={colors}>
          <Switch
            value={reminder}
            onValueChange={setReminder}
            trackColor={{ false: colors.outlineVariant, true: colors.primaryContainer }}
            thumbColor={reminder ? colors.primary : colors.surfaceVariant}
          />
        </SettingsRow>
      </View>

      {/* ── about ── */}
      <SectionLabel label="ABOUT" colors={colors} />
      <View style={[styles.section, { borderColor: colors.outline }]}>
        <SettingsRow
          icon="information-outline"
          label="Version"
          sub="1.0.0"
          colors={colors}
        />
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <SettingsRow
          icon="lightning-bolt-outline"
          label="1000 Motivational Quotes"
          sub="Fully offline"
          colors={colors}
        />
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <SettingsRow
          icon="image-multiple-outline"
          label="100 Background Images"
          sub="Built-in, no internet needed"
          colors={colors}
        />
      </View>

      {/* ── danger ── */}
      <SectionLabel label="DATA" colors={colors} />
      <View style={[styles.section, { borderColor: colors.outline }]}>
        <TouchableOpacity
          style={styles.dangerRow}
          onPress={confirmResetStreak}>
          <View style={styles.dangerLeft}>
            <View style={[styles.iconWrap, { backgroundColor: 'rgba(211,47,47,0.12)' }]}>
              <Icon name="restart" size={20} color="#D32F2F" />
            </View>
            <View>
              <Text style={[styles.rowLabel, { color: '#D32F2F' }]}>Reset Streak</Text>
              <Text style={[styles.rowSub, { color: colors.onSurfaceVariant }]}>
                Start from day 0
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ── sub-components ── */

function SectionLabel({ label, colors }) {
  return (
    <Text
      style={[
        styles.sectionLabel,
        { color: colors.onSurfaceVariant },
      ]}>
      {label}
    </Text>
  );
}

function StatCard({ icon, iconColor, label, value, colors }) {
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.surface, borderColor: colors.outline },
      ]}>
      <Icon name={icon} size={24} color={iconColor} />
      <Text style={[styles.statValue, { color: colors.onSurface }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
    </View>
  );
}

function SettingsRow({ icon, label, sub, colors, children }) {
  return (
    <View style={styles.settingsRow}>
      <View style={styles.dangerLeft}>
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceVariant }]}>
          <Icon name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.rowTextWrap}>
          <Text style={[styles.rowLabel, { color: colors.onSurface }]}>{label}</Text>
          {sub ? (
            <Text style={[styles.rowSub, { color: colors.onSurfaceVariant }]}>
              {sub}
            </Text>
          ) : null}
        </View>
      </View>
      {children || null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 10,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'flex-start',
    gap: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  progressWrap: { gap: 6 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },

  section: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dangerLeft: {
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
});
