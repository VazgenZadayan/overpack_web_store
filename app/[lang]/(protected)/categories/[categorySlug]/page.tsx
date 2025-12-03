import { extractIdFromSlug } from '@/utils/slug';
import { CategoryView } from '@/components/categories/CategoryView';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: string; categorySlug: string }>;
}) {
  const { lang, categorySlug } = await params;
  const categoryId = extractIdFromSlug(categorySlug);

  if (!categoryId) {
    return (
      <div>
        <p>Invalid category</p>
      </div>
    );
  }

  return (
    <CategoryView
      language={lang}
      categoryId={categoryId}
      categorySlug={categorySlug}
    />
  );
}
