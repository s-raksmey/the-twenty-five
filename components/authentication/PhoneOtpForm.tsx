'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Shield, RotateCcw, TimerReset } from 'lucide-react';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

interface PhoneOtpFormProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const RESEND_COOLDOWN = 60; // seconds

export function PhoneOtpForm({ onBack, onSuccess }: PhoneOtpFormProps) {
  const [phone, setPhone] = useState('');
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
    if (!phone.trim()) return;
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
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold">Phone Verification</h3>
        <p className="text-muted-foreground">
          {!otpSent
            ? "We'll send you a secure verification code"
            : `Enter the 6-digit code sent to ${maskedPhone ?? 'your phone'}`}
        </p>
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+855 12 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 text-base"
                inputMode="tel"
                autoComplete="tel"
              />
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
              <Label>Verification Code</Label>
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

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Your number is protected</span>
              </div>
              <div className="flex items-center gap-1">
                <TimerReset className="w-3 h-3" />
                <span>{cooldown > 0 ? `Resend available in ${cooldown}s` : 'You can resend now'}</span>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendOtp}
                disabled={loading || cooldown > 0}
                className="text-muted-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Resend Code
              </Button>
            </div>
          </>
        )}
      </div>

      <Button variant="ghost" onClick={onBack} className="w-full">
        ← Back to Sign In Options
      </Button>
    </motion.div>
  );
}
