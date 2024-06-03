import admin from '@/firebase/firebaseAdmin';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    // Verify the custom token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve the token from the user's document
    const userRef = admin.firestore().collection('users').doc(decoded.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists || userDoc.data().customToken !== token) {
      throw new Error('Invalid token');
    }

    // Token is valid
    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Error verifying token:', error);

    // If token verification fails, assume it's invalid and remove the cookie
    const cookie = serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1,
      path: '/',
    });
    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({ valid: false });
  }
}
