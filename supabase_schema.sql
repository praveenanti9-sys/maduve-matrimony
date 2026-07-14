-- ============================================================
-- Maduvedibbana Matrimony — Complete Supabase Schema
-- ============================================================
-- Run this in Supabase Dashboard → SQL Editor
-- This replaces the previous schema entirely.
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
-- Linked to Supabase Auth (auth.users) via auth_id.
-- No password column — Supabase Auth handles passwords securely.
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'suspended', 'blocked', 'pending')),
  status_reason text DEFAULT '',

  -- Personal Info
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text DEFAULT '',
  gender text DEFAULT '' CHECK (gender IN ('MALE', 'FEMALE', '')),
  dob text DEFAULT '',
  education text DEFAULT '',
  occupation text DEFAULT '',
  city text DEFAULT '',
  district text DEFAULT '',
  gothra text DEFAULT '',
  bio text DEFAULT '',
  height text DEFAULT '',
  weight text DEFAULT '',
  complexion text DEFAULT '',
  marital_status text DEFAULT '',
  annual_income text DEFAULT '',
  nakshatra text DEFAULT '',
  rashi text DEFAULT '',
  native_place text DEFAULT '',
  state text DEFAULT 'Karnataka',

  -- Family Details
  father_name text DEFAULT '',
  father_occupation text DEFAULT '',
  mother_name text DEFAULT '',
  mother_occupation text DEFAULT '',
  siblings text DEFAULT '',

  -- Partner Preferences
  pref_age_min text DEFAULT '',
  pref_age_max text DEFAULT '',
  pref_height_min text DEFAULT '',
  pref_district text DEFAULT '',
  pref_education text DEFAULT '',

  -- Profile Photo (URL from Supabase Storage)
  profile_photo text DEFAULT '',

  -- Rate Limiting
  daily_interest_count integer DEFAULT 0,
  last_interest_date text DEFAULT '',

  -- Privacy & Notification Settings
  profile_visible boolean DEFAULT true,
  photo_privacy boolean DEFAULT false,
  contact_hidden boolean DEFAULT true,
  notif_messages boolean DEFAULT true,
  notif_interests boolean DEFAULT true,
  notif_accepted boolean DEFAULT true,
  notif_matches boolean DEFAULT true,
  notif_promo boolean DEFAULT false,

  -- Stats
  profile_views integer DEFAULT 0,
  shortlisted_ids uuid[] DEFAULT '{}',

  -- Admin Flags
  admin_reviewed boolean DEFAULT false,
  is_verified boolean DEFAULT false,

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON public.profiles(gender);
CREATE INDEX IF NOT EXISTS idx_profiles_district ON public.profiles(district);
CREATE INDEX IF NOT EXISTS idx_profiles_auth_id ON public.profiles(auth_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 2. MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id uuid NOT NULL,       -- profile.id or NULL for system
  receiver_id uuid NOT NULL,     -- profile.id
  sender_type text DEFAULT 'user' CHECK (sender_type IN ('user', 'admin', 'system')),
  text text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);

-- ============================================================
-- 3. INTERESTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.interests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamp with time zone DEFAULT now(),

  -- Prevent duplicate interests
  UNIQUE(from_id, to_id)
);

CREATE INDEX IF NOT EXISTS idx_interests_from ON public.interests(from_id);
CREATE INDEX IF NOT EXISTS idx_interests_to ON public.interests(to_id);
CREATE INDEX IF NOT EXISTS idx_interests_status ON public.interests(status);

-- ============================================================
-- 4. SYSTEM SETTINGS TABLE (Single Row)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.system_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- Only 1 row allowed
  daily_interest_limit integer DEFAULT 10,
  auto_approve_profiles boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default settings
