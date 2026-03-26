import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, currency, setCurrency }) => {
  return (
    <div className="min-h-screen bg-obsidian text-ivory relative overflow-hidden">
      {/* Zero-Gravity Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-lavender/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-20 right-[15%] w-96 h-96 bg-lavender/10 rounded-full blur-[120px] animate-pulse-slow delayed-animation" />
        
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

      <footer className="bg-obsidian/50 border-t border-white/10 pt-16 pb-8 px-8 sm:px-12 relative z-10 mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <span className="text-xl font-black tracking-tighter text-ivory leading-none">DSD</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-lavender uppercase">DELECTABLE & SVELT DESIGNS</span>
            <p className="text-ivory/60 text-sm leading-relaxed mt-2 max-w-sm">
              The Avant-Garde Atelier. Where Modesty Shapes Every Design.
            </p>
          </div>

          {/* Links Col */}
          <div className="flex flex-col gap-4">
            <h4 className="text-ivory font-bold tracking-widest text-sm uppercase mb-2">The Brand</h4>
            <a href="#" className="text-ivory/60 hover:text-lavender text-sm transition-colors w-fit">About Us</a>
            <a href="#" className="text-ivory/60 hover:text-lavender text-sm transition-colors w-fit">Privacy Policy</a>
            <a href="#" className="text-ivory/60 hover:text-lavender text-sm transition-colors w-fit">Refund Policy</a>
            <a href="#" className="text-ivory/60 hover:text-lavender text-sm transition-colors w-fit">Terms of Service</a>
          </div>

          {/* Contact Col */}
          <div className="flex flex-col gap-4">
            <h4 className="text-ivory font-bold tracking-widest text-sm uppercase mb-2">Contact The Atelier</h4>
            <a href="mailto:delectablesvelt@gmail.com" className="text-ivory/60 hover:text-lavender text-sm transition-colors w-fit flex items-center gap-2">
              <span className="text-neon_cyan">✉</span> delectablesvelt@gmail.com
            </a>
            <a href="tel:+2348000000000" className="text-ivory/60 hover:text-lavender text-sm transition-colors w-fit flex items-center gap-2">
              <span className="text-neon_cyan">✆</span> +234 800 000 0000
            </a>
            <p className="text-ivory/40 text-xs italic mt-4">
              Visits by appointment only.
            </p>
          </div>
        </div>

        <div className="text-center text-ivory/30 text-xs border-t border-white/5 pt-8 max-w-6xl mx-auto">
          <p>© {new Date().getFullYear()} DELECTABLE & SVELT DESIGNS. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
