'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { GoogleSignIn } from '@/components/auth/google-sign-in';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function SignInPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="group flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-white/5 hover:text-white transition-all"
        >
          <motion.div
            whileHover={{ rotate: 12, scale: 1.15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 16 }}
            className="rounded-full bg-white/10 p-1 shadow-inner"
          >
            <Sparkles className="h-4 w-4 text-primary" />
          </motion.div>
          Sign in
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={10}
        className="w-[360px] rounded-3xl border border-border/40 bg-gradient-to-br from-background/90 via-background/70 to-background/90 shadow-[0_32px_70px_-20px_rgba(80,70,229,0.55)] backdrop-blur-xl p-0 overflow-hidden"
      >
        <VisuallyHidden>Sign in</VisuallyHidden>

        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative"
        >
          {/* Glow Background */}
          <div className="pointer-events-none absolute -top-24 right-0 h-44 w-44 rounded-full bg-indigo-400/25 blur-3xl dark:bg-indigo-500/20" />
          <div className="pointer-events-none absolute -bottom-28 left-0 h-48 w-48 rounded-full bg-purple-400/25 blur-3xl dark:bg-fuchsia-500/20" />

          {/* Panel Content */}
          <div className="relative px-7 py-8">
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 dark:border-white/20 dark:bg-white/10 dark:text-slate-200"
            >
              <Sparkles className="h-4 w-4" />
              Welcome Back
            </motion.div>

            <GoogleSignIn />
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
