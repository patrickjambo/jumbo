import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'fonts/**/*', 'puzzles/**/*.svg'],
      manifest: {
        name: 'Jumbo App',
        short_name: 'Jumbo',
        description: 'Video meetings + live quiz games',
        theme_color: '#0d0d1a',
        background_color: '#0d0d1a',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/flagcdn\.com\//,
            handler: 'CacheFirst',
            options: { cacheName: 'flags-cache', expiration: { maxEntries: 300, maxAgeSeconds: 86400 } },
          },
          {
            // Cache local SVG puzzle illustrations
            urlPattern: /\/puzzles\/.*\.svg$/,
            handler: 'CacheFirst',
            options: { cacheName: 'puzzles-cache', expiration: { maxEntries: 100, maxAgeSeconds: 604800 } },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@jumbo/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@jumbo/questions': path.resolve(__dirname, '../../packages/questions/src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-livekit': ['livekit-client', '@livekit/components-react'],
          'vendor-socket': ['socket.io-client'],
        },
      },
    },
    // Inject <link rel="modulepreload"> for all entry-point dependencies
    modulePreload: { polyfill: true },
    // Warn if first-load JS exceeds 200KB gzipped target
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/socket.io': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
