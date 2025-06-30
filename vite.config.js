import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5001, // this is Vite's dev server port (frontend)
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
