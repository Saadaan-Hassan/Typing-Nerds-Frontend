'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_ROUTES } from '@/constants/api-routes';
import { ROUTES } from '@/constants/routes';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import apiCaller from '@/lib/api-caller';
import { clearTokens, clearUser, setTokens, setUser } from '@/lib/auth';

export default function OAuthSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract URL parameters
  const token = searchParams.get('token');
  const refreshToken = searchParams.get('refreshToken');
  const userData = searchParams.get('user');

  // Log all search params for debugging
  useEffect(() => {
    console.log('Auth success page loaded');
    console.log('URL parameters:', {
      token: token ? `${token.substring(0, 10)}...` : null, // Show partial token for security
      refreshToken: refreshToken ? 'exists' : null,
      userData: userData ? 'exists' : null,
      allParams: Object.fromEntries(searchParams.entries()),
    });
  }, [searchParams, token, refreshToken, userData]);

  useEffect(() => {
    // Create a function to handle token validation and user fetching
    const completeAuthentication = async () => {
      if (!token) {
        const errorMsg = 'Invalid authentication response: No token received';
        setError(errorMsg);
        toast.error(errorMsg);
        setTimeout(() => router.push(ROUTES.AUTH.LOGIN), 2000);
        return;
      }

      try {
        console.log('Starting authentication process with tokens');

        // Clear any existing auth data first
        clearTokens();
        clearUser();

        // Set the new tokens
        setTokens({
          accessToken: token,
          refreshToken: refreshToken || token,
        });

        // First try to get user data if it's in the URL
        if (userData) {
          try {
            const parsedUser = JSON.parse(decodeURIComponent(userData));
            console.log('Successfully parsed user data from URL param');
            setUser(parsedUser);

            toast.success('Successfully signed in');
            setTimeout(() => {
              // Explicitly force a hard navigation to dashboard to refresh the app state
              window.location.href = ROUTES.DASHBOARD;
            }, 1500);
            return; // Don't fetch from API if we have the user data
          } catch (e) {
            console.error('Error parsing user data from URL:', e);
            // Continue to API fetch as fallback
          }
        }

        // If no user data in URL or parsing failed, fetch from API
        console.log('Fetching user data from API...');
        try {
          const userResponse = await apiCaller(
            API_ROUTES.AUTH.CURRENT_USER,
            'GET',
            undefined,
            {},
            true
          );

          if (userResponse?.data?.success) {
            const user = userResponse.data.data;
            console.log('User data fetched successfully from API');
            setUser(user);

            toast.success('Successfully signed in');
            setTimeout(() => {
              // Explicitly force a hard navigation to dashboard to refresh the app state
              window.location.href = ROUTES.DASHBOARD;
            }, 1500);
          } else {
            throw new Error(
              userResponse?.data?.message || 'Failed to fetch user data'
            );
          }
        } catch (apiError) {
          console.error('API error when fetching user data:', apiError);
          throw apiError;
        }
      } catch (error: unknown) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : 'Authentication failed. Please try again.';
        console.error('Authentication error:', errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
        clearTokens();
        clearUser();
        setTimeout(() => router.push(ROUTES.AUTH.LOGIN), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    // Execute the authentication process
    completeAuthentication();
  }, [token, refreshToken, userData, router]);

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
        ) : error ? (
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
            <p className="text-muted-foreground">{error}</p>
            <p className="text-muted-foreground mt-4">
              Redirecting you back to login...
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
