'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { lightThemeColors, darkThemeColors, ThemeColors } from '@/shared/constants/colors';

export type ThemeType = 'light' | 'dark' | 'system';

interface IThemeContextType {
  themeType: ThemeType;
  setThemeType: (theme: ThemeType) => void;
  colors: ThemeColors;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<IThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'system' 
}) => {
  const [themeType, setThemeType] = useState<ThemeType>(initialTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const resolvedTheme = themeType === 'system' ? systemTheme : themeType;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  const handleThemeChange = async (newTheme: ThemeType): Promise<void> => {
    try {
      await fetch('/api/theme/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme }),
      });
      
      setThemeType(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

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

