"use client";
import { useState } from 'react';
import { FormEvent } from 'react';

async function handleSignIn(email: string, password: string) {
  try {
    const response = await fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const user = await response.json();
      // Redirect to the dashboard
      window.location.href = '/dashboard';
    } else {
      const error = await response.json();
      console.error('Error signing in:', error.error);
      // Handle error (e.g., show error message to user)
    }
  } catch (error) {
    console.error('Error signing in:', error);
    // Handle error (e.g., show error message to user)
  }
}

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSignIn(email, password);
  };

  return (
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
      <button type="submit">Sign In</button>
    </form>
  );
}
