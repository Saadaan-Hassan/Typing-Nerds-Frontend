'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { AlarmClock, Lock, Users, Zap } from 'lucide-react';

import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function CompetitionPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [timeLimit, setTimeLimit] = useState('60');
  const [text, setText] = useState(
    'The quick brown fox jumps over the lazy dog. Welcome to the typing competition where you can test your speed and accuracy against other players.'
  );

  // Redirect non-authenticated users to login page
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, router]);

  // If not authenticated, show loading state
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">
          Please login to access competitions
        </h1>
        <Button onClick={() => router.push(ROUTES.AUTH.LOGIN)}>
          Login Now
        </Button>
      </div>
    );
  }

  const handleCreateRoom = async () => {
    setIsCreating(true);

    try {
      // In a real app, you would make an API call to create a room
      // For this quick implementation, we'll just simulate it

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate a random room ID (in a real app, this would come from the backend)
      const roomId = Math.random().toString(36).substring(2, 10);

      // Navigate to the room
      router.push(`/competition/room/${roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      setIsCreating(false);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    router.push(`/competition/room/${roomId}`);
  };

  // Sample room data (in a real app, this would come from an API)
  const publicRooms = [
    { id: 'room1', name: 'Speed Demons', participants: 4, maxParticipants: 10 },
    {
      id: 'room2',
      name: 'Keyboard Warriors',
      participants: 2,
      maxParticipants: 10,
    },
    { id: 'room3', name: 'Type or Die', participants: 7, maxParticipants: 10 },
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Typing Competitions</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Create a Competition</h2>
          <Card>
            <CardHeader>
              <CardTitle>New Competition Room</CardTitle>
              <CardDescription>
                Set up your typing competition and invite others to race.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                  id="roomName"
                  placeholder="Enter room name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="private"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
                <Label htmlFor="private" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Private Room
                </Label>
              </div>

              {isPrivate && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter room password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                <Select value={timeLimit} onValueChange={setTimeLimit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                    <SelectItem value="120">2 minutes</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Typing Text</Label>
                <Textarea
                  id="text"
                  placeholder="Enter the text for the competition"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleCreateRoom}
                disabled={isCreating || !roomName}
                className="w-full"
              >
                {isCreating ? 'Creating...' : 'Create Competition'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Join a Competition</h2>
          <div className="space-y-4">
            {publicRooms.map((room) => (
              <Card key={room.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="text-muted-foreground h-4 w-4" />
                      <span className="text-muted-foreground text-sm">
                        {room.participants}/{room.maxParticipants} players
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlarmClock className="text-muted-foreground h-4 w-4" />
                      <span className="text-muted-foreground text-sm">
                        60 sec
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleJoinRoom(room.id)}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Join Race
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
