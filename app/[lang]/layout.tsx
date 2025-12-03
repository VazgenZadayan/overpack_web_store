import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SWRProvider } from "@/lib/providers/SWRProvider";
import { ThemeProvider, type ThemeType } from "@/shared/contexts/ThemeProvider";
import { Toast } from "@/shared/ui/Toast/Toast";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

function getMetadata(lang: string): Metadata {
  const baseUrl = 'https://overpack.am';
  const langPath = lang === 'en' ? '' : `/${lang}`;
  const canonical = `${baseUrl}${langPath}/`;

  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical,
      languages: {
        'en': `${baseUrl}/`,
        'hy': `${baseUrl}/hy/`,
        'ru': `${baseUrl}/ru/`,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: LangLayoutProps): Promise<Metadata> {
  const { lang } = await params;
  
  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  return getMetadata(lang);
}

export default async function LangLayout({
  children,
  params,
}: LangLayoutProps) {
  const { lang } = await params;

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  const htmlLang = lang === 'hy' ? 'am' : lang;
  
  const messages = await getMessages();
  
  const cookieStore = await cookies();
  const savedTheme = (cookieStore.get('theme')?.value || 'system') as ThemeType;
  
  const initialDataTheme = savedTheme === 'system' ? 'light' : savedTheme;

  return (
    <html lang={htmlLang} data-theme={initialDataTheme}>
      <head>
        <link rel="canonical" href={`https://overpack.am${lang === 'en' ? '/' : `/${lang}/`}`} />
        <link rel="alternate" hrefLang="en" href="https://overpack.am/" />
        <link rel="alternate" hrefLang="hy" href="https://overpack.am/hy/" />
        <link rel="alternate" hrefLang="ru" href="https://overpack.am/ru/" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SWRProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider initialTheme={savedTheme}>
              {children}
              <Toast />
            </ThemeProvider>
          </NextIntlClientProvider>
        </SWRProvider>
      </body>
    </html>
  );
}

