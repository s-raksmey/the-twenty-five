"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, RotateCcw, Shield, Sparkle, TimerReset } from "lucide-react"
import { signIn } from "next-auth/react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"

interface PhoneOtpFormProps {
  onBack: () => void
  onSuccess?: () => void
}

const RESEND_COOLDOWN = 60

export function PhoneOtpForm({ onBack, onSuccess }: PhoneOtpFormProps) {
  const [phone, setPhone] = useState<string>("")
  const [code, setCode] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [maskedPhone, setMaskedPhone] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  const handleSendOtp = async () => {
    if (!phone?.trim()) return
    setLoading(true)
    setAlert(null)

    try {
      const res = await fetch("/api/auth/phone/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()

      if (data.success) {
        setOtpSent(true)
        setMaskedPhone(data.maskedPhone ?? null)
        setCooldown(RESEND_COOLDOWN)
        setAlert({ type: "success", message: `Verification code sent to ${data.maskedPhone}` })
      } else {
        setAlert({ type: "error", message: data.message || "Failed to send verification code." })
      }
    } catch {
      setAlert({ type: "error", message: "Something went wrong. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (code.trim().length < 6) return
    setLoading(true)
    setAlert(null)

    const result = await signIn("phone", { phone, code, redirect: false })

    if (result?.error) {
      setAlert({ type: "error", message: result.error })
    } else {
      setAlert({ type: "success", message: "🎉 Welcome back! Sign in successful." })
      setTimeout(() => onSuccess?.(), 600)
    }
    setLoading(false)
  }

  const handleResendOtp = () => {
    if (cooldown > 0) return
    setCode("")
    setOtpSent(false)
    setAlert(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary dark:border-white/15 dark:bg-white/10 dark:text-white/90">
          <Sparkle className="h-3 w-3" />
          Seamless phone access
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Verify with your phone</h3>
          <p className="text-sm text-muted-foreground">
            {!otpSent
              ? "Enter your phone number and we'll send you a secure code."
              : `Enter the 6-digit code sent to ${maskedPhone ?? "your phone number"}.`}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {alert && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <Alert variant={alert.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Body */}
      <div className="space-y-3">
        {!otpSent ? (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Phone number</Label>
              <PhoneInput
                value={phone}
                onChange={(value: string) => setPhone(value)}
                placeholder="Enter phone number"
                defaultCountry="KH"
                className="border border-border/60 bg-white/50 text-foreground backdrop-blur-sm focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/30 dark:border-white/20 dark:bg-slate-900/60"
              />
              <p className="text-xs text-muted-foreground">
                We&apos;ll send a verification code to this number.
              </p>
            </div>

            <Button
              onClick={handleSendOtp}
              className="h-11 w-full rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 text-base font-semibold text-white shadow-[0_20px_45px_-25px_rgba(56,189,248,0.9)] transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_30px_55px_-25px_rgba(129,140,248,0.85)] active:scale-95"
              disabled={loading || !phone}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                />
              ) : (
                <>Send Verification Code</>
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">Verification code</Label>
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(v: string) => setCode(v)}
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerifyCode}
              className="h-11 w-full rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 text-base font-semibold text-white shadow-[0_20px_45px_-25px_rgba(56,189,248,0.9)] transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_30px_55px_-25px_rgba(129,140,248,0.85)] active:scale-95"
              disabled={loading || code.length < 6}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                />
              ) : (
                <>Verify & Sign In</>
              )}
            </Button>

            <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-white/40 p-3 text-xs text-muted-foreground backdrop-blur-md dark:border-white/15 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Your number is protected and never shared.</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <TimerReset className="h-4 w-4 text-primary" />
                <span>{cooldown > 0 ? `Resend in ${cooldown}s` : "You can resend"}</span>
              </div>
            </div>

            <div className="flex items-center justify-center pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendOtp}
                disabled={loading || cooldown > 0}
                className="gap-2 rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                Resend code
              </Button>
            </div>
          </>
        )}
      </div>

      <Button
        variant="ghost"
        onClick={onBack}
        className="group mt-2 inline-flex w-auto items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Button>
    </motion.div>
  )
}
