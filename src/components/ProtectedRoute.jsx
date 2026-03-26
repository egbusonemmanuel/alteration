import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { LockOutlined as Lock } from '@mui/icons-material';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-lavender border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (requireAdmin) {
    const adminEmails = ['delectablesvelt@gmail.com', 'vibesemmy3@gmail.com'];
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const isApprovedEmail = userEmail && adminEmails.includes(userEmail.toLowerCase());

    if (!isApprovedEmail) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
          <div className="text-6xl font-black text-lavender/20 mb-4">403</div>
          <h2 className="text-2xl font-black tracking-tighter uppercase mb-2">Access Denied</h2>
          <p className="text-ivory/40 text-sm">Only the Master Tailor may enter this chamber.</p>
        </div>
      );
    }

    if (!unlocked) {
      const handleUnlock = (e) => {
        e.preventDefault();
        const masterPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'svelt2026';
        if (password === masterPassword) {
          setUnlocked(true);
        } else {
          setError('Invalid Master Tailor Password.');
        }
      };

      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-fade-in">
          <div className="glass-card p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-lavender/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <Lock className="text-lavender w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-2 text-lavender-gradient">RESTRICTED ACCESS</h2>
            <p className="text-ivory/40 text-xs tracking-widest uppercase mb-8">Enter the Master Tailor Password</p>
            
            <form onSubmit={handleUnlock} className="flex flex-col gap-4">
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Password..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-lavender transition-colors text-ivory text-center tracking-[0.2em]"
              />
              {error && <p className="text-red-400 text-[10px] uppercase tracking-widest font-bold">{error}</p>}
              <button type="submit" className="w-full btn-primary py-4">UNLOCK ATELIER</button>
            </form>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
