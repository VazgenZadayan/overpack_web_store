'use client';

import { LogoMini } from '@/shared/icons/LogoMini';
import styles from './Loading.module.css';
import { useTheme } from '@/shared/contexts/ThemeProvider';

export default function Loading() {
  const { resolvedTheme } = useTheme();
  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <LogoMini className={styles.logo} theme={resolvedTheme} />
      </div>
    </div>
  );
}

