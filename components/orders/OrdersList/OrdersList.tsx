'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import useSWRInfinite from 'swr/infinite';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { OrderCard } from '../OrderCard/OrderCard';
import { getOrderHistory } from '@/lib/api/orders';
import styles from './OrdersList.module.css';

export const OrdersList: React.FC = () => {
  const t = useTranslations('Order.history');
  const tCategories = useTranslations('CategoriesPage');
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';

  const getKey = (pageIndex: number, previousPageData: { data: { orders: unknown[] } } | null) => {
    if (previousPageData && (!previousPageData.data?.orders || previousPageData.data.orders.length === 0)) {
      return null;
    }
    return ['orderHistory', pageIndex + 1] as const;
  };

  const { data, size, setSize, isLoading } = useSWRInfinite(
    getKey,
    ([, page]: [string, number]) => getOrderHistory({ limit: 10, page }),
    {
      revalidateFirstPage: false,
    }
  );

  const orders = useMemo(() => {
    return data ? data.flatMap((page) => page.data.orders) : [];
  }, [data]);

  const isEmpty = !isLoading && orders.length === 0;
  const hasMore = data && data[data.length - 1]?.data.orders.length === 10;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setSize(size + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, size, setSize]);

  const breadcrumbsItems = [
    {
      label: tCategories('title'),
      href: `/${lang}/categories`,
    },
    {
      label: t('title'),
      href: `/${lang}/profile/history`,
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Breadcrumbs items={breadcrumbsItems} locale={lang} />
      </div>

      {isEmpty ? (
        <div className={styles.emptyWrapper}>
          <EmptyState
            title={t('empty.title')}
            description={t('empty.subtitle')}
            lottie="history"
          />
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {orders.map((order) => (
              <OrderCard key={order.orderId} order={order} locale={lang} />
            ))}
            {hasMore && <div ref={loadMoreRef} className={styles.loadMoreTrigger} />}
          </div>
        </>
      )}
    </div>
  );
};

