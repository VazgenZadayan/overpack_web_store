'use client';

import { RegistrationFormProvider } from '@/shared/contexts/RegistrationFormContext';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RegistrationFormProvider>{children}</RegistrationFormProvider>;
}

