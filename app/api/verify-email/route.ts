import { NextResponse } from 'next/server';

import { db } from '@/app/db';
import { users } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

import { EmailVerificationService } from '@/lib/email-verification';

const redirectWithStatus = (req: Request, status: string) => {
  const url = new URL('/auth/verify-email', req.url);
  url.searchParams.set('status', status);
  url.searchParams.set('ts', Date.now().toString());
  return NextResponse.redirect(url);
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return redirectWithStatus(req, 'invalid');
  }

  const [userRecord] = await db
    .select()
    .from(users)
    .where(eq(users.verificationToken, token))
    .limit(1);

  if (!userRecord) {
    return redirectWithStatus(req, 'invalid');
  }

  if (userRecord.emailVerified) {
    return redirectWithStatus(req, 'success');
  }

  const expiresAtRaw = userRecord.verificationTokenExpires;
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

  if (!expiresAt || expiresAt.getTime() < Date.now()) {
    await db
      .update(users)
      .set({ verificationToken: null, verificationTokenExpires: null })
      .where(eq(users.id, userRecord.id));

    return redirectWithStatus(req, 'expired');
  }

  const now = new Date();

  await db
    .update(users)
    .set({
      emailVerified: now,
      verificationToken: null,
      verificationTokenExpires: null,
    })
    .where(eq(users.id, userRecord.id));

  if (userRecord.email) {
    try {
      await EmailVerificationService.sendWelcomeEmail(
        userRecord.email,
        userRecord.name
      );
    } catch (error) {
      console.error('⚠️ Failed to send welcome email:', error);
    }
  }

  return redirectWithStatus(req, 'success');
}
