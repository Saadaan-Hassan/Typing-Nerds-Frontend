'use client';

import { motion } from 'framer-motion';
import { Award, BarChart, Keyboard, Users } from 'lucide-react';

const steps = [
  {
    icon: Keyboard,
    title: 'Practice Daily',
    description:
      'Start with personalized typing exercises tailored to your skill level.',
    color: 'bg-green-500',
  },
  {
    icon: Users,
    title: 'Join Competitions',
    description:
      'Challenge others in real-time typing races to test your skills.',
    color: 'bg-blue-500',
  },
  {
    icon: BarChart,
    title: 'Track Progress',
    description:
      'Monitor your improvement with detailed analytics and insights.',
    color: 'bg-purple-500',
  },
  {
    icon: Award,
    title: 'Earn Achievements',
    description:
      'Unlock badges and climb the global leaderboard as you improve.',
    color: 'bg-red-500',
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-muted/30 relative py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(var(--accent-rgb),0.1),transparent_50%)]" />

      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            How <span className="text-primary">TypingNerds</span> Works
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Follow these simple steps to improve your typing skills and join our
            community of typing enthusiasts.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="from-primary/30 via-primary/50 to-primary/30 absolute top-0 left-1/2 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b md:block" />

          <div className="relative space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}
              >
                <div className="text-center md:w-1/2 md:text-left">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${step.color} mb-4 text-white`}
                  >
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                <div className="relative md:w-1/2">
                  {/* Circle on the timeline */}
                  <div className="bg-primary absolute top-1/2 left-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full md:block" />

                  {/* Step illustration */}
                  <div className="from-background to-muted border-border rounded-lg border bg-gradient-to-br p-6 shadow-lg">
                    <div className="bg-muted/50 flex aspect-video items-center justify-center rounded">
                      <step.icon className="text-primary/40 h-16 w-16" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
