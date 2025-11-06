import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import nodemailer from 'nodemailer';

import { TursoDrizzleAdapter } from "./auth-adapter";
import { EmailValidator } from "./email-validator";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";

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
    async jwt({ token, account, profile }) {
      if (account) {
        if (account.access_token) {
          token.accessToken = account.access_token;
        }

        const googleProfile = profile as GoogleProfile;
        token.emailVerified = googleProfile?.email_verified || false;
        token.isLikelyFake = EmailValidator.isLikelyFake(token.email || "");
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
      }
      return session;
    },
  },
};
