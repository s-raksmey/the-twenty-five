import crypto from 'crypto';

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

function requireSecret(envKey: string): string {
  const secret = process.env[envKey];
  if (!secret) {
    throw new Error(`${envKey} environment variable is required for phone authentication`);
  }
  return secret;
}

export function normalizePhoneNumber(rawPhone: string): string {
  const digitsOnly = rawPhone.replace(/[^\d]/g, '');

  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    throw new Error('Phone number must contain between 10 and 15 digits');
  }

  return `+${digitsOnly}`;
}

export function hashPhoneNumber(normalizedPhone: string): string {
  const secret = requireSecret('PHONE_NUMBER_SECRET');
  return crypto.createHmac('sha256', secret).update(normalizedPhone).digest('hex');
}

export function generateOtpCode(): string {
  const otp = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
  return otp;
}

export function hashOtpCode(code: string): string {
  const secret = requireSecret('OTP_SECRET');
  return crypto.createHmac('sha256', secret).update(code).digest('hex');
}

export function maskPhoneFromFull(normalizedPhone: string): string {
  const lastFour = normalizedPhone.slice(-4);
  return maskPhoneFromLastFour(lastFour);
}

export function maskPhoneFromLastFour(lastFour: string): string {
  const sanitized = lastFour.replace(/[^\d]/g, '').padStart(4, '•');
  return `••••••${sanitized.slice(-4)}`;
}

export function getOtpExpiry(): Date {
  return new Date(Date.now() + OTP_TTL_MS);
}
