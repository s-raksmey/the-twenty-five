import {
  Brain,
  CalendarCheck,
  LineChart,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const featureHighlights = [
  {
    title: 'Guided focus rituals',
    description:
      'Structure your twenty five with science-backed cadence blocks, check-ins, and reflections that keep the team aligned.',
    icon: CalendarCheck,
  },
  {
    title: 'Team accountability',
    description:
      'See progress in real time, celebrate wins together, and unlock momentum with transparent shared dashboards.',
    icon: Users,
  },
  {
    title: 'AI copilots',
    description:
      'Our Braintrust engine suggests the next best action, summarizes outcomes, and nudges you before momentum slips.',
    icon: Brain,
  },
];

const automationFeatures = [
  {
    title: 'Adaptive scheduling',
    description:
      'Reschedules missed check-ins and aligns calendars automatically when priorities shift.',
  },
  {
    title: 'Focus safeguards',
    description:
      'Silences noisy channels, locks scope, and escalates blockers so you keep shipping.',
  },
  {
    title: 'Celebration loops',
    description:
      'Auto-generate highlight reels to share with stakeholders and keep morale high.',
  },
];

const performanceMetrics = [
  { metric: '25 min', label: 'Average ritual duration' },
  { metric: '4.9/5', label: 'Weekly focus satisfaction' },
  { metric: '87%', label: 'Teams reporting sustained momentum' },
];

export default function FeaturesPage() {
  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-secondary/20 p-8 sm:p-12">
        <div className="pointer-events-none absolute -left-16 top-20 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-secondary/30 blur-3xl" />
        <div className="relative space-y-6">
          <Badge variant="secondary" className="bg-white/70 text-foreground">
            Focus, share, celebrate
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Everything you need to run your twenty five rituals with confidence
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            THE TWENTY FIVE combines proven focus frameworks with delightful
            collaboration tools. Keep everyone on pace, reduce friction, and
            spotlight the work that moves the needle.
          </p>
          <div className="grid gap-6 pt-4 sm:grid-cols-3">
            {performanceMetrics.map(metric => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/20 bg-white/60 p-4 text-left shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-3xl font-semibold text-foreground sm:text-4xl">
                  {metric.metric}
                </p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <div className="space-y-3">
          <Badge variant="outline" className="border-primary/40 text-primary">
            Core capabilities
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Designed for teams who care about meaningful outcomes
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            From deep work sessions to sprint reviews, orchestrate every ritual
            in one place. Tailor the cadence, automate the handoffs, and surface
            insights instantly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featureHighlights.map(feature => (
            <Card
              key={feature.title}
              className="h-full border border-white/20 bg-white/70 text-left shadow-md backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
            >
              <CardContent className="space-y-4 p-6">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/15 bg-background/80 p-8 shadow-xl backdrop-blur lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Automations that keep the momentum alive
            </h3>
            <p className="max-w-xl text-muted-foreground">
              We built THE TWENTY FIVE to handle the busywork so your team can
              stay focused. Automations keep everyone informed without the pings
              and nagging.
            </p>
            <div className="grid gap-4">
              {automationFeatures.map(feature => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5"
                >
                  <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                    <Sparkles className="h-4 w-4" />
                    {feature.title}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 rounded-2xl border border-white/10 bg-white/70 p-6 shadow-md backdrop-blur dark:bg-white/5">
            <h4 className="text-lg font-semibold text-foreground">
              Built for measurable progress
            </h4>
            <p className="text-sm text-muted-foreground">
              See where every commitment stands with dashboards tuned for
              clarity. Our goal tracking keeps objectives visible and connected
              to daily rituals.
            </p>
            <div className="h-px w-full bg-primary/20" />
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Target className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    Goal alignment built in
                  </p>
                  <p>
                    Link every ritual to strategic outcomes and highlight
                    progress in context.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <LineChart className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    Insights without spreadsheets
                  </p>
                  <p>
                    Export executive-ready snapshots or drill into the details
                    right inside the workspace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
