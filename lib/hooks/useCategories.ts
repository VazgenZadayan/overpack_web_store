import useSWR from 'swr';
import type { IGetCategoriesResponse } from '@/shared/types/products';

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<IGetCategoriesResponse>(
    '/category',
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

