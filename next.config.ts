import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.overpack.am",
          },
        ],
        destination: "https://overpack.am/:path*/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "https://www.overpack.am",
          },
        ],
        destination: "https://overpack.am/:path*/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "http://overpack.am",
          },
        ],
        destination: "https://overpack.am/:path*/",
        permanent: true,
      },
    ];
  },
  trailingSlash: true,
  allowedDevOrigins: [
    'http://192.168.1.209:4230',
    'http://localhost:4230',
  ],
};

export default withNextIntl(nextConfig);
