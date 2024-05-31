import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // Log the presence of the token
  console.log('Token:', token);

  const url = req.nextUrl.clone();

  // Redirect to /signin if no token is found and the path is not /signin
  if (!token) {
    if (url.pathname !== '/signin') {
      console.log('No token found, redirecting to /signin');
      return NextResponse.redirect(new URL('/signin', req.url));
    }
    return NextResponse.next();
  }

  try {
    // Decode the token
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

    // Retrieve user token using the uid
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

    // Log the user token retrieved from the user document
    console.log('User token:', savedToken);

    // Verify the token
    const verifyResponse = await fetch(`${req.nextUrl.origin}/api/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tokenCookie: savedToken, userToken: token }),
    });

    // Log the token verification response status
    console.log('Token verification response status:', verifyResponse.status);

    if (verifyResponse.status !== 200) {
      throw new Error('Invalid or expired token');
    }

    const verifiedToken = await verifyResponse.json();
    console.log('Verified token:', verifiedToken);

    // Check if the user is authenticated based on the verified token
    if (verifiedToken) {
      if (url.pathname === '/signin') {
        console.log('User is authenticated, redirecting to /dashboard');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    }

    // Redirect to /signin if not authenticated and path is not /signin
    if (url.pathname !== '/signin') {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  } catch (error) {
    console.error('Authentication error:', error);
    // Redirect to /signin in case of an error and path is not /signin
    if (url.pathname !== '/signin') {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/signin'],
};