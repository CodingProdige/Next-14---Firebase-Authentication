import { createUserWithEmailAndPassword, sendEmailVerification  } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { db } from "@/firebase/firebase"; // Assuming you have Firestore initialized in this file
import { doc, setDoc } from "firebase/firestore"; 

export async function POST(req: Request) {
    // Parse the request body as JSON
    const body = await req.json();
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, body.email, body.password);
        const user = userCredential.user;

        // Create a new user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: body.email,
            createdAt: new Date().toISOString(),
            uid: user.uid,
            // Add other fields as needed
        });

        // Send a verification email
        await sendEmailVerification(user);

        // Redirect to the /dashboard
        return new Response(null, {
            status: 302,
            headers: { 
                "Content-Type": "application/json",
                "Set-Cookie": `user=${user.uid}; Path=/; HttpOnly; Secure; SameSite=Strict`,        
                "Location": "/dashboard" 
            },
        });
    } catch (error: any) {
        // Handle any errors that occurred during the signup process
        console.error("Error signing up:", error.message, error.stack);
        return new Response(error.message, { status: 500 });
    }
}
