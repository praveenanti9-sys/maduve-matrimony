const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local and .env
function loadEnvFile(fileName) {
  const envPath = path.join(__dirname, '..', fileName);
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        let value = trimmed.substring(eqIndex + 1).trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value;
      }
    }
  }
}

loadEnvFile('.env');
loadEnvFile('.env.local');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'contact@maduvedibbana.com').toLowerCase();

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log('====================================================');
  console.log('       INSPECTING AND CLEARING TEST DATA            ');
  console.log('====================================================');
  console.log(`Super Admin Email preserved: ${adminEmail}`);

  // 1. Fetch all profiles
  const { data: profiles, error: profilesErr } = await supabaseAdmin
    .from('profiles')
    .select('*');

  if (profilesErr) {
    console.error('Failed to fetch profiles:', profilesErr.message);
    return;
  }

  console.log(`\nTotal profiles found in DB: ${profiles.length}`);

  // Identify profiles to keep vs delete
  const profilesToKeep = [];
  const profilesToDelete = [];

  for (const p of profiles) {
    const email = (p.email || '').toLowerCase();
    if (email === adminEmail || p.role === 'admin') {
      profilesToKeep.push(p);
    } else {
      profilesToDelete.push(p);
    }
  }

  console.log(`-> Profiles to KEEP (Super Admin / Admin): ${profilesToKeep.length}`);
  profilesToKeep.forEach(p => console.log(`   [KEEP] ${p.full_name} (${p.email}) [Role: ${p.role}] [ID: ${p.id}]`));

  console.log(`-> Profiles to DELETE (Dummy/Test Users): ${profilesToDelete.length}`);
  profilesToDelete.forEach(p => console.log(`   [DELETE] ${p.full_name} (${p.email}) [Role: ${p.role}] [ID: ${p.id}]`));

  // 2. Fetch all auth users using pagination/loop in case there are many
  let allAuthUsers = [];
  let page = 1;
  while (true) {
    const { data: usersData, error: usersErr } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (usersErr) {
      console.error('Failed to fetch auth users:', usersErr.message);
      break;
    }
    const list = usersData?.users || [];
    allAuthUsers = allAuthUsers.concat(list);
    if (list.length < 1000) break;
    page++;
  }

  console.log(`\nTotal auth.users found: ${allAuthUsers.length}`);

  const authToKeep = [];
  const authToDelete = [];

  // Also collect IDs of kept profiles
  const keptProfileAuthIds = new Set(profilesToKeep.map(p => p.auth_id).filter(Boolean));

  for (const u of allAuthUsers) {
    const email = (u.email || '').toLowerCase();
    if (email === adminEmail || keptProfileAuthIds.has(u.id)) {
      authToKeep.push(u);
    } else {
      authToDelete.push(u);
    }
  }

  console.log(`-> Auth users to KEEP: ${authToKeep.length}`);
  authToKeep.forEach(u => console.log(`   [KEEP] ${u.email} [ID: ${u.id}]`));

  console.log(`-> Auth users to DELETE: ${authToDelete.length}`);
  authToDelete.forEach(u => console.log(`   [DELETE] ${u.email} [ID: ${u.id}]`));

  // 3. Delete messages and interests involving deleted profiles
  const deletedProfileIds = profilesToDelete.map(p => p.id);
  
  // Also clean up all dummy/test contact inquiries
  const { data: inquiries, error: inqErr } = await supabaseAdmin.from('contact_inquiries').select('*');
  if (!inqErr && inquiries && inquiries.length > 0) {
    console.log(`\nFound ${inquiries.length} contact inquiries. Clearing dummy contact inquiries...`);
    // Delete all contact inquiries that are test data
    await supabaseAdmin.from('contact_inquiries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log(`-> Cleared ${inquiries.length} contact inquiries.`);
  }

  // Clear messages
  const { data: allMessages } = await supabaseAdmin.from('messages').select('*');
  if (allMessages && allMessages.length > 0) {
    console.log(`\nFound ${allMessages.length} total messages.`);
    // If we have deleted profiles, delete any messages where sender or receiver is not in profilesToKeep
    const keptIds = new Set(profilesToKeep.map(p => p.id));
    const messagesToDelete = allMessages.filter(m => !keptIds.has(m.sender_id) || !keptIds.has(m.receiver_id));
    if (messagesToDelete.length > 0) {
      console.log(`-> Deleting ${messagesToDelete.length} dummy/test messages...`);
      for (const m of messagesToDelete) {
        await supabaseAdmin.from('messages').delete().eq('id', m.id);
      }
    }
  }

  // Clear interests
  const { data: allInterests } = await supabaseAdmin.from('interests').select('*');
  if (allInterests && allInterests.length > 0) {
    console.log(`\nFound ${allInterests.length} total interests.`);
    const keptIds = new Set(profilesToKeep.map(p => p.id));
    const interestsToDelete = allInterests.filter(i => !keptIds.has(i.from_id) || !keptIds.has(i.to_id));
    if (interestsToDelete.length > 0) {
      console.log(`-> Deleting ${interestsToDelete.length} dummy/test interests...`);
      for (const i of interestsToDelete) {
        await supabaseAdmin.from('interests').delete().eq('id', i.id);
      }
    }
  }

  // Clean storage photos
  const { data: storageFiles, error: storageErr } = await supabaseAdmin.storage.from('profile-photos').list('');
  if (!storageErr && storageFiles && storageFiles.length > 0) {
    console.log(`\nFound ${storageFiles.length} files in 'profile-photos' storage bucket.`);
    // Check which files belong to kept profiles vs deleted profiles
    const keptPhotos = new Set(profilesToKeep.map(p => p.profile_photo).filter(Boolean));
    const filesToDelete = [];
    for (const f of storageFiles) {
      if (f.name === '.emptyFolderPlaceholder') continue;
      // If none of the kept profiles link to this file name, mark for deletion
      let isKept = false;
      for (const kp of keptPhotos) {
        if (kp.includes(f.name)) {
          isKept = true;
          break;
        }
      }
      if (!isKept) {
        filesToDelete.push(f.name);
      }
    }
    if (filesToDelete.length > 0) {
      console.log(`-> Deleting ${filesToDelete.length} dummy profile photos from storage...`);
      await supabaseAdmin.storage.from('profile-photos').remove(filesToDelete);
    }
  }

  // 4. Delete profiles from DB
  if (deletedProfileIds.length > 0) {
    console.log(`\nDeleting ${deletedProfileIds.length} profiles from database...`);
    for (const pid of deletedProfileIds) {
      const { error: delErr } = await supabaseAdmin.from('profiles').delete().eq('id', pid);
      if (delErr) {
        console.error(`   Error deleting profile ${pid}: ${delErr.message}`);
      } else {
        console.log(`   Successfully deleted profile ID: ${pid}`);
      }
    }
  }

  // 5. Delete auth users
  if (authToDelete.length > 0) {
    console.log(`\nDeleting ${authToDelete.length} auth users from Supabase Auth...`);
    for (const u of authToDelete) {
      const { error: delAuthErr } = await supabaseAdmin.auth.admin.deleteUser(u.id);
      if (delAuthErr) {
        console.error(`   Error deleting auth user ${u.email} (${u.id}): ${delAuthErr.message}`);
      } else {
        console.log(`   Successfully deleted auth user: ${u.email} (${u.id})`);
      }
    }
  }

  // 6. Clean audit logs targeting deleted users
  const { data: auditLogs } = await supabaseAdmin.from('admin_audit_log').select('*');
  if (auditLogs && auditLogs.length > 0) {
    const keptIds = new Set(profilesToKeep.map(p => p.id));
    for (const log of auditLogs) {
      if (log.target_user_id && !keptIds.has(log.target_user_id)) {
        await supabaseAdmin.from('admin_audit_log').delete().eq('id', log.id);
      }
    }
  }

  console.log('\n====================================================');
  console.log('       TEST DATA DELETION COMPLETE                  ');
  console.log('====================================================');
}

run().catch(err => {
  console.error('Fatal error running cleanup:', err);
});
