'use client';

import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { StatsCards } from '@/components/leaderboard/stats-cards';
import { UserBadges } from '@/components/leaderboard/user-badges';

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState('daily');

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-primary-foreground text-3xl font-bold tracking-tight">
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          See how you rank against other typists.
        </p>
      </div>

      <StatsCards />

      <div className="mt-8">
        <UserBadges />
      </div>

      <Tabs
        defaultValue="daily"
        className="mt-8"
        onValueChange={handleTimeRangeChange}
      >
        <div className="flex items-center justify-between">
          <TabsList className="bg-secondary">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="all-time">All Time</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="daily" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Daily Top Performers</CardTitle>
              <CardDescription>
                The fastest typists in the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekly" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Weekly Top Performers</CardTitle>
              <CardDescription>
                The fastest typists in the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Monthly Top Performers</CardTitle>
              <CardDescription>
                The fastest typists in the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="all-time" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All-Time Top Performers</CardTitle>
              <CardDescription>The fastest typists of all time</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
