import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const ADMIN_UUID = '00000000-0000-0000-0000-00000000a111';
export const SYSTEM_UUID = '00000000-0000-0000-0000-000000005111';

export function normalizeMessageId(id: string): string {
  if (id === 'admin') return ADMIN_UUID;
  if (id === 'system') return SYSTEM_UUID;
  return id;
}

// ── Types ──
export interface DbProfile {
  id: string;
  auth_id: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'blocked' | 'pending';
  status_reason: string;
  full_name: string;
  email: string;
  phone: string;
  gender: 'MALE' | 'FEMALE' | '';
  dob: string;
  education: string;
  occupation: string;
  city: string;
  district: string;
  gothra: string;
  bio: string;
  height: string;
  weight: string;
  complexion: string;
  marital_status: string;
  annual_income: string;
  nakshatra: string;
  rashi: string;
  native_place: string;
  state: string;
  father_name: string;
  father_occupation: string;
  mother_name: string;
  mother_occupation: string;
  siblings: string;
  pref_age_min: string;
  pref_age_max: string;
  pref_height_min: string;
  pref_district: string;
  pref_education: string;
  profile_photo: string;
  daily_interest_count: number;
  last_interest_date: string;
  profile_visible: boolean;
  photo_privacy: boolean;
  contact_hidden: boolean;
  notif_messages: boolean;
  notif_interests: boolean;
  notif_accepted: boolean;
  notif_matches: boolean;
  notif_promo: boolean;
  profile_views: number;
  admin_reviewed: boolean;
  is_verified: boolean;
  shortlisted_ids?: string[];
  created_at: string;
  updated_at: string;

  // ARMember custom fields
  username?: string;
  first_name?: string;
  last_name?: string;
  posted_by?: string;
  body_type?: string;
  skin_tone?: string;
  disability?: string;
  blood_group?: string;
  eating_habits?: string;
  drinking_habits?: string;
  smoking_habits?: string;
  birth_time?: string;
  birth_place?: string;
  gana?: string;
  dosham?: string;
  education_field?: string;
  college?: string;
  working_with?: string;
  working_as?: string;
  organization?: string;
  work_location?: string;
  family_value?: string;
  family_type?: string;
  family_status?: string;
  father_status?: string;
  mother_status?: string;
  brothers?: string;
  brothers_married?: string;
  sisters?: string;
  sisters_married?: string;
  family_location?: string;
  guardian_phone?: string;
  family_origin?: string;

  // Payments flow custom fields
  payment_status?: 'unpaid' | 'pending_verification' | 'verified' | 'failed';
  payment_utr?: string;
  payment_screenshot?: string;
  payment_amount?: number;
  payment_date?: string;
}

export interface DbMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  sender_type: 'user' | 'admin' | 'system';
  text: string;
  read: boolean;
  created_at: string;
}

