import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useUser, UserButton, SignInButton } from '@clerk/clerk-react';
import {
  LocalMallOutlined as ShoppingBag,
  Inventory2Outlined as Box,
  PersonOutlineOutlined as User,
  TerminalOutlined as Terminal,
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
