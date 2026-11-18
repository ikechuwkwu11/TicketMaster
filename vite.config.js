import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Relative base works on GitHub Pages, jsDelivr CDN mirrors, and Netlify.
  base: process.env.VITE_BASE || './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'prompt',
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'pwa-maskable-512x512.png',
        'offline.html',
      ],
      manifest: {
        name: 'TicketMaster',
        short_name: 'TicketMaster',
        description:
          'Discover events, manage tickets, and book shows with TicketMaster.',
        theme_color: '#026CDF',
        background_color: '#026CDF',
        display: 'standalone',
        display_override: ['standalone', 'fullscreen'],
        orientation: 'portrait-primary',
        // Hash routes keep navigation inside the installed iOS web app shell
        start_url: './',
        scope: './',
        lang: 'en',
        categories: ['entertainment', 'lifestyle', 'shopping'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      injectManifest: {
        // Precache app shell + event images so installed Safari/PWA works offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
      devOptions: {
        // Keep disabled during HMR; use `npm run preview:pwa` for offline tests
        enabled: false,
        type: 'module',
      },
    }),
  ],
  server: {
    // Listen on all interfaces so phones on the same network can connect
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/media': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})

