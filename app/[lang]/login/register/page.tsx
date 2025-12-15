'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { signIn, signUp } from '@/lib/api/auth';
import { useToastStore } from '@/stores/toast';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Logo } from '@/shared/icons/Logo';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useTheme } from '@/shared/contexts/ThemeProvider';
import { IRegistrationFormData, ISignUpRequest } from '@/shared/types/auth';
import { setAuthToken } from '@/utils/auth';
import styles from './register.module.css';

interface RegisterPageProps {
  params: Promise<{ lang: string }>;
}

const UserType = {
  USER: 1,
  BUSINESS: 2,
};

export default function RegisterPage({ params }: RegisterPageProps) {
  const { lang } = use(params);
  const t = useTranslations('Auth');
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const { resolvedTheme } = useTheme();
  const { control, watch } = useFormContext<IRegistrationFormData>();
  const phone = watch('phone');
  const userType = watch('type');
  const name = watch('name');
  const documentNumber = watch('documentNumber');
  
  const fullPhoneNumber = phone?.countryCode && phone?.phoneNumber
    ? `${phone.countryCode.replace('+', '')}${phone.phoneNumber}`
    : '';

  const isPartner = userType === UserType.BUSINESS;
  const isFormValid = isPartner 
    ? name && documentNumber 
    : name;

  const [animationData, setAnimationData] = useState<unknown | null>(null);

  useEffect(() => {
    let mounted = true;
    import('@/shared/lotties/enterName.json')
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

  const handleRegister = async () => {
    if (!fullPhoneNumber || !name) return;

    try {
      const signUpData: ISignUpRequest = {
        phone: fullPhoneNumber,
        name,
        type: userType,
        ...(isPartner && documentNumber ? { documentNumber } : {}),
      };

      await signUp(signUpData);
      
      const code = watch('code');
      if (!code) {
        showToast({
          message: t('phoneNumber.error.message'),
        });
        return;
      }

      const signInData = await signIn({ phone: fullPhoneNumber, code });
      await setAuthToken(signInData.data.token);
      router.replace(`/${lang}/categories`);
    } catch (error) {
      showToast({
        message: t('phoneNumber.error.message'),
      });
    }
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
              {isPartner ? t('partner.name.title') : t('client.name.title')}
            </Typography>
          </div>

          <div className={styles.formContent}>
            <div className={styles.formFields}>
              <Input
                name="name"
                control={control}
                placeholder={isPartner ? t('partner.name.placeholder') : t('client.name.placeholder')}
                required
              />

              {isPartner && (
                <Input
                  name="documentNumber"
                  control={control}
                  placeholder={t('partner.tin.placeholder')}
                  required
                  type="text"
                  inputMode="numeric"
                />
              )}
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

            <div className={styles.buttonWrapper}>
              <Button
                label={isPartner ? t('partner.name.register') : t('client.name.register')}
                variant="danger"
                onClick={handleRegister}
                isDisabled={!isFormValid}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}