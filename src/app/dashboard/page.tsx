"use client";
import React from 'react';
import { auth } from '@/firebase/firebase';

const Dashboard = () => {
  const handleSignOut = () => {
    auth.signOut().then(() => {
      console.log('User signed out');
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Dashboard</h1>
      <p>Welcome!</p>
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
