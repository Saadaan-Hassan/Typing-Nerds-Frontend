import type { Metadata } from 'next';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Keyboard } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password | TypeRacer',
  description: 'Reset your TypeRacer password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mb-2 flex justify-center">
            <div className="bg-primary/10 rounded-full p-2">
              <Keyboard className="text-primary h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            Forgot password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we&rsquo;ll send you a link to reset
            your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter className="border-border flex flex-col space-y-4 border-t pt-6">
          <div className="text-center text-sm">
            Remember your password?{' '}
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="text-primary hover:underline"
            >
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
