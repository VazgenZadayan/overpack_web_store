import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CategoryList } from '@/components/categories/CategoryList';
import styles from './categories.module.css';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className={styles.container}>
      <Header locale={lang} />
      <main className={styles.main}>
        <div className={styles.content}>
          <CategoryList language={lang} />
        </div>
      </main>
      <Footer locale={lang} />
    </div>
  );
}
