import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve token from cookies (or session headers)
  const token = request.cookies.get('auth_token')?.value;

  // 1. Allow the login page and static assets without authentication
  if (pathname === '/admin/login' || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    // If already logged in, redirect away from /admin/login to /admin dashboard
    if (token && pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // 2. Protect all other /admin sub-routes
  if (pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};