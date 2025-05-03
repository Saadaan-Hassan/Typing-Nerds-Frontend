'use client';

import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { ArrowRight, Code, Keyboard, Target, Trophy, Zap } from 'lucide-react';

import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCards } from '@/components/leaderboard/stats-cards';

export default function DashboardPage() {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Quick Race',
      description: 'Join a typing race against other users',
      icon: Keyboard,
      href: '/',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Competition',
      description: 'Join or create typing competitions',
      icon: Zap,
      href: ROUTES.COMPETITION.HOME,
      color: 'bg-red-500/10 text-red-500',
    },
    {
      title: 'Practice Session',
      description: 'Improve your typing skills with customized drills',
      icon: Target,
      href: ROUTES.PRACTICE,
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'Code Practice',
      description: 'Practice typing code snippets in various languages',
      icon: Code,
      href: `${ROUTES.PRACTICE}/code`,
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: 'Leaderboard',
      description: 'See how you rank against other typists',
      icon: Trophy,
      href: ROUTES.LEADERBOARD,
      color: 'bg-amber-500/10 text-amber-500',
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name || 'Typist'}
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and continue improving your typing skills
        </p>
      </div>

      <div className="mb-8">
        <StatsCards />
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className={`w-fit rounded-lg p-2 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-2 text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-between"
                >
                  <Link href={action.href}>
                    Start <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Tabs defaultValue="activity" className="mt-8">
        <TabsList className="bg-secondary">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Races</CardTitle>
              <CardDescription>Your latest typing competitions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4 text-center">
                <p className="text-muted-foreground">
                  You haven&apos;t participated in any races yet. Join a race to
                  see your activity here.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/">Start Racing</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stats" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typing Performance</CardTitle>
              <CardDescription>
                Your typing speed and accuracy over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4 text-center">
                <p className="text-muted-foreground">
                  Complete more typing tests to see your performance charts
                  here.
                </p>
                <Button asChild className="mt-4">
                  <Link href={ROUTES.PRACTICE}>Practice Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="achievements" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>
                Badges and trophies you&apos;ve earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4 text-center">
                <p className="text-muted-foreground">
                  Complete challenges and improve your skills to earn
                  achievements.
                </p>
                <Button asChild className="mt-4">
                  <Link href={ROUTES.PRACTICE}>Start Practicing</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
