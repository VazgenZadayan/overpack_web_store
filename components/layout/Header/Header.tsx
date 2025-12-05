'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { useTheme } from '@/shared/contexts/ThemeProvider';
import { Logo } from '@/shared/icons/Logo';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/ui/ThemeSwitcher';
import { getInitials } from '@/utils/helpers';
import { useUser } from '@/lib/hooks/useUser';
import { Sidebar } from '../Sidebar/Sidebar';
import { HeaderProps } from './types';
import styles from './Header.module.css';

export const Header: React.FC<HeaderProps> = ({
  locale,
}) => {
  const { resolvedTheme } = useTheme();
  const { user } = useUser();
  const initials = user?.name ? getInitials(user.name) : null;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleProfileClick = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href={`/${locale}`} className={styles.logo}>
            <Logo theme={resolvedTheme} className={styles.logoIcon} />
          </Link>

          <div className={styles.rightSection}>
            <div className={styles.actions}>
              <LanguageSwitcher currentLocale={locale} />
              <ThemeSwitcher />

              <button
                onClick={handleProfileClick}
                className={styles.profileButton}
                aria-label="Profile"
              >
                {initials ? (
                  <span className={styles.initials}>{initials}</span>
                ) : (
                  <User size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        userName={user?.name}
        userPhone={user?.phone}
        documentNumber={user?.documentNumber ? String(user.documentNumber) : undefined}
        locale={locale}
      />
    </>
  );
};

