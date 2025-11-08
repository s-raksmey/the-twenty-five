import { db } from '@/app/db';
import { users, verificationTokens } from '@/app/db/schema';
import crypto from 'crypto';
import { and, eq } from 'drizzle-orm';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { z } from 'zod';

import { TursoDrizzleAdapter } from '@/lib/auth-adapter';
import { EmailValidator } from '@/lib/email-validator';
import { EmailVerificationService } from '@/lib/email-verification';
import {
  hashOtpCode,
  hashPhoneNumber,
  maskPhoneFromLastFour,
  normalizePhoneNumber,
} from '@/lib/phone-auth';

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
  phoneNumberHash: string | null;
  phoneNumberLast4: string | null;
  verificationToken: string | null;
  verificationTokenExpires: Date | null;
}

const phoneCredentialsSchema = z.object({
  phone: z.string().min(6),
  code: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, 'Verification code must contain exactly 6 digits.'),
});

// ----- Email Verification Class -----

// ----- NextAuth Configuration -----
export const authOptions: NextAuthOptions = {
  adapter: TursoDrizzleAdapter,
  providers: [
    CredentialsProvider({
      id: 'phone',
      name: 'Phone',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        code: { label: 'Code', type: 'text' },
      },
      async authorize(credentials) {
        const parsed = phoneCredentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error(
            'Please provide a valid phone number and verification code.'
          );
        }

        const normalizedPhone = normalizePhoneNumber(parsed.data.phone);
        const phoneHash = hashPhoneNumber(normalizedPhone);
        const hashedCode = hashOtpCode(parsed.data.code);

        const [verification] = await db
          .select()
          .from(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, phoneHash),
              eq(verificationTokens.token, hashedCode)
            )
          )
          .limit(1);

        if (!verification) throw new Error('Invalid verification code.');

        const expiresAt =
          verification.expires instanceof Date
            ? verification.expires
            : new Date(verification.expires);
        if (expiresAt.getTime() < Date.now()) {
          await db
            .delete(verificationTokens)
            .where(eq(verificationTokens.identifier, phoneHash));
          throw new Error(
            'Your verification code has expired. Please request a new one.'
          );
        }

        // Delete token after use
        await db
          .delete(verificationTokens)
          .where(eq(verificationTokens.identifier, phoneHash));

        const lastFour = normalizedPhone.slice(-4);

        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.phoneNumberHash, phoneHash))
          .limit(1);

        let userRecord: UserRecord | undefined =
          existingUser.length > 0 ? existingUser[0] : undefined;

        if (!userRecord) {
          const createdUsers = await db
            .insert(users)
            .values({
              id: crypto.randomUUID(),
              name: `Phone ${lastFour}`,
              phoneNumberHash: phoneHash,
              phoneNumberLast4: lastFour,
              emailVerified: null,
              verificationToken: null,
              verificationTokenExpires: null,
            })
            .returning();
          userRecord = createdUsers[0] as UserRecord;
        }

        // Ensure last four stored
        if (userRecord && !userRecord.phoneNumberLast4) {
          await db
            .update(users)
            .set({ phoneNumberLast4: lastFour })
            .where(eq(users.id, userRecord.id));
          userRecord = { ...userRecord, phoneNumberLast4: lastFour };
        }

        if (!userRecord) {
          throw new Error('Failed to create or retrieve user record.');
        }

        const storedLastFour = userRecord.phoneNumberLast4 ?? lastFour;
        const masked = maskPhoneFromLastFour(storedLastFour);

        return {
          id: userRecord.id,
          name: userRecord.name ?? `Phone ${storedLastFour}`,
          email: userRecord.email ?? undefined,
          emailVerified: userRecord.emailVerified,
          phoneMasked: masked,
          phoneLast4: storedLastFour,
          phoneLogin: true,
        };
      },
    }),
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
    verifyRequest: '/auth/verify-email',
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

        if (isFirstLogin) {
          // New user - create account with verification token
          const verificationToken =
            EmailVerificationService.generateVerificationToken();
          const verificationExpiry =
            EmailVerificationService.getVerificationExpiry();

          await db.insert(users).values({
            id: crypto.randomUUID(),
            email: email,
            name: user.name,
            image: user.image,
            emailVerified: null,
            verificationToken,
            verificationTokenExpires: verificationExpiry,
          });

          // Send verification email
          await EmailVerificationService.sendVerificationEmail(
            email,
            verificationToken,
            user.name
          );
        } else {
          // Existing user
          const userRecord = existingUser[0] as UserRecord;

          if (!userRecord.emailVerified) {
            // User exists but email is not verified
            // Check if they have a valid verification token
            const now = new Date();
            const hasValidToken =
              userRecord.verificationToken &&
              userRecord.verificationTokenExpires &&
              userRecord.verificationTokenExpires > now;

            if (!hasValidToken) {
              // Generate new verification token
              const verificationToken =
                EmailVerificationService.generateVerificationToken();
              const verificationExpiry =
                EmailVerificationService.getVerificationExpiry();

              await db
                .update(users)
                .set({
                  verificationToken,
                  verificationTokenExpires: verificationExpiry,
                })
                .where(eq(users.id, userRecord.id));

              await EmailVerificationService.sendVerificationEmail(
                email,
                verificationToken,
                userRecord.name
              );
            }
            // If valid token exists, no need to resend
          } else {
            // User is verified - send login notification
            try {
              await EmailVerificationService.sendLoginNotification(
                email,
                userRecord.name
              );
            } catch (err) {
              console.error('⚠️ Failed to send login notification:', err);
            }
          }
        }

        return true;
      }

      // For phone authentication - always allow sign in
      return true;
    },

    async jwt({ token, account, profile, user, trigger, session }) {
      // Initial sign in
      if (account && user) {
        if (account.access_token) {
          token.accessToken = account.access_token;
        }

        if (account.provider === 'google') {
          const googleProfile = profile as GoogleProfile;
          token.emailVerified = googleProfile?.email_verified || false;
          token.isLikelyFake = EmailValidator.isLikelyFake(token.email || '');
          token.phoneLogin = false;

          // Check verification status in database for Google users
          if (token.email) {
            const existingUser = await db
              .select()
              .from(users)
              .where(eq(users.email, token.email))
              .limit(1);

            if (existingUser.length > 0) {
              const userRecord = existingUser[0] as UserRecord;
              token.emailVerified = Boolean(userRecord.emailVerified);
              token.needsEmailVerification = !userRecord.emailVerified;
              token.verificationToken =
                userRecord.verificationToken || undefined;
              token.verificationTokenExpires =
                userRecord.verificationTokenExpires || undefined;
            }
          }
        }

        if (account.provider === 'credentials') {
          token.phoneLogin = true;
          token.isLikelyFake = false;
          token.emailVerified = false; // Phone users don't have email verification
          token.needsEmailVerification = false;
        }
      }

      // Pass user info to token
      if (user) {
        token['id'] = user.id;
        token.emailVerified = Boolean(user.emailVerified);
        token.phoneLogin = user.phoneLogin || false;
        token.phoneMasked = user.phoneMasked;
        token.phoneLast4 = user.phoneLast4;
        token.needsEmailVerification = user.needsEmailVerification || false;
      }

      // Update token when session is updated (e.g., after email verification)
      if (trigger === 'update' && session?.user) {
        if (typeof session.user.emailVerified !== 'undefined') {
          token.emailVerified = Boolean(session.user.emailVerified);

          if (session.user.emailVerified) {
            token.needsEmailVerification = false;
            token.verificationToken = undefined;
            token.verificationTokenExpires = undefined;
          }
        }

        if (typeof session.user.needsEmailVerification !== 'undefined') {
          token.needsEmailVerification = Boolean(
            session.user.needsEmailVerification
          );
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
        session.user.phoneLogin = token.phoneLogin;
        session.user.phoneMasked = token.phoneMasked;
        session.user.phoneLast4 = token.phoneLast4;
        session.user.needsEmailVerification = token.needsEmailVerification;
      }
      return session;
    },
  },
};
