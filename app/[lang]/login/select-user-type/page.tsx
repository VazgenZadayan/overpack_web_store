'use client';

import { use } from 'react';
import { Typography } from '@/shared/ui/Typography/Typography';

interface SelectUserTypePageProps {
  params: Promise<{ lang: string }>;
}

export default function SelectUserTypePage({ params }: SelectUserTypePageProps) {
  const { lang } = use(params);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Typography variant="h1">Select User Type Page - Coming soon</Typography>
    </div>
  );
}

