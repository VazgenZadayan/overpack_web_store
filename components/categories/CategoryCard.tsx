'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt={title}
          width={280}
          height={280}
          className={styles.image}
          unoptimized
        />
      </div>

      <div className={styles.overlay} />

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </Link>
  );
};
