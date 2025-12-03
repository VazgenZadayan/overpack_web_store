import { getTranslations } from 'next-intl/server';
import { CategoryList } from '@/components/categories/CategoryList';
import { Typography } from '@/shared/ui/Typography/Typography';
import styles from './categories.module.css';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getTranslations('CategoriesPage');

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h1" className={styles.title}>
          {t('title')}
        </Typography>
        <CategoryList language={lang} />
      </div>
    </div>
  );
}
