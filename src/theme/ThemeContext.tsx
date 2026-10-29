import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { colors } from './colors';
import { typography } from './typography';

export { colors, typography };

export type ThemeMode = 'dark' | 'light' | 'classic' | 'cyberpunk' | 'zen';

export interface StrandColor {
  stroke: string;
  glow: string;
  accent: string;
}

export interface AppTheme {
  mode: ThemeMode;
  name: string;
  isDark: boolean;
  background: string;
  bgGradient: [string, string, string];
  surface: string;
  cardBg: string;
  cardBorder: string;
  cardGlow: string;
  divider: string;
  boardBg: string;
  boardBorder: string;
  boardShadow: string;
  gridNodeDot: string;
  gridLine: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSecondary: string;
  accentGlow: string;
  neonMagenta: string;
  neonMagentaGlow: string;
  goldStar: string;
  badgeBg: string;
  badgeText: string;
  tabBarBg: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  hudBg: string;
  hudBorder: string;
  hudShadow: string;
  heartActive: string;
  heartInactive: string;
  modalBg: string;
  modalCardBg: string;
  modalBorder: string;
  buttonPrimary: string;
  buttonPrimaryGradient: [string, string];
  buttonPrimaryText: string;
  buttonPrimaryShadow: string;
  buttonSecondaryBg: string;
  buttonSecondaryBorder: string;
  blockedStroke: string;
  arrowColor: string;
  strands: StrandColor[];
  // UI Panel & Button Design System (Section 3 specs)
  panelRadius: number;
  panelBorderWidth: number;
  primaryButtonHeight: number;
  primaryButtonRadius: number;
  secondaryButtonRadius: number;
}

export const ARROWMAZE_PALETTE = {
  bgDark: colors.bgTop,
  bgMid: '#07132F',
  bgLight: colors.bgBottom,
  deepNavy: colors.bgTop,
  midnightBlue: colors.bgBottom,
  panelDark: colors.panel,
  panelBorder: colors.panelBorder,
  electricCyan: colors.accent,
  neonCyan: colors.accent,
  electricBlue: colors.primaryA,
  brightBlue: colors.primaryA,
  royalBlue: colors.primaryB,
  neonMagenta: '#FF2A85',
  neonPink: '#E024C3',
  goldStar: colors.star,
  warmYellow: '#FFC107',
  dangerRed: colors.danger,
  heartRed: colors.danger,
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textMuted: '#4E688F',
  white: '#FFFFFF',
};

export const DARK_THEME: AppTheme = {
  mode: 'dark',
  name: 'Neon Cyberpunk Dark',
  isDark: true,
  background: colors.bgTop,
  bgGradient: [colors.bgTop, '#07132F', colors.bgBottom],
  surface: colors.panel,
  cardBg: colors.panel,
  cardBorder: colors.panelBorder,
  cardGlow: 'rgba(34, 211, 255, 0.22)',
  divider: 'rgba(46, 123, 255, 0.25)',
  boardBg: '#050E24',
  boardBorder: colors.panelBorder,
  boardShadow: 'rgba(0, 0, 0, 0.85)',
  gridNodeDot: 'rgba(34, 211, 255, 0.25)',
  gridLine: colors.gridLine,
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textMuted: '#5C749B',
  accent: colors.accent,
  accentSecondary: colors.primaryA,
  accentGlow: colors.arrowGlow,
  neonMagenta: '#FF2A85',
  neonMagentaGlow: 'rgba(255, 42, 133, 0.45)',
  goldStar: colors.star,
  badgeBg: 'rgba(34, 211, 255, 0.16)',
  badgeText: colors.accent,
  tabBarBg: colors.bgTop,
  tabBarBorder: 'rgba(46, 123, 255, 0.28)',
  tabBarActive: colors.accent,
  tabBarInactive: '#4E688F',
  hudBg: 'rgba(11, 26, 58, 0.92)',
  hudBorder: colors.panelBorder,
  hudShadow: 'rgba(0, 0, 0, 0.55)',
  heartActive: colors.danger,
  heartInactive: 'rgba(78, 104, 143, 0.4)',
  modalBg: 'rgba(5, 11, 31, 0.88)',
  modalCardBg: colors.panel,
  modalBorder: colors.panelBorder,
  buttonPrimary: colors.primaryA,
  buttonPrimaryGradient: [colors.primaryA, colors.primaryB],
  buttonPrimaryText: '#FFFFFF',
  buttonPrimaryShadow: 'rgba(46, 155, 255, 0.5)',
  buttonSecondaryBg: 'transparent',
  buttonSecondaryBorder: colors.buttonSecondaryBorder,
  blockedStroke: colors.danger,
  arrowColor: colors.arrow,
  strands: [
    { stroke: colors.arrow, glow: colors.arrowGlow, accent: colors.arrow },
    { stroke: '#FF2A85', glow: 'rgba(255, 42, 133, 0.5)', accent: '#FF2A85' },
    { stroke: '#22D3FF', glow: 'rgba(34, 211, 255, 0.5)', accent: '#22D3FF' },
    { stroke: '#A855F7', glow: 'rgba(168, 85, 247, 0.5)', accent: '#A855F7' },
  ],
  panelRadius: 18,
  panelBorderWidth: 1,
  primaryButtonHeight: 56,
  primaryButtonRadius: 28,
  secondaryButtonRadius: 28,
};

