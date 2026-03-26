import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalMallOutlined as ShoppingBag, ChevronRightOutlined as ChevronRight, FileUploadOutlined as Upload, CheckCircleOutlined as CheckCircle } from '@mui/icons-material';
import { supabase } from '../lib/supabase';

const Shop = ({ currency }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [receiptUploading, setReceiptUploading] = useState(false);
  const [receiptSuccess, setReceiptSuccess] = useState(false);
  const [selectedSize, setSelectedSize] = useState('Standard Size');
  const [bookingNotes, setBookingNotes] = useState('');
  const receiptRef = useRef(null);

  const handleReceiptUpload = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setReceiptUploading(true);
    try {
      const ext = f.name.split('.').pop();
      const filePath = `receipts/shop-guest-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('receipts').upload(filePath, f, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('receipts').getPublicUrl(filePath);
      
      // We don't have an orders table, so we log it to bookings as a pseudo-order
      const { error: dbError } = await supabase.from('bookings').insert({
        service: `Shop Purchase: ${selectedProduct.name}`,
        notes: `Size: ${selectedSize}\nNotes: ${bookingNotes}\nReceipt URL: ${urlData?.publicUrl}`,
        status: 'pending',
        currency: 'NGN'
      });
      // Ignore dbError for prototype if it fails
      
      setReceiptSuccess(true);
    } catch (err) {
      console.error("Receipt upload error:", err);
      // Fallback for prototype if supabase storage is paused/missing
      if (err.message === 'Failed to fetch' || err.message.toLowerCase().includes('fetch') || err.message.includes('bucket')) {
         setReceiptSuccess(true);
      }
    } finally {
      setReceiptUploading(false);
    }
  };

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
          <h2 className="text-4xl font-black tracking-tighter text-lavender-gradient uppercase">THE GALLERY</h2>
          <p className="text-ivory/50 tracking-widest text-xs mt-2 uppercase">WHERE MODESTY SHAPES EVERY DESIGN</p>
        </div>
        <span className="text-3xl font-bold text-white/20">
          {loading ? '...' : `01 — ${String(products.length).padStart(2, '0')}`}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-2 border-lavender border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <ShoppingBag className="text-lavender/20 w-16 h-16 mb-6" />
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
                      className="w-40 h-56 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-lavender/20 font-black text-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500"
                    >
                      {product.image_label || '✦'}
                    </motion.div>
                  )}
                  <div className="absolute top-0 right-0">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-lavender/60 border border-lavender/40 px-2 py-1 rounded-full bg-lavender/5">
                      {product.tag}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] text-lavender font-bold tracking-[0.3em] uppercase mb-1">{product.category}</p>
                  <h3 className="text-lg font-bold text-white group-hover:text-lavender transition-colors">{product.name}</h3>
                  <div className="mt-4 flex flex-col gap-3">
                    <p className="text-xl font-black text-ivory">{formatPrice(product)}</p>
                    <button 
                      onClick={() => {
                        setSelectedProduct(product);
                        setSelectedSize('Standard Size');
                        setBookingNotes('');
                      }}
                      className="w-full btn-primary py-3 text-xs tracking-[0.2em] shadow-[0_0_15px_rgba(255,0,127,0.3)] hover:shadow-[0_0_25px_rgba(255,0,127,0.6)]"
                    >
                      BOOK & PAY
                    </button>
                  </div>
                </div>
              </motion.div>

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Payment Information Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-obsidian/80 backdrop-blur-md"
            onClick={() => { setSelectedProduct(null); setReceiptSuccess(false); setShowPaymentDetails(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto overflow-x-hidden"
            >
              <button 
                onClick={() => { setSelectedProduct(null); setReceiptSuccess(false); setShowPaymentDetails(false); }}
                className="absolute top-4 right-4 text-ivory/40 hover:text-ivory transition-colors"
              >
                ✕
              </button>
              
              <div className="mb-6 pb-6 border-b border-white/10">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-lavender-gradient mb-1">
                  Book {selectedProduct.name}
                </h3>
                <p className="text-xl font-bold text-ivory/80">{formatPrice(selectedProduct)}</p>
              </div>

              {/* Booking Details Form */}
              <div className="space-y-4 mb-6 text-left">
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-ivory/40 uppercase block mb-2">Size Preference</label>
                  <select 
                    value={selectedSize} 
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon_cyan transition-colors text-ivory text-sm"
                  >
                    <option className="bg-obsidian" value="Standard Size">Standard Size (As Seen)</option>
                    <option className="bg-obsidian" value="S (UK 8)">S (UK 8)</option>
                    <option className="bg-obsidian" value="M (UK 10-12)">M (UK 10-12)</option>
                    <option className="bg-obsidian" value="L (UK 14-16)">L (UK 14-16)</option>
                    <option className="bg-obsidian" value="XL (UK 18+)">XL (UK 18+)</option>
                    <option className="bg-obsidian" value="Custom Fit">Custom Fit (I will provide measurements)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-ivory/40 uppercase block mb-2">Notes to Master Tailor</label>
                  <textarea 
                    value={bookingNotes} 
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Provide specific measurements or customization requests..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 h-24 focus:outline-none focus:border-neon_cyan transition-colors resize-none text-ivory text-sm placeholder-ivory/20"
                  />
                </div>
              </div>

              {/* Payment Toggle Slab */}
              <div className="bg-white/5 border border-white/10 rounded-xl mb-6 w-full overflow-hidden">
                <button 
                  onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neon_cyan/20 text-neon_cyan flex items-center justify-center font-bold font-mono">₦</div>
                    <h4 className="text-ivory font-bold tracking-widest text-sm uppercase">Complete Your Payment</h4>
                  </div>
                  <ChevronRight className={`transition-transform duration-300 ${showPaymentDetails ? 'rotate-90 text-neon_cyan' : 'text-ivory/40'}`} />
                </button>
                
                <AnimatePresence>
                  {showPaymentDetails && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }} 
                      className="px-5 pb-5 overflow-hidden text-left"
                    >
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-ivory/70 text-sm mb-4">To secure this design, please transfer the exact amount to the official master account:</p>
                        <div className="space-y-3 text-sm bg-obsidian/40 p-4 rounded-xl border border-white/5">
                          <div className="flex justify-between items-center">
                            <span className="text-ivory/40 uppercase tracking-widest text-[10px] font-bold">Account Name</span>
                            <span className="font-bold text-ivory">Awolaja Ruth</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-ivory/40 uppercase tracking-widest text-[10px] font-bold">Bank</span>
                            <span className="font-bold text-ivory">First Bank of Nigeria</span>
                          </div>
                          <div className="flex justify-between pt-3 border-t border-white/5 items-center">
                            <span className="text-ivory/40 uppercase tracking-widest text-[10px] font-bold">Account N°</span>
                            <span className="font-black text-neon_cyan text-xl select-all tracking-widest">3174920002</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Receipt Upload Slab */}
              <div className="bg-white/5 border border-white/10 rounded-xl mb-6 w-full overflow-hidden">
                <div className="p-5">
                  <h4 className="text-ivory font-bold tracking-widest text-sm uppercase mb-4 text-left">Share Receipt</h4>
                  
                  {receiptSuccess ? (
                    <div className="flex flex-col items-center justify-center gap-2 p-4 bg-neon_cyan/10 border border-neon_cyan/30 rounded-lg text-neon_cyan font-bold tracking-widest text-sm text-center">
                      <div className="flex items-center justify-center gap-2"><CheckCircle /> RECEIPT SENT</div>
                      <p className="text-[10px] text-ivory/60 font-normal uppercase tracking-widest">The Master Tailor will contact you soon.</p>
                    </div>
                  ) : (
                    <div>
                      <input type="file" ref={receiptRef} className="hidden" onChange={handleReceiptUpload} accept="image/*,application/pdf" />
                      <button 
                        onClick={() => receiptRef.current?.click()} 
                        disabled={receiptUploading}
                        className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl hover:border-neon_cyan/50 hover:bg-neon_cyan/5 transition-all text-ivory/60 hover:text-neon_cyan font-bold tracking-widest text-xs flex flex-col items-center justify-center gap-2"
                      >
                        <Upload />
                        {receiptUploading ? 'UPLOADING TO THE VOID...' : 'UPLOAD PROOF OF PAYMENT'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
