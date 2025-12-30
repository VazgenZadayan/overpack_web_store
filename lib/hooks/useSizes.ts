import useSWR from 'swr';
import type { IGetSizesResponse } from '@/shared/types/products';
import { useMemo } from 'react';

interface UseSizesParams {
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
}

export function useSizes(params: UseSizesParams) {
  const { categoryId, subCategoryId, brandId } = params;
  
  const searchParams = new URLSearchParams();
  if (categoryId) searchParams.set('categoryId', categoryId);
  if (subCategoryId) searchParams.set('subCategoryId', subCategoryId);
  if (brandId) searchParams.set('brandId', brandId);
  
  const queryString = searchParams.toString();
  const key = queryString ? `/product/sizes?${queryString}` : null;

  const { data, error, isLoading, mutate } = useSWR<IGetSizesResponse>(
    key,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000,
    }
  );
  const filteredData = useMemo(() => {
    return data?.data.sizes.filter((size) => size !== null) || [];
  }, [data]);

  return {
    data: {
      ...data,
      data: {
        ...data?.data,
        sizes: filteredData,
      },
    },
    isLoading,
    isError: error,
    mutate,
  };
}