export const CLASSIC_THEME: AppTheme = {
  mode: 'classic',
  name: 'Classic Blueprint',
  isDark: true,
  background: '#0B193C',
  bgGradient: ['#0B193C', '#102A5C', '#183B7A'],
  surface: '#102A5C',
  cardBg: 'rgba(16, 42, 92, 0.92)',
  cardBorder: 'rgba(56, 189, 248, 0.35)',
  cardGlow: 'rgba(56, 189, 248, 0.2)',
  divider: 'rgba(255, 255, 255, 0.1)',
  boardBg: '#0B193C',
  boardBorder: 'rgba(56, 189, 248, 0.25)',
  boardShadow: 'rgba(0, 0, 0, 0.7)',
  gridNodeDot: 'rgba(56, 189, 248, 0.3)',
  gridLine: 'rgba(56, 189, 248, 0.1)',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  accent: '#38BDF8',
  accentSecondary: '#2563EB',
  accentGlow: 'rgba(56, 189, 248, 0.35)',
  neonMagenta: '#EC4899',
  neonMagentaGlow: 'rgba(236, 72, 153, 0.4)',
  goldStar: '#FBBF24',
  badgeBg: 'rgba(56, 189, 248, 0.15)',
  badgeText: '#38BDF8',
  tabBarBg: '#0B193C',
  tabBarBorder: 'rgba(56, 189, 248, 0.2)',
  tabBarActive: '#38BDF8',
  tabBarInactive: '#64748B',
  hudBg: 'rgba(16, 42, 92, 0.95)',
  hudBorder: 'rgba(56, 189, 248, 0.3)',
  hudShadow: 'rgba(0, 0, 0, 0.4)',
  heartActive: '#EF4444',
  heartInactive: 'rgba(100, 116, 139, 0.4)',
  modalBg: 'rgba(11, 25, 60, 0.85)',
  modalCardBg: '#133066',
  modalBorder: '#38BDF8',
  buttonPrimary: '#2563EB',
  buttonPrimaryGradient: ['#38BDF8', '#2563EB'],
  buttonPrimaryText: '#FFFFFF',
  buttonPrimaryShadow: 'rgba(37, 99, 235, 0.4)',
  buttonSecondaryBg: '#0D214A',
  buttonSecondaryBorder: 'rgba(56, 189, 248, 0.3)',
  blockedStroke: '#EF4444',
  arrowColor: '#38BDF8',
  strands: [
    { stroke: '#38BDF8', glow: 'rgba(56, 189, 248, 0.4)', accent: '#38BDF8' },
    { stroke: '#EC4899', glow: 'rgba(236, 72, 153, 0.4)', accent: '#EC4899' },
  ],
  panelRadius: 18,
  panelBorderWidth: 1,
  primaryButtonHeight: 56,
  primaryButtonRadius: 28,
  secondaryButtonRadius: 28,
};

