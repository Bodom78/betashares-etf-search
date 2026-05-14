import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss(), cssInjectedByJs()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
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
