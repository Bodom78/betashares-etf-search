import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [TanStackRouterVite({ target: 'react' }), react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  base: process.env.VITE_BASE ?? '/',
  server: {
    proxy: {
      '/api/search': {
        target: 'https://search.betashares.services',
        changeOrigin: true,
        rewrite: () => '/search',
      },
    },
  },
})
