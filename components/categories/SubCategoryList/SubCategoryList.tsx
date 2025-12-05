'use client';

import { useTranslations } from 'next-intl';
import { useSubCategories } from '@/lib/hooks/useSubCategories';
import { useCategories } from '@/lib/hooks/useCategories';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs';
import { CategoryCard } from '../CategoryList/CategoryCard/CategoryCard';
import { SubCategoryListProps } from './types';
import styles from './SubCategoryList.module.css';

export function SubCategoryList({ language, categoryId, categorySlug }: SubCategoryListProps) {
  const t = useTranslations('CategoriesPage');
  const { data: subCategoriesData } = useSubCategories(categoryId.toString());
  const { data: categoriesData } = useCategories();
  const subCategories = subCategoriesData?.data.subCategories || [];
  const category = categoriesData?.data.categories.find((c) => c.id === categoryId);
  const categoryTitle = category?.title || '';

  const breadcrumbsItems = [
    { label: t('title'), href: `/${language}/categories` },
    { label: categoryTitle, href: `/${language}/categories/${categorySlug}` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbsItems} locale={language} />
      <div className={styles.grid}>
        {subCategories.map((subCategory) => (
          <CategoryCard
            key={subCategory.id}
            id={subCategory.id}
            title={subCategory.title}
            image={subCategory.image}
            brands={subCategory.brands}
            subCategories={subCategory.subCategories}
            locale={language}
            subCategoryId={subCategory.id}
            parentCategorySlug={categorySlug}
          />
        ))}
      </div>
    </>
  );
}

