import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(req: Request) {
  // Parse the request body as JSON
  const body = await req.json();

  if (!body.token) {
    return new Response(JSON.stringify({ error: 'Token is required' }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(body.token);
    return new Response(JSON.stringify(decodedToken), {
      headers: { 
        "Content-Type": "application/json",
        "Set-Cookie": `token=${body.token}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Path=/`,
      },
    });
  } catch (error: any) {
    console.error('Error verifying token:', error.message, error.stack);
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}
