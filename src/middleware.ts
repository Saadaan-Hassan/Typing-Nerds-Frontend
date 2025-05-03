import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has('accessToken');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  // Redirect to login if trying to access protected routes while not logged in
  if (!isLoggedIn && !isAuthRoute && !isApiRoute) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Redirect to dashboard if trying to access auth routes while logged in
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Specify the routes that should be checked by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
};
