import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase"; // Make sure to export your Firestore instance from your firebase setup file

export async function POST(req: Request) {
  // Parse the request body as JSON
  const body = await req.json();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, body.email, body.password);
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    // Update the user's document with the new token
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { token: idToken });

    const maxAge = process.env.COOKIE_AGE || "3600"; // 30 days in seconds
    
    // Return the user's details as a JSON response
    return new Response(JSON.stringify(user), {
      headers: { 
        "Content-Type": "application/json",
        "Set-Cookie": `token=${idToken}; Max-Age=${maxAge}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Path=/`,
        "Location": "/dashboard" 
      },
    });
  } catch (error: any) {
    // Handle any errors that occurred during the sign-in process
    console.error("Error signing in:", error.message, error.stack);
    return new Response(error.message, { status: 500 });
  }
}
