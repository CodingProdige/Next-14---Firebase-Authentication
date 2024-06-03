import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // Log the presence of the token
  console.log('Token:', token);

  const url = req.nextUrl.clone();

  // Redirect to /signin if no token is found and the path is not /signin or /signup
  if (!token) {
    if (url.pathname !== '/signin' && url.pathname !== '/signup') {
      console.log('No token found, redirecting to /signin');
      return NextResponse.redirect(new URL('/signin', req.url));
    }
    return NextResponse.next();
  }

  try {
    // Verify the token
    const verifyResponse = await fetch(`${req.nextUrl.origin}/api/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    // Log the token verification response status
    console.log('Token verification response status:', verifyResponse.status);

    if (verifyResponse.status !== 200) {
      throw new Error('Invalid or expired token');
    }

    const verificationResult = await verifyResponse.json();
    console.log('Verification result:', verificationResult);

    // Check if the user is authenticated based on the verification result
    if (verificationResult.valid) {
      if (url.pathname === '/signin' || url.pathname === '/signup') {
        console.log('User is authenticated, redirecting to /dashboard');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    }

    // Redirect to /signin if not authenticated and path is not /signin or /signup
    if (url.pathname !== '/signin' && url.pathname !== '/signup') {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  } catch (error) {
    console.error('Authentication error:', error);
    // Redirect to /signin in case of an error and path is not /signin or /signup
    if (url.pathname !== '/signin' && url.pathname !== '/signup') {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup'],
};
