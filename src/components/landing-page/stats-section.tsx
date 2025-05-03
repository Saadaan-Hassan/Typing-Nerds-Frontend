'use client';

import { motion } from 'framer-motion';
import { Award, Clock, Keyboard, Users } from 'lucide-react';
import CountUp from 'react-countup';

const stats = [
  {
    icon: Users,
    value: 50000,
    label: 'Active Users',
    suffix: '+',
  },
  {
    icon: Award,
    value: 1000000,
    label: 'Races Completed',
    suffix: '+',
  },
  {
    icon: Clock,
    value: 120,
    label: 'Average WPM',
    suffix: '',
  },
  {
    icon: Keyboard,
    value: 99.8,
    label: 'Accuracy',
    suffix: '%',
    decimals: 1,
  },
];

export function StatsSection() {
  return (
    <section className="bg-background relative px-8 py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,rgba(var(--primary-rgb),0.1),transparent_70%)]" />

      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Our <span className="text-primary">Community</span> in Numbers
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Join thousands of typing enthusiasts who are improving their skills
            every day.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="from-background to-muted/50 border-border flex flex-col items-center rounded-lg border bg-gradient-to-br p-6 shadow-lg">
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <stat.icon className="text-primary h-6 w-6" />
                </div>
                <div className="mb-1 flex items-center text-3xl font-bold">
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    decimals={stat.decimals || 0}
                    decimal="."
                  />
                  <span>{stat.suffix}</span>
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
