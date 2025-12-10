'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Clock, ChevronRight } from 'lucide-react';
import { Typography } from '@/shared/ui/Typography/Typography';
import { createSlugSegment } from '@/utils/slug';
import { IPartner } from '@/shared/types/partner';
import styles from './PartnerCard.module.css';

interface PartnerCardProps {
  partner: IPartner;
  locale: string;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner, locale }) => {
  const router = useRouter();

  const handleClick = () => {
    const slug = createSlugSegment(partner.id, partner.name);
    router.push(`/${locale}/profile/partners/${slug}`);
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
          <div className={styles.timeWrapper}>
            <Clock size={20} className={styles.timeIcon} />
            <Typography variant="bodyLMed" className={styles.workingHours}>
              {partner.workingHours}
            </Typography>
          </div>
        </div>
      </div>
      <ChevronRight size={20} className={styles.chevron} />
    </div>
  );
};

