'use client';

import { useState, use } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { sendSMSToUser } from '@/lib/api/auth';
import { useToastStore } from '@/stores/toast';
import { Button } from '@/shared/ui/Button/Button';
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox';
import { PhoneInput } from '@/shared/ui/PhoneInput/PhoneInput';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Dialog } from '@/shared/ui/Dialog/Dialog';
import { Logo } from '@/shared/icons/Logo';
import { useTheme } from '@/shared/contexts/ThemeProvider';
import { IRegistrationFormData } from '@/shared/types/auth';
import styles from './login.module.css';

interface LoginPageProps {
  params: Promise<{ lang: string }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const { lang } = use(params);
  const t = useTranslations('Auth');
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const { resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'signin' | null>(null);

  const formContext = useFormContext<IRegistrationFormData>();
  const { watch, setValue, trigger } = formContext;
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
    if (!phone?.countryCode || !phone?.phoneNumber) {
      return;
    }
    
    const phoneNumber = `${phone.countryCode.replace('+', '')}${phone.phoneNumber}`;
    
    setIsLoading(true);
    try {
      await sendSMSToUser({ phone: phoneNumber });
      setValue('phone', phone, { shouldValidate: false });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('registration_phone', JSON.stringify(phone));
      }
      setIsDialogOpen(false);
      
      const otpPath = `/${lang}/login/otp`;
      router.replace(otpPath);
    } catch {
      setIsDialogOpen(false);
      showToast({
        message: t('phoneNumber.error.message'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    const isFirstStepValid = await trigger(['phone', 'checkbox']);
    if (isFirstStepValid) {
      setDialogAction('signin');
      setIsDialogOpen(true);
    }
  };

  const handleDialogOk = async () => {
    if (dialogAction === 'signin') {
      await handleSendSMSToUser();
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDialogAction(null);
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
              {t('phoneNumber.title')}
            </Typography>
            <Typography 
              variant="bodyLBold"
              className={styles.formSubtitle}
              style={{ color: 'var(--color-secondary-text)' }}
            >
              {t('phoneNumber.subtitle')}
            </Typography>
          </div>

          <form 
            className={styles.formContent}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={styles.formFields}>
              <PhoneInput
                name="phone"
                control={formContext.control}
                placeholder={t('phoneNumber.placeholder')}
                required
              />

              <div className={styles.checkboxWrapper}>
                <div className="mt-0.5 flex-shrink-0">
                  <Checkbox
                    isChecked={checkbox}
                    onPress={() => {
                      setValue('checkbox', !checkbox, { shouldValidate: true });
                    }}
                  />
                </div>
                <div className={styles.checkboxText}>
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

            <div className={styles.buttonWrapper}>
              <Button
                label={t('phoneNumber.getCode')}
                variant="danger"
                onClick={handleSignIn}
                isDisabled={!isValidPhone || !checkbox}
                isLoading={isLoading}
                className="w-full"
              />
            </div>
          </form>
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

