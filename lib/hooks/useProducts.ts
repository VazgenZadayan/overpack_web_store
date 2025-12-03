import useSWR from 'swr';
import { getProductList } from '@/lib/api/products';
import type { IGetProductListResponse } from '@/shared/types/products';

interface UseProductsParams {
  language: string;
  categoryId: string | null;
  subCategoryId?: string;
  brandId?: string;
  size?: number;
  search: string;
}

export function useProducts(params: UseProductsParams) {
  const { data, error, isLoading, mutate } = useSWR<IGetProductListResponse>(
    params.language && params.categoryId
      ? [
          'products',
          params.language,
          params.categoryId,
          params.subCategoryId,
          params.brandId,
          params.size,
          params.search,
        ]
      : null,
    () => getProductList({ ...params, categoryId: params.categoryId! }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
}

