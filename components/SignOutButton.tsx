// components/SignOutButton.tsx
'use client';

import { signOut } from 'next-auth/react';

// components/SignOutButton.tsx

// components/SignOutButton.tsx

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="btn-danger"
    >
      Sign Out
    </button>
  );
}
