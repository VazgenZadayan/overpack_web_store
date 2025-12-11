'use client';

import { useEffect } from 'react';
import { SupportContent } from '@/components/support/SupportContent/SupportContent';
import styles from './support.module.css';
import { Header } from '@/components/layout/Header/Header';
import { useParams } from 'next/navigation';

export default function SupportPage() {
  const params = useParams();
  const lang = params.lang as string;
  useEffect(() => {
    document.body.classList.add('addresses-page-no-scroll');
    return () => {
      document.body.classList.remove('addresses-page-no-scroll');
    };
  }, []);

  return (
    <>
      <Header locale={lang} />
      
    <div className={styles.container}>
      <SupportContent />
    </div>
    </>
  );
}

