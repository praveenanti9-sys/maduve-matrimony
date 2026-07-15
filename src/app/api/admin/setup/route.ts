import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Dynamic access prevents Next.js from statically inlining at build time
function env(key: string): string { return process.env[key] || ''; }

export async function POST(request: Request) {
  try {
    const supabaseUrl = env('NEXT_PUBLIC_SUPABASE_URL');
    const serviceRoleKey = env('SUPABASE_SERVICE_ROLE_KEY');
    const adminEmail = env('NEXT_PUBLIC_ADMIN_EMAIL') || env('ADMIN_EMAIL') || 'admin@maduvedibbana.com';
    const adminPassword = env('ADMIN_PASSWORD') || env('NEXT_PUBLIC_ADMIN_PASSWORD') || 'admin123';

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 0. Security Check: If any admin exists, require x-setup-secret header to prevent unauthorized re-execution
    const { data: existingAdmins } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    if (existingAdmins && existingAdmins.length > 0) {
      const setupSecret = env('ADMIN_SETUP_SECRET');
      const headerSecret = request.headers.get('x-setup-secret');
      if (!setupSecret || headerSecret !== setupSecret) {
        return NextResponse.json({ 
          error: 'Forbidden: Super Admin is already configured. Setup endpoint locked.' 
        }, { status: 403 });
      }
    }

    // 1. Check if profile exists by email
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role')
      .eq('email', adminEmail)
      .maybeSingle();

    if (existingProfile) {
      // Do NOT disclose sensitive profile objects or auth IDs to callers
      return NextResponse.json({ message: 'Admin already configured' });
    }

    // 2. Check if auth user exists in auth.users by email (if they exist but profile was deleted)
    // We can list users or try to create, if it fails because email exists, we can reset their password/link.
    // To keep it simple, we try to create:
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    let authUserId = authData?.user?.id;

    if (authError) {
      // If user already exists in Auth, find them
      if (authError.message.includes('already registered') || authError.status === 422) {
        // Fetch users using the admin API to find their ID
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const foundUser = usersData?.users.find(u => u.email === adminEmail);
        if (foundUser) {
          authUserId = foundUser.id;
        } else {
          return NextResponse.json({ error: `Auth user already exists but could not retrieve ID: ${authError.message}` }, { status: 500 });
        }
      } else {
        return NextResponse.json({ error: `Auth creation failed: ${authError.message}` }, { status: 500 });
      }
    }

    if (!authUserId) {
      return NextResponse.json({ error: 'Auth user creation failed, no ID returned.' }, { status: 500 });
    }

    // 3. Create profile row
    const { data: newProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        auth_id: authUserId,
        email: adminEmail,
        full_name: 'Super Admin',
        role: 'admin',
        status: 'active',
        is_verified: true,
        admin_reviewed: true,
      })
      .select()
      .single();

    if (profileError) {
      return NextResponse.json({ error: `Profile creation failed: ${profileError.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: 'Admin setup successful', profile: newProfile });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
