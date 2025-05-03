// components/AuthGuard.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

import { useAuth } from '@/lib/context/auth-context';

const PUBLIC_PATHS = ['/', '/auth', '/practice'];

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // wait until we know auth state

    // Normalize so '/auth/login' still matches '/auth'
    const isPublic = PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(path + '/')
    );

    if (!isAuthenticated && !isPublic) {
      // Not logged in ➔ protect
      router.replace(ROUTES.AUTH.LOGIN);
    } else if (isAuthenticated && pathname.startsWith('/auth')) {
      // Logged in ➔ block auth routes
      router.replace('/dashboard');
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Optionally render a loader while we check
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">Loading…</div>
    );
  }

  return <>{children}</>;
}
