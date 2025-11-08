'use client';

import { useEffect, useMemo, useRef } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Loader2, MailCheck, MailWarning } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ViewState = 'idle' | 'waiting' | 'success' | 'error';

type StatusParam = 'success' | 'invalid' | 'expired' | 'pending' | null;

export default function VerifyEmailPage() {
  const { data: session, status: sessionStatus, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = (searchParams.get('status') as StatusParam) ?? null;
  const hasUpdatedSession = useRef(false);

  const isAuthenticated = sessionStatus === 'authenticated';
  const isUnauthenticated = sessionStatus === 'unauthenticated';

  const { viewState, message, headline } = useMemo(() => {
    if (sessionStatus === 'loading') {
      return {
        viewState: 'idle' as ViewState,
        message: 'Checking your account status...',
        headline: 'Verify your email',
      };
    }

    if (statusParam === 'success') {
      if (isAuthenticated) {
        return {
          viewState: 'success' as ViewState,
          message: 'All set! Redirecting you to your dashboard...',
          headline: 'Email verified successfully',
        };
      }

      return {
        viewState: 'success' as ViewState,
        message: 'Your email is verified. Please sign in again to continue.',
        headline: 'Email verified successfully',
      };
    }

    if (statusParam === 'invalid') {
      return {
        viewState: 'error' as ViewState,
        message:
          'That verification link is invalid or has already been used. Request a new verification link from your account settings.',
        headline: 'Verification issue',
      };
    }

    if (statusParam === 'expired') {
      return {
        viewState: 'error' as ViewState,
        message:
          'Your verification link has expired. Request a fresh link from your account settings to continue.',
        headline: 'Verification issue',
      };
    }

    if (isUnauthenticated) {
      return {
        viewState: 'error' as ViewState,
        message: 'Sign in to request a new verification email.',
        headline: 'Verification issue',
      };
    }

    if (isAuthenticated && session?.user?.emailVerified) {
      return {
        viewState: 'success' as ViewState,
        message: 'All set! Redirecting you to your dashboard...',
        headline: 'Email verified successfully',
      };
    }

    return {
      viewState: 'waiting' as ViewState,
      message:
        'We sent a verification email to your inbox. Click the link inside to finish setting up your account.',
      headline: 'Verify your email',
    };
  }, [
    isAuthenticated,
    isUnauthenticated,
    session?.user?.emailVerified,
    sessionStatus,
    statusParam,
  ]);

  useEffect(() => {
    if (sessionStatus === 'loading') {
      return;
    }

    if (
      statusParam === 'success' &&
      isAuthenticated &&
      !hasUpdatedSession.current
    ) {
      hasUpdatedSession.current = true;

      void (async () => {
        await update({
          user: {
            emailVerified: true,
            needsEmailVerification: false,
            verificationToken: undefined,
            verificationTokenExpires: undefined,
          },
        });

        setTimeout(() => {
          router.replace('/dashboard');
        }, 1500);
      })();

      return;
    }

    if (!statusParam && isAuthenticated && session?.user?.emailVerified) {
      router.replace('/dashboard');
    }
  }, [
    isAuthenticated,
    router,
    session?.user?.emailVerified,
    sessionStatus,
    statusParam,
    update,
  ]);

  const renderStatusIcon = () => {
    switch (viewState) {
      case 'success':
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <MailCheck className="h-8 w-8" />
          </div>
        );
      case 'error':
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <MailWarning className="h-8 w-8" />
          </div>
        );
      default:
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <Card className="w-full max-w-lg border-border/60 bg-background/95 backdrop-blur">
        <CardHeader className="flex flex-col items-center space-y-4 text-center">
          {renderStatusIcon()}
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {headline}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-sm text-muted-foreground">{message}</p>

          {viewState === 'waiting' && (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Didn&apos;t get the email? Check your spam folder or resend the
                verification message from your profile page.
              </p>
            </div>
          )}

          {viewState === 'success' && isUnauthenticated && (
            <Button asChild className="w-full">
              <Link href="/auth/signin">Back to sign in</Link>
            </Button>
          )}

          {viewState === 'error' && (
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/auth/signin">Back to sign in</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Need another link? Sign in again to trigger a fresh verification
                email.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
