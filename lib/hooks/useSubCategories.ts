import useSWR from 'swr';
import type { IGetSubCategoriesResponse } from '@/shared/types/products';

export function useSubCategories(categoryId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<IGetSubCategoriesResponse>(
    categoryId ? `/category/subs?categoryId=${categoryId}` : null,
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
