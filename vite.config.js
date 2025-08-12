import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Visionneuse/',  // base pour GitHub Pages sous un sous-dossier
  plugins: [react()],
})
