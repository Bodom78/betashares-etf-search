import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'docs/dist',
    lib: {
      entry: 'src/web-component.ts',
      name: 'BetasharesEtfSearch',
      formats: ['iife'],
      fileName: () => 'etf-search.js',
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
})
