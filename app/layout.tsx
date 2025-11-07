// app/layout.tsx
import type { Metadata } from 'next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ThemeToggle from '@/components/ThemeToggle';

import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'THE TWENTY FIVE',
  description: 'NextAuth + Drizzle + Turso',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans">
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
