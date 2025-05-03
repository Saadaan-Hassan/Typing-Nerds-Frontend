// components/AuthGuard.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Keyboard } from 'lucide-react';

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
    if (loading) return;

    const isCallback = AUTH_CALLBACK_PATHS.some(
      (path) => pathname === path || pathname.startsWith(path)
    );
    if (isCallback) return;

    const isProtected =
      pathname === ROUTES.DASHBOARD ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/user');

    if (!isAuthenticated && isProtected) {
      router.replace(ROUTES.AUTH.LOGIN);
    } else if (isAuthenticated && pathname.startsWith('/auth')) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) {
    return (
      <div className="bg-background/75 fixed inset-0 flex items-center justify-center">
        <Keyboard className="h-16 w-16 animate-pulse" />
      </div>
    );
  }

  return <>{children}</>;
}
