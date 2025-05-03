'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export default function OAuthErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || 'Authentication failed';

  useEffect(() => {
    toast.error(errorMessage);
  }, [errorMessage]);

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 rounded-lg border p-6 text-center shadow-md">
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
        <p className="text-muted-foreground">{errorMessage}</p>
        <Button asChild className="w-full">
          <Link href={ROUTES.AUTH.LOGIN}>Return to Login</Link>
        </Button>
      </div>
    </div>
  );
}
