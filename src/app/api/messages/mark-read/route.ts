import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyServerAuth } from '@/lib/server-auth';
import { ADMIN_UUID, SYSTEM_UUID, normalizeMessageId } from '@/lib/supabase-service';

function env(key: string): string { return process.env[key] || ''; }

export async function POST(request: Request) {
  try {
    const { receiverId, senderId } = await request.json();

    if (!receiverId || !senderId) {
      return NextResponse.json({ error: 'Missing receiverId or senderId' }, { status: 400 });
    }

    const auth = await verifyServerAuth(request);
    if (!auth.authorized) return auth.errorResponse!;

    const supabaseUrl = env('NEXT_PUBLIC_SUPABASE_URL');
    const serviceRoleKey = env('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const actualSender = normalizeMessageId(senderId);
    const actualReceiver = normalizeMessageId(receiverId);

    let query = supabaseAdmin
      .from('messages')
      .update({ read: true })
      .eq('sender_id', actualSender)
      .eq('read', false);

    // Strictly check verified server token (never trust client payload for admin status)
    if (auth.isAdmin === true) {
      await query.in('receiver_id', [actualReceiver, ADMIN_UUID, auth.userId || '']);
    } else {
      await query.in('receiver_id', [actualReceiver, auth.userId || '']);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
