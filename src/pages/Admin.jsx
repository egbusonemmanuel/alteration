import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DashboardOutlined as LayoutDashboard,
  Inventory2Outlined as Package,
  CalendarTodayOutlined as Calendar,
  SettingsOutlined as Settings,
  TrendingUpOutlined as TrendingUp,
  AddOutlined as Add,
  RefreshOutlined as Refresh,
  DeleteOutlineOutlined as DeleteIcon,
} from '@mui/icons-material';
import { supabase } from '../lib/supabase';

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  in_analysis: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  stitching: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  complete: 'text-green-400 bg-green-500/10 border-green-500/30',
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price_ngn: '', price_usd: '', category: 'Bespoke', tag: '', image_url: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    const adminPass = sessionStorage.getItem('admin_token') || 'svelt2026';
    const { data, error } = await supabase
      .rpc('secure_fetch_bookings', { pass: adminPass });
    if (!error && data) setBookings(data);
    else if (error) console.error('[Admin] Error fetching bookings:', error);
    setLoading(false);
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setProductsLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);
  useEffect(() => { if (activeTab === 'products') fetchProducts(); }, [activeTab]);

  const updateStatus = async (id, status) => {
    const adminPass = sessionStorage.getItem('admin_token') || 'svelt2026';
    const { error } = await supabase.rpc('secure_update_booking_status', { pass: adminPass, b_id: id, b_status: status });
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } else {
      console.error('[Admin] Error updating status:', error);
    }
  };

  const addProduct = async () => {
    setSaving(true);
    setSaveMsg('');
    let imageUrl = newProduct.image_url || null;

    console.log('[Admin] Starting addProduct...');
    console.log('[Admin] Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

    // Upload image if one was selected
    if (imageFile) {
      try {
        console.log('[Admin] Uploading image:', imageFile.name, imageFile.size, 'bytes');
        const ext = imageFile.name.split('.').pop();
        const filePath = `design-${Date.now()}.${ext}`;

        const uploadPromise = supabase.storage.from('products').upload(filePath, imageFile, { upsert: true });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Upload timed out after 15 seconds. Check your Supabase URL and network.')), 15000)
        );

        const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('products').getPublicUrl(filePath);
        imageUrl = urlData?.publicUrl || imageUrl;
        console.log('[Admin] Image uploaded successfully:', imageUrl);
      } catch (err) {
        console.error('[Admin] Image upload error:', err);
        setSaveMsg('Image upload error: ' + (err.message || JSON.stringify(err)));
        setSaving(false);
        return;
      }
    }

    // Insert product into DB
    try {
      console.log('[Admin] Inserting product into DB...');
      const adminPass = sessionStorage.getItem('admin_token') || 'svelt2026';
      const insertPromise = supabase.rpc('secure_add_product', {
        pass: adminPass,
        p_name: newProduct.name,
        p_price_ngn: parseInt(newProduct.price_ngn) || 0,
        p_price_usd: parseInt(newProduct.price_usd) || 0,
        p_category: newProduct.category,
        p_tag: newProduct.tag.toUpperCase(),
        p_image_url: imageUrl,
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB insert timed out after 15 seconds. Check your Supabase URL and network.')), 15000)
      );

      const { error } = await Promise.race([insertPromise, timeoutPromise]);
      if (error) throw error;

      console.log('[Admin] Product saved successfully!');
      setSaveMsg('Product added!');
      setNewProduct({ name: '', price_ngn: '', price_usd: '', category: 'Bespoke', tag: '', image_url: '' });
      setImageFile(null);
      setShowAddProduct(false);
      fetchProducts();
    } catch (err) {
      console.error('[Admin] DB insert error:', err);
      setSaveMsg('Error: ' + (err.message || JSON.stringify(err)));
    } finally {
      setSaving(false);
    }
  };


  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this design? This cannot be undone.')) return;
    setDeletingId(id);
    const adminPass = sessionStorage.getItem('admin_token') || 'svelt2026';
    const { error } = await supabase.rpc('secure_delete_product', { pass: adminPass, p_id: id });
    if (!error) setProducts(prev => prev.filter(p => p.id !== id));
    else console.error('[Admin] Error deleting product:', error);
    setDeletingId(null);
  };

  const totalRevenue = bookings.length
    ? bookings.reduce((acc, _) => acc, 0)
    : 0;

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: <Calendar fontSize="small" /> },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: <TrendingUp fontSize="small" /> },
    { label: 'In Progress', value: bookings.filter(b => ['in_analysis', 'stitching'].includes(b.status)).length, icon: <Package fontSize="small" /> },
  ];

  const sidebarItems = [
    { id: 'bookings', label: 'Sewing Bookings', icon: <Calendar fontSize="small" /> },
    { id: 'products', label: 'Post Designs', icon: <Package fontSize="small" /> },
    { id: 'settings', label: 'Settings', icon: <Settings fontSize="small" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-60 flex flex-col gap-2">
          <div className="glass-card p-4 mb-4 text-center">
            <div className="w-14 h-14 bg-lavender/20 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-lavender font-black text-sm">MT</span>
            </div>
            <h3 className="font-bold text-sm tracking-widest">MASTER TAILOR</h3>
            <p className="text-[10px] text-ivory/40 uppercase">Atelier Lead</p>
          </div>
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                activeTab === item.id ? 'bg-lavender text-obsidian font-bold' : 'text-ivory/60 hover:bg-white/5'
              }`}>
              {item.icon}
              <span className="text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map(s => (
              <div key={s.label} className="glass-card p-5">
                <div className="flex items-center gap-2 text-lavender mb-1">
                  {s.icon}
                  <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
                </div>
                <p className="text-3xl font-black">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="glass-card overflow-hidden">
              <div className="p-5 border-b border-white/5 flex justify-between items-center">
                <h4 className="font-black tracking-widest uppercase text-sm">SEWING BOOKINGS</h4>
                <button onClick={fetchBookings} className="text-ivory/40 hover:text-lavender transition-colors">
                  <Refresh fontSize="small" />
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="w-8 h-8 border-2 border-lavender border-t-transparent rounded-full animate-spin" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16 text-ivory/40">
                  <p className="text-sm">No bookings yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-[10px] font-bold tracking-[0.2em] text-ivory/40 uppercase">
                        <th className="px-5 py-4">User</th>
                        <th className="px-5 py-4">Service</th>
                        <th className="px-5 py-4">Measurements</th>
                        <th className="px-5 py-4">Garment</th>
                        <th className="px-5 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-4 text-xs font-bold text-ivory/60 max-w-[120px] truncate">{b.user_id?.slice(0, 12) || 'Guest'}...</td>
                          <td className="px-5 py-4 text-sm">{b.service}</td>
                          <td className="px-5 py-4 text-[10px] text-ivory/50">
                            {b.measurements ? Object.entries(b.measurements).filter(([,v]) => v).map(([k,v]) => `${k[0]}:${v}`).join(' ') : '—'}
                          </td>
                          <td className="px-5 py-4">
                            {b.garment_url
                              ? <a href={b.garment_url} target="_blank" rel="noopener noreferrer" className="text-lavender text-xs hover:underline">View ↗</a>
                              : <span className="text-ivory/30 text-xs">—</span>
                            }
                          </td>
                          <td className="px-5 py-4">
                            <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)}
                              className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border bg-transparent cursor-pointer ${STATUS_COLORS[b.status] || 'text-ivory/60 border-white/10'}`}>
                              {['pending','in_analysis','stitching','complete'].map(s => (
                                <option key={s} value={s} className="bg-obsidian text-ivory capitalize">{s.replace('_', ' ')}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="glass-card p-8">
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-black tracking-widest uppercase text-sm">POST NEW DESIGN</h4>
                <button onClick={() => setShowAddProduct(v => !v)} className="btn-outline py-2 px-4 text-xs flex items-center gap-2">
                  <Add fontSize="small" /> ADD DESIGN
                </button>
              </div>
              {showAddProduct && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                  {[
                    { key: 'name', label: 'Design Name', placeholder: 'e.g. Obsidian Void Suit' },
                    { key: 'price_ngn', label: 'Price (₦ NGN)', placeholder: '450000' },
                    { key: 'price_usd', label: 'Price ($ USD)', placeholder: '550' },
                    { key: 'tag', label: 'Tag', placeholder: 'WEIGHTLESS' },
                    { key: 'image_url', label: 'Image URL (Optional)', placeholder: 'https://example.com/image.jpg' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-[10px] font-bold tracking-widest text-ivory/40 uppercase block mb-1">{field.label}</label>
                      <input type="text" value={newProduct[field.key]} placeholder={field.placeholder}
                        onChange={(e) => setNewProduct(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-lavender transition-colors text-ivory placeholder-ivory/20"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-ivory/40 uppercase block mb-1">Upload Image File (Overrides URL)</label>
                    <input type="file" accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-lavender text-ivory file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-lavender/20 file:text-lavender hover:file:bg-lavender/30 transition-all cursor-pointer mb-5"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-ivory/40 uppercase block mb-1">Category</label>
                    <select value={newProduct.category} onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-lavender text-ivory">
                      {['Bespoke', 'Ready-to-Wear', 'Masterpiece'].map(c => <option key={c} className="bg-obsidian">{c}</option>)}
                    </select>
                  </div>
                  {saveMsg && <p className={`text-xs ${saveMsg.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{saveMsg}</p>}
                  <button onClick={addProduct} disabled={saving || !newProduct.name} className="w-full btn-primary disabled:opacity-50">
                    {saving ? 'SAVING...' : 'PUBLISH DESIGN'}
                  </button>
                </motion.div>
              )}

              {/* Posted Designs List */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-[10px] font-bold tracking-widest text-ivory/40 uppercase">Your Posted Designs</h5>
                  <button onClick={fetchProducts} className="text-ivory/40 hover:text-lavender transition-colors">
                    <Refresh fontSize="small" />
                  </button>
                </div>
                {productsLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-7 h-7 border-2 border-lavender border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-10 text-ivory/30 text-xs tracking-widest uppercase">No designs posted yet.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(product => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group relative"
                      >
                        {/* Image */}
                        <div className="w-full h-40 bg-white/5 flex items-center justify-center overflow-hidden">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-4xl text-lavender/20 font-black">✦</span>
                          )}
                        </div>
                        {/* Info */}
                        <div className="p-4">
                          <p className="text-[10px] text-lavender font-bold tracking-widest uppercase mb-1">{product.category} · {product.tag}</p>
                          <h6 className="font-bold text-ivory text-sm truncate">{product.name}</h6>
                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <p className="text-xs text-ivory/60">₦{(product.price_ngn || 0).toLocaleString()}</p>
                              <p className="text-[10px] text-ivory/30">${(product.price_usd || 0).toLocaleString()}</p>
                            </div>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              disabled={deletingId === product.id}
                              className="flex items-center gap-1 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all text-[10px] font-bold tracking-widest uppercase disabled:opacity-40"
                            >
                              <DeleteIcon fontSize="small" />
                              {deletingId === product.id ? 'DELETING...' : 'DELETE'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass-card p-8 text-ivory/40 text-center">
              <p className="text-sm">Atelier settings coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
