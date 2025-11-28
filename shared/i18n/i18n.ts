import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { storage } from '@/utils/storage';

import en from './locales/en.json';
import hy from './locales/hy.json';
import ru from './locales/ru.json';

const resources = {
  ru: ru,
  en: en,
  hy: hy,
};

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (
    callback: (lng: string | readonly string[] | undefined) => void,
  ): Promise<string | readonly string[] | undefined> => {
    try {
      // In Next.js App Router, language should come from URL, not browser
      // This detector is used as fallback only
      // The actual language is set via I18nProvider from URL params
      
      // Try to get from URL pathname first (client-side only)
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        const pathLang = pathname.split('/')[1];
        if (pathLang && ['en', 'ru', 'hy'].includes(pathLang)) {
          callback(pathLang);
          return pathLang;
        }
      }

      // Fallback to stored language
      const storedLanguage = storage.getItem('language');
      if (storedLanguage) {
        let language = storedLanguage;
        try {
          const parsed = JSON.parse(storedLanguage);
          language = parsed;
        } catch {
          // If parsing fails, use the value as is
        }

        if (['en', 'ru', 'hy'].includes(language)) {
          callback(language);
          return language;
        }
      }

      // Final fallback to browser language
      let browserLanguage = 'en';
      if (typeof window !== 'undefined') {
        const navLang = navigator.language || (navigator as any).userLanguage;
        browserLanguage = navLang.split('-')[0];
      }
      
      if (!['en', 'ru', 'hy'].includes(browserLanguage)) {
        browserLanguage = 'en';
      }
      
      callback(browserLanguage);
      return browserLanguage;
    } catch (error) {
      console.error('Error detecting language:', error);
      callback('en');
      return 'en';
    }
  },
  init: () => {},
  cacheUserLanguage: (lng: string) => {
    if (typeof window !== 'undefined') {
      storage.setItem('language', JSON.stringify(lng));
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    ns: [
      'Profile',
      'Auth',
      'Product',
      'Cart',
      'Address',
      'Order',
      'common',
      'emptyBlock',
      'notFound',
      'support',
    ],
    defaultNS: 'Profile',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;




