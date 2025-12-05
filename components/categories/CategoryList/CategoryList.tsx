'use client';

import { useCategories } from '@/lib/hooks/useCategories';
import { CategoryCard } from './CategoryCard/CategoryCard';
import { CategoryListProps } from './types';
import styles from './CategoryList.module.css';

export function CategoryList({ language }: CategoryListProps) {
  const { data } = useCategories();
  const categories = data?.data.categories || [];

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

