import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    proxy: {
      '/auth': 'http://localhost:5000',
      '/story': 'http://localhost:5000',
      '/facebook': 'http://localhost:5000',
    }
  }
})
