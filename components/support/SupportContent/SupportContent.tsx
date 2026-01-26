'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Phone, Mail, Clock } from 'lucide-react';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs';
import { Typography } from '@/shared/ui/Typography/Typography';
import styles from './SupportContent.module.css';

export const SupportContent: React.FC = () => {
  const t = useTranslations('support');
  const tCategories = useTranslations('CategoriesPage');
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';

  const breadcrumbsItems = [
    {
      label: tCategories('title'),
      href: `/${lang}/categories`,
    },
    {
      label: t('title'),
      href: `/${lang}/support`,
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Breadcrumbs items={breadcrumbsItems} locale={lang} />
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <Typography variant="bodyMMed" className={styles.description}>
            {t('description')}
          </Typography>
        </div>

        <div className={styles.section}>
          <div className={styles.card}>
            <Typography variant="h3" className={styles.cardTitle}>
              {t('phone.title')}
            </Typography>
            <a href="tel:+37441919694" className={styles.contactItem}>
              <div className={styles.contactIconWrapper}>
                <Phone className={styles.contactIcon} />
              </div>
              <div className={styles.contactContent}>
                <Typography variant="bodyMSB" className={styles.contactLabel}>
                  {t('phone.title')}
                </Typography>
                <Typography variant="bodySMed" className={styles.contactValue}>
                  +374 41 919 694
                </Typography>
                <Typography variant="bodyXSMed" className={styles.contactNote}>
                  {t('phone.note')}
                </Typography>
              </div>
            </a>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.card}>
            <Typography variant="h3" className={styles.cardTitle}>
              {t('email.title')}
            </Typography>
            <a href="mailto:info@overpack.am" className={styles.contactItem}>
              <div className={styles.contactIconWrapper}>
                <Mail className={styles.contactIcon} />
              </div>
              <div className={styles.contactContent}>
                <Typography variant="bodyMSB" className={styles.contactLabel}>
                  {t('email.title')}
                </Typography>
                <Typography variant="bodySMed" className={styles.contactValue}>
                  info@overpack.am
                </Typography>
                <Typography variant="bodyXSMed" className={styles.contactNote}>
                  {t('email.note')}
                </Typography>
              </div>
            </a>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.card}>
            <Typography variant="h3" className={styles.cardTitle}>
              {t('workingHours.title')}
            </Typography>
            <div className={styles.workingHoursItem}>
              <div className={styles.workingHoursIconWrapper}>
                <Clock className={styles.workingHoursIcon} />
              </div>
              <Typography variant="bodySMed" className={styles.workingHoursText}>
                {t('workingHours.text')}
              </Typography>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.card}>
            <Typography variant="bodySMed" className={styles.additionalInfo}>
              {t('additionalInfo')}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

