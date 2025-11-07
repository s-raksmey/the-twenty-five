'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockKeyhole, Mail, Phone, ShieldCheck, Sparkles, TimerReset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PhoneOtpForm } from '@/components/authentication/PhoneOtpForm';
import { GoogleSignIn } from '@/components/authentication/GoogleSignIn';

export function SignInDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const reset = () => setSelected(null);
  const handleSuccess = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-5 py-2 text-white shadow-lg shadow-emerald-500/10 transition hover:shadow-emerald-500/30"
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-400/20 opacity-0 transition group-hover:opacity-100"
          />
          <span className="relative flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-emerald-300 transition-transform group-hover:rotate-12" />
            Sign in
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 p-0 text-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.7)]">
        <div className="grid md:grid-cols-[260px,1fr]">
          <div className="relative hidden flex-col justify-between gap-8 bg-gradient-to-br from-emerald-500/20 via-slate-950 to-slate-950 p-8 md:flex">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100">
                <Sparkles className="h-3 w-3" />
                Welcome back
              </div>
              <h2 className="text-2xl font-semibold leading-tight">Choose a secure way to access your workspace</h2>
              <p className="text-sm text-slate-200/80">
                Streamlined options with enterprise-grade security and a beautifully crafted experience.
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-200/80">
              {[{ icon: ShieldCheck, text: 'Protected by industry-leading authentication' }, { icon: LockKeyhole, text: 'No passwords stored — revoke access anytime' }, { icon: TimerReset, text: 'Pick the fastest option tailored to you' }].map((feature) => (
                <div key={feature.text} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                  <feature.icon className="mt-0.5 h-4 w-4 text-emerald-300" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-xs text-slate-100">
              We value privacy. Sign-in data is encrypted in transit and never used for marketing.
            </div>
          </div>

          <div className="relative p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {!selected ? (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">How would you like to sign in?</h3>
                    <p className="text-sm text-slate-300">Pick a method that suits you best — both are secure and passwordless.</p>
                  </div>

                  <div className="grid gap-3">
                    {[
                      {
                        id: 'google',
                        title: 'Continue with Google',
                        description: 'Sign in instantly with your Google account and stay in sync across devices.',
                        icon: Mail,
                        accent: 'from-red-500 via-orange-500 to-amber-500',
                        tag: 'Recommended',
                        tagStyles: 'bg-red-500/10 text-red-200',
                      },
                      {
                        id: 'phone',
                        title: 'Verify with phone number',
                        description: 'Receive a one-time passcode for quick, password-free access anywhere.',
                        icon: Phone,
                        accent: 'from-emerald-500 via-teal-500 to-cyan-500',
                        tag: 'Passwordless',
                        tagStyles: 'bg-emerald-500/10 text-emerald-200',
                      },
                    ].map((method) => (
                      <motion.button
                        key={method.id}
                        type="button"
                        onClick={() => setSelected(method.id)}
                        className="group relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-5 text-left transition hover:border-emerald-400/60 hover:bg-slate-900/60"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${method.tagStyles}`}>
                          {method.tag}
                        </span>
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${method.accent} text-white shadow-lg shadow-emerald-500/20`}>
                            <method.icon className="h-5 w-5" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-lg font-semibold text-white">{method.title}</h4>
                            <p className="text-sm text-slate-300">{method.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : selected === 'phone' ? (
                <PhoneOtpForm key="phone" onBack={reset} onSuccess={handleSuccess} />
              ) : (
                <GoogleSignIn key="google" onBack={reset} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
