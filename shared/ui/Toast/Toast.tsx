'use client';

import { useEffect, useState, startTransition } from 'react';
import { XCircle } from 'lucide-react';
import { useToastStore } from '@/stores/toast';
import { Typography } from '../Typography/Typography';
import styles from './Toast.module.css';

export function Toast() {
  const { isVisible, message, autoHide, hideToast, icon, onClose } = useToastStore();
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
            if (onClose) {
              onClose();
            }
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
  }, [isVisible, autoHide, hideToast, onClose]);

  const handleClick = () => {
    if (onClose) {
      onClose();
    }
    setIsAnimating(false);
    setTimeout(() => {
      hideToast();
    }, 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${styles.wrapper} ${isAnimating ? styles.visible : ''}`}>
      <div className={styles.container} onClick={handleClick}>
        {icon || <XCircle size={18} className={styles.icon} />}
        <Typography variant="bodyMBold" className={styles.message}>
          {message}
        </Typography>
      </div>
    </div>
  );
}

