import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'th.bing.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bing.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tech505.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dlcdnwebimgs.asus.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  i18n: {
    locales: ['vi-VN'],
    defaultLocale: 'vi-VN',
  },
};

export default nextConfig;