export interface DbInterest {
  id: string;
  from_id: string;
  to_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface DbSystemSettings {
  id: number;
  daily_interest_limit: number;
  auto_approve_profiles: boolean;
}

export interface DbContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ── Supabase Clients ──

// Dynamic access prevents Next.js from statically inlining NEXT_PUBLIC_ at build time
function env(key: string): string { return process.env[key] || ''; }

// Read env with fallback to server-injected window.__ENV__ for client-side code
function clientEnv(key: string): string {
  const val = env(key);
  if (val) return val;
  if (typeof window !== 'undefined') {
    const injected = (window as unknown as Record<string, unknown>).__ENV__ as Record<string, string> | undefined;
    if (injected?.[key]) return injected[key];
  }
  return '';
}

// Client-side Supabase (uses anon key, respects RLS)
let _supabase: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient {
  const url = clientEnv('NEXT_PUBLIC_SUPABASE_URL');
  const key = clientEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (!_supabase) {
    if (!url || !key) {
      throw new Error('Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

// Server-side Supabase (uses service role key, bypasses RLS — for admin operations)
let _supabaseAdmin: SupabaseClient | null = null;
export function getSupabaseAdmin(): SupabaseClient {
  const url = env('NEXT_PUBLIC_SUPABASE_URL');
  const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY');

  if (!_supabaseAdmin) {
    if (!url || !serviceKey) {
      throw new Error('Missing Supabase service role key. Check SUPABASE_SERVICE_ROLE_KEY.');
    }
    _supabaseAdmin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _supabaseAdmin;
}

// ============================================================
// AUTH OPERATIONS
// ============================================================

// NOTE: Registration is handled server-side via /api/auth/register route
// which uses the admin client to bypass RLS. The old registerUser()
// function has been removed to avoid confusion.

/** Login with Supabase Auth + fetch profile */
export async function loginUser(
  email: string,
  password: string
): Promise<{ profile: DbProfile | null; error: string | null }> {
  const supabase = getSupabase();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return { profile: null, error: authError.message };
  }

  if (!authData.user) {
    return { profile: null, error: 'Login failed.' };
  }

  // Fetch the user's profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', authData.user.id)
    .single();

  if (profileError || !profile) {
    return { profile: null, error: 'Profile not found.' };
  }

  // Check if user is pending, blocked, or suspended
  if (profile.status === 'pending') {
    await supabase.auth.signOut();
    return { profile: profile as DbProfile, error: 'Your profile is pending admin review and approval. You will receive an email once it is approved.' };
  }

  if (profile.status === 'blocked' || profile.status === 'suspended') {
    await supabase.auth.signOut();
    return { profile: profile as DbProfile, error: `Your account is ${profile.status}. ${profile.status_reason || 'Please contact support.'}` };
  }

  return { profile: profile as DbProfile, error: null };
}

/** Logout */
export async function logoutUser(): Promise<void> {
  const supabase = getSupabase();
  await supabase.auth.signOut();
}

/** Reset password — sends a real email via Supabase Auth */
export async function resetPassword(email: string): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/login` : '';
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  return { error: error?.message || null };
}

/** Update password for the currently authenticated user */
export async function updatePassword(newPassword: string): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error: error?.message || null };
}

/** Get auth headers including Bearer token if available */
export async function getAuthHeader(): Promise<Record<string, string>> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  return headers;
}

/** Delete own account — uses server API route to also clean up auth user */
export async function deleteSelfAccount(profileId: string): Promise<{ error: string | null }> {
  try {
    const headers = await getAuthHeader();
    const res = await fetch('/api/admin/delete-user', {
      method: 'POST',
      headers,
      body: JSON.stringify({ profileId, selfDelete: true }),
    });
    const result = await res.json();
    if (!res.ok) {
      return { error: result.error || 'Failed to delete account' };
    }
    // Sign out locally
    const supabase = getSupabase();
    await supabase.auth.signOut();
    return { error: null };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ============================================================
// PROFILE OPERATIONS
// ============================================================

/** Fetch current user's profile by auth_id */
export async function fetchMyProfile(): Promise<DbProfile | null> {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  return data as DbProfile | null;
}

/** Fetch all active profiles (for browse page) */
export async function fetchActiveProfiles(targetGender?: string): Promise<DbProfile[]> {
  const supabase = getSupabase();
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('status', 'active')
    .eq('profile_visible', true)
    .order('created_at', { ascending: false });

  if (targetGender) {
    query = query.eq('gender', targetGender);
  }

  const { data } = await query;
  return (data || []) as DbProfile[];
}

/** Fetch all profiles (admin only) */
export async function fetchAllProfiles(): Promise<DbProfile[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (data || []) as DbProfile[];
}

/** Update profile data */
export async function updateProfile(
  profileId: string,
  data: Partial<DbProfile>
): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', profileId);

  return { error: error?.message || null };
}

/** Upload profile photo to Supabase Storage */
export async function uploadProfilePhoto(
  profileId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const supabase = getSupabase();
  const fileExt = file.name.split('.').pop();
  const filePath = `${profileId}/avatar.${fileExt}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath);

  // Update profile with photo URL
  await supabase
    .from('profiles')
    .update({ profile_photo: publicUrl })
    .eq('id', profileId);

  return { url: publicUrl, error: null };
}

/** Increment profile views */
export async function incrementProfileViews(profileId: string): Promise<void> {
  const supabase = getSupabase();
  await supabase.rpc('increment_profile_views', { profile_id: profileId });
}

// ============================================================
// MESSAGE OPERATIONS
// ============================================================

/** Send a message */
export async function sendMessage(
  senderId: string,
  receiverId: string,
  text: string,
  senderType: 'user' | 'admin' | 'system' = 'user'
): Promise<{ message: DbMessage | null; error: string | null }> {
  const supabase = getSupabase();
  const actualSender = normalizeMessageId(senderId);
  const actualReceiver = normalizeMessageId(receiverId);

  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: actualSender,
      receiver_id: actualReceiver,
      text,
      sender_type: senderType,
    })
    .select()
    .single();

  return { message: data as DbMessage | null, error: error?.message || null };
}

/** Send a system message — uses server API route to bypass RLS */
export async function sendSystemMessage(receiverId: string, text: string): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch('/api/messages/system', {
      method: 'POST',
      headers,
      body: JSON.stringify({ receiverId, text, senderType: 'system' }),
    });
  } catch (err) {
    console.error('Failed to send system message:', err);
  }
}

