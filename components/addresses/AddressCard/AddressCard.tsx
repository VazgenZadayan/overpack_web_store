'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';
import { Typography } from '@/shared/ui/Typography/Typography';
import { IAddress } from '@/shared/types/address';
import styles from './AddressCard.module.css';

interface AddressCardProps {
  address: IAddress;
  onSetMain: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onSetMain,
  onDelete,
}) => {
  const t = useTranslations('Address');
  const isMain = address.isMain === 1;

  const formatDetails = () => {
    const parts = [];
    if (address.entrance) parts.push(`${t('form.entrance')} ${address.entrance}`);
    if (address.apartment) parts.push(`${t('form.apartment')} ${address.apartment}`);
    if (address.floor) parts.push(`${t('form.floor')} ${address.floor}`);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  const details = formatDetails();

  return (
    <div
      className={`${styles.card} ${isMain ? styles.main : ''}`}
      onClick={!isMain ? onSetMain : undefined}
    >
      <div className={styles.content}>
        <div className={styles.addressHeader}>
          <Typography variant="bodyMSB" className={styles.addressText}>
            {address.address}
          </Typography>
          {isMain && (
            <span className={styles.mainBadge}>{t('mainAddress')}</span>
          )}
        </div>
        {details && (
          <Typography variant="bodySSB" className={styles.details}>
            {details}
          </Typography>
        )}
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className={styles.deleteButton}
          aria-label="Удалить адрес"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
};

