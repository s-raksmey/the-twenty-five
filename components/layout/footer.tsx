'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { ArrowUp, Github, Linkedin, Mail, Twitter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <Github className="w-4 h-4" />,
      href: 'https://github.com',
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-4 h-4" />,
      href: 'https://twitter.com',
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-4 h-4" />,
      href: 'https://linkedin.com',
    },
    {
      name: 'Email',
      icon: <Mail className="w-4 h-4" />,
      href: 'mailto:hello@myapp.com',
    },
  ];

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Case Studies', href: '/case-studies' },
        { name: 'Updates', href: '/updates' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Press', href: '/press' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Help Center', href: '/help' },
        { name: 'Community', href: '/community' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Security', href: '/security' },
      ],
    },
  ];

  return (
    <footer className="relative bg-background border-t">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute bottom-0 left-4 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-4 sm:right-10 w-20 h-20 sm:w-32 sm:h-32 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 sm:mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4"
          >
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary" />
              <span className="text-xl sm:text-2xl font-bold">
                THE TWENTY FIVE
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md text-sm sm:text-base">
              Building the future of productivity with cutting-edge design and
              innovative technology. Join thousands of users transforming their
              workflow.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map(social => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4"
          >
            <h3 className="font-semibold text-lg mb-3 sm:mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Get the latest news and product updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button className="shrink-0 sm:px-6">Subscribe</Button>
            </div>
          </motion.div>

          {/* Quick Links Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4 grid grid-cols-2 gap-6 sm:gap-8"
          >
            {footerSections.map(section => (
              <div key={section.title}>
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>

        <Separator className="my-6 sm:my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 text-sm text-muted-foreground text-center sm:text-left"
          >
            <span>© {currentYear} THE TWENTY FIVE. All rights reserved.</span>
          </motion.div>

          {/* Additional Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center space-x-4 sm:space-x-6 text-sm text-muted-foreground"
          >
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors text-xs sm:text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors text-xs sm:text-sm"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="hover:text-foreground transition-colors text-xs sm:text-sm"
            >
              Cookies
            </Link>

            {/* Scroll to Top Button */}
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-foreground hover:bg-accent/80 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-16 left-10 sm:bottom-32 sm:left-20 w-2 h-2 sm:w-3 sm:h-3 bg-secondary rounded-full opacity-30 animate-pulse delay-1000"></div>
    </footer>
  );
}
