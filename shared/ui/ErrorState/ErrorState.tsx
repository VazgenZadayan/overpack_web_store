'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { Typography } from '../Typography/Typography';
import { Button } from '../Button/Button';
import { ErrorStateProps } from './types';
import styles from './ErrorState.module.css';

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  lottie,
  onRetry,
  retryLabel,
}) => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadLottie = async () => {
      try {
        const lottieModule = lottie
          ? await import(`@/shared/lotties/${lottie}.json`)
          : await import('@/shared/lotties/technicalProblems.json');
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
            loop
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
      {onRetry && (
        <div className={styles.actionContainer}>
          <Button
            label={retryLabel || 'Try again'}
            variant="default"
            onClick={onRetry}
          />
        </div>
      )}
    </div>
  );
};

