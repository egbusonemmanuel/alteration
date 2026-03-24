import React from 'react';
import { motion } from 'framer-motion';
import { ArrowForwardOutlined as ArrowRight, AutoAwesomeOutlined as Sparkles } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ZenityCloth from '../components/ZenityCloth';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 overflow-hidden relative">
      <ZenityCloth />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-4xl relative z-10 select-none mt-20"
      >

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 text-gold-gradient leading-none">
          DELECTABLE <br /> & SVELT
        </h1>

        <p className="text-xl md:text-2xl text-ivory/60 mb-12 font-light tracking-wide max-w-2xl mx-auto leading-relaxed pointer-events-none uppercase">
          Where Modesty Shapes <br />
          Every Design.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/shop" className="btn-primary flex items-center gap-3">
            EXPLORE DESIGNS
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/alterations" className="btn-outline flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-gold" />
            VIRTUAL CLOSET
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
