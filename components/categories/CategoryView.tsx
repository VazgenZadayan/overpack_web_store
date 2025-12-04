'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useBrands } from '@/lib/hooks/useBrands';
import { useSubCategories } from '@/lib/hooks/useSubCategories';
import { useCategories } from '@/lib/hooks/useCategories';
import { BrandCard } from '@/components/brands/BrandCard';
import { CategoryCard } from './CategoryCard';
import { ProductList } from '@/components/products/ProductList';
import { Typography } from '@/shared/ui/Typography/Typography';
import styles from './CategoryView.module.css';

interface CategoryViewProps {
  language: string;
  categoryId: number;
  categorySlug: string;
}

export function CategoryView({
  language,
  categoryId,
  categorySlug,
}: CategoryViewProps) {
  const router = useRouter();

  const { data: categoriesData } = useCategories();
  const category = categoriesData?.data.categories.find((c) => c.id === categoryId);

  const { data: brandsData, isLoading: isBrandsLoading } = useBrands(
    categoryId ? categoryId.toString() : null
  );

  const { data: subCategoriesData, isLoading: isSubCategoriesLoading } = useSubCategories(
    categoryId ? categoryId.toString() : null
  );

  const viewMode = useMemo(() => {
    if (!category) return null;
    if (category.brands > 0) return 'brands';
    if (category.subCategories > 0) return 'subcategories';
    return 'products';
  }, [category]);

  if (!viewMode || !category) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Typography variant="bodyMMed">Loading...</Typography>
        </div>
      </div>
    );
  }

  if (viewMode === 'brands') {
    const brands = brandsData?.data.brands || [];
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
              {category.title}
            </Typography>
          </div>

          {isBrandsLoading ? (
            <div className={styles.loading}>
              <Typography variant="bodyMMed">Loading brands...</Typography>
            </div>
          ) : brands.length === 0 ? (
            <div className={styles.empty}>
              <Typography variant="bodyMMed" textAlign="center">
                No brands found
              </Typography>
            </div>
          ) : (
            <div className={styles.grid}>
              {brands.map((brand) => (
                <BrandCard
                  key={brand.id}
                  id={brand.id}
                  title={brand.title}
                  image={brand.image}
                  description={brand.description}
                  strength={brand.strength}
                  categoryId={categoryId}
                  categorySlug={categorySlug}
                  locale={language}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (viewMode === 'subcategories') {
    const subCategories = subCategoriesData?.data.subCategories || [];
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
              {category.title}
            </Typography>
          </div>

          {isSubCategoriesLoading ? (
            <div className={styles.loading}>
              <Typography variant="bodyMMed">Loading subcategories...</Typography>
            </div>
          ) : subCategories.length === 0 ? (
            <div className={styles.empty}>
              <Typography variant="bodyMMed" textAlign="center">
                No subcategories found
              </Typography>
            </div>
          ) : (
            <div className={styles.grid}>
              {subCategories.map((subCategory) => (
                <CategoryCard
                  key={subCategory.id}
                  id={categoryId}
                  title={subCategory.title}
                  image={subCategory.image}
                  brands={subCategory.brands}
                  subCategories={subCategory.subCategories}
                  locale={language}
                  subCategoryId={subCategory.id}
                  parentCategorySlug={categorySlug}
                />
              ))}
            </div>
          )}
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
            {category.title}
          </Typography>
        </div>

        <ProductList
          language={language}
          categoryId={categoryId.toString()}
        />
      </div>
    </div>
  );
}

