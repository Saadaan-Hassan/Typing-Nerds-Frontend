'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { BarChart2, BookOpen, Keyboard, User, Zap } from 'lucide-react';

import { useAuth } from '@/lib/context/auth-context';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { href: '/', label: 'Race', icon: Keyboard },
    { href: ROUTES.PRACTICE, label: 'Practice', icon: BookOpen },
    { href: ROUTES.COMPETITION.HOME, label: 'Competition', icon: Zap },
    { href: ROUTES.LEADERBOARD, label: 'Leaderboard', icon: BarChart2 },
    {
      href: isAuthenticated ? ROUTES.DASHBOARD : ROUTES.AUTH.LOGIN,
      label: isAuthenticated ? 'Dashboard' : 'Login',
      icon: User,
    },
  ];

  return (
    <header className="border-border bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Keyboard className="text-primary h-6 w-6" />
            <span className="text-primary-foreground text-xl font-bold">
              TypeRacer
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.profilePicture || '/placeholder.svg'}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm leading-none font-medium">
                    {user.name}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.USER.PROFILE}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.USER.SETTINGS}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href={ROUTES.AUTH.LOGIN}>Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
