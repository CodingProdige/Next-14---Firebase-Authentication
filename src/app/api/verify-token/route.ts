import admin from '@/firebase/firebaseAdmin';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response("Method not allowed", { status: 405 });
  }

  const { token } = await req.json();

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token is required' }), { status: 400 });
  }

  try {
    // Verify the custom token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

    // Retrieve the token from the user's document
    const userRef = admin.firestore().collection('users').doc(decoded.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists || userDoc.data()?.customToken !== token) {
      throw new Error('Invalid token');
    }

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if ((decoded.exp ?? 0) < currentTime) {
      // Token is expired, remove the cookie
      const cookie = serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: -1,
        path: '/',
      });

      const headers = new Headers();
      headers.append('Set-Cookie', cookie);

      return new Response(JSON.stringify({ valid: false }), {
        status: 200,
        headers: headers,
      });
    }

    // Token is valid
    return new Response(JSON.stringify({ valid: true }), { status: 200 });
  } catch (error) {
    console.error('Error verifying token:', error);

    // If token verification fails, assume it's invalid and remove the cookie
    const cookie = serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1,
      path: '/',
    });

    const headers = new Headers();
    headers.append('Set-Cookie', cookie);

    return new Response(JSON.stringify({ valid: false }), {
      status: 200,
      headers: headers,
    });
  }
}
