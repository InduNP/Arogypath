import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ===================================================
  // ====== ADD THIS 'server' SECTION BELOW ======
  // ===================================================
  server: {
    proxy: {
      // string shorthand: '/foo' -> 'http://localhost:4567/foo'
      '/api': {
        target: 'https://arogypath-production.up.railway.app', // Your backend server address
        changeOrigin: true,
        // secure: false, // uncomment if you have issues with https
      },
    },
  },
})