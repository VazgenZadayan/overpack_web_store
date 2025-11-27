'use client';

import { Typography } from '@/shared/ui/Typography/Typography';

export default function CategoriesPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ 
        backgroundColor: 'var(--color-background)',
      }}
    >
      <div className="text-center px-4">
        <Typography
          variant="h1"
          style={{ color: 'var(--color-dark)' }}
        >
          Категории
        </Typography>
        <Typography
          variant="bodyMMed"
          className="mt-4"
          style={{ color: 'var(--color-secondary-text)' }}
        >
          Страница категорий будет добавлена позже
        </Typography>
      </div>
    </div>
  );
}

