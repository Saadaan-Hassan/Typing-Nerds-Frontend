'use client';

import { Clock, Eye, Globe, Keyboard, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RoomHeaderProps {
  name: string;
  roomType: 'public' | 'private';
  timeLimit: number;
  participantCount: number;
  spectatorCount: number;
  status: 'waiting' | 'countdown' | 'in-progress' | 'completed';
  onExit: () => void;
  onStart?: () => void;
  onEnd?: () => void;
  isCreator: boolean;
}

export function RoomHeader({
  name,
  roomType,
  timeLimit,
  participantCount,
  spectatorCount,
  status,
  onExit,
  onStart,
  onEnd,
  isCreator,
}: RoomHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Keyboard className="text-primary h-6 w-6" />
          {name}
          {roomType === 'private' && (
            <Badge
              variant="outline"
              className="ml-2 border-amber-500/20 bg-amber-500/10 text-amber-500"
            >
              Private
            </Badge>
          )}
          {roomType === 'public' && (
            <Badge
              variant="outline"
              className="ml-2 border-green-500/20 bg-green-500/10 text-green-500"
            >
              <Globe className="mr-1 h-3 w-3" />
              Public
            </Badge>
          )}
        </h1>
        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span>{timeLimit} seconds</span>
          <span className="mx-1">•</span>
          <Users className="h-4 w-4" />
          <span>{participantCount} participants</span>
          <span className="mx-1">•</span>
          <Eye className="h-4 w-4" />
          <span>{spectatorCount} spectators</span>
        </div>
      </div>

      <div className="flex gap-2">
        {isCreator && status === 'waiting' && onStart && (
          <Button
            onClick={onStart}
            className="from-primary to-accent text-primary-foreground bg-gradient-to-r"
          >
            Start Race
          </Button>
        )}
        {isCreator && status === 'in-progress' && onEnd && (
          <Button onClick={onEnd} variant="destructive">
            End Race
          </Button>
        )}
        <Button variant="outline" onClick={onExit}>
          Exit Room
        </Button>
      </div>
    </div>
  );
}
