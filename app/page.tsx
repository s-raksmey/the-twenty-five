// app/page.tsx
'use client';

import { signIn } from 'next-auth/react';  // Fixed
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="text-center mt-12">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to <span className="text-blue-600">MyApp</span>
      </h1>

      {status === 'loading' ? (
        <p className="text-gray-500">Loading session...</p>
      ) : session ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-lg font-semibold text-green-800">
            Hello, {session.user?.name}!
          </p>
          <p className="text-sm text-green-600 mt-2">
            You are signed in with Google.
          </p>
          <Link
            href="/profile"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Go to Profile
          </Link>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-lg font-medium text-gray-700">
            Please sign in to continue.
          </p>
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="mt-4 bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded font-medium"
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}