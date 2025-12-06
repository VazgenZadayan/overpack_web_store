'use client';

import { useTranslations } from 'next-intl';
import { Phone, Mail, CheckCircle2, Heart, Zap, Shield } from 'lucide-react';
import { Logo } from '@/shared/icons/Logo';
import { useTheme } from '@/shared/contexts/ThemeProvider';
import styles from './about.module.css';


export default function AboutPage() {
  const t = useTranslations('About');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const values = [
    {
      icon: CheckCircle2,
      title: t('values.quality.title'),
      text: t('values.quality.text'),
    },
    {
      icon: Heart,
      title: t('values.service.title'),
      text: t('values.service.text'),
    },
    {
      icon: Zap,
      title: t('values.speed.title'),
      text: t('values.speed.text'),
    },
    {
      icon: Shield,
      title: t('values.trust.title'),
      text: t('values.trust.text'),
    },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logoWrapper}>
            <Logo theme={isDark ? 'dark' : 'light'} className={styles.logo} />
          </div>
          <p className={styles.heroTagline}>{t('tagline')}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>{t('description')}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.missionCard}>
          <h2 className={styles.missionTitle}>{t('mission.title')}</h2>
          <p className={styles.missionText}>{t('mission.text')}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.valuesCard}>
          <h2 className={styles.valuesTitle}>{t('values.title')}</h2>
          <div className={styles.valuesList}>
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className={styles.valueItem}>
                  <div className={styles.valueIconWrapper}>
                    <IconComponent className={styles.valueIcon} />
                  </div>
                  <div className={styles.valueContent}>
                    <h3 className={styles.valueTitle}>{value.title}</h3>
                    <p className={styles.valueText}>{value.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.contactsCard}>
          <h2 className={styles.contactsTitle}>{t('contacts.title')}</h2>
          <div className={styles.contactsList}>
            <a href="tel:+37441919694" className={styles.contactItem}>
              <div className={styles.contactIconWrapper}>
                <Phone className={styles.contactIcon} />
              </div>
              <div className={styles.contactContent}>
                <h3 className={styles.contactLabel}>{t('contacts.phone')}</h3>
                <p className={styles.contactValue}>+374 41 919 694</p>
              </div>
            </a>
            <a href="mailto:info@overpack.am" className={styles.contactItem}>
              <div className={styles.contactIconWrapper}>
                <Mail className={styles.contactIcon} />
              </div>
              <div className={styles.contactContent}>
                <h3 className={styles.contactLabel}>{t('contacts.email')}</h3>
                <p className={styles.contactValue}>info@overpack.am</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
