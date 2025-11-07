'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Mail, Shield } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

interface GoogleSignInProps {
  onBack: () => void;
}

export function GoogleSignIn({ onBack }: GoogleSignInProps) {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-200">
          <CheckCircle className="h-3 w-3" />
          One-click access
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-white">Continue with Google</h3>
          <p className="text-sm text-slate-300">
            Sign in instantly using your Google account. We never store your password and you can revoke access anytime.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleGoogleSignIn}
          className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-base font-medium text-white shadow-lg shadow-red-500/30 transition hover:shadow-red-500/50"
          size="lg"
        >
          <Mail className="h-5 w-5" />
          Continue with Google
        </Button>

        <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-900/50 p-4 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-300" />
            <span>Secure OAuth 2.0 connection handled by Google.</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-red-300" />
            <span>We only receive your name and email address.</span>
          </div>
        </div>
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
