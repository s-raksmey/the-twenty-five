import { NextResponse } from 'next/server';

import { db } from '@/app/db';
import { verificationTokens } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import {
  generateOtpCode,
  getOtpExpiry,
  hashOtpCode,
  hashPhoneNumber,
  maskPhoneFromFull,
  normalizePhoneNumber,
} from '@/lib/phone-auth';

const requestSchema = z.object({
  phone: z.string().min(6, 'Phone number is required'),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    let normalizedPhone: string;
    try {
      normalizedPhone = normalizePhoneNumber(parsed.data.phone);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Invalid phone number provided.';
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 400 }
      );
    }
    const phoneHash = hashPhoneNumber(normalizedPhone);
    const otpCode = generateOtpCode();
    const hashedOtp = hashOtpCode(otpCode);
    const expiresAt = getOtpExpiry();

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, phoneHash));

    await db.insert(verificationTokens).values({
      identifier: phoneHash,
      token: hashedOtp,
      expires: expiresAt,
    });

    const maskedPhone = maskPhoneFromFull(normalizedPhone);

    if (process.env.NODE_ENV !== 'production') {
      console.info(`OTP for ${maskedPhone}: ${otpCode}`);
    }

    return NextResponse.json({
      success: true,
      maskedPhone,
      debugCode: process.env.NODE_ENV === 'production' ? undefined : otpCode,
    });
  } catch (error) {
    console.error('Failed to request phone OTP', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to request verification code at this time.',
      },
      { status: 500 }
    );
  }
}
