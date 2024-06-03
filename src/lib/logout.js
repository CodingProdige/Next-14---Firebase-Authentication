import { signOut } from 'firebase/auth';
import { auth } from './firebaseClient';

export async function logout() {
  try {
    // Log out using Firebase Client SDK
    await signOut(auth);

    // Remove the token cookie
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
