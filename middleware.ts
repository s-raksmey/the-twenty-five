import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getToken } from 'next-auth/jwt';

const PROTECTED_PATHS = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));

  if (isProtected) {
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url);
      const target = `${pathname}${request.nextUrl.search}`;
      if (target && target !== '/') {
        signInUrl.searchParams.set('callbackUrl', target);
      }
      return NextResponse.redirect(signInUrl);
    }

    if (!token.emailVerified) {
      const verifyUrl = new URL('/auth/verify-email', request.url);
      verifyUrl.searchParams.set('status', 'pending');
      return NextResponse.redirect(verifyUrl);
    }
  }

  if (pathname.startsWith('/auth/verify-email') && token?.emailVerified) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/verify-email'],
};
