import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Alterations from './pages/Alterations';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';

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
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
