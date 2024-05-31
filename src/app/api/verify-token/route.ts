import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const userToken = body.userToken;
  const tokenCookie = body.tokenCookie;

  if (!userToken) {
    return new NextResponse(JSON.stringify({ error: 'User token is required' }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!tokenCookie) {
    return new NextResponse(JSON.stringify({ error: 'Token cookie is required' }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (userToken !== tokenCookie) {
    return new NextResponse(JSON.stringify({ error: 'Tokens do not match' }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Decode the token to check expiration (assuming it's a JWT)
  const tokenParts = tokenCookie.split('.');
  if (tokenParts.length !== 3) {
    return new NextResponse(JSON.stringify({ error: 'Invalid token format' }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = JSON.parse(atob(tokenParts[1]));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now) {
    // Token is expired, sign the user out and delete the token cookie
    return new NextResponse(JSON.stringify({ error: 'Token is expired' }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": serialize('token', '', {
          maxAge: -1,
          path: '/',
          httpOnly: true,
          secure: true,
        }),
      },
    });
  }

  // If the token is valid and not expired, return a 200 status
  return new NextResponse(JSON.stringify({ success: true }), {
    headers: { 
      "Content-Type": "application/json",
    },
  });
}
