import useSWR from 'swr';
import type { IGetMeResponse } from '@/shared/types/user';
import { getMe } from '@/lib/api/user';

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<IGetMeResponse>(
    '/user',
    () => getMe(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000,
      shouldRetryOnError: false,
    }
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
    user: data?.data?.user,
  };
}




