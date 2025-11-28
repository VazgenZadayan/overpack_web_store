import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/store/StoreProvider";
import { I18nProvider } from "@/shared/providers/I18nProvider";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SUPPORTED_LANGS = ['en', 'hy', 'ru'] as const;
type Lang = typeof SUPPORTED_LANGS[number];

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

function getMetadata(lang: string): Metadata {
  const baseUrl = 'https://overpack.am';
  const langPath = lang === 'en' ? '' : `/${lang}`;
  const canonical = `${baseUrl}${langPath}/`;

  const alternateLanguages = SUPPORTED_LANGS.map(l => ({
    hreflang: l,
    url: l === 'en' ? `${baseUrl}/` : `${baseUrl}/${l}/`,
  }));

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
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LangLayoutProps): Promise<Metadata> {
  const { lang } = await params;
  
  if (!SUPPORTED_LANGS.includes(lang as Lang)) {
    notFound();
  }

  return getMetadata(lang);
}

export default async function LangLayout({
  children,
  params,
}: LangLayoutProps) {
  const { lang } = await params;

  if (!SUPPORTED_LANGS.includes(lang as Lang)) {
    notFound();
  }

  const htmlLang = lang === 'hy' ? 'am' : lang;

  return (
    <html lang={htmlLang}>
      <head>
        <link rel="canonical" href={`https://overpack.am${lang === 'en' ? '/' : `/${lang}/`}`} />
        <link rel="alternate" hrefLang="en" href="https://overpack.am/" />
        <link rel="alternate" hrefLang="hy" href="https://overpack.am/hy/" />
        <link rel="alternate" hrefLang="ru" href="https://overpack.am/ru/" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <I18nProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </I18nProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

