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

  if (isProtected && !token) {
    const signInUrl = new URL('/auth/signin', request.url);
    const target = `${pathname}${request.nextUrl.search}`;
    if (target && target !== '/') {
      signInUrl.searchParams.set('callbackUrl', target);
    }
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
