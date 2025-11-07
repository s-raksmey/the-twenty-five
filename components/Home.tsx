// components/Home.tsx
'use client';

import { ArrowRight, Sparkles, Users, Zap } from 'lucide-react';

import HeroSection from '@/components/HeroSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const features = [
    {
      icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'AI Powered',
      description:
        'Leverage cutting-edge artificial intelligence for enhanced productivity.',
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'Lightning Fast',
      description:
        'Built for speed with optimized performance and instant responses.',
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'Collaborative',
      description: 'Work seamlessly with your team in real-time collaboration.',
    },
  ];

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Why Choose <span className="gradient-text">MyApp</span>?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of productivity with our innovative platform designed for modern teams and individuals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map(feature => (
              <Card
                key={feature.title}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
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
            <CardContent className="p-6 sm:p-8 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
                Join thousands of users who are already transforming their workflow with our platform.
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
