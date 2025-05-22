import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/funds': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/graph-data': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/market-event': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/market-events': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/health': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
