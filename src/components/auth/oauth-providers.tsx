'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Github } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export function OAuthButtons() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const router = useRouter();

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);

    try {
      // This would be replaced with your actual Google OAuth logic
      console.log('Sign in with Google');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Google sign-in successful!');

      router.push('/dashboard');
    } catch {
      toast.error(
        'There was a problem signing in with Google. Please try again.'
      );
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function handleGithubSignIn() {
    setIsGithubLoading(true);

    try {
      // This would be replaced with your actual GitHub OAuth logic
      console.log('Sign in with GitHub');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('GitHub sign-in successful!');

      router.push('/dashboard');
    } catch {
      toast.error(
        'There was a problem signing in with GitHub. Please try again.'
      );
    } finally {
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
            src="/placeholder.svg?height=16&width=16"
            alt="Google logo"
            width={16}
            height={16}
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
