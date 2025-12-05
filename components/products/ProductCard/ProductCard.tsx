'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Typography } from '@/shared/ui/Typography/Typography';
import { useCartStore } from '@/stores/cart';
import { ProductCardProps } from './types';
import styles from './ProductCard.module.css';
import { formatPrice } from '@/utils/helpers';

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  image,
  size,
  quantity,
  description,
  createdAt,
  onClick,
}) => {
  const t = useTranslations('Product');
  const { items, addToCart, updateQuantity, removeFromCart } = useCartStore();
  const cartItem = items.find((item) => item.id === id);
  const countInCart = cartItem?.countInCart || 0;
  const isOutOfStock = quantity === 0;
  const isStockLimitReached = countInCart >= quantity;

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOutOfStock || isStockLimitReached) return;

      addToCart({
        id,
        price: parseFloat(price),
        image,
        size,
        quantity,
        description,
        createdAt,
        title,
        countInCart: 0,
      });
    },
    [id, price, image, size, quantity, description, createdAt, title, isOutOfStock, isStockLimitReached, addToCart]
  );

  const handleIncrease = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isStockLimitReached) return;
      if (countInCart === 0) {
        handleAddToCart(e);
      } else {
        updateQuantity(id, countInCart + 1);
      }
    },
    [id, countInCart, isStockLimitReached, handleAddToCart, updateQuantity]
  );

  const handleDecrease = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (countInCart === 1) {
        removeFromCart(id);
      } else if (countInCart > 1) {
        updateQuantity(id, countInCart - 1);
      }
    },
    [id, countInCart, removeFromCart, updateQuantity]
  );

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={title}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 50vw, 33vw"
          unoptimized
        />
      </div>
      <div className={styles.content}>
        <Typography variant="bodyMBold" className={styles.title}>
          {title}
        </Typography>
        <div className={styles.footer}>
          <Typography variant="bodyLBold" className={styles.price}>
            {formatPrice(price)} ֏
          </Typography>
          <div className={styles.cartButtonWrapper}>
          <button
            className={styles.cartButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isOutOfStock) return;
              if (countInCart > 0) {
                return;
              }
              handleAddToCart(e);
            }}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? t('outOfStock') : countInCart > 0 ? "Управление количеством" : "Добавить в корзину"}
          >
            {isOutOfStock ? (
              <Typography variant="bodyMBold" className={styles.outOfStockText}>
                {t('outOfStock')}
              </Typography>
            ) : countInCart > 0 ? (
              <div className={styles.cartControls} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.decreaseButton}
                  onClick={handleDecrease}
                  aria-label="Уменьшить количество"
                >
                  <Minus size={20} />
                </button>
                <span className={styles.count}>{countInCart}</span>
                <button
                  className={styles.increaseButton}
                  onClick={handleIncrease}
                  disabled={isStockLimitReached}
                  aria-label="Увеличить количество"
                >
                  <Plus size={20} />
                </button>
              </div>
            ) : (
              <Plus size={20} />
            )}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

