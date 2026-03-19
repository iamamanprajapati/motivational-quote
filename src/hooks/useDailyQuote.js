import { useApp } from '../context/AppContext';

/** Thin hook around app context for today’s quote + index. */
export function useDailyQuote() {
  const { dailyQuote, dailyQuoteIndex, imageForIndex } = useApp();
  return {
    dailyQuote,
    dailyQuoteIndex,
    backgroundImage: imageForIndex(dailyQuoteIndex),
  };
}
