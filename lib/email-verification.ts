import crypto from 'crypto';
import nodemailer from 'nodemailer';

export class EmailVerificationService {
  static generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static getVerificationExpiry(): Date {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);
    return expiry;
  }

  static async sendVerificationEmail(
    email: string,
    token: string,
    name?: string | null
  ) {
    const baseUrl = process.env.NEXTAUTH_URL ?? '';
    const verificationUrl = baseUrl
      ? new URL(`/api/verify-email?token=${token}`, baseUrl).toString()
      : `/api/verify-email?token=${token}`;

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
