'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { BarChart2, Flag, Medal, Star, Timer, Trophy, Zap } from 'lucide-react';

import { useCompetition } from '@/lib/context/competition-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

import { RaceCountdown } from './race-countdown';

interface RaceCompetitionProps {
  roomId: string;
  userId: string;
}

export function RaceCompetition({ roomId, userId }: RaceCompetitionProps) {
  const router = useRouter();
  const {
    joinRoom,
    room,
    isCountingDown,
    countdown,
    updateWordProgress,
    finishCompetition,
    currentWordIndex,
    results,
    socket,
  } = useCompetition();

  const [text, setText] = useState<string[]>([]);
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isRoomCreator, setIsRoomCreator] = useState(false);

  // Determine if current user is the room creator
  useEffect(() => {
    // In a full implementation, we would check against room.creator
    // For this quick demo, let's make the first person to join the creator
    if (room?.participants && room.participants.length > 0) {
      setIsRoomCreator(room.participants[0].userId === userId);
    }
  }, [room?.participants, userId]);

  // Join the room when the component mounts
  useEffect(() => {
    joinRoom(roomId, userId);
  }, [roomId, userId]);

  // Set up the text from the room when it's loaded
  useEffect(() => {
    if (room?.text) {
      setText(room.text.split(' '));
    }
  }, [room?.text]);

  // Set the start time when the competition starts
  useEffect(() => {
    if (room?.status === 'in_progress' && !startTime) {
      setStartTime(new Date());
    }
  }, [room?.status]);

  // Handle user typing
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!room || room.status !== 'in_progress' || isFinished) return;

    const inputText = e.target.value;
    setTypedText(inputText);

    // Check if the word is complete (user typed a space)
    if (inputText.endsWith(' ')) {
      const typedWord = inputText.trim();
      const currentWord = text[currentWordIndex];

      // Check if the typed word is correct
      const isCorrect = typedWord === currentWord;

      // Update word progress
      updateWordProgress(currentWordIndex + 1, isCorrect);

      // Clear the input for the next word
      setTypedText('');

      // Check if all words are typed
      if (currentWordIndex + 1 >= text.length) {
        handleFinish();
      }
    }
  };

  // Handle finishing the competition
  const handleFinish = () => {
    if (isFinished) return;

    setEndTime(new Date());
    setIsFinished(true);
    finishCompetition();
  };

  // Calculate WPM
  const calculateWPM = () => {
    if (!startTime || !endTime) return 0;

    const minutes = (endTime.getTime() - startTime.getTime()) / 60000;
    return Math.round(currentWordIndex / minutes);
  };

  // Start race manually (for room creator)
  const handleStartRace = () => {
    if (!room || room.status !== 'waiting' || !socket) return;

    // In a real app, we would call a backend API to start the race
    // For now, we'll simulate this in the frontend
    // The socket service would handle this in a full implementation
    if (room.participants.length >= 1) {
      socket.emit('start_race', { roomId });
    }
  };

  // Return to the competition lobby
  const handleReturnToLobby = () => {
    router.push(ROUTES.COMPETITION.HOME);
  };

  if (!room) {
    return (
      <div className="flex h-64 items-center justify-center">
        Loading race...
      </div>
    );
  }

  // Show countdown if in countdown state
  if (isCountingDown) {
    return <RaceCountdown count={countdown} />;
  }

  // Show results if the race is finished
  if (room.status === 'finished' || isFinished) {
    return (
      <div className="space-y-6 p-4">
        <Card className="border-none bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Race Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="mt-4 space-y-4">
                {results.map((result, index) => (
                  <div
                    key={result.userId}
                    className={`flex items-center justify-between rounded-lg p-4 transition-all ${
                      result.userId === userId
                        ? 'bg-primary/10 border-primary/20 border'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          index === 0
                            ? 'bg-yellow-500 text-white'
                            : index === 1
                              ? 'bg-gray-400 text-white'
                              : index === 2
                                ? 'bg-amber-700 text-white'
                                : 'bg-muted-foreground/20 text-muted-foreground'
                        }`}
                      >
                        {index < 3 ? (
                          <Medal className="h-5 w-5" />
                        ) : (
                          <span className="font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1 font-semibold">
                          {result.userId === userId
                            ? 'You'
                            : `Player ${index + 1}`}
                          {result.userId === userId && (
                            <Star className="inline h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          Finished in {result.finishTime.toFixed(1)}s
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold">
                        <Zap
                          className={`h-4 w-4 ${index === 0 ? 'text-yellow-500' : 'text-muted-foreground'}`}
                        />
                        {result.wpm} WPM
                      </div>
                      <div className="text-muted-foreground flex items-center justify-end gap-1 text-sm">
                        <BarChart2 className="h-3 w-3" />
                        Accuracy: {result.accuracy}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted mt-4 rounded-lg py-8 text-center">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold">
                  <Zap className="text-primary h-6 w-6" />
                  {calculateWPM()} WPM
                </div>
                <div className="text-muted-foreground mt-2">
                  You completed the race!
                </div>
              </div>
            )}

            <Separator className="my-6" />

            <Button
              className="w-full"
              variant="default"
              onClick={handleReturnToLobby}
            >
              Return to Lobby
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Waiting state with Start button for room creator
  if (room.status === 'waiting') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Waiting for Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-6 py-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold">Room is Ready</h2>
                <p className="text-muted-foreground">
                  {room.participants.length} player(s) joined
                </p>
              </div>

              {isRoomCreator && (
                <div className="w-full max-w-sm">
                  <Button
                    onClick={handleStartRace}
                    className="w-full"
                    disabled={room.participants.length < 1}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Start Race
                  </Button>
                  {room.participants.length < 1 && (
                    <p className="text-muted-foreground mt-2 text-center text-sm">
                      Need at least 1 player to start
                    </p>
                  )}
                </div>
              )}

              {!isRoomCreator && (
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Waiting for the room creator to start the race...
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <h3 className="font-semibold">Participants:</h3>
              {room.participants.map((participant, index) => (
                <div
                  key={participant.userId}
                  className={`flex items-center justify-between rounded-md p-3 ${
                    participant.userId === userId ? 'bg-primary/10' : 'bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
                      {index + 1}
                    </div>
                    <span className="font-medium">
                      {participant.userId === userId
                        ? 'You'
                        : participant.name || `Player ${index + 1}`}
                    </span>
                  </div>
                  {isRoomCreator && index === 0 && (
                    <span className="bg-primary/20 text-primary rounded-full px-2 py-1 text-xs">
                      Host
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active race UI
  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {room.participants.map((participant) => (
          <div
            key={participant.userId}
            className={`rounded-lg p-4 ${
              participant.userId === userId ? 'bg-primary/10' : 'bg-muted'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold">
                {participant.userId === userId ? 'You' : participant.name}
              </div>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Zap className="text-primary h-3 w-3" />
                {participant.wpm} WPM
              </div>
            </div>
            <Progress
              value={participant.progress}
              className={cn(
                'h-2',
                participant.userId === userId ? 'bg-primary/20' : ''
              )}
            />
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground text-xs">
                {participant.progress}% complete
              </span>
              <span className="text-muted-foreground text-xs">
                Accuracy: {participant.accuracy}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted rounded-lg p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className="text-sm font-medium">
              {startTime
                ? Math.floor(
                    (new Date().getTime() - startTime.getTime()) / 1000
                  )
                : 0}
              s
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            <span className="text-sm font-medium">
              {currentWordIndex}/{text.length} words
            </span>
          </div>
        </div>

        <div className="bg-background text-foreground mb-4 h-24 overflow-y-auto rounded-md p-4 font-mono whitespace-pre-wrap">
          {text.map((word, index) => (
            <span
              key={index}
              className={`${
                index < currentWordIndex
                  ? 'text-green-500'
                  : index === currentWordIndex
                    ? 'bg-primary/20'
                    : ''
              } ${index === currentWordIndex ? 'underline' : ''}`}
            >
              {word}{' '}
            </span>
          ))}
        </div>

        <input
          type="text"
          value={typedText}
          onChange={handleTyping}
          disabled={room.status !== 'in_progress' || isFinished}
          className="focus:ring-primary w-full rounded border p-2 focus:ring-2 focus:outline-none"
          placeholder={
            room.status === 'in_progress'
              ? 'Start typing...'
              : 'Waiting for race to start...'
          }
          autoFocus
        />
      </div>

      <Button
        onClick={handleFinish}
        disabled={isFinished}
        className="w-full"
        variant="destructive"
      >
        Give Up
      </Button>
    </div>
  );
}
