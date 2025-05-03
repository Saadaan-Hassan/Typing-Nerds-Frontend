'use client';

import { useEffect, useState } from 'react';
import { Award, Link2, RefreshCw, Share } from 'lucide-react';
import { toast } from 'sonner';

import { isAuthenticated } from '@/lib/auth';
import { useAuth } from '@/lib/context/auth-context';
import { Badge, DrillService, UserStats } from '@/lib/services/drill-service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const { fetchAndUpdateUser } = useAuth();
  const [shareUrl, setShareUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [showBadgeDialog, setShowBadgeDialog] = useState(false);
  const [updatedStats, setUpdatedStats] = useState<UserStats | null>(null);

  // Save drill results to the backend
  useEffect(() => {
    const saveDrillResult = async () => {
      // Only save if user is authenticated
      if (!isAuthenticated()) return;

      try {
        setIsSaving(true);
        const response = await DrillService.saveDrillResult({
          wpm: results.wpm,
          accuracy: results.accuracy,
          roundTime: results.timeElapsed,
          content: results.content,
          category: results.category,
          totalLetters: results.totalLetters,
          correctLetters: results.correctLetters,
          incorrectLetters: results.incorrectLetters,
        });

        setIsSaved(true);

        // Check if we have new badges
        if (response.data.newBadges && response.data.newBadges.length > 0) {
          setNewBadges(response.data.newBadges);
          setShowBadgeDialog(true);

          // Show a toast notification
          toast.success('You earned new badges!', {
            description: `You've unlocked ${response.data.newBadges.length} new badge${response.data.newBadges.length > 1 ? 's' : ''}!`,
            duration: 5000,
          });
        }

        // Update stats
        if (response.data.stats) {
          setUpdatedStats(response.data.stats);
        }

        // Refresh the user data in the auth context to update badges and stats
        await fetchAndUpdateUser();
      } catch (error) {
        console.error('Failed to save drill result:', error);
        toast.error('Failed to save your results');
      } finally {
        setIsSaving(false);
      }
    };

    if (!isSaved) {
      saveDrillResult();
    }
  }, [results, isSaved, fetchAndUpdateUser]);

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
    <>
      <div className="mx-auto w-full max-w-4xl p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              Your Typing Results
            </CardTitle>
            <CardDescription className="text-center">
              {updatedStats ? (
                <div className="mt-2 text-sm">
                  Updated stats: {updatedStats.avgWpm} WPM avg •{' '}
                  {updatedStats.avgAccuracy}% accuracy • {updatedStats.rank}{' '}
                  rank
                </div>
              ) : (
                'Share your performance with friends!'
              )}
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

            <div className="mt-10">
              <h3 className="mb-2 text-lg font-medium">WPM Over Time</h3>
              <div className="h-64">
                <WpmChart data={results.wpmOverTime} />
              </div>
            </div>

            {newBadges.length > 0 && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setShowBadgeDialog(true)}
                >
                  <Award className="h-5 w-5 text-amber-500" />
                  View New Badges ({newBadges.length})
                </Button>
              </div>
            )}

            {isSaving && !isSaved && (
              <div className="text-muted-foreground mt-6 text-center text-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  <span>Saving your results...</span>
                </div>
              </div>
            )}
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

      {/* Badge Dialog */}
      <Dialog open={showBadgeDialog} onOpenChange={setShowBadgeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              🎉 Congratulations! 🎉
            </DialogTitle>
            <DialogDescription className="text-center">
              You&apos;ve earned {newBadges.length} new badge
              {newBadges.length > 1 ? 's' : ''}!
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {newBadges.map((badge) => (
              <div
                key={badge._id}
                className="bg-secondary/50 flex flex-col items-center rounded-lg p-4 text-center"
              >
                <div className="bg-primary/10 mb-2 flex h-14 w-14 items-center justify-center rounded-full">
                  <Award className="text-primary h-8 w-8" />
                </div>
                <h4 className="font-semibold">{badge.name}</h4>
                <p className="text-muted-foreground mt-1 text-xs">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
