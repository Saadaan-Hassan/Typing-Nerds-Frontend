'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { AlarmClock, Award, Medal, Trophy, Users, Zap } from 'lucide-react';

import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LeaderboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // Redirect non-authenticated users to login page
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, router]);

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">
          Please login to access leaderboard
        </h1>
        <Button onClick={() => router.push(ROUTES.AUTH.LOGIN)}>
          Login Now
        </Button>
      </div>
    );
  }

  // Sample leaderboard data (in a real app, this would come from an API)
  const topTypers = [
    {
      id: 1,
      name: 'SpeedDemon',
      wpm: 156,
      races: 245,
      accuracy: 98.2,
      rank: 'Grandmaster',
    },
    {
      id: 2,
      name: 'KeyboardKing',
      wpm: 143,
      races: 187,
      accuracy: 97.5,
      rank: 'Master',
    },
    {
      id: 3,
      name: 'SwiftFingers',
      wpm: 139,
      races: 203,
      accuracy: 96.8,
      rank: 'Master',
    },
    {
      id: 4,
      name: 'TypeLightning',
      wpm: 132,
      races: 176,
      accuracy: 95.9,
      rank: 'Expert',
    },
    {
      id: 5,
      name: 'RapidTypist',
      wpm: 128,
      races: 164,
      accuracy: 94.7,
      rank: 'Expert',
    },
    {
      id: 6,
      name: 'KeyCrusher',
      wpm: 125,
      races: 152,
      accuracy: 93.8,
      rank: 'Expert',
    },
    {
      id: 7,
      name: 'TypeMaster',
      wpm: 118,
      races: 134,
      accuracy: 93.2,
      rank: 'Advanced',
    },
    {
      id: 8,
      name: 'QuickKeys',
      wpm: 112,
      races: 128,
      accuracy: 92.5,
      rank: 'Advanced',
    },
    {
      id: 9,
      name: 'SpeedyTyper',
      wpm: 108,
      races: 117,
      accuracy: 91.9,
      rank: 'Advanced',
    },
    {
      id: 10,
      name: 'FlashType',
      wpm: 104,
      races: 98,
      accuracy: 91.2,
      rank: 'Intermediate',
    },
  ];

  // Sample friends data
  const friends = [
    {
      id: 101,
      name: 'YourFriend1',
      wpm: 95,
      races: 87,
      accuracy: 92.1,
      rank: 'Intermediate',
    },
    {
      id: 102,
      name: 'YourFriend2',
      wpm: 88,
      races: 76,
      accuracy: 90.5,
      rank: 'Intermediate',
    },
    {
      id: 103,
      name: user?.name || 'You',
      wpm: 82,
      races: 65,
      accuracy: 89.8,
      rank: 'Intermediate',
    },
    {
      id: 104,
      name: 'YourFriend3',
      wpm: 79,
      races: 58,
      accuracy: 88.7,
      rank: 'Casual',
    },
    {
      id: 105,
      name: 'YourFriend4',
      wpm: 72,
      races: 49,
      accuracy: 87.3,
      rank: 'Casual',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you rank against the best typists in the world
        </p>
      </div>

      <Tabs defaultValue="global">
        <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="global">
            <Trophy className="mr-2 h-4 w-4" />
            Global Rankings
          </TabsTrigger>
          <TabsTrigger value="friends">
            <Users className="mr-2 h-4 w-4" />
            Friends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Typists Worldwide
              </CardTitle>
              <CardDescription>
                The fastest typists based on average WPM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-center">WPM</TableHead>
                    <TableHead className="text-center">Accuracy</TableHead>
                    <TableHead className="text-center">Races</TableHead>
                    <TableHead className="text-center">Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topTypers.map((typer, index) => (
                    <TableRow key={typer.id}>
                      <TableCell className="text-center font-medium">
                        <div className="flex justify-center">
                          {index === 0 ? (
                            <Medal className="h-5 w-5 text-yellow-500" />
                          ) : index === 1 ? (
                            <Medal className="h-5 w-5 text-gray-400" />
                          ) : index === 2 ? (
                            <Medal className="h-5 w-5 text-amber-700" />
                          ) : (
                            index + 1
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {typer.name}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        <div className="flex items-center justify-center gap-1">
                          <Zap className="text-primary h-4 w-4" />
                          {typer.wpm}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {typer.accuracy}%
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <AlarmClock className="text-muted-foreground h-3 w-3" />
                          {typer.races}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            typer.rank === 'Grandmaster'
                              ? 'bg-purple-100 text-purple-800'
                              : typer.rank === 'Master'
                                ? 'bg-indigo-100 text-indigo-800'
                                : typer.rank === 'Expert'
                                  ? 'bg-blue-100 text-blue-800'
                                  : typer.rank === 'Advanced'
                                    ? 'bg-cyan-100 text-cyan-800'
                                    : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {typer.rank}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Friend Rankings
              </CardTitle>
              <CardDescription>
                How you compare with your friends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-center">WPM</TableHead>
                    <TableHead className="text-center">Accuracy</TableHead>
                    <TableHead className="text-center">Races</TableHead>
                    <TableHead className="text-center">Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {friends.map((friend, index) => (
                    <TableRow
                      key={friend.id}
                      className={
                        friend.name === (user?.name || 'You')
                          ? 'bg-primary/10'
                          : ''
                      }
                    >
                      <TableCell className="text-center font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {friend.name}
                          {friend.name === (user?.name || 'You') && (
                            <span className="bg-primary/20 text-primary inline-block rounded-full px-2 py-0.5 text-xs">
                              You
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        <div className="flex items-center justify-center gap-1">
                          <Zap className="text-primary h-4 w-4" />
                          {friend.wpm}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {friend.accuracy}%
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <AlarmClock className="text-muted-foreground h-3 w-3" />
                          {friend.races}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            friend.rank === 'Grandmaster'
                              ? 'bg-purple-100 text-purple-800'
                              : friend.rank === 'Master'
                                ? 'bg-indigo-100 text-indigo-800'
                                : friend.rank === 'Expert'
                                  ? 'bg-blue-100 text-blue-800'
                                  : friend.rank === 'Advanced'
                                    ? 'bg-cyan-100 text-cyan-800'
                                    : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {friend.rank}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Your Achievements</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="bg-primary/20 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                  <Zap className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">82 WPM</h3>
                <p className="text-muted-foreground text-sm">Average Speed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">89.8%</h3>
                <p className="text-muted-foreground text-sm">
                  Average Accuracy
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">65</h3>
                <p className="text-muted-foreground text-sm">Races Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold">Intermediate</h3>
                <p className="text-muted-foreground text-sm">Current Rank</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
