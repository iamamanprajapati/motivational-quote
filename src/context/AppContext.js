import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { KEYS } from '../constants/storageKeys';
import { getColors } from '../theme/colors';
import {
  buildDailySlot,
  deterministicQuoteIndex,
  getDayOfYear,
  getYmd,
  parseDailySlot,
  yesterdayYmd,
} from '../utils/quoteUtils';
import { BACKGROUND_IMAGES } from '../assets/imageMap';

const QUOTES_DATA = require('../../assets/quotes.json');
const ALL_QUOTES = QUOTES_DATA.quotes || [];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [streak, setStreak] = useState(0);
  const [seenQuoteIds, setSeenQuoteIds] = useState([]);
  const [dailyQuoteIndex, setDailyQuoteIndex] = useState(0);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [customQuotes, setCustomQuotes] = useState([]);

  const colors = useMemo(() => getColors(isDark), [isDark]);

  const hydrate = useCallback(async () => {
    try {
      const [
        ob,
        favRaw,
        themeRaw,
        streakRaw,
        lastOpen,
        seenRaw,
        slotRaw,
        remRaw,
        customRaw,
      ] = await Promise.all([
        AsyncStorage.getItem(KEYS.ONBOARDING_DONE),
        AsyncStorage.getItem(KEYS.FAVORITES),
        AsyncStorage.getItem(KEYS.THEME),
        AsyncStorage.getItem(KEYS.STREAK),
        AsyncStorage.getItem(KEYS.LAST_OPEN_YMD),
        AsyncStorage.getItem(KEYS.SEEN_QUOTE_IDS),
        AsyncStorage.getItem(KEYS.DAILY_SLOT),
        AsyncStorage.getItem(KEYS.REMINDER_ENABLED),
        AsyncStorage.getItem(KEYS.CUSTOM_QUOTES),
      ]);

      setOnboardingDone(ob === '1');
      setIsDark(true); // dark theme only

      try {
        setFavorites(favRaw ? JSON.parse(favRaw) : []);
      } catch {
        setFavorites([]);
      }
      try {
        setSeenQuoteIds(seenRaw ? JSON.parse(seenRaw) : []);
      } catch {
        setSeenQuoteIds([]);
      }
      try {
        setCustomQuotes(customRaw ? JSON.parse(customRaw) : []);
      } catch {
        setCustomQuotes([]);
      }

      const today = getYmd();
      let nextStreak = parseInt(streakRaw || '0', 10) || 0;
      if (lastOpen !== today) {
        if (lastOpen === yesterdayYmd()) {
          nextStreak = nextStreak + 1;
        } else if (lastOpen) {
          nextStreak = 1;
        } else {
          nextStreak = 1;
        }
        try {
          await AsyncStorage.multiSet([
            [KEYS.LAST_OPEN_YMD, today],
            [KEYS.STREAK, String(nextStreak)],
          ]);
        } catch (e) {
          console.warn('[DailyMotivation] streak save failed', e);
        }
      }
      setStreak(nextStreak);

      const slot = parseDailySlot(slotRaw);
      let idx = 0;
      if (
        slot &&
        slot.ymd === today &&
        slot.quoteIndex >= 0 &&
        slot.quoteIndex < ALL_QUOTES.length
      ) {
        idx = slot.quoteIndex;
      } else if (ALL_QUOTES.length > 0) {
        const doy = getDayOfYear(new Date());
        idx = deterministicQuoteIndex(doy, ALL_QUOTES.length);
        try {
          await AsyncStorage.setItem(KEYS.DAILY_SLOT, buildDailySlot(today, idx));
        } catch (e) {
          console.warn('[DailyMotivation] daily slot save failed', e);
        }
      }
      setDailyQuoteIndex(idx);

      setReminderEnabled(remRaw === '1');
    } catch (e) {
      console.error('[DailyMotivation] hydrate failed — check AsyncStorage / native setup', e);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', s => {
      if (s === 'active') {
        hydrate();
      }
    });
    return () => sub.remove();
  }, [hydrate]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    let alive = true;
    (async () => {
      try {
        const n = await import('../utils/notificationService');
        if (!alive) {
          return;
        }
        if (reminderEnabled) {
          const ok = await n.requestNotificationPermission();
          if (ok && alive) {
            await n.scheduleDailyReminder();
          }
        } else {
          await n.cancelDailyReminder();
        }
      } catch (e) {
        console.warn('[DailyMotivation] reminder init failed', e);
      }
    })();
    return () => {
      alive = false;
    };
  }, [ready, reminderEnabled]);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, '1');
    setOnboardingDone(true);
  }, []);

  const toggleTheme = useCallback(async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem(KEYS.THEME, next ? 'dark' : 'light');
  }, [isDark]);

  const setTheme = useCallback(async (theme) => {
    const dark = theme === 'dark';
    setIsDark(dark);
    await AsyncStorage.setItem(KEYS.THEME, dark ? 'dark' : 'light');
  }, []);

  const toggleFavorite = useCallback(quoteId => {
    setFavorites(prev => {
      const has = prev.includes(quoteId);
      const next = has ? prev.filter(id => id !== quoteId) : [...prev, quoteId];
      AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    quoteId => favorites.includes(quoteId),
    [favorites],
  );

  const registerQuoteViewed = useCallback(quoteId => {
    setSeenQuoteIds(prev => {
      if (prev.includes(quoteId)) {
        return prev;
      }
      const next = [...prev, quoteId];
      AsyncStorage.setItem(KEYS.SEEN_QUOTE_IDS, JSON.stringify(next)).catch(
        () => {},
      );
      return next;
    });
  }, []);

  const setReminder = useCallback(async enabled => {
    setReminderEnabled(enabled);
    try {
      await AsyncStorage.setItem(KEYS.REMINDER_ENABLED, enabled ? '1' : '0');
    } catch (e) {
      console.warn('[DailyMotivation] reminder preference save failed', e);
    }
    try {
      const n = await import('../utils/notificationService');
      if (enabled) {
        const ok = await n.requestNotificationPermission();
        if (ok) {
          await n.scheduleDailyReminder();
        }
      } else {
        await n.cancelDailyReminder();
      }
    } catch (e) {
      console.warn('[DailyMotivation] setReminder native failed', e);
    }
  }, []);

  const addCustomQuote = useCallback(({ text, author, category }) => {
    const newQuote = {
      id: `cq_${Date.now()}`,
      text: text.trim(),
      author: (author || '').trim(),
      category: (category || 'Personal').trim(),
      createdAt: new Date().toISOString(),
    };
    setCustomQuotes(prev => {
      const next = [newQuote, ...prev];
      AsyncStorage.setItem(KEYS.CUSTOM_QUOTES, JSON.stringify(next)).catch(() => {});
      return next;
    });
    return newQuote;
  }, []);

  const updateCustomQuote = useCallback((id, { text, author, category }) => {
    setCustomQuotes(prev => {
      const next = prev.map(q =>
        q.id === id
          ? {
              ...q,
              text: text.trim(),
              author: (author || '').trim(),
              category: (category || q.category).trim(),
              updatedAt: new Date().toISOString(),
            }
          : q,
      );
      AsyncStorage.setItem(KEYS.CUSTOM_QUOTES, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const deleteCustomQuote = useCallback(id => {
    setCustomQuotes(prev => {
      const next = prev.filter(q => q.id !== id);
      AsyncStorage.setItem(KEYS.CUSTOM_QUOTES, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const dailyQuote = useMemo(() => {
    const q = ALL_QUOTES[dailyQuoteIndex] || ALL_QUOTES[0];
    return (
      q || {
        id: 0,
        text: 'Add quotes to assets/quotes.json',
        author: '',
        category: 'General',
      }
    );
  }, [dailyQuoteIndex]);

  const imageForIndex = useCallback(index => {
    const len = BACKGROUND_IMAGES.length;
    if (!len) {
      return undefined;
    }
    const i = Math.abs(index) % len;
    return BACKGROUND_IMAGES[i];
  }, []);

  const categories = useMemo(() => {
    const s = new Set();
    ALL_QUOTES.forEach(q => s.add(q.category || 'General'));
    return Array.from(s).sort();
  }, []);

  const value = useMemo(
    () => ({
      ready,
      onboardingDone,
      completeOnboarding,
      allQuotes: ALL_QUOTES,
      dailyQuoteIndex,
      dailyQuote,
      favorites,
      toggleFavorite,
      isFavorite,
      streak,
      seenQuoteIds,
      registerQuoteViewed,
      colors,
      isDark,
      toggleTheme,
      setTheme,
      reminder: reminderEnabled,
      reminderEnabled,
      setReminder,
      imageForIndex,
      categories,
      customQuotes,
      addCustomQuote,
      updateCustomQuote,
      deleteCustomQuote,
    }),
    [
      ready,
      onboardingDone,
      completeOnboarding,
      dailyQuoteIndex,
      dailyQuote,
      favorites,
      toggleFavorite,
      isFavorite,
      streak,
      seenQuoteIds,
      registerQuoteViewed,
      colors,
      isDark,
      toggleTheme,
      setTheme,
      reminderEnabled,
      setReminder,
      imageForIndex,
      categories,
      customQuotes,
      addCustomQuote,
      updateCustomQuote,
      deleteCustomQuote,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
