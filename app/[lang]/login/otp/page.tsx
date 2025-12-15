 'use client';

import { useEffect, useState, useRef, startTransition, use } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { sendSMSToUser, signIn, verifySMS } from '@/lib/api/auth';
import { useToastStore } from '@/stores/toast';
import { Button } from '@/shared/ui/Button/Button';
import { Typography } from '@/shared/ui/Typography/Typography';
import { OTPInput } from '@/shared/ui/OTPInput/OTPInput';
import { Logo } from '@/shared/icons/Logo';
import { useTheme } from '@/shared/contexts/ThemeProvider';
import { IRegistrationFormData } from '@/shared/types/auth';
import { setAuthToken } from '@/utils/auth';
import Lottie from 'lottie-react';
import styles from './otp.module.css';
interface OTPPageProps {
  params: Promise<{ lang: string }>;
}

export default function OTPPage({ params }: OTPPageProps) {
  const { lang } = use(params);
  const t = useTranslations('Auth');
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const { resolvedTheme } = useTheme();
  const [timer, setTimer] = useState<number | false>(60);
  const [isResending, setIsResending] = useState(false);
  const { setValue, watch } = useFormContext<IRegistrationFormData>();
  const [phoneRestored, setPhoneRestored] = useState(false);
  const [hasError, setHasError] = useState(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [animationData, setAnimationData] = useState<unknown | null>(null);
  
  useEffect(() => {
    const phone = watch('phone');
    if (!phone?.countryCode || !phone?.phoneNumber) {
      const savedPhone = typeof window !== 'undefined' 
        ? sessionStorage.getItem('registration_phone')
        : null;
      if (savedPhone) {
        try {
          const parsedPhone = JSON.parse(savedPhone);
          setValue('phone', parsedPhone, { shouldValidate: false });
          startTransition(() => {
            setPhoneRestored(true);
          });
        } catch {
          startTransition(() => {
            setPhoneRestored(true);
          });
        }
      } else {
        startTransition(() => {
          setPhoneRestored(true);
        });
      }
    } else {
      startTransition(() => {
        setPhoneRestored(true);
      });
    }
  }, [setValue, watch]);

  useEffect(() => {
    let mounted = true;
    import('@/shared/lotties/smsLottie.json')
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
  
  const phone = watch('phone');
  const fullPhoneNumber = phone?.countryCode && phone?.phoneNumber
    ? `${phone.countryCode.replace('+', '')}${phone.phoneNumber}`
    : '';

  useEffect(() => {
    if (!phoneRestored) return;
    
    
    if (!fullPhoneNumber) {
      router.push(`/${lang}/login`);
      return;
    }

    const intervalId = setInterval(() => {
      setTimer(prevSeconds => {
        if (typeof prevSeconds === 'number' && prevSeconds !== 0) {
          return prevSeconds - 1;
        } else return false;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [fullPhoneNumber, lang, router, phoneRestored, phone]);

  const handleVerifySMS = async (code: string) => {
    if (!fullPhoneNumber) return;

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
    
    setHasError(false);
    try {
      const data = await verifySMS({ phone: fullPhoneNumber, code });
      
      if (data.data.userExists) {
        try {
          const signInData = await signIn({ phone: fullPhoneNumber, code });
          await setAuthToken(signInData.data.token);
          router.replace(`/${lang}/categories`);
        } catch {
          setHasError(true);
          errorTimeoutRef.current = setTimeout(() => {
            setHasError(false);
            errorTimeoutRef.current = null;
          }, 2000);
          showToast({
            message: t('phoneNumber.error.message'),
          });
        }
      } else {
        setValue('code', code);
        router.push(`/${lang}/login/select-user-type`);
      }
    } catch {
      setHasError(true);
      errorTimeoutRef.current = setTimeout(() => {
        setHasError(false);
        errorTimeoutRef.current = null;
      }, 2000);
      showToast({
        message: t('smsCode.error.message'),
      });
    }
  };

  const handleResendSMS = async () => {
    if (!fullPhoneNumber) return;

    setIsResending(true);
    try {
      await sendSMSToUser({ phone: fullPhoneNumber });
      setTimer(60);
    } catch {
      showToast({
        message: t('phoneNumber.error.message'),
      });
    } finally {
      setIsResending(false);
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
              {t('smsCode.title')}
            </Typography>
            <Typography 
              variant="bodyLBold"
              className={styles.formSubtitle}
              style={{ color: 'var(--color-secondary-text)' }}
            >
              {t('smsCode.subtitle')}
            </Typography>
          </div>

          <div className={styles.formBody}>
            <div className={styles.otpWrapper}>
              <OTPInput
                length={6}
                autoFocus
                onFilled={handleVerifySMS}
                onInputChange={() => {
                  if (errorTimeoutRef.current) {
                    clearTimeout(errorTimeoutRef.current);
                    errorTimeoutRef.current = null;
                  }
                  if (hasError) {
                    setHasError(false);
                  }
                }}
                hasError={hasError}
              />
            </div>

            <div className={styles.lottieWrapper}>
              {animationData ? (
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              ) : null}
            </div>

            <div className={styles.timerWrapper}>
              {timer ? (
                <div className={styles.timerContent}>
                  <Typography
                    variant="bodyLSB"
                    style={{ color: 'var(--color-secondary-text)' }}
                  >
                    {t('smsCode.resendTimer')}
                  </Typography>
                  <Typography
                    variant="bodyLSB"
                    style={{ color: 'var(--color-main)' }}
                  >
                    {String(timer)}
                  </Typography>
                </div>
              ) : (
                <Button
                  label={t('smsCode.resendButton')}
                  variant="danger"
                  onClick={handleResendSMS}
                  isLoading={isResending}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
