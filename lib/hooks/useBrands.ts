import useSWR from 'swr';
import type { IGetBrandsResponse } from '@/shared/types/products';

export function useBrands(categoryId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<IGetBrandsResponse>(
    categoryId ? `/category/brands?categoryId=${categoryId}` : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000,
    }
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
}
