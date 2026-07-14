import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// ── Client-side Supabase (uses anon key, respects RLS) ──
let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'PASTE_YOUR_ANON_KEY_HERE') {
      console.warn('Missing Supabase environment variables. Check your .env.local file.');
      // Return a dummy client that will fail gracefully
      throw new Error('Supabase is not configured. Please add your API keys to .env.local');
    }
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

// For backward compatibility — lazy initialization
// This export will throw if Supabase is not configured (which is the desired behavior)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return Reflect.get(getSupabase(), prop);
  },
});

// ── Server-side admin client (bypasses RLS, for admin operations) ──
let supabaseAdminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseAdminClient) {
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY for admin operations.');
    }
    supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return supabaseAdminClient;
}
