import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for recent races
const recentRaces = [
  {
    id: 1,
    date: 'Today, 2:30 PM',
    wpm: 108,
    accuracy: 97.2,
    time: '1:42',
    keystrokes: 532,
    text: 'The quick brown fox jumps over the lazy dog...',
  },
  {
    id: 2,
    date: 'Today, 1:15 PM',
    wpm: 105,
    accuracy: 96.8,
    time: '1:38',
    keystrokes: 518,
    text: 'To be or not to be, that is the question...',
  },
  {
    id: 3,
    date: 'Yesterday, 7:45 PM',
    wpm: 110,
    accuracy: 98.1,
    time: '1:35',
    keystrokes: 545,
    text: 'It was the best of times, it was the worst of times...',
  },
  {
    id: 4,
    date: 'Yesterday, 5:20 PM',
    wpm: 102,
    accuracy: 95.9,
    time: '1:48',
    keystrokes: 510,
    text: 'Four score and seven years ago our fathers brought forth...',
  },
  {
    id: 5,
    date: 'May 2, 2023',
    wpm: 106,
    accuracy: 96.5,
    time: '1:40',
    keystrokes: 525,
    text: 'Call me Ishmael. Some years ago—never mind how long precisely...',
  },
];

interface RecentRacesProps {
  showAll?: boolean;
}

export function RecentRaces({ showAll = false }: RecentRacesProps) {
  // If not showing all, limit to 3 races
  const races = showAll ? recentRaces : recentRaces.slice(0, 3);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Text</TableHead>
          <TableHead className="text-right">WPM</TableHead>
          <TableHead className="text-right">Accuracy</TableHead>
          <TableHead className="text-right">Time</TableHead>
          <TableHead className="text-right">Keystrokes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {races.map((race) => (
          <TableRow key={race.id}>
            <TableCell className="font-medium">{race.date}</TableCell>
            <TableCell className="max-w-[200px] truncate">
              {race.text}
            </TableCell>
            <TableCell className="text-right">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary font-medium"
              >
                {race.wpm}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{race.accuracy}%</TableCell>
            <TableCell className="text-right">{race.time}</TableCell>
            <TableCell className="text-right">{race.keystrokes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
