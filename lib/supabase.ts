
import { createClient } from '@supabase/supabase-js';

// Configuration
// @ts-ignore
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xzdrfydahvpitepzkopg.supabase.co';
// @ts-ignore
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_XiPLZkD-7XWRnRmEjCdmxg_DyRsx05_';

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