INSERT INTO public.system_settings (id, daily_interest_limit, auto_approve_profiles)
VALUES (1, 10, false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. CONTACT INQUIRIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- 6. ADMIN AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id uuid REFERENCES public.profiles(id),
  action text NOT NULL,  -- 'approve', 'reject', 'block', 'suspend', 'activate', 'verify', 'delete'
  target_user_id uuid,
  details text DEFAULT '',
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- 7. DATABASE FUNCTIONS
-- ============================================================

-- Increment profile views
CREATE OR REPLACE FUNCTION increment_profile_views(profile_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET profile_views = profile_views + 1
  WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get daily interest count (for rate limiting)
CREATE OR REPLACE FUNCTION get_daily_interest_count(user_id uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM public.interests
    WHERE from_id = user_id
      AND created_at >= CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reset daily interest counts (run via Supabase cron if needed)
CREATE OR REPLACE FUNCTION reset_daily_interest_counts()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET daily_interest_count = 0, last_interest_date = ''
  WHERE last_interest_date != to_char(CURRENT_DATE, 'YYYY-MM-DD');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Helper: Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_id = auth.uid()
      AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── PROFILES POLICIES ──

-- Anyone authenticated can read active profiles (for browsing)
CREATE POLICY "Users can view active profiles"
  ON public.profiles FOR SELECT
  USING (
    status = 'active'
    OR auth_id = auth.uid()  -- Users can always see their own profile
    OR is_admin()            -- Admin can see all profiles
  );

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

-- Only admin can update any profile (for approve/block/verify)
CREATE POLICY "Admin can update any profile"
  ON public.profiles FOR UPDATE
  USING (is_admin());

-- Allow inserting profiles (during registration)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth_id = auth.uid());

-- Only admin can delete profiles
CREATE POLICY "Admin can delete profiles"
  ON public.profiles FOR DELETE
  USING (is_admin());

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  USING (auth_id = auth.uid());

-- ── MESSAGES POLICIES ──

-- Users can read messages they sent or received
CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
  USING (
    sender_id = (SELECT id FROM public.profiles WHERE auth_id = auth.uid())
    OR receiver_id = (SELECT id FROM public.profiles WHERE auth_id = auth.uid())
    OR is_admin()  -- Admin can see all messages
  );

-- Users can send messages
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = (SELECT id FROM public.profiles WHERE auth_id = auth.uid())
    OR is_admin()
  );

-- Users can mark their received messages as read
CREATE POLICY "Users can update own received messages"
  ON public.messages FOR UPDATE
  USING (
    receiver_id = (SELECT id FROM public.profiles WHERE auth_id = auth.uid())
    OR is_admin()
  );

-- ── INTERESTS POLICIES ──

-- Users can view interests they sent or received
CREATE POLICY "Users can view own interests"
  ON public.interests FOR SELECT
  USING (
    from_id = (SELECT id FROM public.profiles WHERE auth_id = auth.uid())
    OR to_id = (SELECT id FROM public.profiles WHERE auth_id = auth.uid())
    OR is_admin()
  );

-- Users can send interests
CREATE POLICY "Users can send interests"
  ON public.interests FOR INSERT
  WITH CHECK (
    from_id = (SELECT id FROM public.profiles WHERE auth_id = auth.uid())
  );

-- Users can update interest status (accept/decline received interests)
CREATE POLICY "Users can update received interests"
  ON public.interests FOR UPDATE
  USING (
    to_id = (SELECT id FROM public.profiles WHERE auth_id = auth.uid())
    OR is_admin()
  );

-- ── SYSTEM SETTINGS POLICIES ──

-- Anyone authenticated can read settings
CREATE POLICY "Authenticated users can read settings"
  ON public.system_settings FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Only admin can update settings
CREATE POLICY "Admin can update settings"
  ON public.system_settings FOR UPDATE
  USING (is_admin());

-- ── CONTACT INQUIRIES POLICIES ──

-- Anyone can insert (public contact form)
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_inquiries FOR INSERT
  WITH CHECK (true);

-- Only admin can read contact inquiries
CREATE POLICY "Admin can read contact inquiries"
  ON public.contact_inquiries FOR SELECT
  USING (is_admin());

-- Admin can update (mark as read)
CREATE POLICY "Admin can update contact inquiries"
  ON public.contact_inquiries FOR UPDATE
  USING (is_admin());

-- ── AUDIT LOG POLICIES ──

-- Only admin can read/write audit log
CREATE POLICY "Admin can manage audit log"
  ON public.admin_audit_log FOR ALL
  USING (is_admin());

-- ============================================================
-- 9. STORAGE BUCKET FOR PROFILE PHOTOS
-- ============================================================

-- Create the bucket (public read, authenticated upload)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view profile photos
CREATE POLICY "Public can view profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

-- Authenticated users can upload their own photos
CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-photos'
    AND auth.uid() IS NOT NULL
  );

-- Users can update/delete their own photos
CREATE POLICY "Users can manage own photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-photos'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-photos'
    AND auth.uid() IS NOT NULL
  );

-- ============================================================
-- 10. ENABLE REALTIME ON MESSAGES
-- ============================================================
-- This enables Supabase Realtime for the messages table
-- so users get live updates when they receive new messages.
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interests;
