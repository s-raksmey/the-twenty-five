import { db } from '@/app/db';
import { users } from '@/app/db/schema';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { TursoDrizzleAdapter } from '@/lib/auth-adapter';
import { EmailValidator } from '@/lib/email-validator';
import { EmailVerificationService } from '@/lib/email-verification';

// ----- Types -----
interface GoogleProfile {
  email_verified?: boolean;
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
}

interface UserRecord {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  verificationToken: string | null;
  verificationTokenExpires: Date | null;
}

// ----- Email Verification Class -----

// ----- NextAuth Configuration -----
export const authOptions: NextAuthOptions = {
  adapter: TursoDrizzleAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env['GOOGLE_CLIENT_ID'] || '',
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'] || '',
      authorization: { params: { access_type: 'offline', prompt: 'consent' } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/signin',
  },

  // ----- Callbacks -----
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const email = user.email;
        if (!email) return false;

        const googleProfile = profile as GoogleProfile;
        const isGoogleVerified = googleProfile?.email_verified;

        if (!isGoogleVerified) return false;

        if (EmailValidator.isDisposableEmail(email)) return false;
        if (EmailValidator.hasSuspiciousPattern(email)) return false;

        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        const isFirstLogin = existingUser.length === 0;

        const now = new Date();

        if (isFirstLogin) {
          await db.insert(users).values({
            id: crypto.randomUUID(),
            email: email,
            name: user.name,
            image: user.image,
            emailVerified: now,
            verificationToken: null,
            verificationTokenExpires: null,
          });
        } else {
          const userRecord = existingUser[0] as UserRecord;

          await db
            .update(users)
            .set({
              emailVerified: userRecord.emailVerified ?? now,
              verificationToken: null,
              verificationTokenExpires: null,
            })
            .where(eq(users.id, userRecord.id));

          try {
            await EmailVerificationService.sendLoginNotification(
              email,
              userRecord.name
            );
          } catch (err) {
            console.error('⚠️ Failed to send login notification:', err);
          }
        }

        if (isFirstLogin) {
          try {
            await EmailVerificationService.sendLoginNotification(
              email,
              user.name
            );
          } catch (err) {
            console.error('⚠️ Failed to send login notification:', err);
          }
        }

        return true;
      }
    },

    async jwt({ token, account, profile: _profile, user, trigger, session }) {
      // Initial sign in
      if (account && user) {
        if (account.access_token) {
          token.accessToken = account.access_token;
        }

        if (account.provider === 'google') {
          token.emailVerified = true;
          token.isLikelyFake = EmailValidator.isLikelyFake(token.email || '');
        }
      }

      // Pass user info to token
      if (user) {
        token['id'] = user.id;
        token.emailVerified = Boolean(user.emailVerified);
      }

      // Update token when session is updated
      if (trigger === 'update' && session?.user) {
        if (typeof session.user.emailVerified !== 'undefined') {
          token.emailVerified = Boolean(session.user.emailVerified);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token['id'] as string;
        session.user.accessToken = token.accessToken;
        session.user.emailVerified = token.emailVerified;
        session.user.isLikelyFake = token.isLikelyFake;
      }
      return session;
    },
  },
};
