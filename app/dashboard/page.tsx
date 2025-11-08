import { redirect } from 'next/navigation';

import { getServerSession } from 'next-auth';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4 py-16">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {session.user?.name ?? 'there'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Explore the dashboard to keep your commitments, celebrate wins, and
            stay aligned with your team.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/60 bg-background/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Next steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Plan your next commitments, add rituals, and invite your team to
                collaborate.
              </p>
              <p>
                We&apos;re building more tools to help you stay on track—check
                back soon for updates.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Account status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Signed in as {session.user?.email ?? 'your account'}.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
