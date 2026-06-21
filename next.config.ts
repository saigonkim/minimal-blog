import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'x-vercel-skip-toolbar',
            value: '1',
          },
          {
            key: 'Content-Type',
            value: 'application/xml; charset=utf-8',
          },
        ],
      },
      {
        source: '/feed.xml',
        headers: [
          {
            key: 'x-vercel-skip-toolbar',
            value: '1',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
