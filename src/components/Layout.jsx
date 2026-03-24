import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, currency, setCurrency }) => {
  return (
    <div className="min-h-screen bg-obsidian text-ivory relative overflow-hidden">
      {/* Zero-Gravity Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-gold/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-20 right-[15%] w-96 h-96 bg-gold/10 rounded-full blur-[120px] animate-pulse-slow delayed-animation" />
        
        {/* Floating dust/particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/20 rounded-full"
            style={{
              width: Math.random() * 4 + 'px',
              height: Math.random() * 4 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            }}
          />
        ))}
      </div>

      <Navbar currency={currency} setCurrency={setCurrency} />
      
      <main className="pt-24 pb-12 px-8 relative z-10">
        {children}
      </main>

      <footer className="py-8 px-8 border-t border-white/5 text-center text-ivory/40 text-sm">
        <p>© 2026 DELECTABLE & SVELT DESIGNS. THE AVANT-GARDE ATELIER.</p>
      </footer>
    </div>
  );
};

export default Layout;
