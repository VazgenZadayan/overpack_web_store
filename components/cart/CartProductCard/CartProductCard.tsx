'use client';

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox';
import { Dialog } from '@/shared/ui/Dialog/Dialog';
import { Button } from '@/shared/ui/Button/Button';
import { useCartStore } from '@/stores/cart';
import { ICartItem } from '@/shared/types/cart';
import { formatPrice } from '@/utils/helpers';
import styles from './CartProductCard.module.css';

interface CartProductCardProps {
  item: ICartItem;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onQuantityChange?: () => void;
}

export const CartProductCard: React.FC<CartProductCardProps> = ({
  item,
  isSelectionMode,
  isSelected,
  onSelect,
  onQuantityChange,
}) => {
  const t = useTranslations('common');
  const tCart = useTranslations('Cart');
  const { updateQuantity, removeFromCart } = useCartStore();
  const { id, title, price, image, size, quantity, countInCart } = item;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isOutOfStock = quantity === 0;
  const isStockLimitReached = countInCart >= quantity;

  const handleUpdateQuantity = useCallback(
    (newQuantity: number) => {
      if (newQuantity === 0) {
        removeFromCart(id);
      } else if (newQuantity <= quantity) {
        updateQuantity(id, newQuantity);
        onQuantityChange?.();
      }
    },
    [id, quantity, updateQuantity, removeFromCart, onQuantityChange]
  );

  const handleDecrease = useCallback(() => {
    handleUpdateQuantity(countInCart - 1);
  }, [countInCart, handleUpdateQuantity]);

  const handleIncrease = useCallback(() => {
    if (!isStockLimitReached && !isOutOfStock) {
      handleUpdateQuantity(countInCart + 1);
    }
  }, [countInCart, isStockLimitReached, isOutOfStock, handleUpdateQuantity]);

  const handleSelect = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);

  const handleDeleteClick = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    removeFromCart(id);
    setIsDeleteDialogOpen(false);
  }, [id, removeFromCart]);

  return (
    <div className={`${styles.card} ${isOutOfStock ? styles.disabled : ''}`}>
      {isSelectionMode && (
        <div className={styles.checkboxContainer}>
          <Checkbox isChecked={isSelected} onPress={handleSelect} />
        </div>
      )}
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={title}
          fill
          className={styles.image}
          sizes="88px"
          unoptimized
        />
      </div>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <Typography variant="bodySBold" className={styles.title}>
            {title}
          </Typography>
          {size > 0 && (
            <Typography variant="bodyXSMed" className={styles.size}>
              {size} {t('units.grams')}
            </Typography>
          )}
          {isOutOfStock ? (
            <Typography variant="bodySBold" className={styles.outOfStock}>
              Нет в наличии
            </Typography>
          ) : (
            <Typography variant="bodySBold" className={styles.price}>
              {formatPrice(price)} ֏
            </Typography>
          )}
          {!isOutOfStock && (
            <div className={styles.quantityContainer}>
              <button
                type="button"
                onClick={handleDecrease}
                className={styles.quantityButton}
                disabled={!quantity}
              >
                <Minus size={18} />
              </button>
              <Typography variant="bodyMBold" className={styles.quantity}>
                {countInCart}
              </Typography>
              <button
                type="button"
                onClick={handleIncrease}
                className={styles.quantityButton}
                disabled={isStockLimitReached || !quantity}
              >
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>
        <div className={styles.deleteContainer}>
          <button
            type="button"
            onClick={handleDeleteClick}
            className={styles.deleteButton}
            aria-label="Удалить товар"
          >
            <Trash2 size={22} />
          </button>
        </div>
      </div>

      <Dialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <div className={styles.dialogContent}>
          <Typography variant="h3" textAlign="center" className={styles.dialogTitle}>
            {tCart('deleteItemModal.title')}
          </Typography>
          <Typography variant="bodyMMed" textAlign="center" className={styles.dialogText}>
            {tCart('deleteItemModal.helpText')}
          </Typography>
          <div className={styles.dialogButtons}>
            <Button
              label={tCart('deleteItemModal.okButton')}
              variant="danger"
              onClick={handleConfirmDelete}
            />
            <Button
              label={tCart('deleteItemModal.cancelButton')}
              variant="text"
              onClick={() => setIsDeleteDialogOpen(false)}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

