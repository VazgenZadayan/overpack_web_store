'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import '@/shared/i18n/i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const lang = params?.lang as string;
  const { i18n } = useTranslation();

  useEffect(() => {
    // Sync i18n language with URL lang parameter
    if (lang && ['en', 'hy', 'ru'].includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return <>{children}</>;
}

