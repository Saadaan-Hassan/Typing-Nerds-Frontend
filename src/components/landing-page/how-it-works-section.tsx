'use client';

import { motion } from 'framer-motion';
import { Award, BarChart, Keyboard, Users } from 'lucide-react';

const steps = [
  {
    icon: Keyboard,
    title: 'Practice Daily',
    description:
      'Start with personalized typing exercises tailored to your skill level.',
    color: 'bg-blue-300',
    illustration:
      'https://media.istockphoto.com/id/1494447525/vector/home-office-workspace-concept-with-desktop-computer.jpg?s=612x612&w=0&k=20&c=__qnA9ZPWanqtSjgh6Zk22pwk7--0g3wmplWSLm4AyU=', // Typing practice illustration
  },
  {
    icon: Users,
    title: 'Join Competitions',
    description:
      'Challenge others in real-time typing races to test your skills.',
    color: 'bg-gray-500',
    illustration:
      'https://www.gsb.stanford.edu/sites/default/files/styles/webp/public/competition-key.jpg.webp?itok=bzyr3V1x', // Competition illustration
  },
  {
    icon: BarChart,
    title: 'Track Progress',
    description:
      'Monitor your improvement with detailed analytics and insights.',
    color: 'bg-pink-300',
    illustration:
      'https://t4.ftcdn.net/jpg/04/73/47/31/360_F_473473129_wN82hxvgR9XpvUQ7YlB4v1wnpjXjiU20.jpg', // Analytics illustration
  },
  {
    icon: Award,
    title: 'Earn Achievements',
    description:
      'Unlock badges and climb the global leaderboard as you improve.',
    color: 'bg-blue-400',
    illustration:
      'https://media.istockphoto.com/id/1643836220/vector/businesswoman-jumps-pole-vault-flat-style-design-vector-illustration-business-concept.jpg?s=612x612&w=0&k=20&c=OFzD69GIgrtoLg_jCitABWGKZT78qmAOI1pXUkFtEuI=', // Award illustration
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
            How Typing<span className="text-primary">Nerds</span> Works
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
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center gap-8`}
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
                  <div className="from-background to-muted border-border rounded-lg border bg-gradient-to-br p-6 shadow-lg">
                    <div className="bg-muted/50 flex aspect-video items-center justify-center overflow-hidden rounded">
                      <img
                        src={step.illustration}
                        alt={step.title}
                        className="h-full w-full object-contain"
                      />
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