export const LIGHT_THEME: AppTheme = {
  mode: 'light',
  name: 'Minimal Light',
  isDark: false,
  background: '#F1F5F9',
  bgGradient: ['#F8FAFC', '#E2E8F0', '#CBD5E1'],
  surface: '#FFFFFF',
  cardBg: 'rgba(255, 255, 255, 0.95)',
  cardBorder: 'rgba(0, 123, 255, 0.2)',
  cardGlow: 'rgba(0, 123, 255, 0.1)',
  divider: 'rgba(0, 0, 0, 0.08)',
  boardBg: '#FFFFFF',
  boardBorder: '#94A3B8',
  boardShadow: 'rgba(15, 23, 42, 0.12)',
  gridNodeDot: 'rgba(100, 116, 139, 0.3)',
  gridLine: 'rgba(203, 213, 225, 0.4)',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  accent: '#0066FF',
  accentSecondary: '#00F0FF',
  accentGlow: 'rgba(0, 102, 255, 0.25)',
  neonMagenta: '#D946EF',
  neonMagentaGlow: 'rgba(217, 70, 239, 0.3)',
  goldStar: '#F59E0B',
  badgeBg: 'rgba(0, 102, 255, 0.1)',
  badgeText: '#0066FF',
  tabBarBg: '#FFFFFF',
  tabBarBorder: 'rgba(0, 0, 0, 0.08)',
  tabBarActive: '#0066FF',
  tabBarInactive: '#94A3B8',
  hudBg: 'rgba(255, 255, 255, 0.95)',
  hudBorder: 'rgba(0, 0, 0, 0.1)',
  hudShadow: 'rgba(15, 23, 42, 0.08)',
  heartActive: '#DC2626',
  heartInactive: 'rgba(203, 213, 225, 0.6)',
  modalBg: 'rgba(15, 23, 42, 0.6)',
  modalCardBg: '#FFFFFF',
  modalBorder: '#0066FF',
  buttonPrimary: '#0066FF',
  buttonPrimaryGradient: ['#007BFF', '#0052CC'],
  buttonPrimaryText: '#FFFFFF',
  buttonPrimaryShadow: 'rgba(0, 102, 255, 0.3)',
  buttonSecondaryBg: '#F8FAFC',
  buttonSecondaryBorder: 'rgba(0, 102, 255, 0.25)',
  blockedStroke: '#DC2626',
  arrowColor: '#0066FF',
  strands: [
    { stroke: '#0066FF', glow: 'rgba(0, 102, 255, 0.3)', accent: '#0066FF' },
    { stroke: '#D946EF', glow: 'rgba(217, 70, 239, 0.3)', accent: '#D946EF' },
  ],
  panelRadius: 18,
  panelBorderWidth: 1,
  primaryButtonHeight: 56,
  primaryButtonRadius: 28,
  secondaryButtonRadius: 28,
};

// Backward-compatibility aliases
export const CYBERPUNK_THEME = DARK_THEME;
export const ZEN_THEME = LIGHT_THEME;

export interface SettingsState {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  language: string;
}

interface ThemeContextType {
  theme: AppTheme;
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  settings: SettingsState;
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setLanguage: (lang: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [settings, setSettings] = useState<SettingsState>({
    soundEnabled: true,
    musicEnabled: true,
    vibrationEnabled: true,
    language: 'English',
  });

  const theme = useMemo<AppTheme>(() => {
    if (mode === 'light' || mode === 'zen') return LIGHT_THEME;
    if (mode === 'classic') return CLASSIC_THEME;
    return DARK_THEME;
  }, [mode]);

  const isDarkMode = theme.isDark;

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'dark' || prev === 'cyberpunk' ? 'light' : 'dark'));
  }, []);

  const setThemeMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSettings((s) => ({ ...s, soundEnabled: enabled }));
  }, []);

  const setMusicEnabled = useCallback((enabled: boolean) => {
    setSettings((s) => ({ ...s, musicEnabled: enabled }));
  }, []);

  const setVibrationEnabled = useCallback((enabled: boolean) => {
    setSettings((s) => ({ ...s, vibrationEnabled: enabled }));
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setSettings((s) => ({ ...s, language: lang }));
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        isDark: isDarkMode,
        toggleTheme,
        setThemeMode,
        settings,
        setSoundEnabled,
        setMusicEnabled,
        setVibrationEnabled,
        setLanguage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
