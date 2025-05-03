'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { formatDistanceToNow } from 'date-fns';
import { AlarmClock, Code, FileText, Trophy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HistoryListProps {
  drillHistory: Array<{
    _id: string;
    wpm: number;
    accuracy: number;
    createdAt: string;
    category: 'word' | 'code';
  }>;
  raceHistory: Array<{
    competitionId: string;
    date: string;
    wpm: number;
    accuracy: number;
    position: number;
    finishTime: number;
  }>;
  isLoading?: boolean;
}

export function HistoryList({
  drillHistory,
  raceHistory,
  isLoading = false,
}: HistoryListProps) {
  const [activeTab, setActiveTab] = useState('all');

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <Skeleton className="ml-auto h-4 w-16" />
              <Skeleton className="ml-auto h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Format and combine histories
  const combinedHistory = [
    ...drillHistory.map((drill) => ({
      id: drill._id,
      wpm: drill.wpm,
      accuracy: drill.accuracy,
      date: drill.createdAt,
      type: 'drill' as const,
      category: drill.category,
    })),
    ...raceHistory.map((race) => ({
      id: race.competitionId,
      wpm: race.wpm,
      accuracy: race.accuracy,
      date: race.date,
      type: 'race' as const,
      position: race.position,
      finishTime: race.finishTime,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter based on active tab
  const filteredHistory =
    activeTab === 'all'
      ? combinedHistory
      : activeTab === 'drills'
        ? combinedHistory.filter((h) => h.type === 'drill')
        : combinedHistory.filter((h) => h.type === 'race');

  if (!filteredHistory.length) {
    return (
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="drills">Drills</TabsTrigger>
            <TabsTrigger value="races">Races</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
          <Trophy className="mb-2 h-10 w-10 opacity-20" />
          <p>No history found</p>
          {activeTab === 'all' && (
            <p className="text-sm">
              Complete drills or races to build your history
            </p>
          )}
          {activeTab === 'drills' && (
            <p className="text-sm">
              Complete typing drills to see your history
            </p>
          )}
          {activeTab === 'races' && (
            <p className="text-sm">
              Compete in typing races to build your history
            </p>
          )}
          <Button className="mt-4" asChild>
            <Link
              href={
                activeTab === 'races'
                  ? ROUTES.COMPETITION.HOME
                  : ROUTES.PRACTICE
              }
            >
              {activeTab === 'races' ? 'Join a Race' : 'Practice Now'}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="drills">Drills</TabsTrigger>
          <TabsTrigger value="races">Races</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="max-h-[400px] space-y-2 overflow-y-auto pr-2">
        {filteredHistory.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              {item.type === 'drill' ? (
                item.category === 'code' ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-500">
                    <Code className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-500">
                    <FileText className="h-5 w-5" />
                  </div>
                )
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <Trophy className="h-5 w-5" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {item.type === 'drill'
                      ? `${item.category === 'code' ? 'Code' : 'Text'} Drill`
                      : 'Race Competition'}
                  </p>
                  {item.type === 'race' && item.position === 1 && (
                    <Badge className="bg-yellow-500">1st Place</Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <AlarmClock className="text-muted-foreground h-4 w-4" />
                <p className="text-lg font-semibold">{item.wpm} WPM</p>
              </div>
              <p className="text-muted-foreground text-sm">
                {item.accuracy}% accuracy
                {item.type === 'race' && ` • ${item.finishTime}s`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
