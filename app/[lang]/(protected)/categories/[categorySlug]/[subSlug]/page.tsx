import { extractIdFromSlug } from '@/utils/slug';
import { SubCategoryOrBrandView } from '@/components/products/SubCategoryOrBrandView';

export default async function SubCategoryOrBrandPage({
  params,
}: {
  params: Promise<{ lang: string; categorySlug: string; subSlug: string }>;
}) {
  const { lang, categorySlug, subSlug } = await params;
  const categoryId = extractIdFromSlug(categorySlug);
  const subId = extractIdFromSlug(subSlug);

  if (!categoryId || !subId) {
    return (
      <div>
        <p>Invalid category or subcategory/brand</p>
      </div>
    );
  }

  return (
    <SubCategoryOrBrandView
      language={lang}
      categoryId={categoryId}
      categorySlug={categorySlug}
      subId={subId}
      subSlug={subSlug}
    />
  );
}
