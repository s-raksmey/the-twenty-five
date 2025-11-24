'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, LogIn, Mail, Shield } from 'lucide-react';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';

interface GoogleSignInProps {
  onBack?: () => void;
}

export function GoogleSignIn({ onBack }: GoogleSignInProps) {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Title + description */}
      <div className="space-y-3 text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary dark:border-white/15 dark:bg-white/10 dark:text-white/90">
          <CheckCircle className="h-3 w-3" />
          One-click login
        </div>

        <div>
          <h3 className="text-[1.25rem] font-bold leading-tight text-foreground flex items-center gap-2">
            <LogIn className="h-4 w-4 text-primary" />
            Sign in with Google
          </h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Use your Google account for a secure and instant login experience.
          </p>
        </div>
      </div>

      {/* Google button */}
      <div className="space-y-4">
        <Button
          onClick={handleGoogleSignIn}
          className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border/50 bg-white text-base font-semibold text-slate-900 shadow-[0_18px_30px_-20px_rgba(15,23,42,0.35)] transition-all duration-200 hover:scale-[1.015] hover:shadow-[0_25px_45px_-25px_rgba(79,70,229,0.55)] dark:bg-white dark:text-slate-900"
          size="lg"
        >
          <Mail className="h-5 w-5 text-[#4285F4]" />
          Continue with Google
        </Button>

        {/* Security info box */}
        <div className="rounded-xl border border-border/40 bg-white/50 px-3 py-2.5 text-xs text-muted-foreground backdrop-blur-sm dark:bg-white/5 dark:border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>Secure OAuth 2.0</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <span>No password required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>
      )}
    </motion.div>
  );
}
