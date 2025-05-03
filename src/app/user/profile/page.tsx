'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import {
  AlarmClock,
  Award,
  Clock,
  Crown,
  History,
  Medal,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';

import { useAuth } from '@/lib/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// HistoryItem component for race and drill history
function HistoryItem({
  date,
  wpm,
  accuracy,
  type,
  position = null,
}: {
  date: string;
  wpm: number;
  accuracy: number;
  type: 'race' | 'drill';
  position?: number | null;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
          {type === 'race' ? (
            <Trophy className="text-primary h-5 w-5" />
          ) : (
            <AlarmClock className="text-primary h-5 w-5" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-medium">
            {type === 'race' ? 'Race' : 'Practice'} Session
          </h4>
          <p className="text-xs text-gray-500">
            {new Date(date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="text-right">
          <p className="text-xs text-gray-500">WPM</p>
          <p className="font-semibold">{wpm}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Accuracy</p>
          <p className="font-semibold">{accuracy}%</p>
        </div>
        {type === 'race' && position !== null && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Position</p>
            <p className="font-semibold">
              {position === 1 ? (
                <span className="flex items-center text-yellow-500">
                  <Crown className="mr-1 h-3 w-3" /> 1st
                </span>
              ) : position === 2 ? (
                <span className="flex items-center text-gray-400">
                  <Medal className="mr-1 h-3 w-3" /> 2nd
                </span>
              ) : position === 3 ? (
                <span className="flex items-center text-amber-700">
                  <Medal className="mr-1 h-3 w-3" /> 3rd
                </span>
              ) : (
                `${position}th`
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Badge display component
function BadgeDisplay({
  badge,
}: {
  badge: {
    name: string;
    description: string;
    imageUrl: string;
  };
}) {
  return (
    <div
      className="bg-secondary/50 hover:bg-secondary/70 flex flex-col items-center rounded-lg p-3 transition-colors"
      title={badge.description}
    >
      <div className="bg-primary/10 mb-2 flex h-14 w-14 items-center justify-center rounded-full">
        <Award className="text-primary h-8 w-8" />
      </div>
      <span className="text-center text-xs font-medium">{badge.name}</span>
    </div>
  );
}

// Statistics card component
function StatCard({
  value,
  description,
  icon,
}: {
  value: number | string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="bg-primary/20 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
            {icon}
          </div>
          <h3 className="text-xl font-bold">{value}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect non-authenticated users to login page
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, router, loading]);

  // If loading, show skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="mb-2 h-12 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="mb-8 h-40 w-full" />
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">
          Please login to access your profile
        </h1>
        <Button onClick={() => router.push(ROUTES.AUTH.LOGIN)}>
          Login Now
        </Button>
      </div>
    );
  }

  // Format join date
  const joinDate = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get stats from user
  const stats = user.stats || {
    avgWpm: 0,
    avgAccuracy: 0,
    rank: 'Beginner',
    totalRaces: 0,
    totalDrills: 0,
  };

  // Get history from detailed stats
  const raceHistory = user.detailedStats?.raceHistory || [];
  const drillHistory = user.detailedStats?.drillHistory || [];

  // Combine and sort histories for the overview tab (limited to 5)
  const combinedHistory = [
    ...raceHistory.map((race) => ({
      date: race.date,
      wpm: race.wpm,
      accuracy: race.accuracy,
      type: 'race' as const,
      position: race.position,
    })),
    ...drillHistory.map((drill) => ({
      date: drill.date,
      wpm: drill.wpm,
      accuracy: drill.accuracy,
      type: 'drill' as const,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          View your statistics and typing history
        </p>
      </div>

      {/* User Profile Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <Avatar className="border-primary/10 h-24 w-24 border-4">
              <AvatarImage
                src={user.profilePicture || '/placeholder.svg'}
                alt={user.name}
              />
              <AvatarFallback className="text-primary-foreground bg-primary text-2xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3 text-center md:text-left">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>

              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {stats.rank || 'Beginner'} Typist
                </Badge>
                <Badge variant="outline">Member since {joinDate}</Badge>
                {user.isEmailVerified && (
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800"
                  >
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          value={stats.avgWpm || 0}
          description="Your typing speed"
          icon={<Zap className="text-primary h-6 w-6" />}
        />

        <StatCard
          value={`${stats.avgAccuracy || 0}%`}
          description="Typing precision"
          icon={<Award className="text-primary h-6 w-6" />}
        />

        <StatCard
          value={stats.totalRaces || 0}
          description="Competitions completed"
          icon={<Trophy className="text-primary h-6 w-6" />}
        />

        <StatCard
          value={stats.totalDrills || 0}
          description="Practice sessions"
          icon={<AlarmClock className="text-primary h-6 w-6" />}
        />
      </div>

      {/* Detailed Tabs */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6 grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">
            <Star className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="badges">
            <Medal className="mr-2 h-4 w-4" />
            Badges
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Performance Summary */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>
                  Your overall typing performance stats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Highest WPM */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Highest WPM</span>
                      <span className="font-bold">
                        {user.detailedStats?.highestWPM || stats.avgWpm || 0}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        ((user.detailedStats?.highestWPM || stats.avgWpm || 0) /
                          150) *
                          100
                      )}
                      className="h-2"
                    />
                  </div>

                  {/* Highest Accuracy */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Highest Accuracy
                      </span>
                      <span className="font-bold">
                        {user.detailedStats?.highestAccuracy ||
                          stats.avgAccuracy ||
                          0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        user.detailedStats?.highestAccuracy ||
                        stats.avgAccuracy ||
                        0
                      }
                      className="h-2"
                    />
                  </div>

                  {/* Races Won */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Races Won</span>
                      <span className="font-bold">
                        {user.detailedStats?.racesWon || 0}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        ((user.detailedStats?.racesWon || 0) /
                          (stats.totalRaces || 1)) *
                          100
                      )}
                      className="h-2"
                    />
                  </div>

                  {/* Total Typing Time */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Total Typing Time
                      </span>
                      <span className="font-bold">
                        {user.detailedStats?.totalTypingTime
                          ? `${Math.floor(user.detailedStats.totalTypingTime / 60)}h ${Math.floor(user.detailedStats.totalTypingTime % 60)}m`
                          : '0h 0m'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your most recent typing sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {combinedHistory.length > 0 ? (
                  <div className="space-y-1">
                    {combinedHistory.map((item, idx) => (
                      <HistoryItem
                        key={idx}
                        date={item.date}
                        wpm={item.wpm}
                        accuracy={item.accuracy}
                        type={item.type}
                        position={item.type === 'race' ? item.position : null}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="mb-2 h-10 w-10 opacity-20" />
                    <p>No recent activity found</p>
                    <p className="text-sm">
                      Complete some races or practice sessions to see your
                      history
                    </p>
                  </div>
                )}
              </CardContent>
              {combinedHistory.length > 0 && (
                <CardFooter className="pt-0 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('history')}
                  >
                    View full history
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Typing History</CardTitle>
              <CardDescription>
                Records of all your typing sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="races">
                <TabsList className="mb-4 grid w-full max-w-xs grid-cols-2">
                  <TabsTrigger value="races">
                    <Trophy className="mr-2 h-4 w-4" />
                    Races
                  </TabsTrigger>
                  <TabsTrigger value="drills">
                    <AlarmClock className="mr-2 h-4 w-4" />
                    Drills
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="races">
                  {raceHistory.length > 0 ? (
                    <div className="max-h-96 space-y-1 overflow-y-auto pr-2">
                      {raceHistory.map((race, idx) => (
                        <HistoryItem
                          key={idx}
                          date={race.date}
                          wpm={race.wpm}
                          accuracy={race.accuracy}
                          type="race"
                          position={race.position}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
                      <Trophy className="mb-2 h-10 w-10 opacity-20" />
                      <p>No race history found</p>
                      <p className="text-sm">
                        Compete in typing races to build your history
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href={ROUTES.COMPETITION.HOME}>Join a Race</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="drills">
                  {drillHistory.length > 0 ? (
                    <div className="max-h-96 space-y-1 overflow-y-auto pr-2">
                      {drillHistory.map((drill, idx) => (
                        <HistoryItem
                          key={idx}
                          date={drill.date}
                          wpm={drill.wpm}
                          accuracy={drill.accuracy}
                          type="drill"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
                      <AlarmClock className="mb-2 h-10 w-10 opacity-20" />
                      <p>No practice history found</p>
                      <p className="text-sm">
                        Complete typing practice sessions to build your history
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href={ROUTES.PRACTICE}>Practice Now</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
              <CardDescription>
                Achievements you&rsquo;ve earned through your typing journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.badges && user.badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {user.badges.map((badge, idx) => (
                    <BadgeDisplay key={idx} badge={badge} />
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
                  <Medal className="mb-3 h-12 w-12 opacity-20" />
                  <p>No badges yet</p>
                  <p className="text-muted-foreground text-xs">
                    Don&apos;t see all your badges? Complete more typing tasks
                    to unlock them!
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href={ROUTES.PRACTICE}>Practice to Earn Badges</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
