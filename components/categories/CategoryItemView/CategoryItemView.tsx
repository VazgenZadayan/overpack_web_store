'use client';

import { useTranslations } from 'next-intl';
import { useSubCategories } from '@/lib/hooks/useSubCategories';
import { useBrands } from '@/lib/hooks/useBrands';
import { useCategories } from '@/lib/hooks/useCategories';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs';
import { ProductList } from '@/components/products/ProductList/ProductList';
import { CategoryItemViewProps } from './types';

export function CategoryItemView({
  language,
  categoryId,
  itemId,
  categorySlug,
  itemSlug,
}: CategoryItemViewProps) {
  const t = useTranslations('CategoriesPage');
  const { data: subCategoriesData } = useSubCategories(
    categoryId ? categoryId.toString() : null
  );
  const { data: brandsData } = useBrands(
    categoryId ? categoryId.toString() : null
  );
  const { data: categoriesData } = useCategories();

  const subCategory = subCategoriesData?.data.subCategories.find((s) => s.id === itemId);
  const brand = brandsData?.data.brands.find((b) => b.id === itemId);
  const item = subCategory || brand;
  const category = categoriesData?.data.categories.find((c) => c.id === categoryId);
  const categoryTitle = category?.title || '';

  if (!item) {
    return null;
  }

  const breadcrumbsItems = [
    { label: t('title'), href: `/${language}/categories` },
    { label: categoryTitle, href: `/${language}/categories/${categorySlug}` },
    { label: item.title, href: `/${language}/categories/${categorySlug}/${itemSlug}` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbsItems} locale={language} />

      <ProductList
        language={language}
        categoryId={categoryId.toString()}
        subCategoryId={subCategory ? itemId.toString() : undefined}
        brandId={brand ? itemId.toString() : undefined}
      />
    </>
  );
}

