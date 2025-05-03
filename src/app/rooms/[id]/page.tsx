'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Clock,
  Eye,
  Keyboard,
  MessageSquare,
  Play,
  Users,
  X,
} from 'lucide-react';
import type { Socket } from 'socket.io-client';
import { toast } from 'sonner';

import apiCaller from '@/lib/api-caller';
import { getSocket, initializeSocket } from '@/lib/socket-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { RaceCountdown } from '@/components/rooms/race-countdown';
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

interface Message {
  id: string;
  user: User;
  text: string;
  timestamp: Date;
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [userRole, setUserRole] = useState<
    'participant' | 'spectator' | 'creator'
  >('participant');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Mock user data - in a real app, this would come from authentication
  const currentUser: User = {
    _id: 'user123',
    name: 'Jane Doe',
    image: '/placeholder.svg?height=40&width=40',
  };

  // Fetch room data
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
        const roomData = response.data.data;
        setRoom(roomData);

        // Determine user role
        if (roomData.creator._id === currentUser._id) {
          setUserRole('creator');
        } else if (
          roomData.participants.some(
            (p: Participant) => p.user._id === currentUser._id
          )
        ) {
          setUserRole('participant');
        } else {
          setUserRole('spectator');
        }

        // Set timer if race is in progress
        if (roomData.status === 'in-progress') {
          setTimeLeft(roomData.timeLeft || roomData.timeLimit);
        }

