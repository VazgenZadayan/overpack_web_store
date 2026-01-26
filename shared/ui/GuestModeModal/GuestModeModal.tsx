'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Dialog } from '../Dialog/Dialog';
import { Button } from '../Button/Button';
import { Typography } from '../Typography/Typography';
import { GuestModeIcon } from '@/shared/icons/GuestMode';
import styles from './GuestModeModal.module.css';

interface GuestModeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLogin: () => void;
  onContinueAsGuest: () => void;
}

export const GuestModeModal: React.FC<GuestModeModalProps> = ({
  isVisible,
  onClose,
  onLogin,
  onContinueAsGuest,
}) => {
  const t = useTranslations('GuestMode');

  return (
    <Dialog isOpen={isVisible} onClose={onClose} className={styles.modal}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <GuestModeIcon />
        </div>

        <div className={styles.textsContainer}>
          <Typography variant="h2" className={styles.title}>
            {t('title')}
          </Typography>
          <Typography variant="bodyLBold" className={styles.subtitle}>
            {t('subtitle')}
          </Typography>
          <Typography variant="bodyMMed" className={styles.description}>
            {t('description')}
          </Typography>
        </div>

        <div className={styles.buttonContainer}>
          <Button
            label={t('loginButton')}
            variant="danger"
            onClick={onLogin}
          />
          <Button
            label={t('continueAsGuestButton')}
            variant="secondary"
            onClick={onContinueAsGuest}
          />
        </div>
      </div>
    </Dialog>
  );
};



