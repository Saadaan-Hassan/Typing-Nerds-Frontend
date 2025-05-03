'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Alex Johnson',
    role: 'Software Developer',
    image: '/placeholder.svg?height=100&width=100',
    content:
      'TypingNerds has transformed my coding workflow. My typing speed increased from 60 WPM to over 100 WPM in just two months of practice!',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'Content Writer',
    image: '/placeholder.svg?height=100&width=100',
    content:
      'As a professional writer, typing speed is crucial. The practice modules and real-time analytics have helped me optimize my typing technique.',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'Student',
    image: '/placeholder.svg?height=100&width=100',
    content:
      "The competition feature makes practicing fun! I've made friends from around the world while improving my typing skills for school.",
    rating: 4,
  },
  {
    name: 'Emily Taylor',
    role: 'Executive Assistant',
    image: '/placeholder.svg?height=100&width=100',
    content:
      'TypingNerds helped me secure my dream job by improving my typing speed and accuracy. The analytics helped me identify and fix my weak points.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Data Analyst',
    image: '/placeholder.svg?height=100&width=100',
    content:
      'The customizable practice sessions are perfect for focusing on number typing, which is essential in my line of work. Highly recommended!',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex(
      (current) => (current - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  return (
    <section className="bg-muted/30 relative py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--accent-rgb),0.1),transparent_70%)]" />

      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            What Our <span className="text-primary">Users</span> Say
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Hear from people who have improved their typing skills with
            TypingNerds.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="from-background to-muted/50 border-none bg-gradient-to-br shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4">
                          <Avatar className="border-primary/10 h-20 w-20 border-4">
                            <AvatarImage
                              src={testimonial.image || '/placeholder.svg'}
                              alt={testimonial.name}
                            />
                            <AvatarFallback>
                              {testimonial.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="mb-4 flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < testimonial.rating
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <blockquote className="mb-4 text-lg italic">
                          &rdquo;{testimonial.content}&rdquo;
                        </blockquote>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAutoplay(false);
                  setActiveIndex(index);
                }}
                className={`h-2 min-w-2 rounded-full p-0 ${activeIndex === index ? 'bg-primary' : 'bg-primary/20'}`}
              />
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
