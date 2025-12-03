'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Dialog } from '@/shared/ui/Dialog/Dialog';
import { Button } from '@/shared/ui/Button/Button';
import { useTranslations } from 'next-intl';
import { createSlugSegment } from '@/utils/slug';
import styles from './BrandCard.module.css';

interface BrandCardProps {
  id: number;
  title: string;
  image: string;
  description: string;
  strength: number;
  categoryId: number;
  categorySlug: string;
  locale: string;
}

const getStrengthBars = (strength: number) => {
  const bars = [
    { level: 'light', threshold: 1 },
    { level: 'medium', threshold: 2 },
    { level: 'strong', threshold: 3 },
  ];

  return bars.map((bar) => ({
    ...bar,
    active: strength >= bar.threshold,
  }));
};

export const BrandCard: React.FC<BrandCardProps> = ({
  id,
  title,
  image,
  description,
  strength,
  categorySlug,
  locale,
}) => {
  const t = useTranslations('CategoriesPage');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const strengthBars = getStrengthBars(strength);
  const brandSlug = createSlugSegment(id, title);

  return (
    <>
      <div className={styles.wrapper}>
        <Link
          href={`/${locale}/categories/${categorySlug}/${brandSlug}`}
          className={styles.card}
        >
          <Image
            src={image}
            alt={title}
            width={300}
            height={300}
            className={styles.image}
            unoptimized
          />
        </Link>
        <button
          onClick={() => setIsModalOpen(true)}
          className={styles.infoButton}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 14V10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 6H10.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.modalContent}>
          <div className={styles.strengthBars}>
            {strengthBars.map((bar) => (
              <div
                key={bar.level}
                className={`${styles.strengthBar} ${
                  bar.active ? styles.active : ''
                } ${styles[bar.level]}`}
              />
            ))}
          </div>
          <Typography variant="h2" className={styles.modalTitle}>
            {title}
          </Typography>
          <Typography variant="bodyMMed" textAlign="center" className={styles.modalDescription}>
            {description || t('noDescription')}
          </Typography>
          <Button
            label={t('understandButton')}
            onClick={() => setIsModalOpen(false)}
            variant="default"
          />
        </div>
      </Dialog>
    </>
  );
};

