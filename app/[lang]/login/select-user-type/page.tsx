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
                {t('userType.title')}
              </Typography>
            </div>

            <div className="flex-1 flex flex-col space-y-4">
              <button
                onClick={() => handleUserTypeSelect(UserType.USER)}
                className="flex items-center justify-between p-4 rounded-2xl transition-all hover:opacity-80 active:opacity-60"
                style={{ backgroundColor: 'var(--color-gray)' }}
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
                className="flex items-center justify-between p-4 rounded-2xl transition-all hover:opacity-80 active:opacity-60"
                style={{ backgroundColor: 'var(--color-gray)' }}
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

              <div className="flex-1 flex items-center justify-center">
                <div className="w-64 h-48 flex items-center justify-center">
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
    </div>
  );
}
