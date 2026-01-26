'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { getPartners } from '@/lib/api/partners';
import { PartnerCard } from '../PartnerCard/PartnerCard';
import styles from './PartnersList.module.css';

export const PartnersList: React.FC = () => {
  const t = useTranslations('Partners');
  const tCategories = useTranslations('CategoriesPage');
  const pathname = usePathname();
  const { data, isLoading } = useSWR('partners', getPartners);

  const lang = pathname.split('/')[1] || 'en';
  const partners = data?.data?.partners || [];
  const isEmpty = !isLoading && partners.length === 0;

  const breadcrumbsItems = [
    {
      label: tCategories('title'),
      href: `/${lang}/categories`,
    },
    {
      label: t('title'),
      href: `/${lang}/partners`,
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Breadcrumbs items={breadcrumbsItems} locale={lang} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Breadcrumbs items={breadcrumbsItems} locale={lang} />
      </div>
      {isEmpty ? (
        <div className={styles.emptyWrapper}>
          <EmptyState
            title={t('emptyBlockSubtitle')}
          />
        </div>
      ) : (
        <div className={styles.list}>
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} locale={lang} />
          ))}
        </div>
      )}
    </div>
  );
};

