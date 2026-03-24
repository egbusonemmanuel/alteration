import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LocalMallOutlined as ShoppingBag } from '@mui/icons-material';
import { supabase } from '../lib/supabase';

const Shop = ({ currency }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) setProducts(data);
      } catch (_) {}
      finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  const formatPrice = (p) => currency === 'NGN'
    ? `₦${(p.price_ngn || 0).toLocaleString()}`
    : `$${(p.price_usd || 0).toLocaleString()}`;

  return (
    <div className="max-w-7xl mx-auto py-12">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-gold-gradient uppercase">THE GALLERY</h2>
          <p className="text-ivory/50 tracking-widest text-xs mt-2 uppercase">WHERE MODESTY SHAPES EVERY DESIGN</p>
        </div>
        <span className="text-3xl font-bold text-white/20">
          {loading ? '...' : `01 — ${String(products.length).padStart(2, '0')}`}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <ShoppingBag className="text-gold/20 w-16 h-16 mb-6" />
          <h3 className="text-2xl font-black tracking-widest text-ivory/60 uppercase mb-4">THE GALLERY IS EMPTY</h3>
          <p className="text-ivory/40 max-w-md text-sm">The Master Tailor has not released any new designs into the void. Check back soon for the next collection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <motion.div
                whileHover={{ y: -20, rotateX: 8, rotateY: 5, scale: 1.02 }}
                className="glass-card p-6 h-[400px] flex flex-col justify-between relative overflow-hidden"
              >
                <div className="relative flex-grow flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  ) : (
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                      className="w-40 h-56 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-gold/20 font-black text-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500"
                    >
                      {product.image_label || '✦'}
                    </motion.div>
                  )}
                  <div className="absolute top-0 right-0">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-gold/60 border border-gold/40 px-2 py-1 rounded-full bg-gold/5">
                      {product.tag}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] text-gold font-bold tracking-[0.3em] uppercase mb-1">{product.category}</p>
                  <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">{product.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xl font-black text-ivory">{formatPrice(product)}</p>
                    <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-obsidian transition-all border border-white/10">
                      <ShoppingBag fontSize="small" />
                    </button>
                  </div>
                </div>
              </motion.div>

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
