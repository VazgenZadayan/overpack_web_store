'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { secureStorage } from '@/utils/storage';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default function HomePage({ params }: HomePageProps) {
  const router = useRouter();
  const { lang } = use(params);

  useEffect(() => {
    const token = secureStorage.getItem('token');
    
    if (token) {
      router.replace(`/${lang}/categories`);
    } else {
      router.replace(`/${lang}/login`);
    }
  }, [lang, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>Loading...</div>
    </div>
  );
}

