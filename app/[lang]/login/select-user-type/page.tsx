'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Logo } from '@/shared/icons/Logo';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useTheme } from '@/shared/contexts/ThemeProvider';
import { IRegistrationFormData } from '@/shared/types/auth';
import styles from './select-user-type.module.css';

interface SelectUserTypePageProps {
  params: Promise<{ lang: string }>;
}

const UserType = {
  USER: 1,
  BUSINESS: 2,
};

export default function SelectUserTypePage({ params }: SelectUserTypePageProps) {
  const { lang } = use(params);
  const t = useTranslations('Auth');
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { setValue, resetField } = useFormContext<IRegistrationFormData>();

  const [animationData, setAnimationData] = useState<unknown | null>(null);

  useEffect(() => {
    let mounted = true;
    import('@/shared/lotties/userTypeLottie.json')
      .then((m) => {
        if (!mounted) return;
        const payload = (m as unknown as { default?: unknown }).default ?? (m as unknown);
        setAnimationData(payload);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const handleUserTypeSelect = (type: number) => {
    setValue('type', type as 1 | 2);
    resetField('name');
    resetField('documentNumber');
    router.push(`/${lang}/login/register`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <Logo theme={resolvedTheme} className={`h-16 w-auto mb-8 ${styles.logo}`} />
        <Typography 
          variant="h2" 
          className={`text-center ${styles.tagline}`}
          style={{ color: 'var(--color-secondary-text)' }}
        >
          {t('phoneNumber.tagline')}
        </Typography>
      </div>

      <div className={styles.formSectionMobile}>
        <div className={styles.formCardMobile}>
          <div className={styles.formTitle}>
            <Typography
              variant="h3" 
              style={{ color: 'var(--color-dark)' }}
            >
              {t('userType.title')}
            </Typography>
          </div>

          <div className={styles.formContent}>
            <div className={styles.buttonsWrapper}>
              <button
                onClick={() => handleUserTypeSelect(UserType.USER)}
                className={styles.userTypeButton}
              >
                <Typography
                  variant="bodyLBold"
                  style={{ color: 'var(--color-dark)' }}
                >
                  {t('userType.personal')}
                </Typography>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-icon)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <button
                onClick={() => handleUserTypeSelect(UserType.BUSINESS)}
                className={styles.userTypeButton}
              >
                <Typography
                  variant="bodyLBold"
                  style={{ color: 'var(--color-dark)' }}
                >
                  {t('userType.business')}
                </Typography>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-icon)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            <div className={styles.lottieWrapper}>
              <div className={styles.lottieContainer}>
                {animationData ? (
                  <Lottie
                    animationData={animationData}
                    loop
                    autoplay
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
