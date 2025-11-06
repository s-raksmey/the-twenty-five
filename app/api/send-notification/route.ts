// app/api/send-notification/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Missing email' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env['EMAIL_USER'],
        pass: process.env['EMAIL_PASS'],
      },
    });

    const mailOptions = {
      from: `"Twenty Five" <${process.env['EMAIL_USER']}>`,
      to: email,
      subject: 'Login Successful ✅',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hi ${name || 'there'},</h2>
          <p>You have successfully signed in to <b>Twenty Five</b> using your Google account.</p>
          <p>If this wasn’t you, please secure your account immediately.</p>
          <hr />
          <p style="font-size: 0.9em; color: #555;">
            Sent automatically by the Twenty Five System
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Notification sent to ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ success: false, error });
  }
}
