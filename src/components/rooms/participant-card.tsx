import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface User {
  _id: string;
  name: string;
  image?: string;
}

interface ParticipantCardProps {
  user: User;
  progress: number;
  wpm: number;
  accuracy: number;
  position: number | null;
  finishTime: number | null;
  isCreator?: boolean;
  isCurrentUser?: boolean;
}

export function ParticipantCard({
  user,
  progress,
  wpm,
  accuracy,
  position,
  isCreator = false,
  isCurrentUser = false,
}: ParticipantCardProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.image || '/placeholder.svg'}
              alt={user.name}
            />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{user.name}</span>
              {isCreator && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary text-xs"
                >
                  Host
                </Badge>
              )}
              {isCurrentUser && (
                <Badge
                  variant="outline"
                  className="bg-accent/10 text-accent-foreground text-xs"
                >
                  You
                </Badge>
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span>{wpm} WPM</span>
              <span>•</span>
              <span>{accuracy}% Accuracy</span>
            </div>
          </div>
        </div>
        {position && (
          <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
            {position}
          </div>
        )}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
