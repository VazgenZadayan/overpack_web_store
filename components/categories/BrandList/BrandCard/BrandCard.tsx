'use client';

import React from 'react';
import Link from 'next/link';
import { createSlugSegment } from '@/utils/slug';
import { BrandCardProps } from './types';
import styles from './BrandCard.module.css';

export const BrandCard: React.FC<BrandCardProps> = ({
  id,
  title,
  image,
  locale,
  categorySlug,
}) => {
  const brandSlugSegment = createSlugSegment(id, title);
  const href = `/${locale}/categories/${categorySlug}/${brandSlugSegment}`;

  if (!image) {
    return null;
  }

  return (
    <Link 
      href={href} 
      className={styles.card}
      style={{ backgroundImage: `url(${image})` }}
    />
  );
};

