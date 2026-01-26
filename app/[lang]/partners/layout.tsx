import { Header } from '@/components/layout/Header/Header';

interface PartnersLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function PartnersLayout({ 
  children,
  params 
}: PartnersLayoutProps) {
  const { lang } = await params;

  return (
    <>
      <Header locale={lang} />
      {children}
    </>
  );
}




