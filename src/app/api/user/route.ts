import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/firebase";

function getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();  // Unsubscribe immediately since we only want the current state
            resolve(user);
        }, reject);
    });
}

export async function GET(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
            // User is signed in.
            return new Response(JSON.stringify(currentUser), {
                headers: { "Content-Type": "application/json" },
            });
        } else {
            // No user is signed in.
            return new Response("No user is signed in", {
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error: any) {
        // Handle any errors that occurred during the sign-in process
        console.error("Error fetching current user", error.message, error.stack);
        return new Response(error.message, { status: 500 });
    }
}
