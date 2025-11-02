import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // React Compiler configuration
  reactCompiler: {
    compilationMode: 'annotation',
  },

  // Cache components for better performance
  cacheComponents: true,

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },

  // Images configuration
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Turbopack configuration
  turbopack: {
    // Resolve aliases for Turbopack
    resolveAlias: {
      '@': './',
    },
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

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
