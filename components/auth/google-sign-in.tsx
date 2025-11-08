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
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      className="space-y-6"
    >
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary dark:border-white/15 dark:bg-white/10 dark:text-white/90">
          <CheckCircle className="h-3 w-3" />
          One-click access
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            Continue with Google
          </h3>
          <p className="text-sm text-muted-foreground">
            Sign in instantly using your Google account. Secure and fast.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleGoogleSignIn}
          className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-2xl border border-border/60 bg-gradient-to-r from-white via-slate-50 to-white text-base font-semibold text-slate-900 shadow-[0_18px_30px_-24px_rgba(15,23,42,0.6)] transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_25px_45px_-25px_rgba(79,70,229,0.55)] dark:from-neutral-100 dark:via-white dark:to-neutral-100 dark:text-slate-900"
          size="lg"
        >
          <Mail className="h-5 w-5 text-[#4285F4]" />
          Continue with Google
        </Button>

        <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-white/40 p-3 text-xs text-muted-foreground backdrop-blur-md dark:border-white/15 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span>Secure OAuth 2.0 connection.</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <Mail className="h-4 w-4 text-primary" />
            <span>Name and email only.</span>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={onBack}
        className="group inline-flex w-auto items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Button>
    </motion.div>
  );
}
