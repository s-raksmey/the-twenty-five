// components/Header.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "./SignOutButton";
import Link from "next/link";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          My App
        </Link>

        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">Hello, {session.user?.name}</span>
            <SignOutButton />
          </div>
        ) : (
          <Link href="/auth/signin">
            <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}