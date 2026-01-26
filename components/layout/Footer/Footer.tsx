'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/shared/contexts/ThemeProvider';
import { Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { LogoMini } from '@/shared/icons/LogoMini';
import { getDeviceType } from '@/utils/device';
import { FooterProps } from './types';
import styles from './Footer.module.css';

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  const t = useTranslations('Footer');
  const { resolvedTheme } = useTheme();
  const deviceType = typeof window !== 'undefined' ? getDeviceType() : 'desktop';

  const currentYear = new Date().getFullYear();
  const logoTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href={`/${locale}`} className={styles.logoLink}>
            <LogoMini theme={logoTheme} className={styles.logo} />
          </Link>
        </div>

        <div className={styles.content}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t('contacts')}</h3>
            <div className={styles.contactList}>
              <a href="tel:+37441919694" className={styles.contactItem}>
                <Phone size={18} className={styles.contactIcon} />
                <span>+374 41 91 96 94</span>
              </a>
              <a href="mailto:info@overpack.am" className={styles.contactItem}>
                <Mail size={18} className={styles.contactIcon} />
                <span>info@overpack.am</span>
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t('legal')}</h3>
            <nav className={styles.linkList}>
              <Link href={`/${locale}/about`} className={styles.linkItem}>
                {t('aboutUs')}
              </Link>
              <Link href={`/${locale}/support`} className={styles.linkItem}>
                {t('support')}
              </Link>
              <Link href={`/${locale}/privacy-policy`} className={styles.linkItem}>
                {t('privacyPolicy')}
              </Link>
              <Link href={`/${locale}/terms-of-use`} className={styles.linkItem}>
                {t('termsOfUse')}
              </Link>
            </nav>
          </div>

          <div className={styles.column}>
            {(deviceType === 'ios' || deviceType === 'android') && (
              <>
                <h3 className={styles.columnTitle}>{t('downloadApp')}</h3>
                <div className={styles.appSection}>
                  {deviceType === 'ios' && (
                    <a
                      href="https://apps.apple.com/am/app/overpack/id6749855441"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.appLink}
                    >
                      <Image
                        src="/assets/app_store.svg"
                        alt="Download on the App Store"
                        width={120}
                        height={40}
                        className={styles.appBadge}
                      />
                    </a>
                  )}
                  {deviceType === 'android' && (
                    <a
                      href="https://play.google.com/store/apps/details?id=com.overpack"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.appLink}
                    >
                      <Image
                        src="/assets/google_play.png"
                        alt="Get it on Google Play"
                        width={135}
                        height={40}
                        className={styles.appBadge}
                      />
                    </a>
                  )}
                </div>
              </>
            )}
            <h3 className={styles.columnTitle}>{t('followUs')}</h3>
            <div className={styles.socialSection}>
              <a
                href="https://www.facebook.com/share/1C6B4czDW9/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialItem} ${styles.facebook}`}
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/overpack.am"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialItem} ${styles.instagram}`}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {currentYear} Overpack. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};
