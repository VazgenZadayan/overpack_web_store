'use client';

import React from 'react';
import Image from 'next/image';
import { Typography } from '@/shared/ui/Typography/Typography';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: number;
  title: string;
  price: string;
  image: string;
  size: number;
  quantity: number;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  image,
  size,
  quantity,
  onClick,
}) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={title}
          width={200}
          height={200}
          className={styles.image}
          unoptimized
        />
        {quantity === 0 && (
          <div className={styles.outOfStock}>
            <Typography variant="bodyXSBold">Out of stock</Typography>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <Typography variant="bodyMBold" className={styles.title}>
          {title}
        </Typography>
        <div className={styles.footer}>
          <Typography variant="bodyMSB" className={styles.size}>
            {size}mm
          </Typography>
          <Typography variant="bodyMBold" className={styles.price}>
            {price} ֏
          </Typography>
        </div>
      </div>
    </div>
  );
};

