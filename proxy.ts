import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ['/categories', '/profile', '/checkout'];
const publicPaths = ['/login'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get('token')?.value;
  
  const pathnameLocale = pathname.split('/')[1];
  const locale = routing.locales.includes(pathnameLocale as 'en' | 'hy' | 'ru') 
    ? pathnameLocale 
    : routing.defaultLocale;
  
  const isProtectedPath = protectedPaths.some(path => 
    pathname.includes(path)
  );
  
  const isPublicPath = publicPaths.some(path => 
    pathname.includes(path)
  );
  
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL(`/${locale}/login/`, request.url));
  }
  
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL(`/${locale}/categories/`, request.url));
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|hy|ru)/:path*', '/((?!api|_next|_vercel|assets|.*\\..*).*)']
};

