'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { storage } from '@/utils/storage';
import { lightThemeColors, darkThemeColors, ThemeColors } from '@/shared/constants/colors';

const THEME_STORAGE_KEY = '@theme_preference';

export type ThemeType = 'light' | 'dark' | 'system';

interface IThemeContextType {
  themeType: ThemeType;
  setThemeType: (theme: ThemeType) => void;
  colors: ThemeColors;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<IThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Detect system theme
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Load saved theme from storage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedTheme = storage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        let theme: ThemeType;
        try {
          theme = JSON.parse(savedTheme) as ThemeType;
        } catch {
          theme = savedTheme as ThemeType;
        }

        if (theme === 'system' || theme === 'light' || theme === 'dark') {
          setThemeType(theme);
        } else {
          setThemeType('system');
          storage.setItem(THEME_STORAGE_KEY, JSON.stringify('system'));
        }
      } else {
        setThemeType('system');
        storage.setItem(THEME_STORAGE_KEY, JSON.stringify('system'));
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      setThemeType('system');
    }
  }, []);

  const handleThemeChange = (newTheme: ThemeType): void => {
    try {
      storage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
      setThemeType(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const resolvedTheme =
    themeType === 'system' ? systemTheme : themeType;

  const colors = resolvedTheme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <ThemeContext.Provider
      value={{
        themeType,
        setThemeType: handleThemeChange,
        colors,
        resolvedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): IThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

