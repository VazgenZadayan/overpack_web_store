'use client';

import { useEffect } from 'react';
import { OrdersList } from '@/components/orders/OrdersList/OrdersList';
import styles from './history.module.css';

export default function HistoryPage() {
  useEffect(() => {
    document.body.classList.add('addresses-page-no-scroll');
    return () => {
      document.body.classList.remove('addresses-page-no-scroll');
    };
  }, []);

  return (
    <div className={styles.container}>
      <OrdersList />
    </div>
  );
}

