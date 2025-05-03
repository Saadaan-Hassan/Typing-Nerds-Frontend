'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { isAuthenticated } from '@/lib/auth';
import { Badge, DrillService } from '@/lib/services/drill-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function UserBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await DrillService.getUserStats();
        if (response.success) {
          setBadges(response.data.badges);
        }
      } catch (error) {
        console.error('Failed to fetch user badges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-md" />
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Sign in to track your badges and achievements.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (badges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            You haven&apos;t earned any badges yet. Keep practicing to unlock
            achievements!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {badges.map((badge) => (
            <div
              key={badge._id}
              className="bg-secondary/50 flex flex-col items-center rounded-lg p-3"
              title={badge.description}
            >
              <div className="relative mb-2 flex h-14 w-14 items-center justify-center">
                <Image
                  src={badge.imageUrl || '/images/badges/default.png'}
                  alt={badge.name}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    // Fallback for missing image
                    (e.target as HTMLImageElement).src =
                      '/images/badges/default.png';
                  }}
                />
              </div>
              <span className="text-center text-xs font-medium">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
