import useSWR from 'swr';
import type { IGetProductListResponse } from '@/shared/types/products';

interface UseProductsParams {
  categoryId: string | null;
  subCategoryId?: string;
  brandId?: string;
  size?: number;
  search: string;
}

export function useProducts(params: UseProductsParams) {
  const { categoryId, subCategoryId, brandId, size, search } = params;
  
  const searchParams = new URLSearchParams();
  if (categoryId) {
    searchParams.set('categoryId', categoryId);
    if (subCategoryId) searchParams.set('subCategoryId', subCategoryId);
    if (brandId) searchParams.set('brandId', brandId);
    if (size) searchParams.set('size', size.toString());
    searchParams.set('search', search);
  }
  
  const queryString = searchParams.toString();
  const key = categoryId ? `/product/search?${queryString}` : null;

  const { data, error, isLoading, mutate } = useSWR<IGetProductListResponse>(
    key,
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
