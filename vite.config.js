import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'tslib',
      '@supabase/supabase-js',
      '@supabase/realtime-js',
      '@supabase/functions-js',
      '@supabase/storage-js',
      '@supabase/postgrest-js',
    ],
  },
  resolve: {
    alias: {
      tslib: 'tslib/tslib.es6.js',
    }
  }
})
