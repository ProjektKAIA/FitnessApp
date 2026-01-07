// /workspaces/claude-workspace/fitnessapp/src/contexts/ThemeContext.tsx

import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { useColorScheme, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useUserStore } from '@/stores/userStore';
import { COLORS } from '@/constants/theme';

const THEME_STORAGE_KEY = 'app-theme-preference';

type ThemeSetting = 'light' | 'dark' | 'system';
type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  icon: string;
  iconSecondary: string;
  primary: string;
  success: string;
  error: string;
  warning: string;
  accent: string;
  purple: string;
  overlay: string;
  card: string;
  cardBorder: string;
  tabBar: string;
  tabBarBorder: string;
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  buttonPrimaryBackground: string;
  buttonPrimaryText: string;
  buttonSecondaryBackground: string;
  buttonSecondaryText: string;
  buttonOutlineBackground: string;
  buttonOutlineBorder: string;
  buttonOutlineText: string;
  statusBarStyle: 'light-content' | 'dark-content';
}

interface ThemeContextValue {
  isDark: boolean;
  mode: ThemeMode;
  themeSetting: ThemeSetting;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeSetting) => void;
}

const lightColors: ThemeColors = {
  background: COLORS.gray[100],
  surface: COLORS.white,
  surfaceElevated: COLORS.white,
  text: COLORS.gray[900],
  textSecondary: COLORS.gray[600],
  textTertiary: COLORS.gray[500],
  border: COLORS.gray[200],
  borderLight: COLORS.gray[100],
  icon: COLORS.gray[700],
  iconSecondary: COLORS.gray[500],
  primary: COLORS.primary,
  success: COLORS.success,
  error: COLORS.error,
  warning: COLORS.warning,
  accent: COLORS.accent,
  purple: COLORS.purple,
  overlay: 'rgba(0,0,0,0.5)',
  card: COLORS.white,
  cardBorder: COLORS.gray[200],
  tabBar: COLORS.white,
  tabBarBorder: COLORS.gray[200],
  inputBackground: COLORS.gray[50],
  inputBorder: COLORS.gray[300],
  inputText: COLORS.gray[900],
  inputPlaceholder: COLORS.gray[400],
  buttonPrimaryBackground: COLORS.primary,
  buttonPrimaryText: COLORS.white,
  buttonSecondaryBackground: COLORS.gray[100],
  buttonSecondaryText: COLORS.gray[700],
  buttonOutlineBackground: 'transparent',
  buttonOutlineBorder: COLORS.gray[300],
  buttonOutlineText: COLORS.gray[700],
  statusBarStyle: 'dark-content',
};

const darkColors: ThemeColors = {
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceElevated: '#242424',
  text: '#FFFFFF',
  textSecondary: COLORS.gray[400],
  textTertiary: COLORS.gray[500],
  border: '#2E2E2E',
  borderLight: '#1F1F1F',
  icon: COLORS.gray[300],
  iconSecondary: COLORS.gray[500],
  primary: '#3B82F6',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  accent: '#FF6B35',
  purple: '#A855F7',
  overlay: 'rgba(0,0,0,0.7)',
  card: '#1A1A1A',
  cardBorder: '#2E2E2E',
  tabBar: '#1A1A1A',
  tabBarBorder: '#2E2E2E',
  inputBackground: '#1A1A1A',
  inputBorder: '#3E3E3E',
  inputText: '#FFFFFF',
  inputPlaceholder: COLORS.gray[500],
  buttonPrimaryBackground: '#3B82F6',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondaryBackground: '#2E2E2E',
  buttonSecondaryText: COLORS.gray[300],
  buttonOutlineBackground: 'transparent',
  buttonOutlineBorder: '#3E3E3E',
  buttonOutlineText: COLORS.gray[300],
  statusBarStyle: 'light-content',
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme();
  const user = useUserStore((state) => state.user);
  const updateSettings = useUserStore((state) => state.updateSettings);

  // Lokaler State für Theme-Einstellung (als Fallback wenn kein User)
  const [localThemeSetting, setLocalThemeSetting] = useState<ThemeSetting>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  // Theme-Einstellung aus User oder lokalem State
  const themeSetting: ThemeSetting = user?.settings?.theme ?? localThemeSetting;

  // Lade gespeicherte Theme-Einstellung beim Start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
          setLocalThemeSetting(stored as ThemeSetting);
        }
      } catch (error) {
        console.error('[ThemeContext] Error loading theme:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    loadTheme();
  }, []);

  // Berechne den aufgelösten Modus
  const resolvedMode: ThemeMode = useMemo(() => {
    if (themeSetting === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeSetting;
  }, [themeSetting, systemColorScheme]);

  const isDark = resolvedMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const setTheme = async (theme: ThemeSetting) => {
    // Speichere lokal
    setLocalThemeSetting(theme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('[ThemeContext] Error saving theme:', error);
    }

    // Update auch im UserStore wenn User existiert
    if (user) {
      updateSettings({ theme });
    }
  };

  const toggleTheme = () => {
    const newTheme: ThemeSetting = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const value = useMemo(
    () => ({
      isDark,
      mode: resolvedMode,
      themeSetting,
      colors,
      toggleTheme,
      setTheme,
    }),
    [isDark, resolvedMode, themeSetting, colors]
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.background}
        translucent={Platform.OS === 'android'}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export type { ThemeColors, ThemeContextValue };
