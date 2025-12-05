'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createSlugSegment } from '@/utils/slug';
import { CategoryCardProps } from './types';
import styles from './CategoryCard.module.css';

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  title,
  image,
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
    return `/${locale}/categories/${slugSegment}`;
  };

  return (
    <Link href={getHref()} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt={title}
          width={50}
          height={50}
          className={styles.image}
        />
      </div>

      <div className={styles.overlay} />

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </Link>
  );
};

