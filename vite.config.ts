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
          // Precache ONLY the app shell. The previous globPatterns included 'js',
          // which precached all 374 route chunks (12.3 MB) on first visit — for a
          // mobile-first study app on patchy connectivity that is unusable. Route
          // chunks are now cached on demand via runtimeCaching below instead.
          globPatterns: ['**/*.{html,css,ico,png,svg,webmanifest}'],
          maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
          navigateFallback: 'index.html',
          runtimeCaching: [
            {
              // Route chunks + the vendor graph they pull in. Stale-while-revalidate
              // means a user who already visited a subject gets it instantly offline.
              urlPattern: ({ request }) =>
                request.destination === 'script' || request.destination === 'style',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'atpl-chunks',
                expiration: {
                  maxEntries: 250,
                  maxAgeSeconds: 30 * 24 * 60 * 60
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
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
          // Function form is required here, not the object form.
          // The object form only claims the exact package entry points you list,
          // so 'react-dom' matched but 'react-dom/client', 'react/jsx-runtime'
          // and 'scheduler' did not. Rollup then assigned those to whichever
          // vendor chunk imported them first (react-dom ended up inside
          // vendor-three), which duplicated the React core across 4 chunks and
          // left vendor-react at 0 bytes. Matching by path catches every subpath.
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            const p = id.replace(/\\/g, '/');
            // React must be claimed first and completely: react, react-dom,
            // react-dom/client, react/jsx-runtime, react/jsx-dev-runtime, scheduler.
            if (/node_modules\/(react|react-dom|scheduler|react-is)\//.test(p)) return 'vendor-react';
            // three.js and @splinetool are deliberately NOT given manual chunks.
            // Only 7 components use @react-three/fiber and a single lazy component
            // uses @splinetool, but forcing them into named chunks makes Rollup emit
            // a bare side-effect `import "./vendor-<x>"` into the entry to preserve
            // evaluation order — putting 1.1 MB of WebGL / 4.6 MB of Spline on the
            // critical path. Left unclaimed, Rollup shares them only with the lazy
            // chunks that actually need them.
            if (/node_modules\/(firebase|@firebase)\//.test(p)) return 'vendor-firebase';
            if (/node_modules\/@clerk\//.test(p)) return 'vendor-clerk';
            if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(p)) return 'vendor-animation';
            if (/node_modules\/(lucide-react|@hello-pangea|recharts|d3-|victory-)\//.test(p)) return 'vendor-utils';
            // Anything else (including @google/genai, which is unused in the web
            // app) is left for Rollup to place — do not force it into a chunk.
          }
        }
      }
    }
  };
});
