'use client';

import { use } from 'react';
import { Typography } from '@/shared/ui/Typography/Typography';

interface OTPPageProps {
  params: Promise<{ lang: string }>;
}

export default function OTPPage({ params }: OTPPageProps) {
  const { lang } = use(params);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Typography variant="h1">OTP Page - Coming soon</Typography>
    </div>
  );
}

