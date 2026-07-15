import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Dynamic access prevents Next.js from statically inlining at build time
function env(key: string): string { return process.env[key] || ''; }

export async function POST(request: Request) {
  try {
    const { profileId, adminId, selfDelete } = await request.json();

    if (!profileId) {
      return NextResponse.json({ error: 'Missing profileId' }, { status: 400 });
    }

    const supabaseUrl = env('NEXT_PUBLIC_SUPABASE_URL');
    const serviceRoleKey = env('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Get auth_id before deleting profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('auth_id, email')
      .eq('id', profileId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // 2. Delete related data first
    await supabaseAdmin.from('messages').delete().or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`);
    await supabaseAdmin.from('interests').delete().or(`from_id.eq.${profileId},to_id.eq.${profileId}`);

    // 3. Delete profile
    const { error: profileError } = await supabaseAdmin.from('profiles').delete().eq('id', profileId);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // 4. Delete auth user (the critical step that was missing client-side)
    if (profile.auth_id) {
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(profile.auth_id);
      if (authError) {
        console.error('Failed to delete auth user:', authError.message);
        // Don't fail the request — profile is already deleted
      }
    }

    // 5. Log admin action if this was an admin-initiated delete
    if (adminId && !selfDelete) {
      await supabaseAdmin.from('admin_audit_log').insert({
        admin_id: adminId,
        action: 'delete',
        target_user_id: profileId,
        details: `Deleted user ${profile.email || profileId}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
