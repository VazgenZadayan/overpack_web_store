import { API } from '@/lib/constants';

function getLocaleFromURL(): string {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  
  const possibleLocale = segments[0];
  if (possibleLocale === 'hy' || possibleLocale === 'ru') {
    return possibleLocale;
  }
  
  return 'en';
}

function localeToApiLanguage(locale: string): string {
  return locale === 'hy' ? 'am' : locale;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const token = getCookie('token');
  const locale = getLocaleFromURL();
  const apiLanguage = localeToApiLanguage(locale);

  const baseUrl = url.startsWith('http') ? url : `${API}${url}`;
  const urlObj = new URL(baseUrl);
  urlObj.searchParams.set('language', apiLanguage);
  const finalUrl = urlObj.toString();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { token }),
    ...options?.headers,
  };

  const response = await fetch(finalUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const swrFetcher = <T>(url: string): Promise<T> => {
  return fetcher<T>(url);
};

