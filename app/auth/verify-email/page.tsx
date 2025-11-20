'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { CheckCircle2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyEmailPage() {
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const isAuthenticated = sessionStatus === 'authenticated';

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <Card className="w-full max-w-lg border-border/60 bg-background/95 backdrop-blur">
        <CardHeader className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Email verification no longer required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-sm text-muted-foreground">
            Great news—signing in with your Google account now gives you instant
            access to protected areas of the platform.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href={isAuthenticated ? '/dashboard' : '/auth/signin'}>
                {isAuthenticated ? 'Continue to dashboard' : 'Back to sign in'}
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              If you reached this page from an old verification email, simply
              sign in again to continue.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
