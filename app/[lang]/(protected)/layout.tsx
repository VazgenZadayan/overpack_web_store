import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function ProtectedLayout({ 
  children,
  params 
}: ProtectedLayoutProps) {
  const { lang } = await params;

  return (
    <>
      <Header locale={lang} />
      {children}
      <Footer locale={lang} />
    </>
  );
}

