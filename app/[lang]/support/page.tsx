'use client';
import { useTranslations } from "next-intl";
import styles from "./support.module.css";

export default function SupportPage() {
  const t = useTranslations('support');

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.supportContent}>
          <h1 className={styles.title}>{t('title')}</h1>
          
          <p className={styles.description}>
            {t('description')}
          </p>

          <div className={styles.contactCards}>
            <div className={styles.contactCard}>
              <div className={styles.iconWrapper}>
                <svg 
                  className={styles.icon}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h2 className={styles.contactTitle}>{t('phone.title')}</h2>
              <a href="tel:+37441919694" className={styles.contactLink}>
                +374 41 919694
              </a>
              <p className={styles.contactNote}>{t('phone.note')}</p>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.iconWrapper}>
                <svg 
                  className={styles.icon}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h2 className={styles.contactTitle}>{t('email.title')}</h2>
              <a href="mailto:overpackhookahmarket@gmail.com" className={styles.contactLink}>
                overpackhookahmarket@gmail.com
              </a>
              <p className={styles.contactNote}>{t('email.note')}</p>
            </div>
          </div>

          <div className={styles.workingHours}>
            <h2 className={styles.workingHoursTitle}>{t('workingHours.title')}</h2>
            <p className={styles.workingHoursText}>{t('workingHours.text')}</p>
          </div>

          <div className={styles.additionalInfo}>
            <p>{t('additionalInfo')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

