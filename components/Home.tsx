'use client';

import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarCheck2,
  Layers,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

import HeroSection from '@/components/HeroSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const features = [
    {
      icon: <Brain className="w-5 h-5 sm:w-6 sm:h-6" />,
      badge: 'Intelligence',
      title: 'AI Powered',
      description:
        'Let our copilots automate busy work, summarize updates, and surface insights before you even ask.',
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      badge: 'Performance',
      title: 'Lightning Fast',
      description:
        'Optimized rendering and smart caching deliver instant responses, even on complex workflows.',
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      badge: 'Collaboration',
      title: 'Team Spaces',
      description:
        'Co-create in shared canvases with presence indicators, comment threads, and version history.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
      badge: 'Security',
      title: 'Enterprise Ready',
      description:
        'SOC2 compliant, SSO support, and fine-grained permissions keep your data safe at scale.',
    },
    {
      icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6" />,
      badge: 'Extensibility',
      title: 'Modular Blocks',
      description:
        'Compose dashboards, docs, and automation flows using reusable building blocks tailored to your team.',
    },
    {
      icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />,
      badge: 'Analytics',
      title: 'Adaptive Reporting',
      description:
        'Track adoption, capacity, and ROI with live metrics that adapt to the goals you set.',
    },
  ];

  const workflowSteps = [
    {
      title: 'Plan with clarity',
      description:
        'Kick off every initiative with AI-crafted briefs, stakeholder templates, and smart reminders to keep owners aligned.',
    },
    {
      title: 'Build together',
      description:
        'Co-edit docs, automate approvals, and sync updates across tools with just a few clicks.',
    },
    {
      title: 'Measure impact',
      description:
        'Dashboards update in real-time so you can celebrate wins and spot blockers before they escalate.',
    },
  ];

  const testimonials = [
    {
      quote:
        '“The automation playbooks saved our team at least ten hours a week. Shipping faster has become our new normal.”',
      author: 'Avery Stone',
      role: 'Director of Product, LaunchLab',
    },
    {
      quote:
        '“Switching to MyApp unified our docs, tasks, and analytics. Stakeholders finally share the same source of truth.”',
      author: 'Mira Patel',
      role: 'Operations Lead, Northwind Co.',
    },
  ];

  const metrics = [
    { value: '2x', label: 'Faster onboarding' },
    { value: '94%', label: 'Tasks automated' },
    { value: '40%', label: 'Meetings reduced' },
  ];

  return (
    <div className="min-h-screen space-y-24 sm:space-y-32">
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl space-y-12 sm:space-y-16">
          <div className="text-center px-4 space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Why teams choose <span className="gradient-text">MyApp</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Ship faster with a unified workspace that adapts to your team, connects your tools, and automates routine work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map(feature => (
              <Card
                key={feature.title}
                className="group h-full border-border/40 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl"
              >
                <CardContent className="flex h-full flex-col gap-4 p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <Badge variant="secondary" className="uppercase tracking-wide">
                      {feature.badge}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span>Explore playbooks</span>
                    <Sparkles className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {metrics.map(metric => (
              <Card key={metric.label} className="border-0 bg-primary/5">
                <CardContent className="py-6 sm:py-8 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{metric.value}</div>
                  <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                    {metric.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto max-w-6xl grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Your workflow, orchestrated end to end
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
                From brainstorming to launch reviews, MyApp keeps every stakeholder aligned with delightful automation and human-first design.
              </p>
            </div>

            <ol className="space-y-5 sm:space-y-6">
              {workflowSteps.map((step, index) => (
                <li key={step.title} className="relative rounded-2xl border border-border/60 bg-card/70 p-5 sm:p-6">
                  <span className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    {index + 1}
                  </span>
                  <div className="space-y-2 pl-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <Card className="border-border/60 bg-background/70 backdrop-blur">
            <CardContent className="flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
              <div className="space-y-3">
                <Badge variant="outline" className="w-fit uppercase tracking-wide">
                  Calendar sync
                </Badge>
                <h3 className="text-xl font-semibold text-foreground">
                  Stay ahead with proactive nudges
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Calendar-aware automations reschedule check-ins, suggest owners for outstanding tasks, and summarize what changed while you were away.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-primary/10 p-4 text-sm text-primary">
                <CalendarCheck2 className="h-5 w-5" />
                <span>Syncs with Google Calendar, Outlook, and Notion events.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl space-y-10 sm:space-y-12">
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Teams are shipping their best work yet
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear how forward-thinking teams orchestrate launches, delight customers, and focus on the work that matters.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
            {testimonials.map(testimonial => (
              <Card key={testimonial.author} className="border-border/40 bg-card/70 backdrop-blur-sm">
                <CardContent className="flex h-full flex-col gap-6 p-6 sm:p-8">
                  <p className="text-base sm:text-lg leading-relaxed text-foreground">
                    {testimonial.quote}
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="border-0 bg-background/80 backdrop-blur-sm">
            <CardContent className="space-y-6 sm:space-y-8 p-6 sm:p-8 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Ready to get started?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of teams automating launches, consolidating tools, and empowering their organizations with MyApp.
              </p>
              <Button size="lg" className="gap-2 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg">
                Get Started Free
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
