const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  const adminEmail = 'contact@maduvedibbana.com';
  const adminPassword = 'admin123';

  console.log('Checking auth users...');
  
  // 1. Try to create the auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  });

  let authUserId = authData?.user?.id;

  if (authError) {
    console.log('Auth user might exist:', authError.message);
    // Fetch the user ID if already exists
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.error('Failed to list users:', listError.message);
      return;
    }
    const existingUser = users.users.find(u => u.email === adminEmail);
    if (existingUser) {
      authUserId = existingUser.id;
      console.log('Found existing auth user:', authUserId);
      
      // Update password just to be sure
      await supabaseAdmin.auth.admin.updateUserById(authUserId, { password: adminPassword });
      console.log('Updated password to admin123');
    } else {
      console.error('User not found in auth list either.');
      return;
    }
  } else {
    console.log('Created new auth user:', authUserId);
  }

  // 2. Insert or update the profile
  console.log('Upserting admin profile...');
  const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
    auth_id: authUserId,
    email: adminEmail,
    full_name: 'Maduvedibbana Admin',
    role: 'admin',
    status: 'active',
  }, { onConflict: 'email' });

  if (profileError) {
    console.error('Failed to insert admin profile:', profileError.message);
  } else {
    console.log('SUCCESS! Admin profile created/updated.');
  }
}

run();
