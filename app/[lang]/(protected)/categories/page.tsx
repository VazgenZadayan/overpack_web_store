import { CategoryList } from '@/components/categories/CategoryList/CategoryList';
import { FloatingCart } from '@/components/cart/FloatingCart/FloatingCart';
import styles from './categories.module.css';
import { Footer } from '@/components/layout/Footer/Footer';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.content}>
          <CategoryList language={lang} />
        </div>
      </div>
      <FloatingCart />
    </div>
      <Footer locale={lang} />
      </>
  );
}
