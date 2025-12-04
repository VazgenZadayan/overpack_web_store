'use client';

import React from 'react';
import { useTheme } from '@/shared/contexts/ThemeProvider';
import styles from './ThemeSwitcher.module.css';
import { MoonIcon, Sun } from 'lucide-react';
import clsx from 'clsx';

export const ThemeSwitcher: React.FC = () => {
  const { setThemeType, resolvedTheme } = useTheme();

  const handleToggle = () => {
    if (resolvedTheme === 'dark') {
      setThemeType('light');
    } else {
      setThemeType('dark');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={styles.button}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <div className={styles.iconContainer}>
        <Sun size={20} className={clsx(styles.icon, styles.sunIcon)} />
        <MoonIcon size={20} className={clsx(styles.icon, styles.moonIcon)} />
      </div>
    </button>
  );
};

