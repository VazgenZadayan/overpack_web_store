import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://overpack.am';
  const languages = ['en', 'hy', 'ru'];

  const routes = [
    '',
    '/login',
    '/categories',
    '/privacy-policy',
    '/terms-of-use',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  languages.forEach((lang) => {
    routes.forEach((route) => {
      const langPath = lang === 'en' ? '' : `/${lang}`;
      const url = `${baseUrl}${langPath}${route}/`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            'en': lang === 'en' ? url : `${baseUrl}${route}/`,
            'hy': lang === 'hy' ? url : `${baseUrl}/hy${route}/`,
            'ru': lang === 'ru' ? url : `${baseUrl}/ru${route}/`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}

