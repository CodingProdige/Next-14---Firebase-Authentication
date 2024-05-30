import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";


export async function POST(req: Request) {
  // Parse the request body as JSON
  const body = await req.json();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, body.email, body.password);
    const user = userCredential.user;
    const idToken = await user.getIdToken();
    
    // Return the user's details as a JSON response
    return new Response(JSON.stringify(user), {
      headers: { 
        "Content-Type": "application/json",
        "Set-Cookie": `token=${idToken}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Path=/`,
        "Location": "/dashboard" 
      },
    });
  } catch (error: any) {
    // Handle any errors that occurred during the sign-in process
    console.error("Error signing in:", error.message, error.stack);
    return new Response(error.message, { status: 500 });
  }
}
