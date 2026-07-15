import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function env(key: string): string { return process.env[key] || ''; }

export interface AuthResult {
  authorized: boolean;
  userId?: string;
  isAdmin?: boolean;
  errorResponse?: NextResponse;
}

/** Verify Bearer token from Request header using Supabase Admin client */
export async function verifyServerAuth(
  request: Request,
  options?: { requireAdmin?: boolean; allowSelfForProfileId?: string }
): Promise<AuthResult> {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    return {
      authorized: false,
      errorResponse: NextResponse.json({ error: 'Unauthorized: Missing auth token' }, { status: 401 }),
    };
  }

  const supabaseUrl = env('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = env('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      authorized: false,
      errorResponse: NextResponse.json({ error: 'Server misconfigured: Missing Supabase credentials' }, { status: 500 }),
    };
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return {
      authorized: false,
      errorResponse: NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 }),
    };
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, role')
    .eq('auth_id', user.id)
    .maybeSingle();

  const isAdmin = profile?.role === 'admin';
  const isSelf = options?.allowSelfForProfileId && profile?.id === options.allowSelfForProfileId;

  if (options?.requireAdmin && !isAdmin && !isSelf) {
    return {
      authorized: false,
      errorResponse: NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 }),
    };
  }

  return { authorized: true, userId: profile?.id || user.id, isAdmin };
}
