import admin from '@/firebase/firebaseAdmin';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response("Method not allowed", { status: 405 });
  }

  const { uid } = await req.json();

  if (!uid) {
    return new Response(JSON.stringify({ error: 'UID is required' }), { status: 400 });
  }

  try {
    // Create a custom token with a custom expiration (1 week)
    const customToken = jwt.sign({ uid }, process.env.JWT_SECRET!, { expiresIn: '1w' });

    // Save the token to the user's document in Firestore
    const userRef = admin.firestore().collection('users').doc(uid);
    await userRef.set({ customToken }, { merge: true });

    // Save the token as a cookie
    const cookie = serialize('token', customToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    const headers = new Headers();
    headers.append('Set-Cookie', cookie);

    return new Response(JSON.stringify({ customToken }), {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error('Error creating custom token:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
