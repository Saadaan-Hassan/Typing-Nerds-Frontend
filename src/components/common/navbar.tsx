'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { BarChart2, BookOpen, Keyboard, Menu, Zap } from 'lucide-react';

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
    { href: ROUTES.PRACTICE, label: 'Practice', icon: BookOpen },
    { href: ROUTES.COMPETITION.HOME, label: 'Competition', icon: Zap },
    { href: ROUTES.LEADERBOARD, label: 'Leaderboard', icon: BarChart2 },
  ];

  return (
    <header className="bg-background border-border sticky top-0 z-50 border-b px-8">
      <div className="container mx-auto flex h-16 items-center">
        {/* Left: Logo */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Keyboard className="text-primary h-6 w-6" />
            <span className="text-xl font-bold">
              Typing<span className="text-primary">Nerds</span>
            </span>
          </Link>
        </div>

        {/* Center: Nav Links */}
        <nav className="hidden flex-1 justify-center gap-6 md:flex">
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

        {/* Right: Profile or Sign In */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full p-0"
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
                <div className="px-4 py-2">
                  <p className="text-sm leading-none font-medium">
                    {user.name}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs leading-none">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.USER.PROFILE}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
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

          {/* Mobile menu icon */}
          <Button variant="ghost" className="md:hidden">
            <Menu className="text-muted-foreground h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
