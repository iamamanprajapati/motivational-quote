/** Material Design 3 – inspired token system */
export function getColors(isDark) {
  if (isDark) {
    return {
      /* backgrounds */
      background: '#09090F',
      surface: '#14131E',
      surfaceVariant: '#1E1D2C',
      surfaceElevated: '#23223A',

      /* primary – lavender indigo */
      primary: '#A09CFF',
      primaryContainer: '#2D2A6E',
      onPrimary: '#FFFFFF',
      onPrimaryContainer: '#E3E0FF',

      /* secondary – warm gold */
      secondary: '#FFD166',
      secondaryContainer: '#4A3600',
      onSecondary: '#1C1200',
      onSecondaryContainer: '#FFE08A',

      /* text */
      onBackground: '#ECE7FF',
      onSurface: '#ECE7FF',
      onSurfaceVariant: '#C9C3DC',

      /* outlines / dividers */
      outline: 'rgba(160,156,255,0.22)',
      outlineVariant: 'rgba(160,156,255,0.10)',
      divider: 'rgba(255,255,255,0.08)',

      /* states */
      error: '#FFB4AB',
      success: '#8BD5B0',
      scrim: 'rgba(0,0,0,0.62)',

      /* nav */
      tabBar: '#10101A',
      tabBarBorder: 'rgba(160,156,255,0.14)',
      statusBar: 'light-content',

      /* overlays – used on photo backgrounds */
      glassCard: 'rgba(20,19,30,0.88)',
      glassBorder: 'rgba(160,156,255,0.22)',
      gradientTop: 'rgba(9,9,15,0.08)',
      gradientBot: 'rgba(9,9,15,0.94)',

      /* backward-compat aliases */
      accent: '#FFD166',
      accentSoft: 'rgba(255,209,102,0.28)',
      text: '#ECE7FF',
      textMuted: '#C9C3DC',
      card: '#1E1D2C',
      border: 'rgba(160,156,255,0.22)',
      screenBg: '#09090F',
    };
  }
  return {
    /* backgrounds */
    background: '#F6F5FF',
    surface: '#FFFFFF',
    surfaceVariant: '#EAE7FF',
    surfaceElevated: '#F2F0FF',

    /* primary – deep indigo */
    primary: '#5756CE',
    primaryContainer: '#E5E3FF',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#1A186A',

    /* secondary – amber */
    secondary: '#B97400',
    secondaryContainer: '#FFE0A0',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#3C2500',

    /* text */
    onBackground: '#1A1830',
    onSurface: '#1A1830',
    onSurfaceVariant: '#47455C',

    /* outlines */
    outline: 'rgba(87,86,206,0.22)',
    outlineVariant: 'rgba(87,86,206,0.12)',
    divider: 'rgba(0,0,0,0.06)',

    /* states */
    error: '#B3261E',
    success: '#1E7555',
    scrim: 'rgba(0,0,0,0.36)',

    /* nav */
    tabBar: '#FFFFFF',
    tabBarBorder: 'rgba(87,86,206,0.14)',
    statusBar: 'dark-content',

    /* overlays */
    glassCard: 'rgba(255,255,255,0.95)',
    glassBorder: 'rgba(87,86,206,0.20)',
    gradientTop: 'rgba(255,255,255,0.08)',
    gradientBot: 'rgba(26,24,48,0.90)',

    /* backward-compat aliases */
    accent: '#B97400',
    accentSoft: 'rgba(185,116,0,0.16)',
    text: '#1A1830',
    textMuted: '#47455C',
    card: '#FFFFFF',
    border: 'rgba(87,86,206,0.22)',
    screenBg: '#F6F5FF',
  };
}
