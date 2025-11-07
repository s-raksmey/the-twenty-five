// components/ThemeToggle.tsx
'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const initialDark = savedTheme ? savedTheme === 'dark' : systemDark;

    const frame = requestAnimationFrame(() => {
      setIsDark(initialDark);
      setMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg"
        disabled
      >
        <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
          >
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg backdrop-blur-sm bg-background/80 border"
              onClick={toggleTheme}
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              {isDark ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="left" className="text-xs sm:text-sm">
          <p>{isDark ? 'Light mode' : 'Dark mode'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
