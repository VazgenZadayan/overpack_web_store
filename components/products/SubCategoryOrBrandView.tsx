'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useBrands } from '@/lib/hooks/useBrands';
import { useSubCategories } from '@/lib/hooks/useSubCategories';
import { ProductList } from './ProductList';
import { Typography } from '@/shared/ui/Typography/Typography';
import styles from './SubCategoryOrBrandView.module.css';

interface SubCategoryOrBrandViewProps {
  language: string;
  categoryId: number;
  categorySlug: string;
  subId: number;
  subSlug: string;
}

export function SubCategoryOrBrandView({
  language,
  categoryId,
  subId,
}: SubCategoryOrBrandViewProps) {
  const router = useRouter();

  const { data: brandsData, isLoading: isBrandsLoading } = useBrands(
    categoryId ? categoryId.toString() : null
  );

  const { data: subCategoriesData, isLoading: isSubCategoriesLoading } = useSubCategories(
    categoryId ? categoryId.toString() : null
  );

  const { type, title } = useMemo(() => {
    if (!subId) return { type: null as 'brand' | 'subcategory' | null, title: '' };

    const brand = brandsData?.data.brands.find((b) => b.id === subId);
    const subCategory = subCategoriesData?.data.subCategories.find((s) => s.id === subId);

    if (brand) {
      return { type: 'brand' as const, title: brand.title };
    } else if (subCategory) {
      return { type: 'subcategory' as const, title: subCategory.title };
    }
    return { type: null as 'brand' | 'subcategory' | null, title: '' };
  }, [subId, brandsData, subCategoriesData]);

  if (!type || isBrandsLoading || isSubCategoriesLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Typography variant="bodyMMed">Loading...</Typography>
        </div>
      </div>
    );
  }

  if (!type) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <Typography variant="bodyMMed">Invalid subcategory or brand</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <button onClick={() => router.back()} className={styles.backButton}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 8L12 16L20 24"
                stroke="var(--color-dark)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <Typography variant="h1" className={styles.title}>
            {title}
          </Typography>
        </div>

        <ProductList
          language={language}
          categoryId={categoryId.toString()}
          subCategoryId={type === 'subcategory' ? subId.toString() : undefined}
          brandId={type === 'brand' ? subId.toString() : undefined}
        />
      </div>
    </div>
  );
}

