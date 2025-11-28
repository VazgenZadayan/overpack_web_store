'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { useSendSMSToUserMutation } from '@/services/auth/auth';
import { showToast } from '@/store/toast/toast.slice';
import { Button } from '@/shared/ui/Button/Button';
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox';
import { PhoneInput } from '@/shared/ui/PhoneInput/PhoneInput';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Dialog } from '@/shared/ui/Dialog/Dialog';
import { Logo } from '@/shared/icons/Logo';
import { useTheme } from '@/shared/providers/ThemeProvider';

interface LoginFormData {
  phone: {
    countryCode: string;
    phoneNumber: string;
  };
  checkbox: boolean;
}

import { use } from 'react';

interface LoginPageProps {
  params: Promise<{ lang: string }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const { lang } = use(params);
  const { t } = useTranslation('Auth');
  const router = useRouter();
  const dispatch = useDispatch();
  const { resolvedTheme } = useTheme();
  const [sendSMSToUser, { isLoading }] = useSendSMSToUserMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'signin' | 'guest' | null>(null);

  const methods = useForm<LoginFormData>({
    defaultValues: {
      phone: {
        countryCode: '+374',
        phoneNumber: '',
      },
      checkbox: false,
    },
    mode: 'onChange',
  });

  const { watch, setValue, trigger } = methods;
  const phone = watch('phone');
  const checkbox = watch('checkbox');

  const phoneUtil = PhoneNumberUtil.getInstance();
  
  const fullPhoneNumber = phone?.countryCode && phone?.phoneNumber
    ? `${phone.countryCode}${phone.phoneNumber}`
    : '';
  
  const isValidPhone = fullPhoneNumber ? (() => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(fullPhoneNumber));
    } catch {
      return false;
    }
  })() : false;

  const handleSendSMSToUser = async () => {
    if (!phone?.countryCode || !phone?.phoneNumber) return;
    
    const phoneNumber = `${phone.countryCode.replace('+', '')}${phone.phoneNumber}`;
    
    try {
      await sendSMSToUser({ phone: phoneNumber }).unwrap();
      setIsDialogOpen(false);
      // Redirect to OTP page
      router.push(`/${lang}/login/otp`);
    } catch {
      setIsDialogOpen(false);
      dispatch(
        showToast({
          title: t('phoneNumber.error.title'),
          message: t('phoneNumber.error.message'),
        })
      );
    }
  };

  const handleSignIn = async () => {
    const isFirstStepValid = await trigger(['phone', 'checkbox']);
    if (isFirstStepValid) {
      setDialogAction('signin');
      setIsDialogOpen(true);
    }
  };

  const handleEnterAsGuest = () => {
    setDialogAction('guest');
    setIsDialogOpen(true);
  };

  const handleDialogOk = () => {
    if (dialogAction === 'signin') {
      handleSendSMSToUser();
    } else if (dialogAction === 'guest') {
      setIsDialogOpen(false);
      router.push(`/${lang}/categories`);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDialogAction(null);
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ 
        backgroundColor: 'var(--color-background)',
      }}
    >
      {/* White dots pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Header Section with Logo and Title */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-6 px-4">
        <Logo theme={resolvedTheme} className="h-16 w-auto mb-8" />
        <Typography 
          variant="h2" 
          className="text-center"
          style={{ color: 'var(--color-secondary-text)' }}
        >
          {t('phoneNumber.tagline')}
        </Typography>
      </div>

      {/* White Card with Form - positioned at bottom */}
      <div className="relative z-10 flex-1 flex items-end justify-center px-4 pb-0">
        <div className="w-full max-w-md">
          <div 
            className="rounded-t-3xl shadow-2xl px-6 pt-8 pb-2 flex flex-col"
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
                {t('phoneNumber.title')}
              </Typography>
              <Typography 
                variant="bodyLBold"
                className="mb-4"
                style={{ color: 'var(--color-secondary-text)' }}
              >
                {t('phoneNumber.subtitle')}
              </Typography>
            </div>

            <FormProvider {...methods}>
              <form 
                className="flex flex-col flex-1"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="space-y-10 flex-1">
                    <PhoneInput
                      name="phone"
                      control={methods.control}
                      placeholder={t('phoneNumber.placeholder')}
                      required
                    />

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <Checkbox
                        isChecked={checkbox}
                        onPress={() => {
                          setValue('checkbox', !checkbox, { shouldValidate: true });
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Typography 
                        variant="bodyXSMed"
                        style={{ 
                          color: 'var(--color-secondary-text)',
                          lineHeight: '1.5'
                        }}
                      >
                        {t('phoneNumber.termsPrefix')}
                        <Link
                          href={`/${lang}/privacy-policy`}
                          className="underline"
                          style={{ 
                            color: 'var(--color-main)',
                            textDecorationColor: 'var(--color-main)',
                            textUnderlineOffset: '2px'
                          }}
                        >
                          {t('phoneNumber.privacy')}
                        </Link>
                        {t('phoneNumber.termsSuffix')}
                        <Link
                          href={`/${lang}/terms-of-use`}
                          className="underline"
                          style={{ 
                            color: 'var(--color-main)',
                            textDecorationColor: 'var(--color-main)',
                            textUnderlineOffset: '2px'
                          }}
                        >
                          {t('phoneNumber.agreement')}
                        </Link>
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-auto pt-6">
                  <Button
                    label={t('phoneNumber.getCode')}
                    variant="danger"
                    onClick={handleSignIn}
                    isDisabled={!isValidPhone || !checkbox}
                    isLoading={isLoading}
                    className="w-full"
                  />
                  <Button
                    label={t('phoneNumber.enterAsGuest')}
                    variant="text"
                    onClick={handleEnterAsGuest}
                    className="w-full"
                  />
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>

      <Dialog isOpen={isDialogOpen} onClose={handleDialogClose}>
        <div className="flex flex-col">
          <Typography variant="h3" className="mb-4 text-center" style={{ color: 'var(--color-dark)' }}>
            {t('ageVerification.title')}
          </Typography>
          <Typography variant="bodyMMed" className="mb-6 text-center" style={{ color: 'var(--color-secondary-text)' }}>
            {t('ageVerification.helpText')}
          </Typography>
          <div className="flex flex-col gap-3">
            <Button
              label={t('ageVerification.okButton')}
              variant="danger"
              onClick={handleDialogOk}
            />
            <Button
              label={t('ageVerification.cancelButton')}
              variant="text"
              onClick={handleDialogClose}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

