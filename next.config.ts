import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Explicitly disable React Compiler - moved to top level in Next.js 16
  reactCompiler: false,
  
  // Disable experimental features that might trigger compiler
  experimental: {
    // Ensure no experimental compiler features are enabled
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },

  // Headers configuration
  async headers() {
    return [
      {
        source: '/service-worker.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
};

export default nextConfig;