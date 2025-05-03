import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  _id: string;
  name: string;
  image?: string;
}

interface ChatMessageProps {
  id: string;
  user: User;
  text: string;
  timestamp: Date;
}

export function ChatMessage({ user, text, timestamp }: ChatMessageProps) {
  return (
    <div className="flex gap-2">
      <Avatar className="h-6 w-6 flex-shrink-0">
        <AvatarImage src={user.image || '/placeholder.svg'} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{user.name}</span>
          <span className="text-muted-foreground text-xs">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
}
