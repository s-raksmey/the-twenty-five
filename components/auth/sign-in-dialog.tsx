'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { GoogleSignIn } from '@/components/auth/google-sign-in';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function SignInDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="group relative inline-flex items-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_-15px_rgba(99,102,241,0.75)] transition-all duration-300 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-background active:scale-95 dark:from-indigo-500 dark:via-violet-500 dark:to-fuchsia-500"
        >
          <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
          <span className="relative flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className="rounded-full bg-white/20 p-1 shadow-inner"
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
            <span>Sign in</span>
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="group w-full max-w-md overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background/95 via-background/80 to-background/95 p-0 text-foreground shadow-[0_40px_90px_-35px_rgba(79,70,229,0.65)] backdrop-blur-xl">
        <DialogTitle asChild>
          <VisuallyHidden>Sign in</VisuallyHidden>
        </DialogTitle>
        <DialogDescription asChild>
          <VisuallyHidden>Continue with Google</VisuallyHidden>
        </DialogDescription>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/20" />
          <div className="pointer-events-none absolute -bottom-28 left-6 h-52 w-52 rounded-full bg-purple-400/25 blur-3xl dark:bg-fuchsia-500/20" />

          <div className="relative px-6 py-8 sm:px-10">
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm dark:border-white/20 dark:bg-white/10 dark:text-slate-200"
            >
              <Sparkles className="h-4 w-4" />
              Welcome back
            </motion.div>

            <GoogleSignIn />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