        setError(null);
      } else {
        setError(response.data.message || 'Failed to load room data');
        toast.error(response.data.message || 'Failed to load room data');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Don't set error if request was aborted
      if (error.name !== 'AbortError') {
        console.error('Error fetching room:', error);
        setError('Failed to load room data');
        toast.error(error.message || 'Failed to load room data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Connect to socket and fetch room data
  useEffect(() => {
    fetchRoom();

    // Initialize socket connection
    socketRef.current = initializeSocket();

    if (socketRef.current) {
      // Join room
      socketRef.current.emit('join_room', { roomId });

      // Listen for countdown events
      socketRef.current.on('countdown_started', (data) => {
        setCountdown(data.count);
        setRoom((prev) => (prev ? { ...prev, status: 'countdown' } : null));
      });

      socketRef.current.on('countdown_update', (data) => {
        setCountdown(data.count);
      });

      // Listen for competition events
      socketRef.current.on('competition_started', () => {
        setCountdown(null);
        setRoom((prev) => (prev ? { ...prev, status: 'in-progress' } : null));
        if (room) {
          setTimeLeft(room.timeLimit);
        }
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      });

      socketRef.current.on('competition_ended', () => {
        setTimeLeft(0);
        setRoom((prev) => (prev ? { ...prev, status: 'completed' } : null));
        setShowResults(true);
      });

      // Listen for participant progress updates
      socketRef.current.on('participant_progress', (data) => {
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
      });

      // Listen for new messages
      socketRef.current.on('new_message', (data) => {
        setMessages((prev) => [...prev, data]);
      });
    }

    // Set up polling for updates (as a fallback)
    const intervalId = setInterval(fetchRoom, 5000);

    // Fetch initial messages
    fetchMessages();

    return () => {
      clearInterval(intervalId);
      // Cancel any in-flight requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Clear any timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Disconnect socket
      if (socketRef.current) {
        socketRef.current.off('countdown_started');
        socketRef.current.off('countdown_update');
        socketRef.current.off('competition_started');
        socketRef.current.off('competition_ended');
        socketRef.current.off('participant_progress');
        socketRef.current.off('new_message');
        socketRef.current.emit('leave_room', { roomId });
      }
    };
  }, [roomId]);

  // Fetch chat messages
  const fetchMessages = async () => {
    try {
      const response = await apiCaller(`/api/rooms/${roomId}/messages`, 'GET');

      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Auto-scroll chat messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || room?.status !== 'in-progress')
      return;

    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);

          // If user is creator, end the race
          if (userRole === 'creator') {
            endCompetition();
          } else {
            // Otherwise just update UI
            setRoom((prevRoom) =>
              prevRoom ? { ...prevRoom, status: 'completed' } : null
            );
            setShowResults(true);
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, room?.status, userRole]);

  // Handle typing
  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (room?.status !== 'in-progress' || userRole === 'spectator') return;

    const newText = e.target.value;
    setTypedText(newText);

    // Calculate progress
    const progress = Math.min(
      100,
      Math.floor((newText.length / (room?.text.length || 1)) * 100)
    );

    // Calculate WPM (very simplified)
    const elapsedMinutes = (room.timeLimit - (timeLeft || 0)) / 60;
    const words = newText.length / 5; // Approximate words
    const wpm = elapsedMinutes > 0 ? Math.round(words / elapsedMinutes) : 0;

    // Calculate accuracy (very simplified)
    let correctChars = 0;
    for (let i = 0; i < newText.length; i++) {
      if (i < room.text.length && newText[i] === room.text[i]) {
        correctChars++;
      }
    }
    const accuracy =
      newText.length > 0
        ? Math.round((correctChars / newText.length) * 100)
        : 100;

    // Update participant progress
    setRoom((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        participants: prev.participants.map((p) =>
          p.user._id === currentUser._id ? { ...p, progress, wpm, accuracy } : p
        ),
      };
    });

    // Send progress update to server
    updateProgress(progress, wpm, accuracy);

    // Check if completed
    if (progress === 100 && room.status === 'in-progress') {
      // Mark as finished
      const finishTime = room.timeLimit - (timeLeft || 0);
      participantFinished(finishTime);

      toast.success(`You finished in ${finishTime} seconds`);
    }
  };

  // Update progress on server
  const updateProgress = async (
    progress: number,
    wpm: number,
    accuracy: number
  ) => {
    try {
      await apiCaller(
        `/api/rooms/${roomId}/progress`,
        'POST',
        {
          progress,
          wpm,
          accuracy,
          completed: progress === 100,
        },
        {},
        true
      );

      // Also emit via socket for real-time updates
      const socket = getSocket();
      if (socket) {
        socket.emit('update_progress', {
          roomId,
          userId: currentUser._id,
          progress,
          wpm,
          accuracy,
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Mark participant as finished
  const participantFinished = async (finishTime: number) => {
    try {
      const response = await apiCaller(
        `/api/rooms/${roomId}/finish`,
        'POST',
        {
          finishTime,
        },
        {},
        true
      );

      if (response.data.success) {
        setRoom((prev) => {
          if (!prev) return null;

          // Find position
          const position = response.data.data.position;

          return {
            ...prev,
            participants: prev.participants.map((p) =>
              p.user._id === currentUser._id
                ? {
                    ...p,
                    progress: 100,
                    finishTime,
                    position,
                  }
                : p
            ),
          };
        });

        // Also emit via socket for real-time updates
        const socket = getSocket();
        if (socket) {
          socket.emit('participant_finished', {
            roomId,
            userId: currentUser._id,
            finishTime,
          });
        }
      }
    } catch (error) {
      console.error('Error marking as finished:', error);
    }
  };

  // Start competition
  const startCompetition = async () => {
    try {
      const response = await apiCaller(`/api/rooms/${roomId}/start`, 'POST');

      if (response.data.success) {
        toast.success('Race starting!');
      } else {
        throw new Error(response.data.message || 'Failed to start race');
      }
    } catch (error) {
      console.error('Error starting competition:', error);
      toast.error(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  };

  // End competition
  const endCompetition = async () => {
    try {
      const response = await apiCaller(`/api/rooms/${roomId}/end`, 'POST');

      if (response.data.success) {
        setTimeLeft(0);
        setRoom((prev) => (prev ? { ...prev, status: 'completed' } : null));
        setShowResults(true);
        toast.success('Race ended');
      } else {
        throw new Error(response.data.message || 'Failed to end race');
      }
    } catch (error) {
      console.error('Error ending competition:', error);
      toast.error(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  };

  // Send chat message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await apiCaller(
        `/api/rooms/${roomId}/messages`,
        'POST',
        {
          text: newMessage.trim(),
        },
        {},
        true
      );

      if (response.data.success) {
        // Optimistically add message to UI
        const message = {
          id: response.data.data.id || `msg${Date.now()}`,
          user: currentUser,
          text: newMessage.trim(),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, message]);
        setNewMessage('');

        // Also emit via socket for real-time updates
        const socket = getSocket();
        if (socket) {
          socket.emit('send_message', {
            roomId,
            message: newMessage.trim(),
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  // Format time
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-10">
        <div className="text-center">
          <Keyboard className="text-primary mx-auto mb-4 h-12 w-12 animate-pulse" />
          <h2 className="text-2xl font-bold">Loading competition room...</h2>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-10">
        <div className="text-center">
          <X className="text-destructive mx-auto mb-4 h-12 w-12" />
          <h2 className="text-2xl font-bold">Room not found</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            The competition room you&rsquo;re looking for doesn&rsquo;t exist or
            has been deleted
          </p>
          <Button onClick={() => router.push('/rooms')}>Back to Rooms</Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <RaceResults
        room={room}
        currentUserId={currentUser._id}
        onBackToRooms={() => router.push('/rooms')}
        onRematch={() => {
          // Request rematch
          apiCaller(`/api/rooms/${roomId}/rematch`, 'POST')
            .then((response) => {
              if (response.data.success) {
                setShowResults(false);
                setTypedText('');
                fetchRoom(); // Refresh room data
                toast.success('Race reset for a rematch!');
              } else {
                throw new Error(
                  response.data.message || 'Failed to request rematch'
                );
              }
            })
            .catch((error) => {
              console.error('Error requesting rematch:', error);
              toast.error(
                error instanceof Error
                  ? error.message
                  : 'An unknown error occurred'
              );
            });
        }}
      />
    );
  }

  return (
    <div className="container py-6">
      {/* Room header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Keyboard className="text-primary h-6 w-6" />
            {room.name}
            {room.roomType === 'private' && (
              <Badge
                variant="outline"
                className="ml-2 border-amber-500/20 bg-amber-500/10 text-amber-500"
              >
                Private
              </Badge>
            )}
          </h1>
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
          {userRole === 'creator' && room.status === 'waiting' && (
            <Button onClick={startCompetition} className="bg-primary">
              <Play className="mr-2 h-4 w-4" />
              Start Race
            </Button>
          )}
          {userRole === 'creator' && room.status === 'in-progress' && (
            <Button onClick={endCompetition} variant="destructive">
              End Race
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push('/rooms')}>
            Exit Room
          </Button>
        </div>
      </div>

      {/* Countdown overlay */}
      {countdown !== null && <RaceCountdown count={countdown} />}

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - Typing area */}
        <div className="space-y-6 lg:col-span-2">
          {/* Status card */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {room.status === 'waiting'
                    ? 'Waiting for race to start...'
                    : room.status === 'countdown'
                      ? 'Race starting soon...'
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
              <CardDescription>
                {userRole === 'spectator'
                  ? 'You are spectating this race'
                  : room.status === 'waiting'
                    ? 'Get ready to type!'
                    : room.status === 'countdown'
                      ? 'Prepare your fingers...'
                      : room.status === 'in-progress'
                        ? 'Type the text below as fast as you can'
                        : 'Race has ended'}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Text to type */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Text to Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-md p-4 font-mono text-sm whitespace-pre-wrap">
                {room.text}
              </div>
            </CardContent>
          </Card>

          {/* Typing area */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Input</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                ref={textareaRef}
                value={typedText}
                onChange={handleTyping}
                placeholder={
                  userRole === 'spectator'
                    ? 'You are in spectator mode'
                    : room.status === 'waiting' || room.status === 'countdown'
                      ? 'Waiting for race to start...'
                      : room.status === 'in-progress'
                        ? 'Start typing here...'
                        : 'Race has ended'
                }
                className="min-h-32 font-mono"
                disabled={
                  userRole === 'spectator' ||
                  room.status === 'waiting' ||
                  room.status === 'countdown' ||
                  room.status === 'completed'
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Right column - Participants and chat */}
        <div className="space-y-6">
          {/* Participants */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {room.participants
                  .sort((a, b) => {
                    // Sort by position first (if race is completed)
                    if (a.position !== null && b.position !== null) {
                      return a.position - b.position;
                    }
                    // Then by progress
                    return b.progress - a.progress;
                  })
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
                              {participant.user._id === currentUser._id && (
                                <Badge
                                  variant="outline"
                                  className="bg-accent/10 text-accent-foreground text-xs"
                                >
                                  You
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
                        {participant.position && (
                          <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                            {participant.position}
                          </div>
                        )}
                      </div>
                      <Progress value={participant.progress} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Chat</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="chat">
                <TabsList className="w-full rounded-none border-b">
                  <TabsTrigger value="chat" className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="spectators" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    Spectators ({room.spectators.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="p-0">
                  <div className="flex h-64 flex-col">
                    <div className="flex-1 space-y-3 overflow-y-auto p-4">
                      {messages.map((message) => (
                        <div key={message.id} className="flex gap-2">
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarImage
                              src={message.user.image || '/placeholder.svg'}
                              alt={message.user.name}
                            />
                            <AvatarFallback>
                              {message.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium">
                                {message.user.name}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {new Date(message.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )}
                              </span>
                            </div>
                            <p className="text-sm">{message.text}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="flex gap-2 border-t p-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <Button size="sm" onClick={sendMessage}>
                        Send
                      </Button>
                    </div>
                  </div>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
