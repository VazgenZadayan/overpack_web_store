'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Heart, Zap, Shield, Phone, Mail } from 'lucide-react';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs';
import { Typography } from '@/shared/ui/Typography/Typography';
import styles from './AboutContent.module.css';

export const AboutContent: React.FC = () => {
  const t = useTranslations('About');
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
      href: `/${lang}/about`,
    },
  ];

  const values = [
    { icon: CheckCircle2, title: t('values.quality.title'), text: t('values.quality.text') },
    { icon: Heart, title: t('values.service.title'), text: t('values.service.text') },
    { icon: Zap, title: t('values.speed.title'), text: t('values.speed.text') },
    { icon: Shield, title: t('values.trust.title'), text: t('values.trust.text') },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Breadcrumbs items={breadcrumbsItems} locale={lang} />
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.description}>
            <strong>Overpack</strong> {t('description')}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.card}>
            <Typography variant="h3" className={styles.cardTitle}>
              {t('mission.title')}
            </Typography>
            <Typography variant="bodySMed" className={styles.cardText}>
              {t('mission.text')}
            </Typography>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.card}>
            <Typography variant="h3" className={styles.cardTitle}>
              {t('values.title')}
            </Typography>
            <div className={styles.valuesList}>
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className={styles.valueItem}>
                    <div className={styles.valueIconWrapper}>
                      <IconComponent className={styles.valueIcon} />
                    </div>
                    <div className={styles.valueContent}>
                      <Typography variant="bodyMSB" className={styles.valueTitle}>
                        {value.title}
                      </Typography>
                      <Typography variant="bodySMed" className={styles.valueText}>
                        {value.text}
                      </Typography>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.card}>
            <Typography variant="h3" className={styles.cardTitle}>
              {t('contacts.title')}
            </Typography>
            <div className={styles.contactsList}>
              <a href="tel:+37441919694" className={styles.contactItem}>
                <div className={styles.contactIconWrapper}>
                  <Phone className={styles.contactIcon} />
                </div>
                <div className={styles.contactContent}>
                  <Typography variant="bodyMSB" className={styles.contactLabel}>
                    {t('contacts.phone')}
                  </Typography>
                  <Typography variant="bodySMed" className={styles.contactValue}>
                    +374 41 919 694
                  </Typography>
                </div>
              </a>
              <a href="mailto:info@overpack.am" className={styles.contactItem}>
                <div className={styles.contactIconWrapper}>
                  <Mail className={styles.contactIcon} />
                </div>
                <div className={styles.contactContent}>
                  <Typography variant="bodyMSB" className={styles.contactLabel}>
                    {t('contacts.email')}
                  </Typography>
                  <Typography variant="bodySMed" className={styles.contactValue}>
                    info@overpack.am
                  </Typography>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

