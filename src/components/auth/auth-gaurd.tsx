// components/AuthGuard.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

import { useAuth } from '@/lib/context/auth-context';

// Auth callback paths that should always be accessible
const AUTH_CALLBACK_PATHS = [
  '/auth/success',
  '/auth/error',
  '/auth/oauth-callback',
];

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything while auth is still loading
    if (loading) return;

    // Check if it's an auth callback page (don't redirect these at all)
    const isAuthCallback = AUTH_CALLBACK_PATHS.some(
      (path) => pathname === path || pathname.startsWith(path)
    );

    // If we're on an auth callback page, don't redirect regardless of auth state
    if (isAuthCallback) {
      return;
    }

    // Check if it's a protected page (dashboard, user profile, etc.)
    const isProtectedPath =
      pathname === ROUTES.DASHBOARD ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/user');

    if (!isAuthenticated && isProtectedPath) {
      // Not logged in -> protect restricted routes
      console.log(
        'Not authenticated, redirecting from protected page to login'
      );
      router.replace(ROUTES.AUTH.LOGIN);
    } else if (isAuthenticated && pathname.startsWith('/auth')) {
      // Logged in -> block auth routes
      console.log(
        'Already authenticated, redirecting from auth page to dashboard'
      );
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Show a loader while checking authentication
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
}
