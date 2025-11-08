import { Compass, Heart, Lightbulb, Rocket, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const values = [
  {
    title: 'Intentional by default',
    description:
      'We design every ritual to create clarity. If it does not reduce noise or spark momentum, it does not ship.',
    icon: Compass,
  },
  {
    title: 'Humans over dashboards',
    description:
      'Metrics matter, but people matter more. We focus on experiences that keep teams energised and connected.',
    icon: Users,
  },
  {
    title: 'Celebrate the small wins',
    description:
      'Progress is a daily practice. THE TWENTY FIVE highlights each tiny victory to keep motivation high.',
    icon: Heart,
  },
];

const milestones = [
  {
    year: '2021',
    title: 'The idea sparks',
    description:
      'Our founders prototyped a simple ritual to help friends stay accountable to their goals. The first twenty five sessions were run manually over video calls.',
  },
  {
    year: '2022',
    title: 'Product takes shape',
    description:
      'We launched the private beta with AI-assisted facilitation. Teams reported sharper focus and fewer status meetings within weeks.',
  },
  {
    year: '2023',
    title: 'Global community grows',
    description:
      'Thousands of members across 40+ countries host daily rituals through the platform, sharing templates and best practices.',
  },
  {
    year: 'Today',
    title: 'Building the future of ritual work',
    description:
      'We continue to invest in the Braintrust engine, deeper integrations, and research-backed practices that keep high-performing teams aligned.',
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      <section className="space-y-6 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-secondary/20 p-10">
        <Badge variant="secondary" className="bg-white/70 text-foreground">
          Our story
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          We help teams honour their commitments every single day
        </h1>
        <p className="max-w-2xl text-muted-foreground sm:text-lg">
          THE TWENTY FIVE began as a ritual between friends trying to create
          sustainable momentum. Today it is a platform that blends thoughtful
          design with research-backed habits so teams never lose sight of what
          matters.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="h-full border border-white/20 bg-white/70 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
          <CardContent className="space-y-6 p-8">
            <div className="flex items-center gap-3 text-primary">
              <Rocket className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-widest">
                Mission
              </span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              Build a home for the rituals that keep ambitious teams aligned,
              accountable, and inspired.
            </p>
            <p className="text-sm text-muted-foreground">
              Rituals transform strategy into action. We craft tools that make
              those rituals effortless, measurable, and delightful.
            </p>
          </CardContent>
        </Card>

        <Card className="h-full border border-white/20 bg-white/70 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
          <CardContent className="space-y-6 p-8">
            <div className="flex items-center gap-3 text-primary">
              <Lightbulb className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-widest">
                What guides us
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              We work in small, multidisciplinary squads who obsess over real
              team outcomes. Every iteration is co-created with our community.
            </p>
            <div className="h-px w-full bg-primary/20" />
            <div className="space-y-4">
              {values.map(value => (
                <div key={value.title} className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <value.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {value.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-8 rounded-3xl border border-white/15 bg-background/80 p-8 shadow-xl backdrop-blur lg:p-12">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Milestones
        </h2>
        <div className="space-y-6">
          {milestones.map(milestone => (
            <div
              key={milestone.year}
              className="rounded-2xl border border-white/15 bg-white/70 p-6 shadow-sm backdrop-blur transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                  {milestone.year}
                </span>
                <span className="text-base font-semibold text-foreground">
                  {milestone.title}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
