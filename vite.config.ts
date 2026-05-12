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
  const env = loadEnv(mode, '.', '');
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
          name: 'ATPLVector',
          short_name: 'ATPLVector',
          description: 'The Ultimate ATPL Theory Training Platform',
          theme_color: '#0f172a',
          background_color: '#020617',
          display: 'standalone',
          icons: [
            {
              src: '/favicon.ico',
              sizes: '64x64 32x32 24x24 16x16',
              type: 'image/x-icon'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,glb}'],
          maximumFileSizeToCacheInBytes: 10000000, // Increased to 10MB to accommodate 3D models/splines
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
            }
          ]
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
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
            'vendor-react': ['react', 'react-dom', 'framer-motion'],
            'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
            'vendor-utils': ['lucide-react', '@hello-pangea/dnd', 'recharts']
          }
        }
      }
    }
  };
});
