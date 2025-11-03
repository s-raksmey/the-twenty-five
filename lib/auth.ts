// lib/auth.ts
import { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { TursoDrizzleAdapter } from './auth-adapter';
import { EmailValidator } from './email-validator';

// Define proper types for Google profile
interface GoogleProfile {
  email_verified?: boolean;
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: TursoDrizzleAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env['GOOGLE_CLIENT_ID']!,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  secret: process.env['NEXTAUTH_SECRET']!,
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/signin' },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const email = user.email;

        if (!email) {
          console.log('❌ No email provided');
          return false;
        }

        // 1. Check Google's email verification with proper type
        const googleProfile = profile as GoogleProfile;
        const isGoogleVerified = googleProfile?.email_verified;
        if (!isGoogleVerified) {
          console.log('❌ Unverified Google email:', email);
          return false;
        }

        // 2. Check for disposable emails
        if (EmailValidator.isDisposableEmail(email)) {
          console.log('❌ Disposable email detected:', email);
          return false;
        }

        // 3. Check for suspicious patterns
        if (EmailValidator.hasSuspiciousPattern(email)) {
          console.log('❌ Suspicious email pattern:', email);
          return false;
        }

        console.log('✅ Valid email:', email);
      }
      return true;
    },

    async jwt({ token, account, profile }) {
      if (account) {
        // Fix: Handle the exactOptionalPropertyTypes issue
        if (account.access_token) {
          token.accessToken = account.access_token;
        }

        // Use proper type for profile
        const googleProfile = profile as GoogleProfile;
        token.emailVerified = googleProfile?.email_verified || false;
        token.isLikelyFake = EmailValidator.isLikelyFake(token.email || '');
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // Fix: Only assign if it exists
        if (token.accessToken) {
          session.user.accessToken = token.accessToken;
        }
        session.user.emailVerified = token.emailVerified;

        // Fix: Handle optional boolean
        if (typeof token.isLikelyFake !== 'undefined') {
          session.user.isLikelyFake = token.isLikelyFake;
        }
      }
      return session;
    },
  },
};
