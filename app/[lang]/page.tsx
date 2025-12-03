import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}
export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (token) {
    redirect(`/${lang}/categories/`);
  } else {
    redirect(`/${lang}/login/`);
  }
}

