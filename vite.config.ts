import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

import {
  fileURLToPath,
  URL,
} from 'node:url';

export default defineConfig({
  plugins: [
    react(),

    tailwindcss(),

    VitePWA({
      registerType: 'prompt',

      includeAssets: [
        'favicon.ico',
        'pwa-icon.svg',
        'apple-touch-icon-180x180.png',
      ],

      manifest: {
        id: '/',

        name: '4-МД-16 Расписание',

        short_name: 'Пара',

        description:
          'Расписание занятий учебной группы 4-МД-16',

        lang: 'ru',

        start_url: '/',

        scope: '/',

        display: 'standalone',

        background_color: '#f7f8fc',

        theme_color: '#4f46e5',

        categories: [
          'education',
          'utilities',
        ],

        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },

          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },

          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,

        navigateFallback: '/index.html',

        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff,woff2}',
        ],
      },

      devOptions: {
        enabled: true,
      },
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(
        new URL('./src', import.meta.url),
      ),
    },
  },
});