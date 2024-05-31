import { db } from '@/firebase/firebase'; // Ensure the correct path to your Firebase config
import { getDoc, doc } from 'firebase/firestore';

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();

  if (!body.uid) {
    return new Response(JSON.stringify({ error: 'UID is required' }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const userDocRef = doc(db, 'users', body.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return new Response(JSON.stringify({ error: 'User document not found' }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userData = userDoc.data();
    const token = userData?.token;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token not found in user document' }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error fetching token:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
