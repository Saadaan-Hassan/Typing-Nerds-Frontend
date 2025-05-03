'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link2, RefreshCw, Share } from 'lucide-react';
import { toast } from 'sonner';

import { isAuthenticated } from '@/lib/auth';
import {
  Badge as BadgeType,
  DrillResult,
  DrillService,
} from '@/lib/services/drill-service';
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
import { WpmChart } from '@/components/practice/wpm-chart';

interface EndScreenProps {
  results: {
    wpm: number;
    accuracy: number;
    totalLetters: number;
    correctLetters: number;
    incorrectLetters: number;
    timeElapsed: number;
    content: string;
    category: 'word' | 'code';
    wpmOverTime: { time: number; wpm: number }[];
  };
  onRestart: () => void;
}

export function EndScreen({ results, onRestart }: EndScreenProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [newBadges, setNewBadges] = useState<BadgeType[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Generate a shareable URL with encoded results
  useEffect(() => {
    const params = new URLSearchParams({
      wpm: results.wpm.toString(),
      accuracy: results.accuracy.toString(),
      timeElapsed: results.timeElapsed.toString(),
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    setShareUrl(url);
  }, [results]);

  // Save results to backend if authenticated
  useEffect(() => {
    const saveResults = async () => {
      if (!isAuthenticated() || isSaved) return;

      try {
        setIsSaving(true);
        const drillData: DrillResult = {
          wpm: results.wpm,
          accuracy: results.accuracy,
          roundTime: results.timeElapsed,
          content: results.content || 'Practice text',
          category: results.category || 'word',
          totalLetters: results.totalLetters,
          correctLetters: results.correctLetters,
          incorrectLetters: results.incorrectLetters,
        };

        const response = await DrillService.saveDrillResult(drillData);

        if (response.success) {
          setIsSaved(true);
          if (response.data.newBadges.length > 0) {
            setNewBadges(response.data.newBadges);
            response.data.newBadges.forEach((badge) => {
              toast.success(`New Badge Earned: ${badge.name}!`, {
                description: badge.description,
                duration: 5000,
              });
            });
          }
        }
      } catch (error) {
        console.error('Failed to save drill results:', error);
      } finally {
        setIsSaving(false);
      }
    };

    saveResults();
  }, [results, isSaved]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Typing Results',
        text: `I typed ${results.wpm} WPM (${results.accuracy}% accuracy)!`,
        url: shareUrl,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl">
            Your Typing Results
          </CardTitle>
          <CardDescription className="text-center">
            {isSaving
              ? 'Saving your results...'
              : 'Share your performance with friends!'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="bg-secondary flex flex-col items-center justify-center rounded-lg p-6">
              <span className="text-primary text-4xl font-extrabold">
                {results.wpm}
              </span>
              <span className="text-muted-foreground mt-1 text-sm">WPM</span>
            </div>

            <div className="bg-secondary flex flex-col items-center justify-center rounded-lg p-6">
              <span className="text-primary text-4xl font-extrabold">
                {results.accuracy}%
              </span>
              <span className="text-muted-foreground mt-1 text-sm">
                Accuracy
              </span>
            </div>

            <div className="bg-secondary flex flex-col items-center justify-center rounded-lg p-6">
              <span className="text-primary text-4xl font-extrabold">
                {results.timeElapsed}s
              </span>
              <span className="text-muted-foreground mt-1 text-sm">Time</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-secondary/50 flex flex-col items-center rounded-lg p-4">
              <span className="text-xl font-semibold">
                {results.totalLetters}
              </span>
              <span className="text-muted-foreground text-xs">
                Total Letters
              </span>
            </div>
            <div className="bg-secondary/50 flex flex-col items-center rounded-lg p-4">
              <span className="text-xl font-semibold text-green-500">
                {results.correctLetters}
              </span>
              <span className="text-muted-foreground text-xs">Correct</span>
            </div>
            <div className="bg-secondary/50 flex flex-col items-center rounded-lg p-4">
              <span className="text-xl font-semibold text-red-500">
                {results.incorrectLetters}
              </span>
              <span className="text-muted-foreground text-xs">Incorrect</span>
            </div>
          </div>

          {newBadges.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-medium">New Badges Earned!</h3>
              <div className="flex flex-wrap gap-2">
                {newBadges.map((badge) => (
                  <div
                    key={badge._id}
                    className="bg-secondary/50 flex flex-col items-center rounded-lg p-4"
                    title={badge.description}
                  >
                    <div className="relative mb-2 h-12 w-12">
                      <Image
                        src={badge.imageUrl || '/images/badges/default.png'}
                        alt={badge.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback for missing image
                          (e.target as HTMLImageElement).src =
                            '/images/badges/default.png';
                        }}
                      />
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary"
                    >
                      {badge.name}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <h3 className="mb-2 text-lg font-medium">WPM Over Time</h3>
            <div className="h-64">
              <WpmChart data={results.wpmOverTime} />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="flex justify-center space-x-4">
            <Button
              onClick={onRestart}
              variant="default"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share className="h-5 w-5" />
              Share
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Link2 className="text-muted-foreground" />
            <Input readOnly value={shareUrl} className="flex-1" />
            <Button size="icon" onClick={handleCopy} className="h-fit py-2.5">
              {copySuccess ? (
                <span>✓</span>
              ) : (
                <span className="text-[10px]">Copy</span>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
