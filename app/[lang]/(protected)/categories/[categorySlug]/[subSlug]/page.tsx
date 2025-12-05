import { extractIdFromSlug } from '@/utils/slug';
import { CategoryItemView } from '@/components/categories/CategoryItemView/CategoryItemView';
import styles from '../../categories.module.css';

export default async function CategoryItemPage({
  params,
}: {
  params: Promise<{ lang: string; categorySlug: string; subSlug: string }>;
}) {
  const { lang, categorySlug, subSlug } = await params;
  const categoryId = extractIdFromSlug(categorySlug);
  const itemId = extractIdFromSlug(subSlug);

  if (!categoryId || !itemId) return null;

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.content}>
          <CategoryItemView
            language={lang}
            categoryId={categoryId}
            itemId={itemId}
            categorySlug={categorySlug}
            itemSlug={subSlug}
          />
        </div>
      </div>
    </div>
  );
}
