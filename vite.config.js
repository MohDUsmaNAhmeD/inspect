import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure base path is set for Vercel
  build: {
    rollupOptions: {
      input: '/src/main.jsx', // Set entry point explicitly if Vercel has trouble resolving it
    },
  },
})
