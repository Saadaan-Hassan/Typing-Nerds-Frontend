import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  _id: string;
  name: string;
  image?: string;
}

interface SpectatorListProps {
  spectators: User[];
}

export function SpectatorList({ spectators }: SpectatorListProps) {
  return (
    <div className="space-y-2">
      {spectators.length === 0 ? (
        <p className="text-muted-foreground text-sm">No spectators yet</p>
      ) : (
        spectators.map((spectator) => (
          <div key={spectator._id} className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={spectator.image || '/placeholder.svg'}
                alt={spectator.name}
              />
              <AvatarFallback>{spectator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{spectator.name}</span>
          </div>
        ))
      )}
    </div>
  );
}
