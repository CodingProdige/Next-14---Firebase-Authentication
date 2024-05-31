import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.token) {
    return new NextResponse(JSON.stringify({ error: 'Token is required' }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const decodedToken = jwt.decode(body.token) as JwtPayload | null;

    if (!decodedToken) {
      throw new Error('Token decoding failed');
    }

    const uid = decodedToken.user_id || decodedToken.uid;

    if (!uid) {
      return new NextResponse(JSON.stringify({ error: 'UID not found in token' }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify({ uid }), {
      headers: { 
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error('Error decoding token:', error.message, error.stack);
    return new NextResponse(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}
