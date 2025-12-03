 'use client';

import { useEffect, useState, useRef, startTransition, use } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import {
  useSendSMSToUserMutation,
  useSignInMutation,
  useVerifySMSMutation,
} from '@/services/auth/auth';
import { showToast } from '@/store/toast/toast.slice';
import { Button } from '@/shared/ui/Button/Button';
import { Typography } from '@/shared/ui/Typography/Typography';
import { OTPInput } from '@/shared/ui/OTPInput/OTPInput';
import { Logo } from '@/shared/icons/Logo';
import { useTheme } from '@/shared/providers/ThemeProvider';
import { IRegistrationFormData } from '@/services/auth/types';
import { setAuthToken } from '@/utils/auth';
import Lottie from 'lottie-react';
interface OTPPageProps {
  params: Promise<{ lang: string }>;
}

export default function OTPPage({ params }: OTPPageProps) {
  const { lang } = use(params);
  const t = useTranslations('Auth');
  const router = useRouter();
  const dispatch = useDispatch();
  const { resolvedTheme } = useTheme();
  const [timer, setTimer] = useState<number | false>(60);
  const [verifySMS] = useVerifySMSMutation();
  const [sendSMSToUser, { isLoading: isResending }] = useSendSMSToUserMutation();
  const [signIn] = useSignInMutation();
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
      const data = await verifySMS({ phone: fullPhoneNumber, code }).unwrap();
      
      if (data.data.userExists) {
        try {
          const signInData = await signIn({ phone: fullPhoneNumber, code }).unwrap();
          await setAuthToken(signInData.data.token);
          router.replace(`/${lang}/categories`);
        } catch {
          setHasError(true);
          errorTimeoutRef.current = setTimeout(() => {
            setHasError(false);
            errorTimeoutRef.current = null;
          }, 2000);
          dispatch(
            showToast({
              title: t('phoneNumber.error.title'),
              message: t('phoneNumber.error.message'),
            })
          );
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
      dispatch(
        showToast({
          title: t('phoneNumber.error.title'),
          message: t('phoneNumber.error.message'),
        })
      );
    }
  };

  const handleResendSMS = async () => {
    if (!fullPhoneNumber) return;

    try {
      await sendSMSToUser({ phone: fullPhoneNumber }).unwrap();
      setTimer(60);
    } catch {
      dispatch(
        showToast({
          title: t('phoneNumber.error.title'),
          message: t('phoneNumber.error.message'),
        })
      );
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ 
        backgroundColor: 'var(--color-background)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center pt-6 px-4">
        <Logo theme={resolvedTheme} className="h-16 w-auto mb-8" />
      </div>

      <div className="relative z-10 flex-1 flex items-end justify-center px-4 pb-0">
        <div className="w-full max-w-md">
          <div 
            className="rounded-t-3xl shadow-2xl px-6 pt-8 pb-8 flex flex-col"
            style={{ 
              backgroundColor: 'var(--color-white)',
              minHeight: '65vh'
            }}
          >
            <div className="mb-6">
              <Typography
                variant="h3" 
                style={{ color: 'var(--color-dark)' }}
              >
                {t('smsCode.title')}
              </Typography>
              <Typography 
                variant="bodyLBold"
                className="mb-4"
                style={{ color: 'var(--color-secondary-text)' }}
              >
                {t('smsCode.subtitle')}
              </Typography>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
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

              <div className="w-48 h-48 flex items-center justify-center">
                {animationData ? (
                  <Lottie
                    animationData={animationData}
                    loop
                    autoplay
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : null}
              </div>

              <div className="text-center">
                {timer ? (
                  <div className="flex items-center justify-center gap-2">
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
    </div>
  );
}
