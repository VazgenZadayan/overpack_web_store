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

const isProductSearchUrl = (url: string): boolean => {
  try {
    let pathname: string;
    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      pathname = urlObj.pathname;
    } else {
      const [path] = url.split('?');
      pathname = path;
    }
    return pathname.includes('/product/search');
  } catch {
    return false;
  }
};

const hasSearchParam = (url: string): boolean => {
  try {
    let searchParams: URLSearchParams;
    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      searchParams = urlObj.searchParams;
    } else {
      const [, query] = url.split('?');
      searchParams = new URLSearchParams(query || '');
    }
    const searchValue = searchParams.get('search');
    return searchValue !== null && searchValue !== '';
  } catch {
    return false;
  }
};

const isSizesUrl = (url: string): boolean => {
  try {
    let pathname: string;
    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      pathname = urlObj.pathname;
    } else {
      const [path] = url.split('?');
      pathname = path;
    }
    return pathname.includes('/category/sizes') || pathname.includes('/product/sizes');
  } catch {
    return false;
  }
};

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingCount, setLoadingCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const isLoading = loadingCount > 0 || !isMounted;

  const handleRequestStart = useCallback((url: string) => {
    if (isSizesUrl(url)) {
      return;
    }
    if (isProductSearchUrl(url)) {
      if (hasSearchParam(url)) {
        return;
      }
    }

    setLoadingCount((prev) => prev + 1);
  }, []);

  const handleRequestEnd = useCallback((url: string) => {
    if (isSizesUrl(url)) {
      setIsMounted(true);
      return;
    }
    if (isProductSearchUrl(url) && hasSearchParam(url)) {
      setIsMounted(true);
      return;
    }
    setLoadingCount((prev) => Math.max(0, prev - 1));
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher: async (url: string) => {
          handleRequestStart(url);
          try {
            const result = await swrFetcher(url);
            return result;
          } finally {
            handleRequestEnd(url);
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

