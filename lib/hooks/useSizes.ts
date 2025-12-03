import useSWR from 'swr';
import { getSizes } from '@/lib/api/products';
import type { IGetSizesResponse } from '@/shared/types/products';

interface UseSizesParams {
  language: string;
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
}

export function useSizes(params: UseSizesParams) {
  const { data, error, isLoading, mutate } = useSWR<IGetSizesResponse>(
    params.language && params.categoryId
      ? ['sizes', params.language, params.categoryId, params.subCategoryId, params.brandId]
      : null,
    () => getSizes(params),
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

