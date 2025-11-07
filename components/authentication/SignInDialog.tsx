'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
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
          className="relative overflow-hidden group rounded-full px-5 py-2 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 hover:from-slate-700 hover:to-slate-500 text-white shadow-lg backdrop-blur-sm"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-fuchsia-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Sparkles className="w-4 h-4 mr-2 text-cyan-400 group-hover:rotate-12 transition-transform" />
          Sign In
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl overflow-hidden border border-slate-700/50 backdrop-blur-lg bg-gradient-to-b from-slate-900/90 to-slate-800/80">
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader className="pb-4 text-center">
                <DialogTitle className="text-2xl font-semibold text-white">Welcome Back ✨</DialogTitle>
                <p className="text-sm text-slate-400">Choose your preferred sign-in method</p>
              </DialogHeader>

              <div className="p-4 space-y-3">
                {[
                  { id: 'google', name: 'Google', icon: Mail, gradient: 'from-blue-500 to-indigo-500' },
                  { id: 'phone', name: 'Phone', icon: Phone, gradient: 'from-cyan-500 to-emerald-500' },
                ].map((m) => (
                  <motion.div key={m.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      onClick={() => setSelected(m.id)}
                      className="cursor-pointer border border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50 transition-all"
                    >
                      <CardContent className="flex items-center p-4 space-x-4">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${m.gradient}`}>
                          <m.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{m.name}</h4>
                          <p className="text-xs text-slate-400">
                            {m.id === 'google' ? 'Secure & quick sign-in' : 'Use your phone number'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : selected === 'phone' ? (
            <PhoneOtpForm key="phone" onBack={reset} onSuccess={handleSuccess} />
          ) : (
            <GoogleSignIn key="google" onBack={reset} />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
