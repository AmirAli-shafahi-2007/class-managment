import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'سیستم مدیریت آموزشی',
        short_name: 'آموزشی',
        description: 'پنل مدیریت آموزشی - مدیریت کلاس‌ها، قراردادها و امور مالی',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'icons/pwa-icon-256-1.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'icons/pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      // workbox: {
      //   globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      //   runtimeCaching: [
      //     {
      //       urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      //       handler: 'CacheFirst',
      //       options: {
      //         cacheName: 'google-fonts-cache',
      //         expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
      //       },
      //     },
      //     {
      //       urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      //       handler: 'CacheFirst',
      //       options: {
      //         cacheName: 'images-cache',
      //         expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
      //       },
      //     },
      //   ],
      // },
    }),
  ],
  server: {
    port: 5173,
  },
})