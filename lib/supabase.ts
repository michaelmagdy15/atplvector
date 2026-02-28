
import { createClient } from '@supabase/supabase-js';

// Configuration — requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    'Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Minimal mock to prevent crashes if Supabase is not configured
const mockClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } }, error: null }),
    signOut: async () => { },
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      }),
    }),
    update: () => ({
      eq: () => Promise.resolve({ error: null }),
    }),
    insert: () => Promise.resolve({ error: null }),
  }),
} as any;

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : mockClient;

/**
 * Helper to get the current site URL for redirects.
 * Prioritizes environment variables, falls back to window.location.origin.
 */
export const getSiteUrl = () => {
  let url =
    // @ts-ignore
    import.meta.env?.VITE_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  // Ensure it includes the protocol
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }

  // Remove trailing slash if present
  url = url.replace(/\/$/, '');

  return url;
};
