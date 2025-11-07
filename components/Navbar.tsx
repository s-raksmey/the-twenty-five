"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { SignInDialog } from "@/components/authentication/SignInDialog"

const navContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

const navItem: Variants = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
}

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ]

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`sticky top-0 z-50 border-b backdrop-blur-sm transition-shadow ${
        isScrolled ? "shadow-md" : ""
      } bg-background/80`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:py-5">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Image src="/logo.jpg" alt="THE TWENTY FIVE" width={40} height={40} className="rounded-full" />
          <span className="text-lg sm:text-xl font-bold tracking-tight">THE TWENTY FIVE</span>
        </div>

        {/* Navigation */}
        <motion.ul
          className="hidden md:flex items-center space-x-8"
          variants={navContainer}
          initial="hidden"
          animate="show"
        >
          {navigation.map((item) => (
            <motion.li key={item.name} variants={navItem}>
              <Link
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {/* Authentication */}
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <Skeleton className="h-8 w-20 rounded-full" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 p-0 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image ?? ""} />
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {session.user?.name ? getInitials(session.user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user?.email ?? session.user?.phoneMasked ?? ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-500 focus:text-red-600"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignInDialog open={isSignInDialogOpen} onOpenChange={setIsSignInDialogOpen} />
          )}
        </div>
      </div>
    </motion.nav>
  )
}
