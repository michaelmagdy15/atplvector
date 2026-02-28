
import { createClient } from '@supabase/supabase-js';

// Configuration — requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    'Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Mock client for when Supabase is not configured
const createMockQueryBuilder = (tableName?: string) => {
  let currentCode = '';
  const builder: any = {
    select: () => builder,
    update: () => builder,
    insert: () => builder,
    delete: () => builder,
    eq: (col: string, val: any) => {
      if (col === 'code') currentCode = val;
      return builder;
    },
    single: async () => {
      // If checking for our generated codes in the mock client, return success
      const validCodes = ['BYX7R4V9', 'L9K2MQ5P', 'Z1N8T3W6', 'H5D0F2S1', 'V6C2T9R8'];
      if (tableName === 'access_codes' && validCodes.includes(currentCode)) {
        return { data: { id: 'mock-id', code: currentCode, is_used: false }, error: null };
      }
      return { data: null, error: { message: 'Supabase URL and Anon Key are missing. Please configure them in your environment.' } };
    },
    maybeSingle: async () => ({ data: null, error: null }),
    order: () => builder,
    limit: () => builder,
  };
  return builder;
};

const mockClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } }, error: null }),
    signOut: async () => { },
    signInWithPassword: async () => ({ data: { user: null, session: { user: { id: 'mock-user' } } as any }, error: null }),
    signUp: async () => ({ data: { user: { id: 'mock-user' }, session: { user: { id: 'mock-user' } } as any }, error: null }),
    resetPasswordForEmail: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    updateUser: async () => ({ data: { user: { id: 'mock-user' } as any }, error: { message: 'Supabase not configured' } }),
    resend: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    verifyOtp: async () => ({ data: { user: { id: 'mock-user' }, session: { user: { id: 'mock-user' } } as any }, error: { message: 'Supabase not configured' } }),
  },
  from: (table: string) => createMockQueryBuilder(table),
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
