'use client';

import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecentRaces } from '@/components/leaderboard/recent-races';
import { StatsCards } from '@/components/leaderboard/stats-cards';
import { UserBadges } from '@/components/leaderboard/user-badges';
import { ProfileHeader } from '@/components/profile/profile-header';

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      {/* Header with user info */}
      <ProfileHeader />

      {/* Stats overview cards */}
      <section className="mt-10">
        <StatsCards />
      </section>

      {/* Tabs for detailed sections */}
      <section className="mt-12">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary flex space-x-2 rounded-lg p-1">
            {['overview', 'history', 'achievements'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="hover:bg-secondary/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 rounded-lg py-2 text-center"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle>Typing Performance</CardTitle>
                  <CardDescription>
                    Your typing speed and accuracy over time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted text-muted-foreground flex h-48 items-center justify-center rounded-md">
                    Chart coming soon...
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Races</CardTitle>
                  <CardDescription>
                    Your most recent typing competitions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentRaces />
                </CardContent>
                <CardFooter className="text-right">
                  <Link
                    href="/leaderboard"
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    View full leaderboard
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle>Race History</CardTitle>
                <CardDescription>
                  A complete record of all your typing races.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentRaces showAll />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab with UserBadges */}
          <TabsContent value="achievements">
            <UserBadges />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
