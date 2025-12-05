'use client';

import { useState, useEffect, useMemo, startTransition } from 'react';
import { useProducts } from '@/lib/hooks/useProducts';
import { useSizes } from '@/lib/hooks/useSizes';
import { ProductCard } from '../ProductCard/ProductCard';
import { FilterInput } from '@/shared/ui/FilterInput/FilterInput';
import { Tabs } from '@/shared/ui/Tabs/Tabs';
import { debounce } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { ProductListProps } from './types';
import styles from './ProductList.module.css';

export function ProductList({
  categoryId,
  subCategoryId,
  brandId,
}: ProductListProps) {
  const t = useTranslations('common');
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [activeSize, setActiveSize] = useState<number | undefined>(undefined);

  const { data: sizesData } = useSizes({
    categoryId,
    subCategoryId,
    brandId,
  });

  const { data: productsData } = useProducts({
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
    () => {
      const setSearchDebounced = (text: string) => {
        setSearch(text);
      };
      return debounce(setSearchDebounced as (...args: unknown[]) => void, 400) as (text: string) => void;
    },
    []
  );

  const handleInputChange = (text: string) => {
    setInputValue(text);
    debouncedSetSearch(text);
  };

  const handleProductClick = () => {
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
          isLoading={false}
          unit={brandId ? t('units.grams') : t('units.millimeters')}
        />
      </div>

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
            description={product.description}
            createdAt={product.createdAt}
            onClick={handleProductClick}
          />
        ))}
      </div>
    </>
  );
}

