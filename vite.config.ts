import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/contact': {
        target: 'http://127.0.0.1:5001',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    // Every browser this targets ships WebP, `:has()` and container queries
    // already; the default is more conservative and costs transpiled output.
    target: 'es2022',
    rollupOptions: {
      output: {
        /**
         * Split the two big vendor groups out of the app chunk. React and the
         * router change only on upgrade, so they stay cached across every
         * deploy of our own code; GSAP is the largest dependency and is used
         * by the homepage alone, so isolating it keeps a change to either one
         * from invalidating the other.
         *
         * Function form, not the object map: Vite 8 builds on Rolldown, which
         * only accepts a function here.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/]node_modules[\\/](gsap|@gsap)[\\/]/.test(id)) return 'gsap'
          if (
            /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(
              id,
            )
          ) {
            return 'react'
          }
        },
      },
    },
  },
})
