"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    const response = await fetch('/api/signout', {
      method: 'POST',
    });

    if (response.ok) {
      // Redirect to the home page after successful signout
      router.push('/');
    } else {
      console.error('Error signing out');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Dashboard</h1>
      <button 
        onClick={handleSignOut} 
        style={{ padding: '10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
