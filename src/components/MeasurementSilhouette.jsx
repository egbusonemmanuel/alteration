import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MeasurementSilhouette = ({ onPointClick, activePoint }) => {
  const points = [
    { id: 'Shoulders', x: 50, y: 15, label: 'Shoulders' },
    { id: 'Chest', x: 50, y: 25, label: 'Chest' },
    { id: 'Waist', x: 50, y: 38, label: 'Waist' },
    { id: 'Hips', x: 50, y: 48, label: 'Hips' },
    { id: 'Inseam', x: 45, y: 75, label: 'Inseam' },
  ];

  return (
    <div className="relative w-full max-w-[300px] aspect-[1/2] mx-auto glass-card p-4 flex items-center justify-center overflow-hidden">
      {/* Human Silhouette SVG */}
      <svg
        viewBox="0 0 100 200"
        className="w-full h-full opacity-20 filter drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]"
        fill="currentColor"
      >
        <path
          className="text-lavender"
          d="M50,10 C55,10 60,15 60,22 C60,25 58,28 55,30 C65,32 75,38 78,50 C80,60 78,80 75,100 C72,120 70,140 72,160 C73,170 75,185 70,190 C65,195 55,190 50,190 C45,190 35,195 30,190 C25,185 27,170 28,160 C30,140 28,120 25,100 C22,80 20,60 22,50 C25,38 35,32 45,30 C42,28 40,25 40,22 C40,15 45,10 50,10 Z"
        />
      </svg>

      {/* Interactive Points */}
      {points.map((point) => (
        <motion.button
          key={point.id}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPointClick(point.id)}
          className={`absolute w-4 h-4 rounded-full border-2 transition-all duration-300 z-20 ${
            activePoint === point.id
              ? 'bg-lavender border-white scale-125 shadow-[0_0_15px_rgba(212,175,55,0.8)]'
              : 'bg-white/10 border-lavender/40 hover:bg-lavender/40'
          }`}
          style={{ top: `${point.y}%`, left: `${point.x}%`, transform: 'translate(-50%, -50%)' }}
        >
          {activePoint === point.id && (
            <motion.div
              layoutId="active-ring"
              className="absolute -inset-2 border border-lavender rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
        </motion.button>
      ))}

      {/* Labels */}
      <div className="absolute top-4 left-4 text-[10px] font-bold tracking-[0.2em] text-lavender/60 uppercase">
        SELECT MEASUREMENT POINT
      </div>
      
      {activePoint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-0 w-full text-center"
        >
          <span className="text-xs font-black text-ivory tracking-[0.3em] uppercase bg-lavender/10 px-4 py-1 rounded-full border border-lavender/20">
            {activePoint} Activated
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default MeasurementSilhouette;
