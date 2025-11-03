// lib/env.ts
export const env = {
  GOOGLE_CLIENT_ID: process.env['GOOGLE_CLIENT_ID']!,
  GOOGLE_CLIENT_SECRET: process.env['GOOGLE_CLIENT_SECRET']!,
  NEXTAUTH_SECRET: process.env['NEXTAUTH_SECRET']!,
  NEXTAUTH_URL: process.env['NEXTAUTH_URL']!,
  TURSO_CONNECTION_URL: process.env['TURSO_CONNECTION_URL']!,
  TURSO_AUTH_TOKEN: process.env['TURSO_AUTH_TOKEN']!,
};
