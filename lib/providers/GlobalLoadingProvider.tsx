'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SWRConfig } from 'swr';
import { swrFetcher } from '@/lib/api/fetcher';
import Loading from '@/components/ui/Loading/Loading';

interface GlobalLoadingContextType {
  isLoading: boolean;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType>({ isLoading: false });

export function useGlobalLoading() {
  return useContext(GlobalLoadingContext);
}

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingCount, setLoadingCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const isLoading = loadingCount > 0 || !isMounted;

  const handleRequestStart = useCallback(() => {
    setLoadingCount((prev) => prev + 1);
  }, []);

  const handleRequestEnd = useCallback(() => {
    setLoadingCount((prev) => Math.max(0, prev - 1));
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsMounted(false);
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher: async (url: string) => {
          handleRequestStart();
          try {
            const result = await swrFetcher(url);
            return result;
          } finally {
            handleRequestEnd();
          }
        },
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
      }}
    >
      <GlobalLoadingContext.Provider value={{ isLoading }}>
        {children}
        {isLoading && <Loading />}
      </GlobalLoadingContext.Provider>
    </SWRConfig>
  );
}

