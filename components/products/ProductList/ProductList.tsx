'use client';

import { useState, useMemo } from 'react';
import { useProducts } from '@/lib/hooks/useProducts';
import { useSizes } from '@/lib/hooks/useSizes';
import { ProductCard } from '../ProductCard/ProductCard';
import { FilterInput } from '@/shared/ui/FilterInput/FilterInput';
import { Tabs } from '@/shared/ui/Tabs/Tabs';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
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
  const tEmpty = useTranslations('EmptyState.products');
  const tError = useTranslations('ErrorState');
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [activeSize, setActiveSize] = useState<number | undefined>(undefined);

  const { data: sizesData, isLoading: isSizesLoading } = useSizes({
    categoryId,
    subCategoryId,
    brandId,
  });

  const computedSize = useMemo(() => {
    if (isSizesLoading) {
      return undefined;
    }
    if (activeSize !== undefined) {
      return activeSize;
    }
    if (sizesData?.data.sizes.length) {
      return sizesData.data.sizes[0];
    }
    return undefined;
  }, [sizesData?.data.sizes, activeSize, isSizesLoading]);

  const { data: productsData, isError, mutate, isLoading: isProductsLoading } = useProducts({
    categoryId,
    subCategoryId,
    brandId,
    size: computedSize,
    search,
  });

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

  const handleRetry = () => {
    mutate();
  };
  const hasSearchInput = inputValue.trim() !== '';
  const hasActiveSearch = search.trim() !== '';
  const shouldShowFilters = !!productsData?.data.products.length || hasSearchInput || hasActiveSearch;
  const shouldShowEmptyState = !isProductsLoading && !productsData?.data.products.length;

  if (isError) {
    return (
      <ErrorState
        title={tError('title')}
        description={tError('description')}
        onRetry={handleRetry}
        retryLabel={tError('retryButton')}
      />
    );
  }

  return (
    <>
      {shouldShowFilters && (
        <div className={styles.filters}>
          <FilterInput
            placeholder={t('search') || 'Search...'}
            value={inputValue}
            onChangeText={handleInputChange}
          />
            <Tabs
              tabs={sizesData?.data.sizes}
              activeTab={computedSize}
              onTabChange={setActiveSize}
              isLoading={false}
              unit={brandId ? t('units.grams') : t('units.millimeters')}
            />
        </div>
      )}

      {shouldShowEmptyState ? (
        <EmptyState
          title={tEmpty('title')}
          description={tEmpty('description')}
        />
      ) : (
        <div className={styles.grid}>
          {productsData?.data.products.map((product) => (
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
      )}
    </>
  );
}

