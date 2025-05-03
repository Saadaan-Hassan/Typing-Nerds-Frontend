import { Settings } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function ProfileHeader() {
  // Mock user data
  const user = {
    name: 'Jane Doe',
    username: 'janedoe',
    image: '/placeholder.svg?height=100&width=100',
    joinDate: 'January 2023',
    level: 'Expert Typist',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <Avatar className="border-primary/10 h-24 w-24 border-4">
            <AvatarImage
              src={user.image || '/placeholder.svg'}
              alt={user.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {user.level}
              </Badge>
              <Badge variant="outline">Member since {user.joinDate}</Badge>
            </div>
          </div>

          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
