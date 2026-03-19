/**
 * Day-of-year based index: index = dayOfYear % totalQuotes
 * With 1000 quotes, no quote repeats within the same calendar year (for non-leap: 365 < 1000).
 */

export function getYmd(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 86400000;
  return Math.floor(diff / oneDay);
}

export function deterministicQuoteIndex(dayOfYear, totalQuotes) {
  if (totalQuotes <= 0) {
    return 0;
  }
  return dayOfYear % totalQuotes;
}

export function yesterdayYmd() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getYmd(d);
}

export function parseDailySlot(raw) {
  if (!raw) {
    return null;
  }
  try {
    const o = JSON.parse(raw);
    if (o && typeof o.ymd === 'string' && typeof o.quoteIndex === 'number') {
      return o;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function buildDailySlot(ymd, quoteIndex) {
  return JSON.stringify({ ymd, quoteIndex });
}
