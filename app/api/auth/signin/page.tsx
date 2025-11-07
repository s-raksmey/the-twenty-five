'use client';

import { useEffect, useState } from 'react';

import { MessageSquareLock, Shield, Smartphone } from 'lucide-react';
import { signIn } from 'next-auth/react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const RESEND_COOLDOWN_SECONDS = 60;

export default function SignInPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusVariant, setStatusVariant] = useState<'success' | 'error' | 'info' | null>(null);
  const [maskedPhone, setMaskedPhone] = useState('');
  const [debugCode, setDebugCode] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const resetStatus = () => {
    setStatusMessage(null);
    setStatusVariant(null);
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleRequestCode = async () => {
    resetStatus();
    setIsRequestingCode(true);

    try {
      const response = await fetch('/api/auth/phone/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage =
          data?.message ||
          data?.errors?.phone?.[0] ||
          'We could not send a verification code. Please try again.';

        setStatusVariant('error');
        setStatusMessage(errorMessage);
        return;
      }

      const maskedTarget = data.maskedPhone ?? 'your phone';
      setOtpRequested(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setMaskedPhone(maskedTarget);
      setDebugCode(data.debugCode ?? null);
      setStatusVariant('success');
      setStatusMessage(`Verification code sent to ${maskedTarget}.`);
    } catch (error) {
      console.error('Failed to request OTP', error);
      setStatusVariant('error');
      setStatusMessage('Something went wrong. Please try again.');
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    resetStatus();
    setIsVerifyingCode(true);

    try {
      const result = await signIn('phone', {
        phone,
        code,
        redirect: false,
      });

      if (result?.error) {
        setStatusVariant('error');
        setStatusMessage(result.error);
        return;
      }

      const destination = result?.url ?? '/';
      window.location.href = destination;
    } catch (error) {
      console.error('Failed to verify OTP', error);
      setStatusVariant('error');
      setStatusMessage('Unable to verify the code. Please try again.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const showDebugCode =
    debugCode && process.env.NODE_ENV !== 'production' && otpRequested;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-lg border">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Secure Sign In</h1>
          <p className="text-muted-foreground">
            Use a verified Google account or a protected phone number to access
            your workspace.
          </p>
        </div>

        <div className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-sm">
              We verify every login to keep your account safe. Disposable
              emails and unverified phone numbers are blocked.
            </AlertDescription>
          </Alert>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Sign in with your phone</h2>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone-input">
                Phone number
              </label>
              <Input
                id="phone-input"
                placeholder="e.g. +15551234567"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                inputMode="tel"
                autoComplete="tel"
              />
              <p className="text-xs text-muted-foreground">
                Enter a phone number with your country code. We store only a
                protected hash and the last four digits for your security.
              </p>
            </div>

            <Button
              onClick={handleRequestCode}
              disabled={isRequestingCode || cooldown > 0 || phone.trim().length === 0}
              className="w-full"
              variant="secondary"
            >
              {cooldown > 0
                ? `Resend code in ${cooldown}s`
                : 'Send verification code'}
            </Button>

            {otpRequested && (
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="otp-input">
                    One-time passcode
                  </label>
                  <Input
                    id="otp-input"
                    placeholder="6-digit code"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </div>

                <Button
                  onClick={handleVerifyCode}
                  disabled={isVerifyingCode || code.trim().length < 6}
                  className="w-full"
                >
                  {isVerifyingCode ? 'Verifying…' : 'Verify and continue'}
                </Button>

                {showDebugCode && (
                  <p className="text-xs text-muted-foreground">
                    Development code for {maskedPhone}: <strong>{debugCode}</strong>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquareLock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Or continue with Google</h2>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-3"
              size="lg"
            >
              <GoogleIcon />
              Continue with Google
            </Button>
          </div>

          {statusMessage && statusVariant && (
            <Alert
              variant={statusVariant === 'error' ? 'destructive' : undefined}
              className="border"
            >
              <AlertDescription className="text-sm">
                {statusMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
