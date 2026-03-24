import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
  const [mode, setMode] = useState('sign-in');

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center relative overflow-hidden px-4">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 bg-gold rounded-full items-center justify-center mx-auto mb-4">
            <span className="text-obsidian font-black text-xl">D&S</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-gold-gradient uppercase">
            DELECTABLE & SVELT
          </h1>
          <p className="text-ivory/40 text-xs tracking-[0.3em] uppercase mt-1">The Zero-Gravity Atelier</p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
            {['sign-in', 'sign-up'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  mode === m ? 'bg-gold text-obsidian' : 'text-ivory/50 hover:text-ivory'
                }`}
              >
                {m === 'sign-in' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
        </div>

        {/* Clerk Component */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            {mode === 'sign-in' ? (
              <SignIn
                routing="hash"
                afterSignInUrl="/"
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl',
                    headerTitle: 'text-ivory',
                    headerSubtitle: 'text-ivory/40',
                    socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-ivory hover:bg-white/10',
                    dividerLine: 'bg-white/10',
                    dividerText: 'text-ivory/30',
                    formFieldLabel: 'text-ivory/60',
                    formFieldInput: 'bg-white/5 border border-white/10 text-ivory focus:border-gold rounded-lg',
                    formButtonPrimary: 'bg-gold text-obsidian hover:bg-yellow-400 font-bold rounded-full',
                    footerActionLink: 'text-gold hover:text-yellow-300',
                    identityPreviewText: 'text-ivory',
                    identityPreviewEditButton: 'text-gold',
                  }
                }}
              />
            ) : (
              <SignUp
                routing="hash"
                afterSignUpUrl="/"
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl',
                    headerTitle: 'text-ivory',
                    headerSubtitle: 'text-ivory/40',
                    socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-ivory hover:bg-white/10',
                    dividerLine: 'bg-white/10',
                    dividerText: 'text-ivory/30',
                    formFieldLabel: 'text-ivory/60',
                    formFieldInput: 'bg-white/5 border border-white/10 text-ivory focus:border-gold rounded-lg',
                    formButtonPrimary: 'bg-gold text-obsidian hover:bg-yellow-400 font-bold rounded-full',
                    footerActionLink: 'text-gold hover:text-yellow-300',
                  }
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;
