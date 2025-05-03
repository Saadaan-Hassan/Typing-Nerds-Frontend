'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/constants/api-routes';
import {
  Clock,
  Globe,
  Keyboard,
  Lock,
  Plus,
  RefreshCcw,
  Search,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

import apiCaller from '@/lib/api-caller';
import { Badge } from '@/components/ui/badge';
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
import { Skeleton } from '@/components/ui/skeleton';
import { JoinRoomDialog } from '@/components/rooms/join-room-dialog';

interface Room {
  _id: string;
  name: string;
  roomType: 'public' | 'private';
  text: string;
  timeLimit: number;
  creator: {
    _id: string;
    name: string;
  };
  participants?: number;
  status?: 'waiting' | 'in-progress' | 'completed';
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const router = useRouter();

  // Fetch all public rooms
  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await apiCaller(
        API_ROUTES.ROOMS.PUBLIC,
        'GET',
        undefined,
        {},
        true
      );

      if (response.data.success) {
        // Add mock data for participants and status if not provided by API
        const roomsWithData = response.data.data.map((room: Room) => ({
          ...room,
          participants: room.participants || Math.floor(Math.random() * 10) + 1,
          status:
            room.status ||
            (['waiting', 'in-progress', 'completed'][
              Math.floor(Math.random() * 3)
            ] as 'waiting' | 'in-progress' | 'completed'),
        }));

        setRooms(roomsWithData);
        setFilteredRooms(roomsWithData);
      } else {
        throw new Error(response.data.message || 'Failed to fetch rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter rooms based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter(
        (room) =>
          room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRooms(filtered);
    }
  }, [searchQuery, rooms]);

  const handleJoinRoom = (room: Room) => {
    setSelectedRoom(room);

    if (room.roomType === 'private') {
      setIsJoinDialogOpen(true);
    } else {
      joinRoom(room._id);
    }
  };

  const joinRoom = async (
    roomId: string,
    password?: string,
    isSpectator = false
  ) => {
    try {
      const response = await apiCaller(
        API_ROUTES.ROOMS.JOIN,
        'POST',
        {
          roomId,
          password,
          isSpectator,
        },
        {},
        true
      );

      if (response.data.success) {
        toast.success(
          `Successfully joined ${isSpectator ? 'as a spectator' : ''}`
        );
        // Redirect to the room
        router.push(
          isSpectator ? `/rooms/${roomId}/spectate` : `/rooms/${roomId}`
        );
      } else {
        throw new Error(response.data.message || 'Failed to join room');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return (
          <Badge
            variant="outline"
            className="border-blue-500/20 bg-blue-500/10 text-blue-500"
          >
            Waiting
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge
            variant="outline"
            className="border-green-500/20 bg-green-500/10 text-green-500"
          >
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge
            variant="outline"
            className="border-gray-500/20 bg-gray-500/10 text-gray-500"
          >
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Keyboard className="text-primary h-8 w-8" />
            Competition Rooms
          </h1>
          <p className="text-muted-foreground mt-1">
            Join a typing competition or create your own room
          </p>
        </div>

        <div className="flex w-full gap-2 md:w-auto">
          <Button
            onClick={fetchRooms}
            variant="outline"
            size="icon"
            className="h-10 w-10"
            disabled={isLoading}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
          <div className="relative flex-1 md:flex-initial">
            <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
            <Input
              placeholder="Search rooms..."
              className="w-full pl-9 md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild className="bg-primary">
            <Link href="/rooms/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Room
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border shadow-sm">
              <CardHeader className="pb-2">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-9 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="py-12 text-center">
          <div className="bg-muted mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full">
            <Keyboard className="text-muted-foreground h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">No rooms found</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            {searchQuery ? 'Try a different search term or' : 'Be the first to'}{' '}
            create a new competition room
          </p>
          <Button asChild>
            <Link href="/rooms/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Room
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <Card
              key={room._id}
              className="border shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {room.name}
                      {room.roomType === 'private' ? (
                        <Lock className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Globe className="h-4 w-4 text-green-500" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      Created by {room.creator.name}
                    </CardDescription>
                  </div>
                  {getStatusBadge(room.status || 'waiting')}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Clock className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>{room.timeLimit} seconds</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>{room.participants} participants</span>
                  </div>
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                    {room.text}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => joinRoom(room._id, undefined, true)}
                >
                  Spectate
                </Button>
                <Button
                  onClick={() => handleJoinRoom(room)}
                  disabled={room.status === 'completed'}
                  className={room.status !== 'completed' ? 'bg-primary' : ''}
                >
                  {room.status === 'waiting'
                    ? 'Join'
                    : room.status === 'in-progress'
                      ? 'Join Late'
                      : 'Completed'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <JoinRoomDialog
        isOpen={isJoinDialogOpen}
        onClose={() => setIsJoinDialogOpen(false)}
        onJoin={(password) => {
          if (selectedRoom) {
            joinRoom(selectedRoom._id, password);
          }
          setIsJoinDialogOpen(false);
        }}
        roomName={selectedRoom?.name || ''}
      />
    </div>
  );
}
