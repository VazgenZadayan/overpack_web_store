'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '@/shared/ui/Typography/Typography';
import { createSlugSegment } from '@/utils/slug';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  id: number;
  title: string;
  image: string;
  brands: number;
  subCategories: number;
  locale: string;
  subCategoryId?: number;
  parentCategorySlug?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  title,
  image,
  brands,
  subCategories,
  locale,
  subCategoryId,
  parentCategorySlug,
}) => {
  const slugSegment = createSlugSegment(id, title);
  
  const getHref = () => {
    if (subCategoryId && parentCategorySlug) {
      const subSlugSegment = createSlugSegment(subCategoryId, title);
      return `/${locale}/categories/${parentCategorySlug}/${subSlugSegment}`;
    }
    if (brands > 0 || subCategories > 0) {
      return `/${locale}/categories/${slugSegment}`;
    }
    return `/${locale}/categories/${slugSegment}`;
  };

  return (
    <Link href={getHref()} className={styles.card}>
      <div className={styles.iconWrapper}>
        <Image
          src={image}
          alt={title}
          width={200}
          height={200}
          className={styles.icon}
          unoptimized
        />
      </div>
      <div className={styles.textWrapper}>
        <Typography variant="bodyLBold">{title}</Typography>
      </div>
      <div className={styles.arrowContainer}>
        <svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 5L13 10.5L8 16"
            stroke="var(--color-dark)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
};

