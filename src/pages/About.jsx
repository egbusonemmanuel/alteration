import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12 px-4"
    >
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-lavender-gradient mb-3">About Us</h1>
        <p className="text-ivory/50 text-sm uppercase tracking-widest">The Delectable & Svelt Story</p>
      </div>

      <div className="glass-card p-8 md:p-12 space-y-10">
        <div>
          <p className="text-ivory/80 text-lg leading-relaxed">
            Delectable & Svelt Designs was born from a singular belief — that <span className="text-lavender font-bold">modesty is the highest form of elegance</span>. Every stitch, every silhouette, every fabric is chosen with intention. We don't just make clothes; we craft identity.
          </p>
        </div>

        <div className="border-t border-white/10 pt-10">
          <h2 className="text-xl font-black uppercase tracking-widest text-lavender mb-4">Our Mission</h2>
          <p className="text-ivory/70 text-sm leading-relaxed">
            To empower every woman to feel beautifully seen — in a design that celebrates grace, sophistication, and God-given identity. Whether you are ordering a bespoke piece from our Gallery or having a cherished garment completely transformed through our Virtual Closet service, we pour our craftsmanship into every single order.
          </p>
        </div>

        <div className="border-t border-white/10 pt-10">
          <h2 className="text-xl font-black uppercase tracking-widest text-lavender mb-4">The Atelier</h2>
          <p className="text-ivory/70 text-sm leading-relaxed">
            Managed by the talented hands of Awolaja Ruth, Delectable & Svelt Designs operates as a bespoke atelier offering world-class tailoring, alteration, and couture experiences — crafted for every woman who believes she deserves the finest.
          </p>
        </div>

        <div className="border-t border-white/10 pt-10">
          <h2 className="text-xl font-black uppercase tracking-widest text-lavender mb-6">Get In Touch</h2>
          <div className="flex flex-col gap-4 text-sm">
            <a href="mailto:delectablesvelt@gmail.com" className="flex items-center gap-3 text-ivory/70 hover:text-neon_cyan transition-colors">
              <span className="text-neon_cyan text-lg">✉</span> delectablesvelt@gmail.com
            </a>
            <a href="tel:+2348020547860" className="flex items-center gap-3 text-ivory/70 hover:text-neon_cyan transition-colors">
              <span className="text-neon_cyan text-lg">✆</span> 0802 054 7860
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col sm:flex-row gap-4">
          <Link to="/shop" className="btn-primary text-center text-xs tracking-widest">Explore The Gallery</Link>
          <Link to="/alterations" className="btn-outline text-center text-xs tracking-widest">Book an Alteration</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
