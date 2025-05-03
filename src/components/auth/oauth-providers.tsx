'use client';

import { useState } from 'react';
import Image from 'next/image';
import { API_ROUTES } from '@/constants/api-routes';
import { Github } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export function OAuthButtons() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);

    try {
      // Redirect to Google OAuth endpoint with success redirect URL
      const successUrl = encodeURIComponent(
        `${window.location.origin}/auth/success`
      );
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_ROUTES.AUTH.GOOGLE}?redirect_url=${successUrl}`;
    } catch {
      toast.error(
        'There was a problem signing in with Google. Please try again.'
      );
      setIsGoogleLoading(false);
    }
  }

  async function handleGithubSignIn() {
    setIsGithubLoading(true);

    try {
      // Redirect to GitHub OAuth endpoint with success redirect URL
      const successUrl = encodeURIComponent(
        `${window.location.origin}/auth/success`
      );
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_ROUTES.AUTH.GITHUB}?redirect_url=${successUrl}`;
    } catch {
      toast.error(
        'There was a problem signing in with GitHub. Please try again.'
      );
      setIsGithubLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isGithubLoading}
        className="flex items-center gap-2"
      >
        {isGoogleLoading ? (
          <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
        ) : (
          <Image
            src="/google.svg"
            alt="Google"
            width={16}
            height={16}
            className="h-4 w-4"
          />
        )}
        Google
      </Button>
      <Button
        variant="outline"
        onClick={handleGithubSignIn}
        disabled={isGoogleLoading || isGithubLoading}
        className="flex items-center gap-2"
      >
        {isGithubLoading ? (
          <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
        ) : (
          <Github className="h-4 w-4" />
        )}
        GitHub
      </Button>
    </div>
  );
}
