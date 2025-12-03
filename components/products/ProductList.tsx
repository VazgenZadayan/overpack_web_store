'use client';

import { useState, useEffect, useMemo, startTransition } from 'react';
import { useProducts } from '@/lib/hooks/useProducts';
import { useSizes } from '@/lib/hooks/useSizes';
import { ProductCard } from './ProductCard';
import { FilterInput } from '@/shared/ui/FilterInput/FilterInput';
import { Tabs } from '@/shared/ui/Tabs/Tabs';
import { Typography } from '@/shared/ui/Typography/Typography';
import { debounce } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import styles from './ProductList.module.css';

interface ProductListProps {
  language: string;
  categoryId: string;
  subCategoryId?: string;
  brandId?: string;
}

export function ProductList({
  language,
  categoryId,
  subCategoryId,
  brandId,
}: ProductListProps) {
  const t = useTranslations('common');
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [activeSize, setActiveSize] = useState<number | undefined>(undefined);

  const { data: sizesData, isLoading: isSizesLoading } = useSizes({
    language,
    categoryId,
    subCategoryId,
    brandId,
  });

  const { data: productsData, isLoading: isProductsLoading } = useProducts({
    language,
    categoryId,
    subCategoryId,
    brandId,
    size: activeSize,
    search,
  });

  useEffect(() => {
    if (sizesData?.data.sizes.length && activeSize === undefined) {
      startTransition(() => {
        setActiveSize(sizesData.data.sizes[0]);
      });
    }
  }, [sizesData?.data.sizes, activeSize]);

  const debouncedSetSearch = useMemo(
    () => debounce((text: string) => {
      setSearch(text);
    }, 400),
    []
  );

  const handleInputChange = (text: string) => {
    setInputValue(text);
    debouncedSetSearch(text);
  };

  const handleProductClick = () => {
    // TODO: Navigate to product detail page
  };

  const products = productsData?.data.products || [];

  return (
    <>
      <div className={styles.filters}>
        <FilterInput
          placeholder={t('search') || 'Search...'}
          value={inputValue}
          onChangeText={handleInputChange}
        />
        <Tabs
          tabs={sizesData?.data.sizes}
          activeTab={activeSize}
          onTabChange={setActiveSize}
          isLoading={isSizesLoading}
          unit={t('units.millimeters') || 'mm'}
        />
      </div>

      {isProductsLoading ? (
        <div className={styles.loading}>
          <Typography variant="bodyMMed">Loading products...</Typography>
        </div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>
          <Typography variant="bodyMMed" textAlign="center">
            No products found
          </Typography>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              size={product.size}
              quantity={product.quantity}
              onClick={handleProductClick}
            />
          ))}
        </div>
      )}
    </>
  );
}

