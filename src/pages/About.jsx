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
        <p className="text-ivory/50 text-sm uppercase tracking-widest">The Delectable &amp; Svelt Story</p>
      </div>

      <div className="glass-card p-8 md:p-12 space-y-10">

        {/* Vision Statement */}
        <div>
          <p className="text-ivory/80 text-lg leading-relaxed">
            Managed by the <span className="text-lavender font-bold">talented hands of Awolaja Ruth</span>, Delectable &amp; Svelt Designs is a vision, a style with purpose.
          </p>
        </div>

        {/* Scripture & Core Belief */}
        <div className="border-t border-white/10 pt-10">
          <blockquote className="border-l-4 border-lavender pl-6 italic text-ivory/70 text-base leading-relaxed mb-4">
            "Choosing outfits that honour God doesn't mean compromising beauty.
            Modest fashion + a gracious heart = timeless elegance."
          </blockquote>
          <p className="text-ivory/50 text-xs uppercase tracking-widest mt-3">— 1 Timothy 2:9–10</p>
        </div>

        {/* Our Philosophy */}
        <div className="border-t border-white/10 pt-10">
          <h2 className="text-xl font-black uppercase tracking-widest text-lavender mb-4">Our Philosophy</h2>
          <p className="text-ivory/70 text-sm leading-relaxed">
            At Delectable &amp; Svelt Designs, we believe fashion should celebrate every woman's unique shape and style. We carefully choose our styles and fabrics — our collection blends effortless elegance with everyday practicality. Pieces you can wear straight from the rack, or customize with our expert alterations for that perfect fit.
          </p>
        </div>

        {/* Ready-to-Wear */}
        <div className="border-t border-white/10 pt-10">
          <h2 className="text-xl font-black uppercase tracking-widest text-lavender mb-4">Ready to Wear</h2>
          <p className="text-ivory/70 text-sm leading-relaxed mb-4">
            Designed for women who embrace <span className="text-lavender font-semibold">confidence and individuality</span>, our ready-to-wear line spans all sizes — because every woman deserves to feel dressed with intention.
          </p>
          <p className="text-neon_cyan/80 text-sm font-semibold tracking-wide uppercase">
            Wear it · Love it · Fit it
          </p>
          <p className="text-ivory/50 text-xs mt-1">From everyday outfits to tailored perfection.</p>
        </div>

        {/* Our Mission */}
        <div className="border-t border-white/10 pt-10">
          <h2 className="text-xl font-black uppercase tracking-widest text-lavender mb-4">Our Mission</h2>
          <p className="text-ivory/70 text-sm leading-relaxed">
            To empower every woman to feel beautifully seen — in a design that celebrates grace, sophistication, and God-given identity. Whether you are ordering a bespoke piece from our Gallery or transforming a cherished garment through our expert alteration service, we pour our craftsmanship into every single order.
          </p>
        </div>

        {/* Get In Touch */}
        <div className="border-t border-white/10 pt-10">
          <h2 className="text-xl font-black uppercase tracking-widest text-lavender mb-6">Get In Touch</h2>
          <div className="flex flex-col gap-4 text-sm">
            <a href="mailto:delectablesvelt@gmail.com" className="flex items-center gap-3 text-ivory/70 hover:text-neon_cyan transition-colors">
              <span className="text-neon_cyan text-lg">✉</span> delectablesvelt@gmail.com
            </a>
            <a href="tel:+2348020547860" className="flex items-center gap-3 text-ivory/70 hover:text-neon_cyan transition-colors">
              <span className="text-neon_cyan text-lg">✆</span> 0802 054 7860
            </a>
            <a href="tel:+447949582399" className="flex items-center gap-3 text-ivory/70 hover:text-neon_cyan transition-colors">
              <span className="text-neon_cyan text-lg">✆</span> +44 (0) 7949 582 399
            </a>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="border-t border-white/10 pt-10 flex flex-col sm:flex-row gap-4">
          <Link to="/shop" className="btn-primary text-center text-xs tracking-widest">Explore The Gallery</Link>
          <Link to="/alterations" className="btn-outline text-center text-xs tracking-widest">Book an Alteration</Link>
        </div>

      </div>
    </motion.div>
  );
};

export default About;
