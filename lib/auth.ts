import { db } from '@/app/db';
import { users, verificationTokens } from '@/app/db/schema';
import crypto from 'crypto';
import { and, eq } from 'drizzle-orm';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import nodemailer from 'nodemailer';
import { z } from 'zod';

import { TursoDrizzleAdapter } from '@/lib/auth-adapter';
import { EmailValidator } from '@/lib/email-validator';
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
class EmailVerification {
  static generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static getVerificationExpiry(): Date {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24); // 24 hours expiry
    return expiry;
  }

  static async sendVerificationEmail(
    email: string,
    token: string,
    name?: string | null
  ) {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env['EMAIL_USER'],
        pass: process.env['EMAIL_PASS'],
      },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Hello ${name || 'there'},</p>
        <p>Thank you for signing up with <b>Twenty Five</b>! Please verify your email address to complete your registration and access all features.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
        
        <p>This verification link will expire in 24 hours.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 0.9em; color: #555;">
          If you didn't create an account with Twenty Five, please ignore this email.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Twenty Five" <${process.env['EMAIL_USER']}>`,
      to: email,
      subject: 'Verify Your Email Address - Twenty Five',
      html,
    });
  }

  static async sendWelcomeEmail(email: string, name?: string | null) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env['EMAIL_USER'],
        pass: process.env['EMAIL_PASS'],
      },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to Twenty Five 🎉</h2>
        <p>Hello ${name || 'there'},</p>
        <p>Your email has been successfully verified! Welcome to <b>Twenty Five</b>.</p>
        <p>We're excited to have you onboard and can't wait to see what you'll accomplish.</p>
        <hr/>
        <p style="font-size:0.9em;color:#555;">Sent automatically by the Twenty Five System</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Twenty Five" <${process.env['EMAIL_USER']}>`,
      to: email,
      subject: 'Welcome to Twenty Five!',
      html,
    });
  }

  static async sendLoginNotification(email: string, name?: string | null) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env['EMAIL_USER'],
        pass: process.env['EMAIL_PASS'],
      },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${name || 'there'},</h2>
        <p>You just signed in to your <b>Twenty Five</b> account using Google.</p>
        <p>If this wasn't you, please secure your account immediately.</p>
        <hr/>
        <p style="font-size:0.9em;color:#555;">Sent automatically by the Twenty Five System</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Twenty Five" <${process.env['EMAIL_USER']}>`,
      to: email,
      subject: 'Login Successful ✅',
      html,
    });
  }
}

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
            EmailVerification.generateVerificationToken();
          const verificationExpiry = EmailVerification.getVerificationExpiry();

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
          await EmailVerification.sendVerificationEmail(
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
                EmailVerification.generateVerificationToken();
              const verificationExpiry =
                EmailVerification.getVerificationExpiry();

              await db
                .update(users)
                .set({
                  verificationToken,
                  verificationTokenExpires: verificationExpiry,
                })
                .where(eq(users.id, userRecord.id));

              await EmailVerification.sendVerificationEmail(
                email,
                verificationToken,
                userRecord.name
              );
            }
            // If valid token exists, no need to resend
          } else {
            // User is verified - send login notification
            try {
              await EmailVerification.sendLoginNotification(
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
      if (trigger === 'update' && session?.emailVerified) {
        token.emailVerified = true;
        token.needsEmailVerification = false;
        token.verificationToken = undefined;
        token.verificationTokenExpires = undefined;
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
