import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useUser, UserButton, SignInButton } from '@clerk/clerk-react';
import {
  LocalMallOutlined as ShoppingBag,
  Inventory2Outlined as Box,
  PersonOutlineOutlined as User,
  TerminalOutlined as Terminal,
  ContentCutOutlined as Scissors,
} from '@mui/icons-material';

const Navbar = ({ currency, setCurrency }) => {
  const [isHovered, setIsHovered] = useState(null);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  
  const adminEmails = ['delectablesvelt@gmail.com', 'vibesemmy3@gmail.com'];
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = userEmail && adminEmails.includes(userEmail.toLowerCase());

  const navLinks = [
    { name: 'Home', path: '/', icon: <Box fontSize="small" /> },
    { name: 'Gallery', path: '/shop', icon: <ShoppingBag fontSize="small" /> },
    { name: 'Virtual Closet', path: '/alterations', icon: <Scissors fontSize="small" /> },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin', icon: <User fontSize="small" /> }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-header py-4 px-8 flex justify-between items-center bg-obsidian/80 backdrop-blur-xl border-b border-white/5">
      
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 relative flex items-center justify-center">
          {/* Geometric SVG Logo */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-gold group-hover:scale-110 transition-transform duration-500">
            <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40" />
            <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="1" className="opacity-50" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
          </svg>
        </div>
        <div className="flex flex-col hidden sm:flex">
          <span className="text-xl font-black tracking-tighter text-ivory leading-none">D & S</span>
          <span className="text-[8px] font-bold tracking-[0.3em] text-gold uppercase mt-1">ATELIER</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="group relative flex items-center gap-2 text-ivory/70 hover:text-gold transition-colors duration-300"
            onMouseEnter={() => setIsHovered(link.name)}
            onMouseLeave={() => setIsHovered(null)}
          >
            {link.icon}
            <span className="text-xs font-bold uppercase tracking-widest">{link.name}</span>
            {isHovered === link.name && (
              <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gold" />
            )}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {/* Currency Toggle */}
        <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
          {['NGN', 'USD'].map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                currency === c ? 'bg-gold text-obsidian' : 'text-ivory/50 hover:text-ivory'
              }`}
            >
              {c === 'NGN' ? '₦' : '$'}
            </button>
          ))}
        </div>

        {/* Clerk Auth */}
        {isSignedIn ? (
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9 border-2 border-gold',
              }
            }}
          />
        ) : (
          <SignInButton mode="modal">
            <button className="btn-primary py-2 px-4 text-xs">SIGN IN</button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
