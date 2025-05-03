'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Socket } from 'socket.io-client';

import { initializeSocket } from '../socket-client';

interface Participant {
  userId: string;
  name: string;
  progress: number;
  wpm: number;
  accuracy: number;
  status: 'waiting' | 'typing' | 'finished';
}

interface CompetitionRoom {
  _id: string;
  name: string;
  text: string;
  timeLimit: number;
  status: 'waiting' | 'countdown' | 'in_progress' | 'finished';
  participants: Participant[];
  spectators: string[];
}

interface CompetitionContextType {
  socket: Socket | null;
  room: CompetitionRoom | null;
  currentWordIndex: number;
  countdown: number;
  isCountingDown: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any[] | null;
  joinRoom: (roomId: string, userId: string, isSpectator?: boolean) => void;
  leaveRoom: () => void;
  updateWordProgress: (wordIndex: number, isCorrect: boolean) => void;
  finishCompetition: () => void;
}

const CompetitionContext = createContext<CompetitionContextType | null>(null);

export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  return context;
};

export const CompetitionProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<CompetitionRoom | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const [isCountingDown, setIsCountingDown] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[] | null>(null);

  useEffect(() => {
    const socketInstance = initializeSocket();
    setSocket(socketInstance);

    return () => {
      leaveRoom();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Socket event listeners
    socket.on('room_joined', ({ room }) => {
      setRoom(room);
    });

    socket.on('participant_joined', ({ userId, name }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;

        // Check if participant already exists
        const participantExists = prevRoom.participants.some(
          (p) => p.userId === userId
        );

        if (participantExists) {
          return prevRoom;
        }

        return {
          ...prevRoom,
          participants: [
            ...prevRoom.participants,
            {
              userId,
              name,
              progress: 0,
              wpm: 0,
              accuracy: 0,
              status: 'waiting',
            },
          ],
        };
      });
    });

    socket.on('spectator_joined', ({ userId }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;
        return {
          ...prevRoom,
          spectators: [...prevRoom.spectators, userId],
        };
      });
    });

    socket.on('countdown_started', () => {
      setIsCountingDown(true);
    });

    socket.on('countdown_update', ({ count }) => {
      setCountdown(count);
    });

    socket.on('competition_started', () => {
      setIsCountingDown(false);
      setRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;
        return {
          ...prevRoom,
          status: 'in_progress',
        };
      });
    });

    socket.on('live_progress', ({ userId, progress, wpm, accuracy }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;

        return {
          ...prevRoom,
          participants: prevRoom.participants.map((p) => {
            if (p.userId === userId) {
              return {
                ...p,
                progress,
                wpm,
                accuracy,
                status: 'typing',
              };
            }
            return p;
          }),
        };
      });
    });

    socket.on('participant_finished', ({ userId, wpm, accuracy }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;

        return {
          ...prevRoom,
          participants: prevRoom.participants.map((p) => {
            if (p.userId === userId) {
              return {
                ...p,
                wpm,
                accuracy,
                status: 'finished',
                progress: 100,
              };
            }
            return p;
          }),
        };
      });
    });

    socket.on('competition_finished', ({ results }) => {
      setResults(results);
      setRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;
        return {
          ...prevRoom,
          status: 'finished',
        };
      });
    });

    return () => {
      socket.off('room_joined');
      socket.off('participant_joined');
      socket.off('spectator_joined');
      socket.off('countdown_started');
      socket.off('countdown_update');
      socket.off('competition_started');
      socket.off('live_progress');
      socket.off('participant_finished');
      socket.off('competition_finished');
    };
  }, [socket]);

  const joinRoom = (roomId: string, userId: string, isSpectator = false) => {
    if (!socket) return;
    socket.emit('join_room', { roomId, userId, isSpectator });
  };

  const leaveRoom = () => {
    setRoom(null);
    setCurrentWordIndex(0);
    setResults(null);
  };

  const updateWordProgress = (wordIndex: number, isCorrect: boolean) => {
    if (!socket || !room) return;

    setCurrentWordIndex(wordIndex);

    socket.emit('update_word', {
      roomId: room._id,
      userId: localStorage.getItem('userId'), // Assuming userId is stored in localStorage
      wordIndex,
      isCorrect,
      wordTime: new Date().toISOString(),
    });
  };

  const finishCompetition = () => {
    if (!socket || !room) return;

    socket.emit('finish_competition', {
      roomId: room._id,
      userId: localStorage.getItem('userId'), // Assuming userId is stored in localStorage
    });
  };

  return (
    <CompetitionContext.Provider
      value={{
        socket,
        room,
        currentWordIndex,
        countdown,
        isCountingDown,
        results,
        joinRoom,
        leaveRoom,
        updateWordProgress,
        finishCompetition,
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
};
