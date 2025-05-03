'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Shield, Users } from 'lucide-react';

import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { RaceCompetition } from '@/components/rooms/race-competition';

export default function CompetitionRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const roomId = params.id as string;
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Redirect non-authenticated users to login page
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }

    // In a production app, you would get the user ID from your auth context
    // For this quick implementation, we'll use localStorage or generate a temp ID
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Generate a temporary user ID for testing
      const tempUserId = `user_${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem('userId', tempUserId);
      setUserId(tempUserId);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">
          Please login to access competitions
        </h1>
        <Button onClick={() => router.push(ROUTES.AUTH.LOGIN)}>
          Login Now
        </Button>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Typing Race</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="text-muted-foreground h-5 w-5" />
              <span className="text-sm font-medium">
                Room {roomId.slice(0, 6)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="text-muted-foreground h-5 w-5" />
              <span className="text-sm font-medium">Public</span>
            </div>
          </div>
        </div>
      </div>

      <RaceCompetition roomId={roomId} userId={userId} />
    </div>
  );
}
