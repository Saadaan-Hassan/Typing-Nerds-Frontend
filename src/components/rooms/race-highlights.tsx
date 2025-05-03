'use client';

import { useEffect, useState } from 'react';
import { Award, Clock, Flag, Play, Zap } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface User {
  _id: string;
  name: string;
  image?: string;
}

interface Highlight {
  id: string;
  type: 'start' | 'finish' | 'milestone' | 'record';
  user?: User;
  message: string;
  timestamp: Date;
}

interface RaceHighlightsProps {
  roomId: string;
  maxHeight?: string;
}

export function RaceHighlights({
  roomId,
  maxHeight = '300px',
}: RaceHighlightsProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // In a real app, you would fetch highlights from an API
  // For now, we'll use mock data
  useEffect(() => {
    // Mock data
    const mockHighlights: Highlight[] = [
      {
        id: '1',
        type: 'start',
        message: 'Race started',
        timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      },
      {
        id: '2',
        type: 'milestone',
        user: {
          _id: 'user1',
          name: 'John Doe',
          image: '/placeholder.svg?height=40&width=40',
        },
        message: 'reached 50 WPM',
        timestamp: new Date(Date.now() - 90000), // 1.5 minutes ago
      },
      {
        id: '3',
        type: 'finish',
        user: {
          _id: 'user2',
          name: 'Jane Smith',
          image: '/placeholder.svg?height=40&width=40',
        },
        message: 'finished in 1st place',
        timestamp: new Date(Date.now() - 60000), // 1 minute ago
      },
      {
        id: '4',
        type: 'record',
        user: {
          _id: 'user2',
          name: 'Jane Smith',
          image: '/placeholder.svg?height=40&width=40',
        },
        message: 'set a new personal best of 85 WPM',
        timestamp: new Date(Date.now() - 30000), // 30 seconds ago
      },
    ];

    setHighlights(mockHighlights);

    // In a real app, you would listen for socket events to update highlights
    const intervalId = setInterval(() => {
      // Simulate a new highlight every 10 seconds
      if (Math.random() > 0.7) {
        const newHighlight: Highlight = {
          id: `highlight-${Date.now()}`,
          type: ['milestone', 'record', 'finish'][
            Math.floor(Math.random() * 3)
          ] as 'milestone' | 'record' | 'finish',
          user: {
            _id: `user${Math.floor(Math.random() * 5) + 1}`,
            name: [
              'John Doe',
              'Jane Smith',
              'Bob Johnson',
              'Alice Williams',
              'Charlie Brown',
            ][Math.floor(Math.random() * 5)],
            image: '/placeholder.svg?height=40&width=40',
          },
          message: [
            'reached 60 WPM',
            'set a new personal best',
            'finished in 2nd place',
            'reached 90% accuracy',
            'is on a streak',
          ][Math.floor(Math.random() * 5)],
          timestamp: new Date(),
        };

        setHighlights((prev) => [...prev, newHighlight]);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [roomId]);

  // Get icon based on highlight type
  const getHighlightIcon = (type: string) => {
    switch (type) {
      case 'start':
        return <Play className="h-4 w-4 text-green-500" />;
      case 'finish':
        return <Flag className="h-4 w-4 text-red-500" />;
      case 'milestone':
        return <Zap className="h-4 w-4 text-amber-500" />;
      case 'record':
        return <Award className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="text-muted-foreground h-4 w-4" />;
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Race Highlights</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="p-4" style={{ maxHeight }}>
          <div className="relative space-y-4 pl-6">
            {/* Timeline line */}
            <div className="border-muted-foreground/30 absolute top-0 bottom-0 left-2 border-l border-dashed" />

            {highlights.map((highlight) => (
              <div key={highlight.id} className="relative">
                {/* Timeline dot */}
                <div className="bg-background absolute top-1 -left-6 flex h-4 w-4 items-center justify-center rounded-full">
                  {getHighlightIcon(highlight.type)}
                </div>

                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    {highlight.user && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={highlight.user.image || '/placeholder.svg'}
                          alt={highlight.user.name}
                        />
                        <AvatarFallback>
                          {highlight.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1">
                      <p className="text-sm">
                        {highlight.user ? (
                          <>
                            <span className="font-medium">
                              {highlight.user.name}
                            </span>{' '}
                            {highlight.message}
                          </>
                        ) : (
                          highlight.message
                        )}
                      </p>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {new Date(highlight.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
