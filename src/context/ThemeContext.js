import React, { createContext, useContext, useState, useMemo } from 'react';
import * as Haptics from 'expo-haptics';

export const LIGHT_THEME = {
  isDark: false,
  background: '#F8FAFC',        // Soft porcelain canvas
  backgroundLight: '#FFFFFF',
  card: '#FFFFFF',              // Crisp clean card
  cardElevated: '#F8FAFC',
  cardBorder: 'rgba(15, 23, 42, 0.07)',
  cardShadow: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  dockBg: 'rgba(255, 255, 255, 0.94)',
  dockBorder: 'rgba(15, 23, 42, 0.08)',

  // Brand Accents
  primary: '#4F46E5',           // Royal Indigo
  primaryLight: 'rgba(79, 70, 229, 0.10)',
  primaryGlow: 'rgba(79, 70, 229, 0.18)',
  secondary: '#0284C7',         // Ocean Sky
  secondaryLight: 'rgba(2, 132, 199, 0.10)',
  accent: '#0D9488',            // Deep Teal
  accentLight: 'rgba(13, 148, 136, 0.10)',

  // Friendly Status Colors
  success: '#059669',           // Lush Mint
  successBg: 'rgba(5, 150, 105, 0.10)',
  warning: '#D97706',           // Warm Honey Amber
  warningBg: 'rgba(217, 119, 6, 0.10)',
  danger: '#E11D48',            // Soft Watermelon Coral
  dangerBg: 'rgba(225, 29, 72, 0.10)',
  info: '#6366F1',
  infoBg: 'rgba(99, 102, 241, 0.10)',

  // Typography
  textPrimary: '#0F172A',       // Rich charcoal slate
  textSecondary: '#475569',     // Balanced medium slate
  textMuted: '#94A3B8',         // Subtle ash slate
  textHighlight: '#4F46E5',

  // Utility
  divider: 'rgba(15, 23, 42, 0.06)',
  pillBg: 'rgba(15, 23, 42, 0.05)',
  trackBg: '#E2E8F0',
  statusBar: 'dark',
};

export const DARK_THEME = {
  isDark: true,
  background: '#0B0F19',        // Warm, soothing deep midnight
  backgroundLight: '#111827',
  card: '#161F30',              // Balanced slate glass card
  cardElevated: '#1D283E',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  cardShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 5,
  },
  dockBg: 'rgba(17, 24, 39, 0.94)',
  dockBorder: 'rgba(255, 255, 255, 0.10)',

  // Brand Accents
  primary: '#6366F1',           // Radiant Iris Violet
  primaryLight: 'rgba(99, 102, 241, 0.18)',
  primaryGlow: 'rgba(99, 102, 241, 0.30)',
  secondary: '#38BDF8',         // Soft Sky
  secondaryLight: 'rgba(56, 189, 248, 0.18)',
  accent: '#2DD4BF',            // Fresh Mint Teal
  accentLight: 'rgba(45, 212, 191, 0.18)',

  // Friendly Status Colors
  success: '#34D399',           // Radiant Mint
  successBg: 'rgba(52, 211, 153, 0.16)',
  warning: '#FBBF24',           // Warm Golden Sun
  warningBg: 'rgba(251, 191, 36, 0.16)',
  danger: '#FB7185',            // Soft Watermelon
  dangerBg: 'rgba(251, 113, 133, 0.16)',
  info: '#818CF8',
  infoBg: 'rgba(129, 140, 248, 0.16)',

  // Typography
  textPrimary: '#F8FAFC',       // Crisp pearl white
  textSecondary: '#94A3B8',     // Soothing slate
  textMuted: '#64748B',         // Subdued slate
  textHighlight: '#818CF8',

  // Utility
  divider: 'rgba(255, 255, 255, 0.08)',
  pillBg: 'rgba(255, 255, 255, 0.07)',
  trackBg: 'rgba(255, 255, 255, 0.12)',
  statusBar: 'light',
};

const ThemeContext = createContext({
  theme: DARK_THEME,
  isDark: true,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    setIsDark((prev) => !prev);
  };

  const theme = useMemo(() => (isDark ? DARK_THEME : LIGHT_THEME), [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

