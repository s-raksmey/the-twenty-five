// middleware.ts (or proxy.ts)
import { NextResponse } from 'next/server';

import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(request) {
    const { nextUrl } = request;
    const pathname = nextUrl.pathname;
    const token = request.nextauth.token;

    // Block fake email accounts from protected routes
    if (token?.isLikelyFake && pathname.startsWith('/protected')) {
      return NextResponse.redirect(new URL('/auth/blocked', request.url));
    }

    // Add security headers with proper CSP for external images
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Fix: Allow images from Google and other trusted sources
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
      ].join('; ')
    );

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/auth/signin',
          '/auth/error',
          '/auth/blocked',
          '/api/auth',
        ];

        // Check if the route is public
        const isPublicRoute = publicRoutes.some(
          route => pathname === route || pathname.startsWith(`${route}/`)
        );

        if (isPublicRoute) {
          return true;
        }

        // Protected routes require authentication
        if (!token) {
          return false;
        }

        // Block users with fake emails
        if (token.isLikelyFake) {
          console.log('Blocked user with likely fake email:', token.email);
          return false;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
