'use client';

import React, { useCallback, useMemo, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox';
import { Button } from '@/shared/ui/Button/Button';
import { Dialog } from '@/shared/ui/Dialog/Dialog';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { useCartStore } from '@/stores/cart';
import { CartProductCard } from '../CartProductCard/CartProductCard';
import { formatPrice, areCartsEqual } from '@/utils/helpers';
import { getProductsByIds } from '@/lib/api/products';
import { IGetProductListResponse } from '@/shared/types/products';
import { useToastStore } from '@/stores/toast';
import styles from './Cart.module.css';

export const Cart: React.FC = () => {
  const t = useTranslations('Cart');
  const router = useRouter();
  const pathname = usePathname();
  const { items, removeFromCart, setCart } = useCartStore();
  const showToast = useToastStore((state) => state.showToast);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cartHasChanges, setCartHasChanges] = useState(false);
  const [isCheckingCart, setIsCheckingCart] = useState(false);
  const checkCartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lang = pathname.split('/')[1] || 'en';

  const handleSetSelectionMode = useCallback(() => {
    setIsSelectionMode(true);
    setSelectedItems([]);
    setSelectAll(false);
  }, []);

  const handleCancelSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedItems([]);
    setSelectAll(false);
  }, []);

  const handleItemSelect = useCallback(
    (id: number) => {
      setSelectedItems((prev) => {
        if (prev.includes(id)) {
          const newSelected = prev.filter((itemId) => itemId !== id);
          if (newSelected.length === 0) {
            setIsSelectionMode(false);
            setSelectAll(false);
          } else if (newSelected.length < items.length) {
            setSelectAll(false);
          }
          return newSelected;
        } else {
          const newSelected = [...prev, id];
          if (newSelected.length === items.length) {
            setSelectAll(true);
          }
          return newSelected;
        }
      });
    },
    [items.length]
  );

  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(items.map((item) => item.id));
      setSelectAll(true);
    }
  }, [selectAll, items]);

  const handleDeleteSelected = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    selectedItems.forEach((id) => {
      removeFromCart(id);
    });
    setSelectedItems([]);
    setSelectAll(false);
    setIsSelectionMode(false);
    setIsDeleteDialogOpen(false);
  }, [selectedItems, removeFromCart]);

  const handleUpdateCart = useCallback(
    (products: IGetProductListResponse) => {
      if (!products?.data?.products || !Array.isArray(products.data.products)) {
        return;
      }

      const updatedCart = items.map((product) => {
        const backendProduct = products.data.products.find(
          (el) => el.id === product.id
        );
        if (backendProduct) {
          const backendQuantity = Number(backendProduct.quantity);
          if (backendQuantity < product.countInCart) {
            setCartHasChanges(true);
          }
          return {
            ...product,
            ...backendProduct,
            price: Number(backendProduct.price),
            countInCart: Math.min(product.countInCart, backendQuantity),
          };
        } else {
          return { ...product, countInCart: 0 };
        }
      });

      if (!areCartsEqual(updatedCart, items)) {
        setCart(updatedCart);
      }
    },
    [items, setCart]
  );

  const checkCartItems = useCallback(async () => {
    const currentIds = items.map((item) => item.id);

    if (isCheckingCart || currentIds.length === 0) {
      return;
    }

    setIsCheckingCart(true);
    try {
      const data = await getProductsByIds(currentIds);
      handleUpdateCart(data);
    } catch {
      showToast({
        message: t('error.checkCart'),
      });
    } finally {
      setIsCheckingCart(false);
    }
  }, [items, isCheckingCart, handleUpdateCart, showToast, t]);

  const handleQuantityChange = useCallback(() => {
    if (checkCartTimeoutRef.current) {
      clearTimeout(checkCartTimeoutRef.current);
    }
    checkCartTimeoutRef.current = setTimeout(() => {
      checkCartItems();
    }, 300);
  }, [checkCartItems]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.countInCart, 0);
  }, [items]);

  const isEmpty = items.length === 0;
  const hasNonZeroItems = useMemo(() => {
    return items.length > 0 && items.some((item) => item.countInCart > 0);
  }, [items]);
  const isCheckoutDisabled = !hasNonZeroItems || isCheckingCart;

  const handleGoToShopping = useCallback(() => {
    router.push(`/${lang}/categories`);
  }, [router, lang]);

  if (isEmpty) {
    return (
      <EmptyState
        title={t('empty.title')}
        description={t('empty.description')}
        lottie="emptyLottie"
        action={
          <Button
            label={t('goToShopping')}
            variant="default"
            onClick={handleGoToShopping}
          />
        }
      />
    );
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Typography variant="h3" className={styles.title}>
              {t('title')}
            </Typography>
            {isSelectionMode ? (
              <button
                type="button"
                onClick={handleCancelSelection}
                className={styles.actionButton}
              >
                <Typography variant="bodyMBold" className={styles.actionText}>
                  {t('cancel')}
                </Typography>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSetSelectionMode}
                className={styles.actionButton}
              >
                <Typography variant="bodyMBold" className={styles.actionText}>
                  {t('select')}
                </Typography>
              </button>
            )}
          </div>

          {isSelectionMode && (
            <div className={styles.bulkActions}>
              <button
                type="button"
                onClick={handleSelectAll}
                className={styles.selectAllButton}
              >
                <Checkbox isChecked={selectAll} onPress={handleSelectAll} />
                <Typography variant="bodyMMed" className={styles.selectAllText}>
                  {`${t('selectAll')} ${items.length}`}
                </Typography>
              </button>
              <div className={styles.selectionInfo}>
                <div className={styles.selectedTextWrapper}>
                  <Typography variant="bodyMBold" className={styles.selectedLabel}>
                    {t('selected')}
                  </Typography>
                  <Typography variant="bodyMBold" className={styles.selectedCount}>
                    {selectedItems.length}
                  </Typography>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className={styles.deleteSelectedButton}
                  aria-label="Удалить выбранные"
                  style={{ opacity: selectedItems.length > 0 ? 1 : 0, pointerEvents: selectedItems.length > 0 ? 'all' : 'none', visibility: selectedItems.length > 0 ? 'visible' : 'hidden' }}
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          )}

          <div className={styles.itemsList}>
            {items.map((item) => (
              <CartProductCard
                key={item.id}
                item={item}
                isSelectionMode={isSelectionMode}
                isSelected={selectedItems.includes(item.id)}
                onSelect={handleItemSelect}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.total}>
          <Typography variant="bodyMBold" className={styles.totalLabel}>
            {t('total')}
          </Typography>
          <Typography variant="h3" className={styles.totalPrice}>
            {formatPrice(totalPrice)} ֏
          </Typography>
        </div>
        <Button
          label={t('checkout')}
          variant="default"
          onClick={() => {
            // TODO: Navigate to checkout
          }}
          className={styles.checkoutButton}
          isDisabled={isCheckoutDisabled}
        />
      </div>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <div className={styles.dialogContent}>
          <Typography variant="h3" className={styles.dialogTitle}>
            {t('deleteSelectedModal.title')}
          </Typography>
          <Typography variant="bodyMMed" className={styles.dialogHelpText}>
            {t('deleteSelectedModal.helpText')}
          </Typography>
          <div className={styles.dialogActions}>
            <Button
              label={t('deleteSelectedModal.okButton')}
              variant="danger"
              onClick={handleConfirmDelete}
            />
            <Button
              label={t('deleteSelectedModal.cancelButton')}
              variant="text"
              onClick={() => setIsDeleteDialogOpen(false)}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        isOpen={cartHasChanges}
        onClose={() => setCartHasChanges(false)}
      >
        <div className={styles.dialogContent}>
          <Typography variant="h3" textAlign="center" className={styles.dialogTitle}>
            {t('cartChanged.title')}
          </Typography>
          <Typography variant="bodyMMed" textAlign="center" className={styles.dialogHelpText}>
            {t('cartChanged.helpText')}
          </Typography>
          <div className={styles.dialogButtons}>
            <Button
              label={t('cartChanged.okButtonText')}
              variant="default"
              onClick={() => setCartHasChanges(false)}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

