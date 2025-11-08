import { Check, Crown, Rocket, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'per month',
    description:
      'Perfect for individuals experimenting with a consistent twenty five routine.',
    highlight: 'Try the rituals at your own pace.',
    cta: 'Get started',
    icon: Rocket,
    features: [
      'Unlimited personal rituals',
      'Daily focus summaries',
      'Community templates',
      'Email-based support',
    ],
  },
  {
    name: 'Team',
    price: '$18',
    period: 'per member / month',
    description:
      'Bring your crew together with accountability tools and guided ceremonies.',
    highlight: 'Our most popular plan for fast-moving teams.',
    cta: 'Start team trial',
    icon: Sparkles,
    popular: true,
    features: [
      'Shared ritual dashboards',
      'AI recap assistant',
      'Goals & milestone tracking',
      'Priority support within 2 hours',
    ],
  },
  {
    name: 'Scale',
    price: 'Let’s talk',
    period: 'custom pricing',
    description:
      'For organisations that run twenty five across multiple departments or regions.',
    highlight: 'White-glove onboarding and governance controls.',
    cta: 'Book a demo',
    icon: Crown,
    features: [
      'Advanced security reviews',
      'Dedicated success partner',
      'Custom data residency',
      'Enterprise integrations',
    ],
  },
];

const faqs = [
  {
    question: 'Can we trial THE TWENTY FIVE before upgrading?',
    answer:
      'Yes. Every new workspace receives a 14-day Team trial with full access to rituals, AI copilots, and integrations. Downgrading afterwards is automatic if you do nothing.',
  },
  {
    question: 'Do you offer discounts for education or non-profits?',
    answer:
      'We love mission-driven groups. Reach out and we will match you with a partner manager to tailor pricing that fits your budget.',
  },
  {
    question: 'How does billing work for collaborators?',
    answer:
      'Guests are free. Only core team members with scheduling or admin privileges count toward your active seats each month.',
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-16 pb-16">
      <section className="space-y-6 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-secondary/20 p-10">
        <Badge variant="secondary" className="bg-white/70 text-foreground">
          Simple, transparent pricing
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Choose the plan that keeps your rituals thriving
        </h1>
        <p className="max-w-2xl text-muted-foreground sm:text-lg">
          Whether you are leading yourself or an entire organisation, our
          pricing stays fair and scales with the value you unlock. Upgrade or
          downgrade at any time.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {plans.map(plan => (
          <Card
            key={plan.name}
            className={`h-full border border-white/20 bg-white/70 shadow-lg backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5 ${
              plan.popular ? 'ring-2 ring-primary/50' : ''
            }`}
          >
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <plan.icon className="h-5 w-5" />
                </div>
                <Badge variant={plan.popular ? 'default' : 'outline'}>
                  {plan.popular ? 'Most loved' : plan.highlight}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-semibold">
                {plan.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>
              <Button
                className="w-full"
                size="lg"
                variant={plan.popular ? 'default' : 'secondary'}
              >
                {plan.popular ? 'Start team trial' : plan.cta}
              </Button>
              <div className="h-px w-full bg-primary/20" />
              <ul className="space-y-3 text-sm text-muted-foreground">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-8 rounded-3xl border border-white/15 bg-background/80 p-8 shadow-xl backdrop-blur lg:p-12">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Questions, answered
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {faqs.map(item => (
            <div key={item.question} className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                {item.question}
              </h3>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
