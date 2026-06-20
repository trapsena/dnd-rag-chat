import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'fantastic-kindness-production-e00e.up.railway.app'
    ]
  }
})
