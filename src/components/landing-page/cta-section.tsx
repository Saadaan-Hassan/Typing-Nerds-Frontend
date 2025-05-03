'use client';

import { motion } from 'framer-motion';
import { Keyboard } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20">
      {/* Gradient background */}
      <div className="from-background via-background to-primary/10 absolute inset-0 -z-10 bg-gradient-to-b" />

      {/* Animated gradient circles */}
      <div className="from-primary/20 to-accent/20 absolute top-0 left-0 h-64 w-64 rounded-full bg-gradient-to-r blur-3xl" />
      <div className="from-primary/20 to-accent/20 absolute right-0 bottom-0 h-64 w-64 rounded-full bg-gradient-to-l blur-3xl" />

      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center justify-center"
          >
            <Keyboard className="text-primary mr-2 h-10 w-10" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Ready to Become a <span className="text-primary">Typing Nerd</span>?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <TypeAnimation
              sequence={[
                'Join thousands of users improving their typing skills.',
                2000,
                'Practice, compete, and track your progress.',
                2000,
                'Start your typing journey today.',
                2000,
              ]}
              wrapper="p"
              speed={50}
              className="text-muted-foreground text-lg"
              repeat={Number.POSITIVE_INFINITY}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="from-primary to-accent text-primary-foreground bg-gradient-to-r hover:opacity-90"
            >
              Sign Up Free
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
