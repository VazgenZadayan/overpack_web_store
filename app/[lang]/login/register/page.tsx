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
                {isPartner ? t('partner.name.title') : t('client.name.title')}
              </Typography>
            </div>

            <div className="flex-1 flex flex-col space-y-6">
              <div className="space-y-4">
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

              <div className="flex-1 flex items-center justify-center">
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
              </div>

              <div className="mt-auto pt-6">
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
    </div>
  );
}