'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Shield, Sparkle, TimerReset } from 'lucide-react';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { PhoneInput } from '@/components/ui/phone-input';

interface PhoneOtpFormProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const RESEND_COOLDOWN = 60; // seconds

export function PhoneOtpForm({ onBack, onSuccess }: PhoneOtpFormProps) {
  const [phone, setPhone] = useState<string | undefined>();
  const [code, setCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleSendOtp = async () => {
    if (!phone?.trim()) return;
    setLoading(true);
    setAlert(null);

    try {
      const res = await fetch('/api/auth/phone/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setMaskedPhone(data.maskedPhone ?? null);
        setCooldown(RESEND_COOLDOWN);
        setAlert({ type: 'success', message: `Verification code sent to ${data.maskedPhone}` });
      } else {
        setAlert({ type: 'error', message: data.message || 'Failed to send verification code.' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.trim().length < 6) return;
    setLoading(true);
    setAlert(null);

    const result = await signIn('phone', { phone, code, redirect: false });

    if (result?.error) {
      setAlert({ type: 'error', message: result.error });
    } else {
      setAlert({ type: 'success', message: '🎉 Welcome back! Sign in successful.' });
      setTimeout(() => onSuccess?.(), 800);
    }
    setLoading(false);
  };

  const handleResendOtp = () => {
    if (cooldown > 0) return;
    setCode('');
    setOtpSent(false);
    setAlert(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          <Sparkle className="h-3 w-3" />
          Seamless phone access
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-white">Verify with your phone</h3>
          <p className="text-sm text-slate-300">
            {!otpSent
              ? "Pick your country, enter your number, and we'll send you a secure code."
              : `Enter the 6-digit code sent to ${maskedPhone ?? 'your phone number'}.`}
          </p>
        </div>
      </div>

      {alert && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {!otpSent ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-slate-200">
                Phone number
              </Label>
              <PhoneInput
                id="phone"
                name="phone"
                international
                withCountryCallingCode
                defaultCountry="US"
                value={phone}
                onChange={(value: string | undefined) => setPhone(value)}
                placeholder="Enter phone number"
                className="bg-slate-900/50"
              />
              <p className="text-xs text-slate-400">
                Choose your country to automatically include the correct dialing code.
              </p>
            </div>
            <Button
              onClick={handleSendOtp}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              disabled={loading || !phone}
            >
              {loading ? (
                <motion.div
                  aria-label="loading"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>Send Verification Code</>
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-200">Verification code</Label>
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(v: string) => setCode(v)}
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerifyCode}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              disabled={loading || code.length < 6}
            >
              {loading ? (
                <motion.div
                  aria-label="verifying"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Verify & Sign In
                </>
              )}
            </Button>

            <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-900/50 p-4 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>Your number is protected and never shared.</span>
              </div>
              <div className="flex items-center gap-2">
                <TimerReset className="h-4 w-4 text-emerald-400" />
                <span>{cooldown > 0 ? `Resend available in ${cooldown}s` : 'You can resend now'}</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendOtp}
                disabled={loading || cooldown > 0}
                className="gap-2 text-slate-300 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
                Resend code
              </Button>
            </div>
          </>
        )}
      </div>

      <Button
        variant="ghost"
        onClick={onBack}
        className="group inline-flex w-auto items-center gap-2 text-sm text-slate-300 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to sign-in options
      </Button>
    </motion.div>
  );
}
