export interface CategoryCardProps {
  id: number;
  title: string;
  image: string;
  brands: number;
  subCategories: number;
  locale: string;
  subCategoryId?: number;
  parentCategorySlug?: string;
}

