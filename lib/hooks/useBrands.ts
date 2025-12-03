import useSWR from 'swr';
import { getBrands } from '@/lib/api/products';
import type { IGetBrandsResponse } from '@/shared/types/products';

export function useBrands(language: string, categoryId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<IGetBrandsResponse>(
    language && categoryId ? ['brands', language, categoryId] : null,
    () => getBrands(language, categoryId!),
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

