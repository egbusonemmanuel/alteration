import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useUser, UserButton, SignInButton } from '@clerk/clerk-react';
import {
  LocalMallOutlined as ShoppingBag,
  Inventory2Outlined as Box,
  PersonOutlineOutlined as User,
  ContentCutOutlined as Scissors,
  MenuOutlined as Menu,
  CloseOutlined as Close,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ currency, setCurrency }) => {
  const [isHovered, setIsHovered] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  
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
    <>
      <nav className="fixed top-0 left-0 w-full z-50 glass-header py-4 px-4 sm:px-8 flex justify-between items-center bg-obsidian/80 backdrop-blur-xl border-b border-white/5 h-20">
        
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

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`group relative flex items-center gap-2 transition-colors duration-300 ${location.pathname === link.path ? 'text-gold' : 'text-ivory/70 hover:text-gold'}`}
              onMouseEnter={() => setIsHovered(link.name)}
              onMouseLeave={() => setIsHovered(null)}
            >
              {link.icon}
              <span className="text-xs font-bold uppercase tracking-widest">{link.name}</span>
              {(isHovered === link.name || location.pathname === link.path) && (
                <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 w-full h-[2px] bg-gold" />
              )}
            </Link>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 sm:gap-4">
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
            <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8 sm:w-9 sm:h-9 border-2 border-gold' } }} />
          ) : (
            <SignInButton mode="modal">
              <button className="btn-primary py-2 px-3 sm:px-4 text-[10px] sm:text-xs">SIGN IN</button>
            </SignInButton>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button className="md:hidden text-ivory p-1" onClick={() => setMobileMenuOpen(true)}>
            <Menu />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-obsidian/95 backdrop-blur-3xl flex flex-col p-8 md:hidden"
          >
            <div className="flex justify-end mb-12">
              <button className="text-ivory/50 hover:text-gold p-2" onClick={() => setMobileMenuOpen(false)}>
                <Close fontSize="large" />
              </button>
            </div>
            
            <div className="flex flex-col gap-8 items-center justify-center flex-grow">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-black uppercase tracking-widest flex items-center gap-4 transition-colors ${location.pathname === link.path ? 'text-gold' : 'text-ivory hover:text-gold'}`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 mt-auto border-t border-white/10 pt-8">
              <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase">THE ZERO-GRAVITY ATELIER</span>
              <p className="text-[10px] text-ivory/40 uppercase">WHERE MODESTY SHAPES EVERY DESIGN</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
