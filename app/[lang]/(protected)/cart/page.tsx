'use client';

import { useEffect } from 'react';
import { Cart } from '@/components/cart/Cart/Cart';
import styles from './cart.module.css';

export default function CartPage() {
  useEffect(() => {
    document.body.classList.add('cart-page-no-scroll');
    return () => {
      document.body.classList.remove('cart-page-no-scroll');
    };
  }, []);

  return (
    <div className={styles.container}>
      <Cart />
    </div>
  );
}

