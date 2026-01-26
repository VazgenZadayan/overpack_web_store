'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Clock, ChevronRight } from 'lucide-react';
import { Typography } from '@/shared/ui/Typography/Typography';
import { createSlugSegment } from '@/utils/slug';
import { IPartner } from '@/shared/types/partner';
import { isPartnerOpen } from '../utils';
import styles from './PartnerCard.module.css';

interface PartnerCardProps {
  partner: IPartner;
  locale: string;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner, locale }) => {
  const router = useRouter();
  const t = useTranslations('Partners');
  const status = useMemo(
    () => isPartnerOpen(partner.workingHours),
    [partner.workingHours],
  );

  const handleClick = () => {
    const slug = createSlugSegment(partner.id, partner.name);
    router.push(`/${locale}/partners/${slug}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.leftSection}>
        <div className={styles.imageWrapper}>
          <Image
            src={partner.image}
            alt={partner.name}
            width={100}
            height={100}
            className={styles.image}
            unoptimized
          />
        </div>
        <div className={styles.info}>
          <Typography variant="bodyLBold" className={styles.name}>
            {partner.name}
          </Typography>
          {status !== null && (
            <div
              className={`${styles.statusBadge} ${
                status ? styles.statusOpen : styles.statusClosed
              }`}
            >
              <Clock size={16} className={styles.statusIcon} />
              <Typography variant="bodySMed" className={styles.statusText}>
                {status ? t('open') : t('closed')}
              </Typography>
            </div>
          )}
        </div>
      </div>
      <ChevronRight size={20} className={styles.chevron} />
    </div>
  );
};

