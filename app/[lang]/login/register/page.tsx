'use client';

import { use } from 'react';
import { Typography } from '@/shared/ui/Typography/Typography';

interface RegisterPageProps {
  params: Promise<{ lang: string }>;
}

export default function RegisterPage({ params }: RegisterPageProps) {
  const { lang } = use(params);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Typography variant="h1">Register Page - Coming soon</Typography>
    </div>
  );
}

