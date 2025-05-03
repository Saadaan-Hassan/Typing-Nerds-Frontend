'use client';

import { motion } from 'framer-motion';
import { BarChart2, Dumbbell, Trophy, UserCircle } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    icon: Dumbbell,
    title: 'Practice Module',
    description:
      'Improve your typing skills with customizable practice sessions. Track your progress and see real-time WPM and accuracy metrics.',
    gradient: 'from-green-500 to-emerald-700',
  },
  {
    icon: Trophy,
    title: 'Competition Module',
    description:
      'Race against friends or random opponents in real-time typing competitions. Climb the global leaderboard and earn achievements.',
    gradient: 'from-blue-500 to-indigo-700',
  },
  {
    icon: UserCircle,
    title: 'User Accounts & Data',
    description:
      'Create your profile, save your progress, and access your typing history from any device. Set goals and track improvements over time.',
    gradient: 'from-purple-500 to-violet-700',
  },
  {
    icon: BarChart2,
    title: 'Analytics & Sharing',
    description:
      'Get detailed insights into your typing performance. Share your achievements on social media and challenge friends to beat your scores.',
    gradient: 'from-red-500 to-pink-700',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="bg-background relative py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.1),transparent_50%)]" />

      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful Features for{' '}
            <span className="text-primary">Typing Enthusiasts</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Everything you need to improve your typing speed and accuracy,
            compete with others, and track your progress.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="from-background to-muted/50 group h-full overflow-hidden border-none bg-gradient-to-br shadow-lg transition-shadow hover:shadow-xl">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                />
                <CardHeader>
                  <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <feature.icon className="text-primary h-6 w-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/70">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
