'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Eye, Keyboard, Share2, Users } from 'lucide-react';
import { toast } from 'sonner';

import apiCaller from '@/lib/api-caller';
import { initializeSocket } from '@/lib/socket-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RaceResults } from '@/components/rooms/race-results';

interface User {
  _id: string;
  name: string;
  image?: string;
}

interface Participant {
  user: User;
  progress: number;
  wpm: number;
  accuracy: number;
  position: number | null;
  finishTime: number | null;
  isCreator?: boolean;
}

interface Room {
  _id: string;
  name: string;
  roomType: 'public' | 'private';
  text: string;
  timeLimit: number;
  creator: User;
  status: 'waiting' | 'countdown' | 'in-progress' | 'completed';
  participants: Participant[];
  spectators: User[];
}

export default function SpectateRoomPage() {
  const params = useParams();
  const router = useRouter();

  const roomId = params.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For API request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const socketRef = useRef<any>(null);

  // Current user (will be fetched from auth context in a real app)
  const currentUser: User = {
    _id: 'spectator123',
    name: 'Spectator',
    image: '/placeholder.svg?height=40&width=40',
  };

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setIsLoading(true);

        // Cancel previous request if it exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        const response = await apiCaller(
          `/api/rooms/${roomId}`,
          'GET',
          undefined,
          {},
          true,
          'json',
          false,
          abortControllerRef.current.signal
        );

        if (response.data.success) {
          setRoom(response.data.data);
          setTimeLeft(
            response.data.data.timeLeft || response.data.data.timeLimit
          );
          setError(null);
        } else {
          setError(response.data.message || 'Failed to load race data');
          toast.error(response.data.message || 'Failed to load race data');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Don't set error if request was aborted
        if (error.name !== 'AbortError') {
          console.error('Error fetching room:', error);
          setError('Failed to load race data');
          toast.error(error.message || 'Failed to load race data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();

    // Initialize socket connection
    socketRef.current = initializeSocket();

    if (socketRef.current) {
      // Join room as spectator
      socketRef.current.emit('join_room', { roomId, isSpectator: true });

      // Listen for competition events
      socketRef.current.on('competition_started', () => {
        setRoom((prev) => (prev ? { ...prev, status: 'in-progress' } : null));
        if (room) {
          setTimeLeft(room.timeLimit);
        }
      });

      socketRef.current.on('competition_ended', () => {
        setTimeLeft(0);
        setRoom((prev) => (prev ? { ...prev, status: 'completed' } : null));
        setShowResults(true);
      });

      // Listen for participant progress updates
      socketRef.current.on(
        'participant_progress',
        (data: {
          userId: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          progress: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          wpm: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          accuracy: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          position: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          finishTime: any;
        }) => {
          setRoom((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              participants: prev.participants.map((p) =>
                p.user._id === data.userId
                  ? {
                      ...p,
                      progress: data.progress,
                      wpm: data.wpm,
                      accuracy: data.accuracy,
                      position: data.position,
                      finishTime: data.finishTime,
                    }
                  : p
              ),
            };
          });
        }
      );
    }

    // Join as spectator
    joinAsSpectator();

    // Set up polling for updates (as a fallback)
    const intervalId = setInterval(fetchRoom, 3000);

    return () => {
      clearInterval(intervalId);
      // Cancel any in-flight requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Disconnect socket
      if (socketRef.current) {
        socketRef.current.off('competition_started');
        socketRef.current.off('competition_ended');
        socketRef.current.off('participant_progress');
        socketRef.current.emit('leave_room', { roomId });
      }
    };
  }, [roomId]);

  // Handle timer countdown
  useEffect(() => {
    if (!room) return;

    // If race is in progress, start countdown
    if (room.status === 'in-progress') {
      // Calculate end time based on server data
      const endTime = new Date().getTime() + (timeLeft || 0) * 1000;

      const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance <= 0) {
          clearInterval(timerInterval);
          setTimeLeft(0);

          // Check if race is completed
          if (room.status === 'in-progress') {
            // Fetch updated room data to see if race is completed
            apiCaller(`/api/rooms/${roomId}`, 'GET')
              .then((response) => {
                if (
                  response.data.success &&
                  response.data.data.status === 'completed'
                ) {
                  setRoom(response.data.data);
                  setShowResults(true);
                }
              })
              .catch((error) => {
                console.error('Error checking race status:', error);
              });
          }
        } else {
          setTimeLeft(Math.ceil(distance / 1000));
        }
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [room, roomId, timeLeft]);

  // Join as spectator
  const joinAsSpectator = async () => {
    try {
      const response = await apiCaller(
        `/api/rooms/join`,
        'POST',
        {
          roomId,
          isSpectator: true,
        },
        {},
        true
      );

      if (response.data.success) {
        toast.success('Joined as spectator');
      } else {
        toast.error(response.data.message || 'Failed to join as spectator');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error joining as spectator:', error);
      toast.error(error.message || 'Failed to join as spectator');
    }
  };

  // Format time
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Share race
  const shareRace = () => {
    const shareUrl = `${window.location.origin}/rooms/${roomId}/spectate`;

    if (navigator.share) {
      navigator
        .share({
          title: `Watch a typing race: ${room?.name}`,
          text: 'Check out this typing competition!',
          url: shareUrl,
        })
        .catch((err) => {
          console.error('Error sharing:', err);
        });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success(
          'Link copied. Share this link with others to watch the race!'
        );
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-10">
        <div className="text-center">
          <Keyboard className="text-primary mx-auto mb-4 h-12 w-12 animate-pulse" />
          <h2 className="text-2xl font-bold">Loading race view...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !room) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Race not found</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            {error || "The race you're looking for doesn't exist or has ended"}
          </p>
          <Button asChild>
            <Link href="/rooms">Browse Rooms</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Results state
  if (showResults || room.status === 'completed') {
    return (
      <RaceResults
        room={room}
        currentUserId={currentUser._id}
        onBackToRooms={() => router.push('/rooms')}
        isSpectator={true}
      />
    );
  }

  // Calculate average stats
  const avgWpm =
    room.participants.length > 0
      ? Math.round(
          room.participants.reduce((sum, p) => sum + p.wpm, 0) /
            room.participants.length
        )
      : 0;

  const avgAccuracy =
    room.participants.length > 0
      ? Math.round(
          room.participants.reduce((sum, p) => sum + p.accuracy, 0) /
            room.participants.length
        )
      : 0;

  return (
    <div className="container py-6">
      {/* Room header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href="/rooms">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Keyboard className="text-primary h-6 w-6" />
              {room.name}
            </h1>
            <Badge
              variant="outline"
              className="border-blue-500/20 bg-blue-500/10 text-blue-500"
            >
              Spectator View
            </Badge>
          </div>
          <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>{room.timeLimit} seconds</span>
            <span className="mx-1">•</span>
            <Users className="h-4 w-4" />
            <span>{room.participants.length} participants</span>
            <span className="mx-1">•</span>
            <Eye className="h-4 w-4" />
            <span>{room.spectators.length} spectators</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={shareRace}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/rooms/${roomId}`}>Join Race</Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - Race text and progress */}
        <div className="space-y-6 lg:col-span-2">
          {/* Status card */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      room.status === 'waiting'
                        ? 'bg-yellow-500'
                        : room.status === 'in-progress' ||
                            room.status === 'countdown'
                          ? 'animate-pulse bg-green-500'
                          : 'bg-blue-500'
                    }`}
                  />
                  {room.status === 'waiting'
                    ? 'Waiting for race to start'
                    : room.status === 'countdown'
                      ? 'Race starting soon'
                      : room.status === 'in-progress'
                        ? 'Race in progress'
                        : 'Race completed'}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Clock className="text-primary h-4 w-4" />
                  <span className="font-mono text-lg">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Text to type */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Race Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-md p-4 font-mono text-sm whitespace-pre-wrap">
                {room.text}
              </div>
            </CardContent>
          </Card>

          {/* Participants progress */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Live Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {room.participants
                  .sort((a, b) => b.progress - a.progress)
                  .map((participant) => (
                    <div key={participant.user._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={participant.user.image || '/placeholder.svg'}
                              alt={participant.user.name}
                            />
                            <AvatarFallback>
                              {participant.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">
                                {participant.user.name}
                              </span>
                              {participant.isCreator && (
                                <Badge
                                  variant="outline"
                                  className="bg-primary/10 text-primary text-xs"
                                >
                                  Host
                                </Badge>
                              )}
                            </div>
                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                              <span>{participant.wpm} WPM</span>
                              <span>•</span>
                              <span>{participant.accuracy}% Accuracy</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {participant.progress}%
                        </div>
                      </div>
                      <Progress value={participant.progress} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Stats and spectators */}
        <div className="space-y-6">
          {/* Timer card */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Race Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="bg-muted mb-2 flex h-24 w-24 items-center justify-center rounded-full">
                  <span className="font-mono text-3xl font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="text-muted-foreground text-sm">
                  {room.timeLimit} second race
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for leaderboard and spectators */}
          <Card className="border shadow-sm">
            <Tabs defaultValue="leaderboard">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="spectators">
                  Spectators ({room.spectators.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leaderboard" className="space-y-4 p-4">
                {room.participants
                  .sort((a, b) => {
                    // Sort by position first (if race is completed)
                    if (a.position !== null && b.position !== null) {
                      return a.position - b.position;
                    }
                    // Then by progress
                    return b.progress - a.progress;
                  })
                  .map((participant, index) => (
                    <div
                      key={participant.user._id}
                      className="flex items-center gap-3"
                    >
                      <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            {participant.user.name}
                          </div>
                          <div className="text-sm">{participant.wpm} WPM</div>
                        </div>
                        <Progress
                          value={participant.progress}
                          className="mt-1 h-1.5"
                        />
                      </div>
                    </div>
                  ))}
              </TabsContent>

              <TabsContent value="spectators" className="p-4">
                <div className="space-y-2">
                  {room.spectators.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No spectators yet
                    </p>
                  ) : (
                    room.spectators.map((spectator) => (
                      <div
                        key={spectator._id}
                        className="flex items-center gap-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={spectator.image || '/placeholder.svg'}
                            alt={spectator.name}
                          />
                          <AvatarFallback>
                            {spectator.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{spectator.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Race stats */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Race Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-md p-3 text-center">
                  <div className="text-muted-foreground text-sm">Avg. WPM</div>
                  <div className="text-xl font-bold">{avgWpm}</div>
                </div>
                <div className="bg-muted rounded-md p-3 text-center">
                  <div className="text-muted-foreground text-sm">
                    Avg. Accuracy
                  </div>
                  <div className="text-xl font-bold">{avgAccuracy}%</div>
                </div>
                <div className="bg-muted rounded-md p-3 text-center">
                  <div className="text-muted-foreground text-sm">
                    Participants
                  </div>
                  <div className="text-xl font-bold">
                    {room.participants.length}
                  </div>
                </div>
                <div className="bg-muted rounded-md p-3 text-center">
                  <div className="text-muted-foreground text-sm">
                    Spectators
                  </div>
                  <div className="text-xl font-bold">
                    {room.spectators.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
