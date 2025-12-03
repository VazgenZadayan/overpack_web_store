'use client';

import { useEffect, useState, startTransition } from 'react';
import { useToastStore } from '@/stores/toast';
import { Typography } from '../Typography/Typography';
import styles from './Toast.module.css';

export function Toast() {
  const { isVisible, title, message, autoHide, hideToast } = useToastStore();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      startTransition(() => {
        setIsAnimating(true);
      });
      
      if (autoHide) {
        const timer = setTimeout(() => {
          startTransition(() => {
            setIsAnimating(false);
          });
          setTimeout(() => {
            hideToast();
          }, 300);
        }, 3000);

        return () => clearTimeout(timer);
      }
    } else {
      startTransition(() => {
        setIsAnimating(false);
      });
    }
  }, [isVisible, autoHide, hideToast]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${styles.wrapper} ${isAnimating ? styles.visible : ''}`}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Typography variant="bodyMBold" className={styles.title}>
            {title}
          </Typography>
          {message && (
            <Typography variant="bodyMMed" className={styles.message}>
              {message}
            </Typography>
          )}
        </div>
        <button
          onClick={() => {
            setIsAnimating(false);
            setTimeout(() => {
              hideToast();
            }, 300);
          }}
          className={styles.closeButton}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

