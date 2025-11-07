'use client';

import { motion } from 'framer-motion';
import { Mail, Shield } from 'lucide-react';
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
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold">Google Sign In</h3>
        <p className="text-muted-foreground">Secure and fast authentication with Google</p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleGoogleSignIn}
          className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
          size="lg"
        >
          <Mail className="w-5 h-5 mr-3" />
          Continue with Google
        </Button>

        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span>Protected by Google&apos;s security</span>
        </div>
      </div>

      <Button variant="ghost" onClick={onBack} className="w-full">
        ← Back to Sign In Options
      </Button>
    </motion.div>
  );
}
