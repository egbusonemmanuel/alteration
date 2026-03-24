import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isPlaceholder = !PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'pk_test_REPLACE_ME';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isPlaceholder ? (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-black tracking-tighter text-gold-gradient uppercase mb-4">API KEYS REQUIRED</h1>
        <p className="text-ivory/60 max-w-md">
          The Delectable & Svelt backend is fully wired up! Please add your <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> to the <code>.env</code> file to enable the Zero-Gravity Atelier.
        </p>
      </div>
    ) : (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    )}
  </React.StrictMode>,
)
