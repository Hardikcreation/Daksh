import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate common dependencies into their own chunks
          react: ['react', 'react-dom'],
          vendor: ['axios', 'lodash'] // add any other large libs you're using
        }
      }
    },
    chunkSizeWarningLimit: 1000  // Optional: increase limit to suppress warning
  }
})
