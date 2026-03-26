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
  const [newProduct, setNewProduct] = useState({ name: '', price_ngn: '', price_usd: '', category: 'Bespoke', tag: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setBookings(data);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const addProduct = async () => {
    setSaving(true);
    setSaveMsg('');
    const { error } = await supabase.from('products').insert({
      name: newProduct.name,
      price_ngn: parseInt(newProduct.price_ngn) || 0,
      price_usd: parseInt(newProduct.price_usd) || 0,
      category: newProduct.category,
      tag: newProduct.tag.toUpperCase(),
    });
    setSaving(false);
    if (error) { setSaveMsg('Error: ' + error.message); }
    else { setSaveMsg('Product added!'); setNewProduct({ name: '', price_ngn: '', price_usd: '', category: 'Bespoke', tag: '' }); setShowAddProduct(false); }
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
