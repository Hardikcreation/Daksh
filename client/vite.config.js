import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['axios', 'lodash'] // add other common libs here
        }
      }
    },
    chunkSizeWarningLimit: 1000 // optional: suppress large chunk warning
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080', // or whatever your backend port is
    },
  },
})
