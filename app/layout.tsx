// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ThemeToggle from '@/components/ThemeToggle';

import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'T-VX',
  description: 'NextAuth + Drizzle + Turso',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
          <Footer />
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}
