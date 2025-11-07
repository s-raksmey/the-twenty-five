"use client"

import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle, Mail, Shield } from "lucide-react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface GoogleSignInProps {
  onBack: () => void
}

export function GoogleSignIn({ onBack }: GoogleSignInProps) {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      className="space-y-6"
    >
      <div className="space-y-3 text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white border border-white/30">
          <CheckCircle className="h-3 w-3" />
          One-click access
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Continue with Google</h3>
          <p className="text-sm text-gray-300">Sign in instantly using your Google account. Secure and fast.</p>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleGoogleSignIn}
          className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl bg-white text-base font-semibold text-black shadow-lg hover:bg-gray-100 transition-all active:scale-95"
          size="lg"
        >
          <Mail className="h-5 w-5" />
          Continue with Google
        </Button>

        <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-gray-300 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-white" />
            <span>Secure OAuth 2.0 connection.</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-white" />
            <span>Name and email only.</span>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={onBack}
        className="group inline-flex w-auto items-center gap-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Button>
    </motion.div>
  )
}
