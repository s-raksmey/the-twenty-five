'use client';

import { useState } from 'react';

import { useSearchParams } from 'next/navigation';

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Lock,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { signIn } from 'next-auth/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { cn } from '@/lib/utils';

const highlightFeatures = [
  {
    title: 'Adaptive security',
    description:
      'Each login is protected with device fingerprinting and suspicious activity detection.',
    icon: ShieldCheck,
  },
  {
    title: 'Frictionless access',
    description: 'Sign in with Google in less than twenty seconds.',
    icon: CheckCircle2,
  },
  {
    title: 'Realtime collaboration',
    description:
      'Bring your teammates into focus sessions with shared rituals and accountability.',
    icon: Users,
  },
  {
    title: 'Always available',
    description:
      'We maintain 99.99% uptime with active monitoring across every region we serve.',
    icon: Clock,
  },
];

const trustMetrics = [
  { label: 'Teams focused daily', value: '12K+' },
  { label: 'Average weekly streak', value: '17 days' },
  { label: 'Countries served', value: '48' },
];

export default function SignInPage() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const searchParams = useSearchParams();
  const isCompact = searchParams.get('mode') === 'compact';
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);

    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('Google sign-in failed', error);
      setIsSigningIn(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background/95 to-muted/70">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

      <div
        className={cn(
          'container relative mx-auto min-h-screen px-4 py-16',
          isCompact
            ? 'flex max-w-lg flex-col items-center justify-center gap-10'
            : 'grid items-center gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:py-24'
        )}
      >
        {!isCompact && (
          <section className="space-y-10">
            <Badge
              variant="secondary"
              className="bg-white/70 text-foreground backdrop-blur"
            >
              Access the ritual platform
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Sign in to stay on track with your twenty five
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                Choose the sign-in method that fits your flow. We combine strong
                security with a calm, guided experience so you can get back to
                doing the work that matters.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlightFeatures.map(feature => (
                <Card
                  key={feature.title}
                  className="border border-white/20 bg-white/60 p-0 text-left shadow-lg backdrop-blur transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
                >
                  <CardContent className="space-y-3 p-5">
                    <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary">
                      <feature.icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 rounded-2xl border border-white/20 bg-white/50 p-6 text-sm text-muted-foreground backdrop-blur dark:border-white/10 dark:bg-white/5 sm:grid-cols-3 sm:text-base">
              {trustMetrics.map(metric => (
                <div key={metric.label} className="space-y-1">
                  <p className="text-2xl font-semibold text-foreground sm:text-3xl">
                    {metric.value}
                  </p>
                  <p>{metric.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={cn('w-full lg:pl-4', isCompact && 'max-w-lg')}>
          {isCompact && (
            <div className="mb-6 space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                Sign in to continue
              </h1>
              <p className="text-sm text-muted-foreground">
                You need to sign in before accessing this page.
              </p>
            </div>
          )}
          <Card className="border border-white/30 bg-background/80 shadow-2xl backdrop-blur">
            <CardHeader className="space-y-3">
              <Badge
                variant="outline"
                className="border-primary/40 text-primary"
              >
                Secure workspace entry
              </Badge>
              <CardTitle className="text-2xl font-semibold">
                Sign in with Google
              </CardTitle>
              <CardDescription>
                Verified Google accounts keep your rituals safe. No phone
                numbers or extra codes required.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 pt-4">
              <div className="space-y-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5 text-sm text-muted-foreground">
                <div className="flex items-center gap-3 text-primary">
                  <Lock className="h-4 w-4" />
                  <span className="font-medium">Google-powered protection</span>
                </div>
                <p>
                  We rely on Google OAuth for secure access—no passwords to
                  remember and nothing sensitive stored with us.
                </p>
                <p className="text-xs text-muted-foreground">
                  We only request your name and email address to personalise
                  your workspace and keep you notified about important updates.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    Quick sign in—no codes or delays.
                  </p>
                </div>
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-base font-semibold text-primary-foreground shadow-lg transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-xl disabled:translate-y-0 disabled:opacity-90"
                  size="lg"
                >
                  {isSigningIn ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  {isSigningIn
                    ? 'Redirecting to Google…'
                    : 'Continue with Google'}
                  {!isSigningIn && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
