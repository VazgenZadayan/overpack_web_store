'use client';

import { useCategories } from '@/lib/hooks/useCategories';
import { CategoryCard } from './CategoryCard';
import { Typography } from '@/shared/ui/Typography/Typography';
import styles from './CategoryList.module.css';

interface CategoryListProps {
  language: string;
}

export function CategoryList({ language }: CategoryListProps) {
  const { data, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Typography variant="bodyMMed">Loading...</Typography>
      </div>
    );
  }

  const categories = data?.data.categories || [];

  if (categories.length === 0) {
    return (
      <div className={styles.empty}>
        <Typography variant="bodyMMed" textAlign="center">
          No categories found
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          id={category.id}
          title={category.title}
          image={category.image}
          brands={category.brands}
          subCategories={category.subCategories}
          locale={language}
        />
      ))}
    </div>
  );
}

