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

// Mock data for the leaderboard
const leaderboardData = [
  {
    id: 1,
    rank: 1,
    name: 'Alex Johnson',
    avatar: '/placeholder.svg?height=40&width=40',
    wpm: 120,
    accuracy: 98.5,
    races: 42,
    isCurrentUser: false,
  },
  {
    id: 2,
    rank: 2,
    name: 'Maria Garcia',
    avatar: '/placeholder.svg?height=40&width=40',
    wpm: 115,
    accuracy: 97.8,
    races: 38,
    isCurrentUser: false,
  },
  {
    id: 3,
    rank: 3,
    name: 'Sam Wilson',
    avatar: '/placeholder.svg?height=40&width=40',
    wpm: 112,
    accuracy: 96.9,
    races: 45,
    isCurrentUser: false,
  },
  {
    id: 4,
    rank: 4,
    name: 'Jane Doe',
    avatar: '/placeholder.svg?height=40&width=40',
    wpm: 108,
    accuracy: 97.2,
    races: 36,
    isCurrentUser: true,
  },
  {
    id: 5,
    rank: 5,
    name: 'David Kim',
    avatar: '/placeholder.svg?height=40&width=40',
    wpm: 105,
    accuracy: 95.8,
    races: 30,
    isCurrentUser: false,
  },
];

export function LeaderboardTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>User</TableHead>
          <TableHead className="text-right">WPM</TableHead>
          <TableHead className="text-right">Accuracy</TableHead>
          <TableHead className="text-right">Races</TableHead>
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
            <TableCell className="text-right">{user.races}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
