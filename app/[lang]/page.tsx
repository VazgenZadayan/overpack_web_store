import { redirect } from 'next/navigation';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}
export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  redirect(`/${lang}/categories/`);
}

