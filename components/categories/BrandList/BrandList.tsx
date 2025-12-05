'use client';

import { useTranslations } from 'next-intl';
import { useBrands } from '@/lib/hooks/useBrands';
import { useCategories } from '@/lib/hooks/useCategories';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { BrandCard } from './BrandCard/BrandCard';
import { BrandListProps } from './types';
import styles from './BrandList.module.css';

export function BrandList({ language, categoryId, categorySlug }: BrandListProps) {
  const t = useTranslations('CategoriesPage');
  const tEmpty = useTranslations('EmptyState.brands');
  const tError = useTranslations('ErrorState');
  const { data, isError, mutate } = useBrands(categoryId.toString());
  const { data: categoriesData } = useCategories();
  const brands = data?.data?.brands || [];
  const category = categoriesData?.data.categories.find((c) => c.id === categoryId);
  const categoryTitle = category?.title || '';

  const breadcrumbsItems = [
    { label: t('title'), href: `/${language}/categories` },
    { label: categoryTitle, href: `/${language}/categories/${categorySlug}` },
  ];

  const handleRetry = () => {
    mutate();
  };

  if (isError) {
    return (
      <>
        <Breadcrumbs items={breadcrumbsItems} locale={language} />
        <ErrorState
          title={tError('title')}
          description={tError('description')}
          onRetry={handleRetry}
          retryLabel={tError('retryButton')}
        />
      </>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <>
        <Breadcrumbs items={breadcrumbsItems} locale={language} />
        <EmptyState
          title={tEmpty('title')}
          description={tEmpty('description')}
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbsItems} locale={language} />
      <div className={styles.grid}>
        {brands.map((brand, index) => (
          <div
            key={brand.id}
            className={styles.cardWrapper}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <BrandCard
              id={brand.id}
              title={brand.title}
              image={brand.image}
              locale={language}
              categorySlug={categorySlug}
            />
          </div>
        ))}
      </div>
    </>
  );
}

