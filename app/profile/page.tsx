// app/profile/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <p className="text-center text-red-600">
        Not signed in. <Link href="/" className="underline">Go home</Link>
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>

      <div className="flex flex-col items-center space-y-4">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Avatar"
            width={100}
            height={100}
            className="rounded-full border-4 border-blue-500"
          />
        )}

        <div className="text-center">
          <p className="text-lg">
            <strong>Name:</strong> {session.user?.name ?? '—'}
          </p>
          <p className="text-lg">
            <strong>Email:</strong> {session.user?.email ?? '—'}
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}