import useSWR from 'swr';
import { getSubCategories } from '@/lib/api/products';
import type { IGetSubCategoriesResponse } from '@/shared/types/products';

export function useSubCategories(language: string, categoryId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<IGetSubCategoriesResponse>(
    language && categoryId ? ['subCategories', language, categoryId] : null,
    () => getSubCategories(language, categoryId!),
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

