import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { getBrowserLocale, getLocaleFromCookie, setLocaleCookie } from './utils/locale';

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: false,
  alternateLinks: false,
});

const protectedPaths = ['/categories', '/profile', '/checkout'];
const publicPaths = ['/login'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get('token')?.value;
  
  const pathnameLocale = pathname.split('/')[1];
  const hasLocaleInPath = routing.locales.includes(pathnameLocale as 'en' | 'hy' | 'ru');
  
  let preferredLocale: string | null = null;
  const cookieLocale = getLocaleFromCookie(request.headers.get('cookie'));
  
  if (!hasLocaleInPath) {
    if (cookieLocale && routing.locales.includes(cookieLocale as 'en' | 'hy' | 'ru')) {
      preferredLocale = cookieLocale;
    } else {
      const acceptLanguage = request.headers.get('accept-language');
      preferredLocale = getBrowserLocale(acceptLanguage, Array.from(routing.locales));
    }
  } else {
    preferredLocale = pathnameLocale;
  }
  
  const currentLocale = preferredLocale || routing.defaultLocale;
  const isProtectedPath = protectedPaths.some(path => 
    pathname.includes(path)
  );
  
  const isPublicPath = publicPaths.some(path => 
    pathname.includes(path)
  );
  
  if (isProtectedPath && !token) {
    const loginPath = currentLocale === 'en' ? '/login/' : `/${currentLocale}/login/`;
    const response = NextResponse.redirect(new URL(loginPath, request.url));
    if (preferredLocale && preferredLocale !== cookieLocale) {
      response.headers.set('Set-Cookie', setLocaleCookie(preferredLocale));
    }
    return response;
  }
  
  if (isPublicPath && token) {
    const categoriesPath = currentLocale === 'en' ? '/categories/' : `/${currentLocale}/categories/`;
    const response = NextResponse.redirect(new URL(categoriesPath, request.url));
    if (preferredLocale && preferredLocale !== cookieLocale) {
      response.headers.set('Set-Cookie', setLocaleCookie(preferredLocale));
    }
    return response;
  }
  
  if (preferredLocale && !hasLocaleInPath) {
    if (preferredLocale === 'en') {
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = `/en${pathname}`;
      const response = NextResponse.rewrite(newUrl);
      if (preferredLocale !== cookieLocale) {
        response.headers.set('Set-Cookie', setLocaleCookie(preferredLocale));
      }
      return response;
    } else {
      const newPath = `/${preferredLocale}${pathname}`;
      const response = NextResponse.redirect(new URL(newPath, request.url));
      if (preferredLocale !== cookieLocale) {
        response.headers.set('Set-Cookie', setLocaleCookie(preferredLocale));
      }
      return response;
    }
  }
  
  const response = intlMiddleware(request);
  
  if (preferredLocale && preferredLocale !== cookieLocale) {
    response.headers.set('Set-Cookie', setLocaleCookie(preferredLocale));
  }
  
  return response;
}

export const config = {
  matcher: ['/', '/(en|hy|ru)/:path*', '/((?!api|_next|_vercel|assets|.*\\..*).*)']
};

