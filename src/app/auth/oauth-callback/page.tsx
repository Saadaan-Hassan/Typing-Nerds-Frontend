'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { setTokens, setUser } from '@/lib/auth';

export default function OAuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');
  const error = searchParams.get('error');
  const user = searchParams.get('user');

  useEffect(() => {
    if (error) {
      setStatus('error');
      toast.error(error);
      setTimeout(() => {
        router.push(ROUTES.AUTH.LOGIN);
      }, 3000);
      return;
    }

    if (accessToken && refreshToken) {
      setTokens({
        accessToken,
        refreshToken,
      });

      if (user) {
        try {
          const userData = JSON.parse(decodeURIComponent(user));
          setUser(userData);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      setStatus('success');
      toast.success('Successfully signed in');

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } else {
      setStatus('error');
      toast.error('Authentication failed');

      setTimeout(() => {
        router.push(ROUTES.AUTH.LOGIN);
      }, 3000);
    }
  }, [accessToken, refreshToken, error, user, router]);

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 rounded-lg border p-6 text-center shadow-md">
        {status === 'loading' && (
          <>
            <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
            <h2 className="text-2xl font-bold">Processing authentication...</h2>
            <p className="text-muted-foreground">
              Please wait while we complete your sign-in.
            </p>
          </>
        )}

        {status === 'success' && (
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

        {status === 'error' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Authentication Failed</h2>
            <p className="text-muted-foreground">
              {error || 'There was a problem signing you in.'}
            </p>
            <p className="text-muted-foreground text-sm">
              You will be redirected to the login page.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
