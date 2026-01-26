'use client';

import { useEffect } from 'react';
import { PartnerDetail } from '@/components/partners/PartnerDetail/PartnerDetail';
import styles from '../partners.module.css';

export default function PartnerPage() {
  useEffect(() => {
    document.body.classList.add('addresses-page-no-scroll');
    return () => {
      document.body.classList.remove('addresses-page-no-scroll');
    };
  }, []);

  return (
    <div className={styles.container}>
      <PartnerDetail />
    </div>
  );
}




