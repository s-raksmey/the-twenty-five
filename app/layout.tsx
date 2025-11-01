// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "./providers";
// or Navbar if you prefer the client-side version

export const metadata: Metadata = {
  title: "My App",
  description: "NextAuth + Drizzle + Turso",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}