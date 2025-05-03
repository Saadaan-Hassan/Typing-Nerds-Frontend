'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_ROUTES } from '@/constants/api-routes';
import { ROUTES } from '@/constants/routes';
import { Loader2 } from 'lucide-react';

import apiCaller from '@/lib/api-caller';
import { setTokens } from '@/lib/auth';

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      setErrorMessage('Invalid verification link. Please request a new one.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await apiCaller(
          `${API_ROUTES.AUTH.VERIFY_EMAIL}/${token}`,
          'GET',
          undefined,
          {},
          false
        );

        if (response.data.success) {
          setIsSuccess(true);

          // If tokens are returned, store them
          const { accessToken, refreshToken } = response.data.data;
          if (accessToken && refreshToken) {
            setTokens({ accessToken, refreshToken });
          }

          // Redirect to login if no tokens or to dashboard if tokens provided
          setTimeout(() => {
            if (accessToken && refreshToken) {
              router.push('/dashboard');
            } else {
              router.push(ROUTES.AUTH.LOGIN);
            }
          }, 3000);
        } else {
          setErrorMessage(response.data.message || 'Failed to verify email');
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to verify email. Please try again.';
        setErrorMessage(message);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
      <div className="mx-auto max-w-md space-y-6 rounded-lg border p-6 shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Email Verification</h1>
          {isVerifying ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <p className="text-muted-foreground">
                Verifying your email address...
              </p>
            </div>
          ) : isSuccess ? (
            <div className="space-y-4 text-center">
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
              <h2 className="text-xl font-semibold text-green-700">
                Email Verified Successfully
              </h2>
              <p className="text-muted-foreground">
                Your email has been verified. You will be redirected to the
                dashboard.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-center">
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
              <h2 className="text-xl font-semibold text-red-700">
                Verification Failed
              </h2>
              <p className="text-muted-foreground">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
