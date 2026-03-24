import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import {
  FileUploadOutlined as Upload,
  CloseOutlined as X,
  CheckCircleOutlined as CheckCircle,
  ContentCutOutlined as Scissors,
  StraightenOutlined as Ruler,
  ChevronRightOutlined as ChevronRight,
  AutoAwesomeOutlined as Sparkles,
} from '@mui/icons-material';
import MeasurementSilhouette from '../components/MeasurementSilhouette';
import { supabase } from '../lib/supabase';
import { analyzeGarment } from '../lib/gemini';

const Alterations = () => {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [step, setStep] = useState('upload');
  const [isDragActive, setIsDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activePoint, setActivePoint] = useState(null);
  const [measurements, setMeasurements] = useState({ Shoulders: '', Chest: '', Waist: '', Hips: '', Inseam: '' });
  const [service, setService] = useState('Custom Resizing');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setIsAnalyzing(true);
    setStep('svelt-fit');

    try {
      const estimatedMeasurements = await analyzeGarment(f);
      // Map AI output to state, keeping existing values if Gemini returned null
      setMeasurements(prev => ({
        Shoulders: estimatedMeasurements.Shoulders ?? prev.Shoulders,
        Chest: estimatedMeasurements.Chest ?? prev.Chest,
        Waist: estimatedMeasurements.Waist ?? prev.Waist,
        Hips: estimatedMeasurements.Hips ?? prev.Hips,
        Inseam: estimatedMeasurements.Inseam ?? prev.Inseam,
      }));
    } catch (err) {
      console.error("Gemini failed to analyze garment:", err);
      // Fail silently and let them fill it out manually
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragActive(true); };
  const onDragLeave = () => setIsDragActive(false);
  const onDrop = (e) => { e.preventDefault(); setIsDragActive(false); handleFile(e.dataTransfer.files[0]); };

  const removeFile = () => { setFile(null); setPreview(null); setStep('upload'); setMeasurements({ Shoulders: '', Chest: '', Waist: '', Hips: '', Inseam: '' }); };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setError(null);
    try {
      let garment_url = null;

      // 1. Upload image to Supabase Storage
      if (file) {
        const ext = file.name.split('.').pop();
        const filePath = `garments/${user?.id ?? 'guest'}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('garments')
          .upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('garments').getPublicUrl(filePath);
        garment_url = urlData?.publicUrl;
      }

      // 2. Save booking to DB
      const { error: dbError } = await supabase.from('bookings').insert({
        user_id: user?.id ?? null,
        service,
        notes,
        measurements,
        garment_url,
        status: 'pending',
        currency: 'NGN',
      });
      if (dbError) throw dbError;

      setStep('success');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black tracking-tighter text-gold-gradient uppercase mb-4 leading-none">ALTERATION PORTAL</h2>
        <p className="text-ivory/60 tracking-widest text-sm uppercase">Where your wardrobe meets the zero-gravity void.</p>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: UPLOAD */}
        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="max-w-2xl mx-auto">
            <div
              onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`glass-card p-12 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 min-h-[400px]
                ${isDragActive ? 'border-gold bg-gold/5 scale-[1.02]' : 'border-white/10 hover:border-gold/50'}`}
            >
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
              <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-6 animate-float">
                <Upload style={{ fontSize: 48 }} className="text-gold" />
              </div>
              <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">DROPCAP THE DRIP</h3>
              <p className="text-ivory/40 text-xs mb-8 tracking-[0.2em] uppercase">Drag & Drop Your Garment</p>
              <button className="btn-outline px-12" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>SELECT FILE</button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: MEASUREMENTS */}
        {step === 'svelt-fit' && (
          <motion.div key="svelt-fit" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-obsidian font-bold text-sm">01</div>
                <h3 className="text-2xl font-black tracking-tighter uppercase text-gold-gradient">SVELT MEASUREMENTS</h3>
              </div>
              
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-2 border-gold rounded-full opacity-20 animate-ping" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="text-gold w-8 h-8 animate-pulse" />
                    </div>
                  </div>
                  <h4 className="text-lg font-black tracking-widest text-gold mb-2">SVELT AI SCANNING...</h4>
                  <p className="text-ivory/40 text-xs tracking-widest uppercase">Estimating Structural Dimensions</p>
                </div>
              ) : (
                <>
                  <p className="text-ivory/60 mb-8 text-sm leading-relaxed">Click a point on the silhouette, or let Svelt AI estimate your measurements.</p>
                  <div className="space-y-4">
                    {Object.keys(measurements).map((point) => (
                      <div key={point} onClick={() => setActivePoint(point)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${activePoint === point ? 'bg-gold/10 border-gold' : 'bg-white/5 border-white/5 hover:border-gold/30'}`}>
                        <span className="text-xs font-bold tracking-widest uppercase">{point}</span>
                        <input type="text" placeholder="in / cm" value={measurements[point]}
                          onFocus={() => setActivePoint(point)}
                          onChange={(e) => setMeasurements(prev => ({ ...prev, [point]: e.target.value }))}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-transparent text-right focus:outline-none text-gold font-bold w-24 placeholder-ivory/20"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              <button onClick={() => setStep('details')} className="w-full btn-primary mt-10 flex items-center justify-center gap-2">
                NEXT: DETAILS <ChevronRight />
              </button>
            </div>
            <div className="relative">
              <MeasurementSilhouette onPointClick={setActivePoint} activePoint={activePoint} />
            </div>
          </motion.div>
        )}

        {/* STEP 3: DETAILS */}
        {step === 'details' && (
          <motion.div key="details" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="glass-card p-6 flex flex-col gap-6">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10">
                {preview && (
                  <motion.img src={preview} alt="Garment Preview" className="w-full h-full object-cover"
                    animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <button onClick={removeFile} className="absolute top-4 right-4 p-2 bg-obsidian/80 rounded-full hover:bg-red-500 transition-colors"><X /></button>
              </div>
              <div className="text-center">
                <span className="text-[10px] bg-gold/10 text-gold px-3 py-1 rounded-full font-bold tracking-widest uppercase">READY FOR ALTERATION</span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="glass-card p-8">
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2"><Scissors className="text-gold" /> MODIFICATION DETAILS</h4>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold tracking-widest text-ivory/40 uppercase block mb-2">Service Type</label>
                    <select value={service} onChange={(e) => setService(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors text-ivory">
                      <option className="bg-obsidian" value="Custom Resizing">Custom Resizing</option>
                      <option className="bg-obsidian" value="Fabric Reconstruction">Fabric Reconstruction</option>
                      <option className="bg-obsidian" value="Avant-Garde Embellishment">Avant-Garde Embellishment</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-widest text-ivory/40 uppercase block mb-2">Notes to Master Tailor</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Taper the waist, add gold lining..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 h-32 focus:outline-none focus:border-gold transition-colors resize-none text-ivory placeholder-ivory/20"
                    />
                  </div>
                  {error && <p className="text-red-400 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
                  <button onClick={handleConfirmBooking} disabled={submitting} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? 'SUBMITTING...' : 'CONFIRM BOOKING'}
                  </button>
                </div>
              </div>
              <div className="glass-card p-5 flex items-center gap-4 bg-gold/5 border border-gold/20">
                <Ruler className="text-gold" />
                <div>
                  <p className="text-sm font-bold">SVELT FIT ENGAGED</p>
                  <p className="text-xs text-ivory/60">Your measurements will be applied.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-16 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle style={{ fontSize: 52 }} className="text-green-500" />
            </div>
            <h3 className="text-4xl font-black mb-4">BOOKING RECEIVED</h3>
            <p className="text-ivory/60 mb-8 max-w-md mx-auto">Your garment has entered the Zenity Void. The Master Tailor will review your request shortly.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => { setFile(null); setPreview(null); setStep('upload'); setNotes(''); }} className="btn-outline">NEW UPLOAD</button>
              <button onClick={() => window.location.href = '/'} className="btn-primary">RETURN HOME</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Alterations;
