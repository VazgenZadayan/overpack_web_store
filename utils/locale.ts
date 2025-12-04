const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
const LOCALE_STORAGE_KEY = 'preferredLocale';

export function getBrowserLocale(acceptLanguage: string | null, supportedLocales: string[]): string {
  if (!acceptLanguage) {
    return 'en';
  }

  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [locale, q = 'q=1'] = lang.trim().split(';');
      const quality = parseFloat(q.replace('q=', ''));
      return { locale: locale.toLowerCase().split('-')[0], quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { locale } of languages) {
    if (supportedLocales.includes(locale)) {
      return locale;
    }
  }

  return 'en';
}

export function getLocaleFromCookie(cookies: string | null): string | null {
  if (!cookies) return null;
  
  const match = cookies.match(new RegExp(`(^| )${LOCALE_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] : null;
}

export function setLocaleCookie(locale: string): string {
  return `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`; // 1 year
}

export function getLocaleFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LOCALE_STORAGE_KEY);
}

export function setLocaleInStorage(locale: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function setLocaleCookieClient(locale: string): void {
  if (typeof window === 'undefined') return;
  document.cookie = setLocaleCookie(locale);
}

