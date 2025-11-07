"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Phone, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { PhoneOtpForm } from "@/components/authentication/PhoneOtpForm"
import { GoogleSignIn } from "@/components/authentication/GoogleSignIn"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export function SignInDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const reset = () => setSelected(null)
  const handleSuccess = () => {
    onOpenChange(false)
    reset()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="group relative overflow-hidden rounded-full bg-black px-6 py-2.5 text-white shadow-lg transition-all duration-200 hover:shadow-white/20 hover:scale-105 active:scale-95"
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-gray-300/10 opacity-0"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <span className="relative flex items-center gap-2 text-sm font-semibold">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </motion.div>
            Sign in
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-md rounded-2xl border border-white/20 bg-black/95 px-6 py-8 text-white shadow-2xl sm:px-8 backdrop-blur-xl">
        <DialogTitle asChild>
          <VisuallyHidden>Sign in</VisuallyHidden>
        </DialogTitle>
        <DialogDescription asChild>
          <VisuallyHidden>Choose Google or Phone Number sign in</VisuallyHidden>
        </DialogDescription>

        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="choose"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 40,
                duration: 0.1,
              }}
              className="space-y-4"
            >
              <motion.h2
                className="text-lg font-bold text-white text-center"
                initial={{ y: -3, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.15 }}
              >
                Choose your sign-in method
              </motion.h2>

              <div className="grid gap-3 pt-2">
                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.08, duration: 0.15 }}
                >
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 border border-white/40 shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => setSelected("google")}
                  >
                    <Mail className="h-5 w-5" />
                    <span className="font-semibold">Continue with Google</span>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.13, duration: 0.15 }}
                >
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 bg-slate-800 text-white hover:bg-slate-700 border border-white/20 shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => setSelected("phone")}
                  >
                    <Phone className="h-5 w-5" />
                    <span className="font-semibold">Sign in with Phone</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : selected === "phone" ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 40,
                duration: 0.1,
              }}
            >
              <PhoneOtpForm onBack={reset} onSuccess={handleSuccess} />
            </motion.div>
          ) : (
            <motion.div
              key="google"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 40,
                duration: 0.1,
              }}
            >
              <GoogleSignIn onBack={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
