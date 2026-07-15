import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Build timestamp in Cairo time (UTC+2)
const buildDate = new Date();
const cairoOffset = 2 * 60; // UTC+2 in minutes
const cairoTime = new Date(buildDate.getTime() + cairoOffset * 60 * 1000);
const buildStamp = cairoTime.toISOString()
  .replace('T', ' @ ')
  .replace(/\.\d{3}Z$/, ' (Cairo)');

export default defineConfig(({ mode }) => {
  // Only load VITE_ prefixed vars — prevents leaking non-VITE_ secrets
  const env = loadEnv(mode, '.', 'VITE_');
  return {
    base: '/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'ATPLVector — Aviation Training Platform',
          short_name: 'ATPLVector',
          description: 'The Ultimate ATPL Theory Training Platform',
          theme_color: '#0f172a',
          background_color: '#020617',
          display: 'standalone',
          start_url: '/',
          orientation: 'any',
          categories: ['education', 'productivity'],
          icons: [
            {
              src: '/favicon.ico',
              sizes: '64x64 32x32 24x24 16x16',
              type: 'image/x-icon'
            },
            {
              src: '/icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          // Exclude large JSON from precaching — load on demand instead
          globIgnores: ['**/syllabus.json', '**/radio_nav_syllabus.json', '**/qb_metadata.json'],
          maximumFileSizeToCacheInBytes: 3000000, // 3MB — reasonable limit
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'firebase-firestore-cache',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ],
    define: {
      '__COMMIT_HASH__': JSON.stringify(buildStamp),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-animation': ['framer-motion'],
            'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
            'vendor-spline': ['@splinetool/react-spline', '@splinetool/runtime'],
            'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            'vendor-clerk': ['@clerk/clerk-react'],
            'vendor-ai': ['@google/genai'],
            'vendor-utils': ['lucide-react', '@hello-pangea/dnd', 'recharts']
          }
        }
      }
    }
  };
});
