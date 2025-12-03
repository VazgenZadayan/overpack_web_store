import useSWR from 'swr';
import { getCategories } from '@/lib/api/products';
import type { IGetCategoriesResponse } from '@/shared/types/products';

export function useCategories(language: string) {
  const { data, error, isLoading, mutate } = useSWR<IGetCategoriesResponse>(
    language ? ['categories', language] : null,
    () => getCategories(language),
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

