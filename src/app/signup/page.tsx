"use client";
import { useState } from 'react';
import { FormEvent } from 'react';
import { auth } from '@/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

async function handleEmailSignUp(email: string, password: any) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Call the generate-token API with the UID to get a custom token
    const response = await fetch('/api/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: user.uid })
    });

    if (response.ok) {
      const { customToken } = await response.json();

      // Save the custom token as a cookie
      document.cookie = `token=${customToken}; Path=/;`;

      // Redirect to the dashboard
      window.location.href = '/dashboard';
    } else {
      const error = await response.json();
      console.error('Error generating token:', error.error);
      // Handle error (e.g., show error message to user)
    }
  } catch (error) {
    console.error('Error signing up:', error);
    // Handle error (e.g., show error message to user)
  }
}

async function handleGoogleSignUp() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Call the generate-token API with the UID to get a custom token
    const response = await fetch('/api/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: user.uid })
    });

    if (response.ok) {
      const { customToken } = await response.json();

      // Save the custom token as a cookie
      document.cookie = `token=${customToken}; Path=/;`;

      // Redirect to the dashboard
      window.location.href = '/dashboard';
    } else {
      const error = await response.json();
      console.error('Error generating token:', error.error);
      // Handle error (e.g., show error message to user)
    }
  } catch (error) {
    console.error('Error signing up with Google:', error);
    // Handle error (e.g., show error message to user)
  }
}

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleEmailSignUp(email, password);
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up with Email</button>
      </form>
      <button onClick={handleGoogleSignUp}>Sign Up with Google</button>
    </div>
  );
}
