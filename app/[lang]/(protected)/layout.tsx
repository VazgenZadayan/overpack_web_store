import { Header } from '@/components/layout/Header/Header';

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
    </>
  );
}

