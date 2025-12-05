import { extractIdFromSlug } from '@/utils/slug';
import { CategoryView } from '@/components/categories/CategoryView/CategoryView';
import { FloatingCart } from '@/components/cart/FloatingCart/FloatingCart';
import styles from '../categories.module.css';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: string; categorySlug: string }>;
}) {
  const { lang, categorySlug } = await params;
  const categoryId = extractIdFromSlug(categorySlug) || 0;

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.content}>
          <CategoryView 
            language={lang} 
            categoryId={categoryId}
            categorySlug={categorySlug}
          />
        </div>
      </div>
      <FloatingCart />
    </div>
  );
}

