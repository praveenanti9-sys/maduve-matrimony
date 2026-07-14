import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ── Client-side Supabase (uses anon key, respects RLS) ──
let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseClient) {
    if (!url || !key || key === 'PASTE_YOUR_ANON_KEY_HERE') {
      console.warn('Missing Supabase environment variables.');
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

// For backward compatibility — lazy initialization
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return Reflect.get(getSupabase(), prop);
  },
});

// ── Server-side admin client (bypasses RLS, for admin operations) ──
let supabaseAdminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseAdminClient) {
    if (!url || !serviceRoleKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for admin operations.');
    }
    supabaseAdminClient = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return supabaseAdminClient;
}
