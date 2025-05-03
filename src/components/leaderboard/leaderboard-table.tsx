'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { getUser } from '@/lib/auth';
import { DrillService, DrillsResponse } from '@/lib/services/drill-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserLeaderboardData {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  wpm: number;
  accuracy: number;
  drills: number;
  isCurrentUser: boolean;
}

// This function would be replaced by an actual API call in a real implementation
const processLeaderboardData = (
  drillsData: DrillsResponse,
  currentUserId?: string
): UserLeaderboardData[] => {
  // Group drills by user and calculate averages
  const userMap = new Map<
    string,
    {
      id: string;
      drills: number;
      totalWpm: number;
      totalAccuracy: number;
      name: string;
      avatar: string;
    }
  >();

  drillsData.data.forEach((drill) => {
    const userId = drill.user;
    const existingUser = userMap.get(userId);

    if (existingUser) {
      existingUser.drills += 1;
      existingUser.totalWpm += drill.wpm;
      existingUser.totalAccuracy += drill.accuracy;
    } else {
      userMap.set(userId, {
        id: userId,
        drills: 1,
        totalWpm: drill.wpm,
        totalAccuracy: drill.accuracy,
        name: 'User', // This would normally come from the user data
        avatar: '/placeholder.svg',
      });
    }
  });

  // Convert to array and calculate averages
  const leaderboardData = Array.from(userMap.values()).map((user) => {
    const avgWpm = Math.round(user.totalWpm / user.drills);
    const avgAccuracy = Math.round(user.totalAccuracy / user.drills);

    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      wpm: avgWpm,
      accuracy: avgAccuracy,
      drills: user.drills,
      isCurrentUser: user.id === currentUserId,
      rank: 0, // Will be set after sorting
    };
  });

  // Sort by WPM and assign ranks
  return leaderboardData
    .sort((a, b) => b.wpm - a.wpm)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
};

export function LeaderboardTable({
  timeRange = 'all-time',
}: {
  timeRange?: string;
}) {
  const [leaderboardData, setLeaderboardData] = useState<UserLeaderboardData[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        // In a real implementation, we would pass the timeRange to the API
        const response = await DrillService.getUserDrills();
        if (response.success) {
          const currentUser = getUser();
          const processedData = processLeaderboardData(
            response,
            currentUser?.id
          );
          setLeaderboardData(processedData);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
        // Use mock data as fallback
        setLeaderboardData(mockLeaderboardData);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        <span>Loading leaderboard data...</span>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        No data available for this time period. Start typing to appear on the
        leaderboard!
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>User</TableHead>
          <TableHead className="text-right">WPM</TableHead>
          <TableHead className="text-right">Accuracy</TableHead>
          <TableHead className="text-right">Drills</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboardData.map((user) => (
          <TableRow
            key={user.id}
            className={user.isCurrentUser ? 'bg-primary/5' : undefined}
          >
            <TableCell className="font-medium">
              {user.rank === 1 && <span className="text-yellow-500">🏆</span>}
              {user.rank === 2 && <span className="text-gray-400">🥈</span>}
              {user.rank === 3 && <span className="text-amber-700">🥉</span>}
              {user.rank > 3 && user.rank}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.avatar || '/placeholder.svg'}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  {user.isCurrentUser && (
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary text-xs"
                    >
                      You
                    </Badge>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right font-medium">{user.wpm}</TableCell>
            <TableCell className="text-right">{user.accuracy}%</TableCell>
            <TableCell className="text-right">{user.drills}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Mock data for fallback or development
const mockLeaderboardData: UserLeaderboardData[] = [
  {
    id: '1',
    rank: 1,
    name: 'Alex Johnson',
    avatar: '/placeholder.svg?height=40&width=40',
    wpm: 120,
    accuracy: 98.5,
    drills: 42,
    isCurrentUser: false,
  },
  {
    id: '2',
    rank: 2,
    name: 'Maria Garcia',
    avatar: '/placeholder.svg?height=40&width=40',
    wpm: 115,
    accuracy: 97.8,
    drills: 38,
    isCurrentUser: false,
  },
  {
    id: '3',
    rank: 3,
    name: 'Sam Wilson',
    avatar: '/placeholder.svg?height=40&width=40',
    wpm: 112,
    accuracy: 96.9,
    drills: 45,
    isCurrentUser: false,
  },
  {
    id: '4',
    rank: 4,
    name: 'Jane Doe',
    avatar: '/placeholder.svg?height=40&width=40',
    wpm: 108,
    accuracy: 97.2,
    drills: 36,
    isCurrentUser: true,
  },
  {
    id: '5',
    rank: 5,
    name: 'David Kim',
    avatar: '/placeholder.svg?height=40&width=40',
    wpm: 105,
    accuracy: 95.8,
    drills: 30,
    isCurrentUser: false,
  },
];
