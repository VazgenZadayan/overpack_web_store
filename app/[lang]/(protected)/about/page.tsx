'use client';

import { useEffect } from 'react';
import { AboutContent } from '@/components/about/AboutContent/AboutContent';
import styles from './about.module.css';

export default function AboutPage() {
  useEffect(() => {
    document.body.classList.add('addresses-page-no-scroll');
    return () => {
      document.body.classList.remove('addresses-page-no-scroll');
    };
  }, []);

  return (
    <div className={styles.container}>
      <AboutContent />
    </div>
  );
}

