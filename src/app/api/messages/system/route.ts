import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyServerAuth } from '@/lib/server-auth';
import { ADMIN_UUID, SYSTEM_UUID, normalizeMessageId } from '@/lib/supabase-service';

// Dynamic access prevents Next.js from statically inlining at build time
function env(key: string): string { return process.env[key] || ''; }

export async function POST(request: Request) {
  try {
    const { receiverId, text, senderType } = await request.json();

    if (!receiverId || !text) {
      return NextResponse.json({ error: 'Missing receiverId or text' }, { status: 400 });
    }

    const auth = await verifyServerAuth(request, { requireAdmin: true });
    if (!auth.authorized) return auth.errorResponse!;

    const supabaseUrl = env('NEXT_PUBLIC_SUPABASE_URL');
    const serviceRoleKey = env('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Use service role to bypass RLS — allows proper sender_id values
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert({
        sender_id: senderType === 'admin' ? ADMIN_UUID : SYSTEM_UUID,
        receiver_id: normalizeMessageId(receiverId),
        text,
        sender_type: senderType || 'system',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
