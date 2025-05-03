'use client';

import { useState } from 'react';
import { API_ROUTES } from '@/constants/api-routes';
import { ArrowLeft, Crown, Medal, Share2, Trophy } from 'lucide-react';
import { toast } from 'sonner';

import apiCaller from '@/lib/api-caller';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface RaceResultsProps {
  room: Room;
  currentUserId: string;
  onBackToRooms: () => void;
  onRematch?: () => void;
  isSpectator?: boolean;
}

export function RaceResults({
  room,
  currentUserId,
  onBackToRooms,
  onRematch,
  isSpectator = false,
}: RaceResultsProps) {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Sort participants by position or progress
  const sortedParticipants = [...room.participants].sort((a, b) => {
    if (a.position !== null && b.position !== null) {
      return a.position - b.position;
    }
    if (a.position !== null) return -1;
    if (b.position !== null) return 1;
    return b.progress - a.progress;
  });

  // Find current user's result
  const currentUserResult = sortedParticipants.find(
    (p) => p.user._id === currentUserId
  );

  // Share results
  const handleShare = async () => {
    setIsSharing(true);
    const shareText = `I just finished a typing race in "${room.name}" with ${currentUserResult?.wpm || 0} WPM and ${
      currentUserResult?.accuracy || 0
    }% accuracy!`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Typing Race Results',
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Results copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    } finally {
      setIsSharing(false);
    }
  };

  // Save results to user profile
  const saveResults = async () => {
    if (!currentUserResult) return;

    setIsSaving(true);
    try {
      const response = await apiCaller(
        API_ROUTES.ROOMS.RESULTS,
        'POST',
        {
          roomId: room._id,
          wpm: currentUserResult.wpm,
          accuracy: currentUserResult.accuracy,
          position: currentUserResult.position,
          finishTime: currentUserResult.finishTime,
        },
        {},
        true
      );

      if (response.data.success) {
        toast.success('Results saved to your profile');
      } else {
        throw new Error(response.data.message || 'Failed to save results');
      }
    } catch (error) {
      console.error('Error saving results:', error);
      toast.error(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Get medal icon based on position
  const getMedalIcon = (position: number | null) => {
    if (!position) return null;

    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <Trophy className="text-primary h-5 w-5" />;
    }
  };

  return (
    <div className="container py-10">
      <Card className="border shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Race Results</CardTitle>
            <Badge
              variant="outline"
              className="border-green-500/20 bg-green-500/10 text-green-500"
            >
              Completed
            </Badge>
          </div>
          <CardDescription>
            {room.name} • {room.timeLimit} seconds
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard" className="mt-6">
              <div className="space-y-6">
                {/* Top 3 podium for larger screens */}
                <div className="mb-8 hidden h-40 items-end justify-center gap-4 md:flex">
                  {sortedParticipants.slice(0, 3).map((participant, index) => {
                    const height =
                      index === 1 ? 'h-40' : index === 0 ? 'h-32' : 'h-24';
                    const position = index + 1;

                    return participant ? (
                      <div
                        key={participant.user._id}
                        className="flex flex-col items-center"
                      >
                        <Avatar className="mb-2 h-12 w-12">
                          <AvatarImage
                            src={participant.user.image || '/placeholder.svg'}
                            alt={participant.user.name}
                          />
                          <AvatarFallback>
                            {participant.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="mb-2 text-center">
                          <div className="font-medium">
                            {participant.user.name}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {participant.wpm} WPM
                          </div>
                        </div>
                        <div
                          className={`${height} bg-primary/20 flex w-24 items-center justify-center rounded-t-lg ${
                            position === 1 ? 'bg-primary/80' : ''
                          }`}
                        >
                          <div className="text-primary flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold">
                            {position}
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>

                {/* Full leaderboard */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Final Standings</h3>
                  <div className="space-y-3">
                    {sortedParticipants.map((participant) => (
                      <div
                        key={participant.user._id}
                        className={`rounded-lg border p-3 ${
                          participant.user._id === currentUserId
                            ? 'border-primary/20 bg-primary/5'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full font-medium">
                              {participant.position || '-'}
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={
                                  participant.user.image || '/placeholder.svg'
                                }
                                alt={participant.user.name}
                              />
                              <AvatarFallback>
                                {participant.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1 font-medium">
                                {participant.user.name}
                                {participant.isCreator && (
                                  <Badge
                                    variant="outline"
                                    className="bg-primary/10 text-primary text-xs"
                                  >
                                    Host
                                  </Badge>
                                )}
                                {participant.user._id === currentUserId && (
                                  <Badge
                                    variant="outline"
                                    className="bg-accent/10 text-accent-foreground text-xs"
                                  >
                                    You
                                  </Badge>
                                )}
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {participant.finishTime
                                  ? `Finished in ${participant.finishTime}s`
                                  : `${participant.progress}% completed`}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {participant.wpm} WPM
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {participant.accuracy}% accuracy
                            </div>
                          </div>
                        </div>
                        <Progress
                          value={participant.progress}
                          className="mt-2 h-1.5"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Text that was typed */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Race Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                        {room.text}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Your performance */}
                  {currentUserResult && !isSpectator && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Your Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-muted-foreground text-sm">
                              Speed
                            </div>
                            <div className="text-2xl font-bold">
                              {currentUserResult.wpm}{' '}
                              <span className="text-sm font-normal">WPM</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-muted-foreground text-sm">
                              Accuracy
                            </div>
                            <div className="text-2xl font-bold">
                              {currentUserResult.accuracy}
                              <span className="text-sm font-normal">%</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-muted-foreground text-sm">
                              Position
                            </div>
                            <div className="flex items-center text-2xl font-bold">
                              {currentUserResult.position || '-'}
                              {getMedalIcon(currentUserResult.position)}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-muted-foreground text-sm">
                              Finish Time
                            </div>
                            <div className="text-2xl font-bold">
                              {currentUserResult.finishTime
                                ? `${currentUserResult.finishTime}s`
                                : '-'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Participant stats */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">
                    Participant Stats
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {sortedParticipants.map((participant) => (
                      <Card
                        key={participant.user._id}
                        className="overflow-hidden"
                      >
                        <CardHeader className="px-4 pt-4 pb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={
                                  participant.user.image || '/placeholder.svg'
                                }
                                alt={participant.user.name}
                              />
                              <AvatarFallback>
                                {participant.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-sm">
                                {participant.user.name}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {participant.position
                                  ? `Finished #${participant.position}`
                                  : `${participant.progress}% completed`}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="px-4 pt-0 pb-4">
                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-muted rounded p-2">
                              <div className="text-muted-foreground text-xs">
                                WPM
                              </div>
                              <div className="font-bold">{participant.wpm}</div>
                            </div>
                            <div className="bg-muted rounded p-2">
                              <div className="text-muted-foreground text-xs">
                                Accuracy
                              </div>
                              <div className="font-bold">
                                {participant.accuracy}%
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="bg-muted/20 flex justify-between border-t p-6">
          <Button variant="outline" onClick={onBackToRooms}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rooms
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleShare}
              disabled={isSharing}
            >
              <Share2 className="mr-2 h-4 w-4" />
              {isSharing ? 'Sharing...' : 'Share Results'}
            </Button>
            {!isSpectator && currentUserResult && (
              <Button
                variant="outline"
                onClick={saveResults}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Results'}
              </Button>
            )}
            {onRematch && !isSpectator && (
              <Button onClick={onRematch} className="bg-primary">
                Race Again
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
