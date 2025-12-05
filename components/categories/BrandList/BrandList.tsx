'use client';

import { useTranslations } from 'next-intl';
import { useBrands } from '@/lib/hooks/useBrands';
import { useCategories } from '@/lib/hooks/useCategories';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs';
import { BrandCard } from './BrandCard/BrandCard';
import { BrandListProps } from './types';
import styles from './BrandList.module.css';

export function BrandList({ language, categoryId, categorySlug }: BrandListProps) {
  const t = useTranslations('CategoriesPage');
  const { data, isError } = useBrands(categoryId.toString());
  const { data: categoriesData } = useCategories();
  const brands = data?.data?.brands || [];
  const category = categoriesData?.data.categories.find((c) => c.id === categoryId);
  const categoryTitle = category?.title || '';

  const breadcrumbsItems = [
    { label: t('title'), href: `/${language}/categories` },
    { label: categoryTitle, href: `/${language}/categories/${categorySlug}` },
  ];

  if (isError) {
    return (
      <div className={styles.empty}>
        <p>Error loading brands</p>
      </div>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No brands available</p>
      </div>
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

