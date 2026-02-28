
import { createClient } from '@supabase/supabase-js';

// Configuration — requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
