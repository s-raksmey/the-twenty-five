// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@libsql/client'],
  },
  env: {
    TURSO_CONNECTION_URL: process.env['TURSO_CONNECTION_URL'],
    TURSO_AUTH_TOKEN: process.env['TURSO_AUTH_TOKEN'],
  },
};

export default nextConfig;
