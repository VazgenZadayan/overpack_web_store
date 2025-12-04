'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { setLocaleInStorage, setLocaleCookieClient } from '@/utils/locale';
import styles from './LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
  currentLocale: string;
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hy', label: 'Հայերեն' },
  { code: 'ru', label: 'Русский' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    if (isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageMenuOpen]);

  const handleLanguageClick = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const handleLanguageSelect = (newLocale: string) => {
    // Если выбран уже текущий язык, просто закрываем меню
    if (newLocale === currentLocale) {
      setIsLanguageMenuOpen(false);
      return;
    }
    
    setIsLanguageMenuOpen(false);
    
    setLocaleInStorage(newLocale);
    setLocaleCookieClient(newLocale);
    
    let currentPath = pathname;
    
    for (const lang of languages) {
      currentPath = currentPath.replace(`/${lang.code}/`, '/');
      currentPath = currentPath.replace(`/${lang.code}`, '');
    }
    
    if (!currentPath || currentPath === '') {
      currentPath = '/';
    }
    
    if (currentPath !== '/' && !currentPath.endsWith('/')) {
      currentPath = `${currentPath}/`;
    }
    
    let newPath: string;
    if (newLocale === 'en') {
      newPath = currentPath;
    } else {
      const pathWithoutLeadingSlash = currentPath === '/' ? '' : currentPath;
      newPath = `/${newLocale}${pathWithoutLeadingSlash}`;
    }
    
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      window.location.assign(`${baseUrl}${newPath}`);
    } else {
      router.push(newPath);
    }
  };

  return (
    <div className={styles.wrapper} ref={languageMenuRef}>
      <button
        onClick={handleLanguageClick}
        className={styles.button}
        aria-label="Change language"
      >
        <Globe size={20} />
      </button>
      {isLanguageMenuOpen && (
        <div className={styles.dropdown}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`${styles.option} ${
                currentLocale === lang.code ? styles.optionActive : ''
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

