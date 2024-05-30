import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";

export async function POST(req: Request) {
    try {
        await signOut(auth);

        // Create a response that clears the authentication cookie and redirects to the home page
        const response = new Response(null, {
            status: 200,
        });

        // Clear the authentication cookie
        response.headers.set("Set-Cookie", "user=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0");

        return response;
    } catch (error: any) {
        // Handle any errors that occurred during the sign-out process
        console.error("Error signing out:", error.message, error.stack);
        return new Response(error.message, { status: 500 });
    }
}
