import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Alterations from './pages/Alterations';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import About from './pages/About';
import Terms from './pages/Terms';

function App() {
  const [currency, setCurrency] = useState('NGN');

  return (
    <Router>
      <Routes>
        {/* Auth routes — no Layout wrapper */}
        <Route path="/sign-in" element={<Auth />} />
        <Route path="/sign-up" element={<Auth />} />

        {/* Main app routes */}
        <Route path="/*" element={
          <Layout currency={currency} setCurrency={setCurrency}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop currency={currency} />} />
              <Route path="/alterations" element={
                <ProtectedRoute>
                  <Alterations />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
