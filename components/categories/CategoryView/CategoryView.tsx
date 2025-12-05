'use client';

import { useTranslations } from 'next-intl';
import { useSubCategories } from '@/lib/hooks/useSubCategories';
import { useBrands } from '@/lib/hooks/useBrands';
import { useCategories } from '@/lib/hooks/useCategories';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs';
import { SubCategoryList } from '../SubCategoryList/SubCategoryList';
import { BrandList } from '../BrandList/BrandList';
import { ProductList } from '@/components/products/ProductList/ProductList';
import { CategoryViewProps } from './types';

export function CategoryView({ language, categoryId, categorySlug }: CategoryViewProps) {
  const t = useTranslations('CategoriesPage');
  const { data: subCategoriesData, isError: isSubCategoriesError } = useSubCategories(
    categoryId.toString()
  );
  const { data: brandsData, isError: isBrandsError } = useBrands(
    categoryId.toString()
  );
  const { data: categoriesData } = useCategories();

  const subCategories = subCategoriesData?.data.subCategories || [];
  const brands = brandsData?.data.brands || [];
  const category = categoriesData?.data.categories.find((c) => c.id === categoryId);
  const categoryTitle = category?.title || '';

  if (subCategories.length > 0) {
    return (
      <SubCategoryList 
        language={language} 
        categoryId={categoryId}
        categorySlug={categorySlug}
      />
    );
  }

  if (brands.length > 0) {
    return (
      <BrandList 
        language={language} 
        categoryId={categoryId}
        categorySlug={categorySlug}
      />
    );
  }

  const breadcrumbsItems = [
    { label: t('title'), href: `/${language}/categories` },
    { label: categoryTitle, href: `/${language}/categories/${categorySlug}` },
  ];

  if (isSubCategoriesError || isBrandsError) {
    return (
      <>
        <Breadcrumbs items={breadcrumbsItems} locale={language} />
        <ProductList
          language={language}
          categoryId={categoryId.toString()}
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbsItems} locale={language} />
      <ProductList
        language={language}
        categoryId={categoryId.toString()}
      />
    </>
  );
}

