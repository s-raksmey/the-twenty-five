// components/Navbar.tsx
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          MyApp
        </Link>

        <div className="flex gap-4 items-center">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          {status === 'loading' ? (
            <span className="text-sm">Loading…</span>
          ) : session ? (
            <>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}