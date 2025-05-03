'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Keyboard } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="from-background via-background to-primary/5 absolute inset-0 -z-10 bg-gradient-to-b" />

      {/* Animated gradient circles */}
      <div className="from-primary/20 to-accent/20 absolute -top-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r blur-3xl" />
      <div className="from-primary/20 to-accent/20 absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-gradient-to-l blur-3xl" />

      {/* Floating keyboard keys animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[
          'A',
          'S',
          'D',
          'F',
          'J',
          'K',
          'L',
          'W',
          'E',
          'R',
          'T',
          'Y',
          'U',
          'I',
          'O',
          'P',
        ].map((key, index) => (
          <motion.div
            key={index}
            className="text-primary/10 absolute font-mono font-bold"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -100,
              opacity: 0.3,
              scale: Math.random() * 2 + 1,
            }}
            animate={{
              y: window.innerHeight + 100,
              rotate: Math.random() * 360,
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 2 + 1}rem`,
            }}
          >
            {key}
          </motion.div>
        ))}
      </div>

      <div className="container px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center justify-center"
        >
          <Keyboard className="text-primary mr-2 h-12 w-12" />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Typing<span className="text-primary">Nerds</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-8 max-w-3xl"
        >
          <TypeAnimation
            sequence={[
              'Master the keyboard. Dominate the leaderboard.',
              2000,
              'Type faster. Type smarter. Type better.',
              2000,
              'Join the elite typing community today.',
              2000,
            ]}
            wrapper="h2"
            speed={50}
            className="text-muted-foreground text-xl font-light md:text-2xl"
            repeat={Number.POSITIVE_INFINITY}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="from-primary to-accent text-primary-foreground bg-gradient-to-r hover:opacity-90"
          >
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            Try Demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute right-0 bottom-10 left-0 flex justify-center"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToFeatures}
            className={cn(
              'animate-bounce rounded-full',
              scrolled ? 'opacity-0' : 'opacity-100'
            )}
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
