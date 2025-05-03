'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_ROUTES } from '@/constants/api-routes';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import apiCaller from '@/lib/api-caller';
import { setTokens } from '@/lib/auth';

export default function OAuthSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const refreshToken = searchParams.get('refreshToken');

  useEffect(() => {
    if (!token) {
      toast.error('Invalid authentication response');
      router.push('/auth');
      return;
    }

    const fetchUserAndTokens = async () => {
      try {
        // Set the tokens received from OAuth provider
        setTokens({
          accessToken: token,
          refreshToken: refreshToken || token, // Use refreshToken if available, fallback to token
        });

        // Fetch current user with the token
        const userResponse = await apiCaller(
          API_ROUTES.AUTH.CURRENT_USER,
          'GET',
          undefined,
          {},
          true
        );

        if (userResponse.data.success) {
          toast.success('Successfully signed in');

          // Redirect to dashboard
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          toast.error('Failed to fetch user data');
          router.push('/auth');
        }
      } catch (error: unknown) {
        console.error('Error processing authentication:', error);
        toast.error('Authentication failed');
        router.push('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndTokens();
  }, [token, refreshToken, router]);

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 rounded-lg border p-6 text-center shadow-md">
        {isLoading ? (
          <>
            <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
            <h2 className="text-2xl font-bold">Processing authentication...</h2>
            <p className="text-muted-foreground">
              Please wait while we complete your sign-in.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Authentication Successful</h2>
            <p className="text-muted-foreground">
              You will be redirected to the dashboard.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
