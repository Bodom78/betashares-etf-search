/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [
    ...(mode !== 'test' ? [TanStackRouterVite({ target: 'react' })] : []),
    react(),
    tailwindcss(),
  ],
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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    coverage: { provider: 'v8', reporter: ['text', 'html'] },
  },
}))
