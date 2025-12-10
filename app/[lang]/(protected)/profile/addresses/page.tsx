'use client';

import { useEffect } from 'react';
import { AddressesList } from '@/components/addresses/AddressesList/AddressesList';
import styles from './addresses.module.css';

export default function AddressesPage() {
  useEffect(() => {
    document.body.classList.add('addresses-page-no-scroll');
    return () => {
      document.body.classList.remove('addresses-page-no-scroll');
    };
  }, []);

  return (
    <div className={styles.container}>
      <AddressesList />
    </div>
  );
}

