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
    // Call the decode-token route handler
    const decodeResponse = await fetch(`${req.nextUrl.origin}/api/decode-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    // Log the decode token response status
    console.log('Decode token response status:', decodeResponse.status);

    if (decodeResponse.status !== 200) {
      throw new Error('Invalid or expired token');
    }

    const decodedToken = await decodeResponse.json();
    const uid = decodedToken.uid;

    // Log the decoded uid
    console.log('Decoded uid:', uid);

    // Call the get-token route handler with the uid
    const getTokenResponse = await fetch(`${req.nextUrl.origin}/api/get-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid }),
    });

    // Log the get token response status
    console.log('Get token response status:', getTokenResponse.status);

    if (getTokenResponse.status !== 200) {
      throw new Error('Failed to retrieve user token');
    }

    const userToken = await getTokenResponse.json();
    const savedToken = userToken.token;

    // Call the verify-token API route with the saved token
    const verifyResponse = await fetch(`${req.nextUrl.origin}/api/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: savedToken }),
    });

    // Log the token verification response status
    console.log('Token verification response status:', verifyResponse.status);

    if (verifyResponse.status !== 200) {
      throw new Error('Invalid or expired token');
    }

    const verifiedToken = await verifyResponse.json();
    console.log('Verified token:', verifiedToken);

    // Check if the user is authenticated based on the presence of uid
    if (verifiedToken && verifiedToken.uid) {
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
  matcher: ['/dashboard/:path*', '/signin'],
};
