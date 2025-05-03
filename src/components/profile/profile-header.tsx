'use client';

import Link from 'next/link';

import { useAuth } from '@/lib/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Card as ProfileCard,
  CardContent as ProfileCardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecentRaces } from '@/components/leaderboard/recent-races';
import { StatsCards } from '@/components/leaderboard/stats-cards';

// ProfileHeader uses user data from context and User type fields
export function ProfileHeader() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <ProfileCard>
        <ProfileCardContent className="flex justify-center p-6">
          <div className="bg-muted h-24 w-24 animate-pulse rounded-full" />
          <div className="ml-4 flex-1 space-y-2">
            <div className="bg-muted h-6 w-3/4 animate-pulse rounded" />
            <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
          </div>
        </ProfileCardContent>
      </ProfileCard>
    );
  }

  if (!user) return null;

  // Format join date from user.createdAt
  const joinDate = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
  });

  return (
    <ProfileCard>
      <ProfileCardContent className="p-6">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          {/* Avatar */}
          <Avatar className="border-primary/10 h-24 w-24 border-4">
            <AvatarImage
              src={user.profilePicture || '/placeholder.svg'}
              alt={user.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {/* <Badge variant="outline" className="bg-primary/10 text-primary">
                {user.role}
              </Badge> */}
              <Badge variant="outline">Member since {joinDate}</Badge>
            </div>
          </div>

          {/* Edit Profile Button */}
          {/* <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Edit Profile
          </Button> */}
        </div>
      </ProfileCardContent>
    </ProfileCard>
  );
}

// Main Profile Page
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
                <Link
                  href="/leaderboard"
                  className="text-primary mt-2 block text-right text-sm font-medium hover:underline"
                >
                  View full leaderboard
                </Link>
              </Card>
            </div>
          </TabsContent>

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

          <TabsContent value="achievements">
            <Card className="rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>
                  Badges and milestones you’ve earned.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground py-8 text-center">
                  🎉 More achievements coming soon!
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
