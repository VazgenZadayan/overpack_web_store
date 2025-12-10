'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AddAddressForm } from '@/components/addresses/AddAddressForm/AddAddressForm';
import styles from './add.module.css';

export default function AddAddressPage() {
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add('addresses-page-no-scroll');
    return () => {
      document.body.classList.remove('addresses-page-no-scroll');
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <AddAddressForm onBack={handleBack} />
    </div>
  );
}




