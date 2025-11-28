import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
    let lang = 'en';
  if (acceptLanguage.includes('hy') || acceptLanguage.includes('am')) {
    lang = 'hy';
  } else if (acceptLanguage.includes('ru')) {
    lang = 'ru';
  }
  
  redirect(`/${lang}/`);
}

