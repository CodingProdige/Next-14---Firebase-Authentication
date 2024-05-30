import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // Log the presence of the token
  console.log('Token:', token);

  const url = req.nextUrl.clone();

  if (!token) {
    if (url.pathname !== '/signin') {
      console.log('No token found, redirecting to /signin');
      return NextResponse.redirect(new URL('/signin', req.url));
    }
    return NextResponse.next();
  }

  try {
    const response = await fetch(`${req.nextUrl.origin}/api/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    // Log the response status
    console.log('Token verification response status:', response.status);

    if (response.status !== 200) {
      throw new Error('Invalid or expired token');
    }

    const decodedToken = await response.json();
    console.log('Decoded token:', decodedToken);

    // Check if the user is authenticated based on the presence of user_id
    if (decodedToken && decodedToken.user_id) {
      if (url.pathname === '/signin') {
        console.log('User is authenticated, redirecting to /dashboard');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    }

    if (url.pathname !== '/signin') {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  } catch (error) {
    console.error('Authentication error:', error);
    if (url.pathname !== '/signin') {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/signin'],
};
