'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { Typography } from '../Typography/Typography';
import { EmptyStateProps } from './types';
import styles from './EmptyState.module.css';

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  lottie,
  action,
}) => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadLottie = async () => {
      try {
        const lottieModule = lottie
          ? await import(`@/shared/lotties/${lottie}.json`)
          : await import('@/shared/lotties/emptyLottie.json');
        if (!mounted) return;
        const payload = (lottieModule as unknown as { default?: unknown }).default ?? (lottieModule as unknown);
        setAnimationData(payload as object);
      } catch (error) {
        console.error('Failed to load Lottie animation:', error);
      }
    };
    loadLottie();
    return () => {
      mounted = false;
    };
  }, [lottie]);

  return (
    <div className={styles.container}>
      {animationData && (
        <div className={styles.lottieContainer}>
          <Lottie
            animationData={animationData}
            loop={false}
            autoplay
            className={styles.lottie}
          />
        </div>
      )}
      {title && (
        <Typography variant="h2" className={styles.title}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="bodyMMed" className={styles.description}>
          {description}
        </Typography>
      )}
      {action && (
        <div className={styles.actionContainer}>
          {action}
        </div>
      )}
    </div>
  );
};

