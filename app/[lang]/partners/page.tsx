'use client';

import { useEffect } from 'react';
import { PartnersList } from '@/components/partners/PartnersList/PartnersList';
import styles from './partners.module.css';

export default function PartnersPage() {
  useEffect(() => {
    document.body.classList.add('addresses-page-no-scroll');
    return () => {
      document.body.classList.remove('addresses-page-no-scroll');
    };
  }, []);

  return (
    <div className={styles.container}>
      <PartnersList />
    </div>
  );
}