/** Fetch messages for a user (all conversations) */
export async function fetchUserMessages(profileId: string): Promise<DbMessage[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`)
    .order('created_at', { ascending: true });

  return (data || []) as DbMessage[];
}

/** Fetch all messages (admin only) */
export async function fetchAllMessages(): Promise<DbMessage[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  return (data || []) as DbMessage[];
}

/** Mark messages as read — uses server API route to ensure RLS bypass and persistence */
export async function markMessagesRead(
  receiverId: string,
  senderId: string,
  isAdmin: boolean = false
): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch('/api/messages/mark-read', {
      method: 'POST',
      headers,
      body: JSON.stringify({ receiverId, senderId, isAdmin }),
    });
  } catch (err) {
    console.error('Failed to mark messages as read:', err);
  }
}

// ============================================================
// INTEREST OPERATIONS
// ============================================================

/** Send an interest */
export async function sendInterest(
  fromId: string,
  toId: string
): Promise<{ interest: DbInterest | null; error: string | null }> {
  const supabase = getSupabase();

  // Check daily limit
  const { data: countData } = await supabase.rpc('get_daily_interest_count', { user_id: fromId });
  const settings = await fetchSystemSettings();
  const limit = settings?.daily_interest_limit ?? 10;

  if ((countData ?? 0) >= limit) {
    return { interest: null, error: 'Daily interest limit reached. Try again tomorrow!' };
  }

  const { data, error } = await supabase
    .from('interests')
    .insert({ from_id: fromId, to_id: toId, status: 'pending' })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return { interest: null, error: 'Interest already sent to this profile.' };
    }
    return { interest: null, error: error.message };
  }

  return { interest: data as DbInterest, error: null };
}

/** Update interest status (accept/decline) */
export async function updateInterestStatus(
  interestId: string,
  status: 'accepted' | 'declined'
): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('interests')
    .update({ status })
    .eq('id', interestId);

  return { error: error?.message || null };
}

/** Fetch interests for a user */
export async function fetchUserInterests(profileId: string): Promise<DbInterest[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('interests')
    .select('*')
    .or(`from_id.eq.${profileId},to_id.eq.${profileId}`)
    .order('created_at', { ascending: false });

  return (data || []) as DbInterest[];
}

/** Fetch all interests (admin only) */
export async function fetchAllInterests(): Promise<DbInterest[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('interests')
    .select('*')
    .order('created_at', { ascending: false });

  return (data || []) as DbInterest[];
}

/** Get remaining interests for today */
export async function getRemainingInterests(profileId: string): Promise<number> {
  const supabase = getSupabase();
  const { data: countData } = await supabase.rpc('get_daily_interest_count', { user_id: profileId });
  const settings = await fetchSystemSettings();
  const limit = settings?.daily_interest_limit ?? 10;
  return Math.max(0, limit - (countData ?? 0));
}

// ============================================================
// ADMIN OPERATIONS
// ============================================================

/** Block a user */
export async function blockUser(profileId: string, adminId: string): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'blocked', status_reason: 'Blocked by admin' })
    .eq('id', profileId);

  if (!error) {
    await sendAdminMessage(profileId, '🚫 Your account has been blocked by the administrator. If you believe this is a mistake, please contact support.');
    await logAdminAction(adminId, 'block', profileId);
  }

  return { error: error?.message || null };
}

/** Suspend a user */
export async function suspendUser(
  profileId: string,
  reason: string,
  adminId: string
): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'suspended', status_reason: reason })
    .eq('id', profileId);

  if (!error) {
    await sendAdminMessage(profileId, `⚠️ Your account has been temporarily suspended. Reason: ${reason}. Please contact support if you have questions.`);
    await logAdminAction(adminId, 'suspend', profileId, reason);
  }

  return { error: error?.message || null };
}

/** Activate a user (unblock/unsuspend) */
export async function activateUser(profileId: string, adminId: string): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'active', status_reason: '' })
    .eq('id', profileId);

  if (!error) {
    await sendAdminMessage(profileId, '✅ Great news! Your account has been re-activated. You can now use all platform features again. Welcome back!');
    await logAdminAction(adminId, 'activate', profileId);
  }

  return { error: error?.message || null };
}

/** Approve a pending user */
export async function approveUser(profileId: string, adminId: string): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'active', status_reason: '', admin_reviewed: true })
    .eq('id', profileId);

  if (!error) {
    await sendAdminMessage(profileId, 'Welcome! Your profile has been verified and approved by the Super Admin.');
    await logAdminAction(adminId, 'approve', profileId);
  }

  return { error: error?.message || null };
}

/** Reject a pending user */
export async function rejectUser(profileId: string, adminId: string): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'blocked', status_reason: 'Rejected by admin' })
    .eq('id', profileId);

  if (!error) {
    await sendAdminMessage(profileId, '❌ Your profile registration has been reviewed and unfortunately was not approved. Please contact support for more information.');
    await logAdminAction(adminId, 'reject', profileId);
  }

  return { error: error?.message || null };
}

/** Verify/Unverify a user */
export async function verifyUser(
  profileId: string,
  verified: boolean,
  adminId: string
): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('profiles')
    .update({ is_verified: verified })
    .eq('id', profileId);

  if (!error) {
    await sendAdminMessage(
      profileId,
      verified
        ? '✅ Your profile has been verified by the admin team. A verified badge is now visible on your profile.'
        : '⚠️ Your profile verification has been revoked by the admin team.'
    );
    await logAdminAction(adminId, 'verify', profileId, `verified=${verified}`);
  }

  return { error: error?.message || null };
}

/** Verify payment status for a user */
export async function verifyPayment(
  profileId: string,
  status: 'verified' | 'failed',
  adminId: string
): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  
  const updateData = {
    payment_status: status,
    status: status === 'verified' ? 'active' : 'suspended',
    status_reason: status === 'verified' ? '' : 'Payment verification failed',
    admin_reviewed: status === 'verified' ? true : false,
  };

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', profileId);

  if (!error) {
    if (status === 'verified') {
      await sendAdminMessage(
        profileId,
        '✅ Your registration payment of ₹1,000 has been verified! Your account is now fully active and approved. Happy matchmaking!'
      );
    } else {
      await sendAdminMessage(
        profileId,
        '⚠️ Your registration payment verification failed. Please contact the administrator to resolve payment verification.'
      );
    }
    await logAdminAction(adminId, 'verify_payment', profileId, `status=${status}`);
  }

  return { error: error?.message || null };
}

/** Delete a user (admin action) — uses server API route to also clean up auth user */
export async function deleteUserByAdmin(profileId: string, adminId: string): Promise<{ error: string | null }> {
  try {
    const headers = await getAuthHeader();
    const res = await fetch('/api/admin/delete-user', {
      method: 'POST',
      headers,
      body: JSON.stringify({ profileId, adminId }),
    });
    const result = await res.json();
    if (!res.ok) {
      return { error: result.error || 'Failed to delete user' };
    }
    return { error: null };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ============================================================
// SYSTEM SETTINGS
// ============================================================

/** Fetch system settings */
export async function fetchSystemSettings(): Promise<DbSystemSettings | null> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('system_settings')
    .select('*')
    .eq('id', 1)
    .single();

  return data as DbSystemSettings | null;
}

/** Update system settings */
export async function updateSystemSettings(
  settings: Partial<DbSystemSettings>
): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('system_settings')
    .update(settings)
    .eq('id', 1);

  return { error: error?.message || null };
}

// ============================================================
// CONTACT INQUIRIES
// ============================================================

/** Submit a contact form inquiry */
export async function submitContactInquiry(
  name: string,
  email: string,
  message: string,
  phone?: string
): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('contact_inquiries')
    .insert({ name, email, message, phone });

  return { error: error?.message || null };
}

/** Fetch all contact inquiries (admin only) */
export async function fetchContactInquiries(): Promise<DbContactInquiry[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('contact_inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  return (data || []) as DbContactInquiry[];
}

// ============================================================
// REALTIME SUBSCRIPTIONS
// ============================================================

/** Subscribe to new messages for a user */
export function subscribeToMessages(
  profileId: string,
  onNewMessage: (message: DbMessage) => void,
  isAdmin: boolean = false
) {
  const supabase = getSupabase();
  const filter = isAdmin ? undefined : `receiver_id=eq.${profileId}`;

  const channel = supabase
    .channel(`messages:${profileId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        ...(filter ? { filter } : {}),
      },
      (payload) => {
        onNewMessage(payload.new as DbMessage);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}

/** Subscribe to profile changes across platform (for Admin real-time notifications) */
export function subscribeToProfiles(
  onProfileChange: (profile: DbProfile) => void
) {
  const supabase = getSupabase();
  const channel = supabase
    .channel('profiles:admin')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
      },
      (payload) => {
        if (payload.new) {
          onProfileChange(payload.new as DbProfile);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/** Subscribe to interest updates for a user */
export function subscribeToInterests(
  profileId: string,
  onInterestUpdate: (interest: DbInterest) => void
) {
  const supabase = getSupabase();
  const channel = supabase
    .channel(`interests:${profileId}`)
    // Listen to interests sent TO me
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'interests',
        filter: `to_id=eq.${profileId}`,
      },
      (payload) => {
        onInterestUpdate(payload.new as DbInterest);
      }
    )
    // Listen to updates on interests sent BY me (e.g., accepted/declined by others)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'interests',
        filter: `from_id=eq.${profileId}`,
      },
      (payload) => {
        onInterestUpdate(payload.new as DbInterest);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ============================================================
// HELPERS
// ============================================================

/** Send message from admin — uses server API route to bypass RLS */
async function sendAdminMessage(receiverId: string, text: string): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch('/api/messages/system', {
      method: 'POST',
      headers,
      body: JSON.stringify({ receiverId, text, senderType: 'admin' }),
    });
  } catch (err) {
    console.error('Failed to send admin message:', err);
  }
}

/** Log admin action to audit log */
async function logAdminAction(
  adminId: string,
  action: string,
  targetUserId: string,
  details: string = ''
): Promise<void> {
  const supabase = getSupabase();
  await supabase.from('admin_audit_log').insert({
    admin_id: adminId,
    action,
    target_user_id: targetUserId,
    details,
  });
}

/** Get the current authenticated user's profile ID */
export async function getCurrentProfileId(): Promise<string | null> {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  return data?.id || null;
}

/** Check if current user is authenticated */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

/** Listen for auth state changes */
export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  const supabase = getSupabase();
  return supabase.auth.onAuthStateChange(callback);
}
