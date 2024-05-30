// pages/signup.js
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            // Redirect to dashboard
            router.push('/dashboard');
        } else {
            const errorData = await response.json();
            setError(errorData.message || 'An error occurred');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px', marginBottom: '10px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px', marginBottom: '10px' }}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={{ padding: '10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px' }}>
                    Sign Up
                </button>
            </form>
        </div>
    );
}
