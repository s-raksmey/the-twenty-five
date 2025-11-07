import crypto from 'crypto';

import { db } from '@/app/db';
import { users, verificationTokens } from '@/app/db/schema';
import { TursoDrizzleAdapter } from '@/lib/auth-adapter';
import { EmailValidator } from '@/lib/email-validator';
import {
  hashOtpCode,
  hashPhoneNumber,
  maskPhoneFromLastFour,
  normalizePhoneNumber,
} from '@/lib/phone-auth';
import { and, eq } from 'drizzle-orm';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Define proper types for Google profile
interface GoogleProfile {
  email_verified?: boolean;
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
}

const phoneCredentialsSchema = z.object({
  phone: z.string().min(6),
  code: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, 'Verification code must contain exactly 6 digits.'),
});

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
          throw new Error('Please provide a valid phone number and verification code.');
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

        if (!verification) {
          throw new Error('Invalid verification code.');
        }

        const expiresAt =
          verification.expires instanceof Date
            ? verification.expires
            : new Date(verification.expires);

        if (expiresAt.getTime() < Date.now()) {
          await db
            .delete(verificationTokens)
            .where(eq(verificationTokens.identifier, phoneHash));
          throw new Error('Your verification code has expired. Please request a new one.');
        }

        await db
          .delete(verificationTokens)
          .where(eq(verificationTokens.identifier, phoneHash));

        const lastFour = normalizedPhone.slice(-4);

        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.phoneNumberHash, phoneHash))
          .limit(1);

        let userRecord = existingUser[0];

        if (!userRecord) {
          const [created] = await db
            .insert(users)
            .values({
              id: crypto.randomUUID(),
              name: `Phone ${lastFour}`,
              phoneNumberHash: phoneHash,
              phoneNumberLast4: lastFour,
            })
            .returning();

          userRecord = created;
        } else if (!userRecord.phoneNumberLast4) {
          await db
            .update(users)
            .set({ phoneNumberLast4: lastFour })
            .where(eq(users.id, userRecord.id));

          userRecord = { ...userRecord, phoneNumberLast4: lastFour };
        }

        const storedLastFour = userRecord.phoneNumberLast4 ?? lastFour;
        const masked = maskPhoneFromLastFour(storedLastFour);

        return {
          id: userRecord.id,
          name: userRecord.name ?? `Phone ${storedLastFour}`,
          email: userRecord.email ?? undefined,
          emailVerified: Boolean(userRecord.emailVerified),
          phoneMasked: masked,
          phoneLast4: storedLastFour,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env["GOOGLE_CLIENT_ID"]!,
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"]!,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  secret: process.env["NEXTAUTH_SECRET"]!,
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },

  callbacks: {
    // ✅ SIGN-IN CALLBACK
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email;

        if (!email) {
          console.log("❌ No email provided");
          return false;
        }

        // 1️⃣ Verify Google's email
        const googleProfile = profile as GoogleProfile;
        const isGoogleVerified = googleProfile?.email_verified;
        if (!isGoogleVerified) {
          console.log("❌ Unverified Google email:", email);
          return false;
        }

        // 2️⃣ Check for disposable or suspicious patterns
        if (EmailValidator.isDisposableEmail(email)) {
          console.log("❌ Disposable email detected:", email);
          return false;
        }

        if (EmailValidator.hasSuspiciousPattern(email)) {
          console.log("❌ Suspicious email pattern:", email);
          return false;
        }

        console.log("✅ Valid email:", email);

        // 3️⃣ Optional: Check if user is first-time login
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        const isFirstLogin = existingUser.length === 0;

        // 4️⃣ Directly send the email using Nodemailer (no fetch)
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env["EMAIL_USER"],
              pass: process.env["EMAIL_PASS"],
            },
          });

          const subject = isFirstLogin
            ? "Welcome to Twenty Five 🎉"
            : "Login Successful ✅";

          const html = isFirstLogin
            ? `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome, ${user.name || "there"}!</h2>
                <p>Thank you for joining <b>Twenty Five</b>.</p>
                <p>We’re excited to have you onboard.</p>
                <hr/>
                <p style="font-size:0.9em;color:#555;">Sent automatically by the Twenty Five System</p>
              </div>
            `
            : `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Hello ${user.name || "there"},</h2>
                <p>You just signed in to your <b>Twenty Five</b> account using Google.</p>
                <p>If this wasn’t you, please secure your account immediately.</p>
                <hr/>
                <p style="font-size:0.9em;color:#555;">Sent automatically by the Twenty Five System</p>
              </div>
            `;

          await transporter.sendMail({
            from: `"Twenty Five" <${process.env["EMAIL_USER"]}>`,
            to: email,
            subject,
            html,
          });

          console.log(`📧 Notification email sent to ${email}`);
        } catch (err) {
          console.error("⚠️ Failed to send notification:", err);
        }
      }

      return true;
    },

    // ✅ JWT CALLBACK
    async jwt({ token, account, profile, user }) {
      if (account) {
        if (account.access_token) {
          token.accessToken = account.access_token;
        }

        if (account.provider === 'google') {
          const googleProfile = profile as GoogleProfile;
          token.emailVerified = googleProfile?.email_verified || false;
          token.isLikelyFake = EmailValidator.isLikelyFake(token.email || "");
          token.phoneMasked = undefined;
          token.phoneLast4 = undefined;
          token.phoneLogin = false;
        }

        if (account.provider === 'credentials') {
          token.phoneLogin = true;
          token.isLikelyFake = false;
        }
      }

      if (user && typeof user === 'object') {
        const typedUser = user as {
          emailVerified?: boolean;
          phoneMasked?: string;
          phoneLast4?: string;
        };

        if (typeof typedUser.emailVerified !== 'undefined') {
          token.emailVerified = Boolean(typedUser.emailVerified);
        }

        if (typedUser.phoneMasked) {
          token.phoneMasked = typedUser.phoneMasked;
        }

        if (typedUser.phoneLast4) {
          token.phoneLast4 = typedUser.phoneLast4;
        }
      }
      return token;
    },

    // ✅ SESSION CALLBACK
    async session({ session, token }) {
      if (session.user) {
        if (token.accessToken) {
          session.user.accessToken = token.accessToken;
        }
        session.user.emailVerified = token.emailVerified;

        if (typeof token.isLikelyFake !== "undefined") {
          session.user.isLikelyFake = token.isLikelyFake;
        }

        if (typeof token.phoneLogin !== 'undefined') {
          session.user.phoneLogin = token.phoneLogin;
        }

        if (token.phoneMasked) {
          session.user.phoneMasked = token.phoneMasked;
        }

        if (token.phoneLast4) {
          session.user.phoneLast4 = token.phoneLast4;
        }
      }
      return session;
    },
  },
};
