'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CreditCard, Trash2 } from 'lucide-react';
import { Typography } from '@/shared/ui/Typography/Typography';
import { ICard } from '@/shared/types/card';
import styles from './CardCard.module.css';

interface CardCardProps {
  card: ICard;
  onSetMain: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export const CardCard: React.FC<CardCardProps> = ({
  card,
  onSetMain,
  onDelete,
}) => {
  const t = useTranslations('paymentCards');
  const isMain = card.isMain === 1;

  return (
    <div
      className={`${styles.card} ${isMain ? styles.main : ''}`}
      onClick={!isMain ? onSetMain : undefined}
    >
      <div className={styles.content}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIconWrapper}>
            <CreditCard size={20} className={styles.cardIcon} />
          </div>
          <Typography variant="bodyMSB" className={styles.cardText}>
            {card.title}
          </Typography>
          {isMain && (
            <span className={styles.mainBadge}>{t('mainBadge')}</span>
          )}
        </div>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className={styles.deleteButton}
          aria-label="Удалить карту"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
};

