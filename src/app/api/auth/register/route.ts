import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-service';

export async function POST(request: Request) {
  try {
    const { email, password, profileData = {} } = await request.json();

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Valid email and password are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
    }

    if (password.length < 6 || password.length > 128) {
      return NextResponse.json({ error: 'Password must be between 6 and 128 characters' }, { status: 400 });
    }

    // Sanitize string helpers to prevent buffer overflow or DoS payload injection
    const sanitizeStr = (val: any, maxLen = 150): string => {
      if (typeof val !== 'string') return '';
      return val.trim().slice(0, maxLen);
    };

    const adminClient = getSupabaseAdmin();

    // 1. Create user in Supabase Auth via admin auth API (auto-confirms email!)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email to bypass validation during testing/production
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || 'Auth registration failed' }, { status: 400 });
    }

    // 2. Read system settings to determine if auto-approve is enabled
    const { data: settings } = await adminClient
      .from('system_settings')
      .select('auto_approve_profiles')
      .eq('id', 1)
      .single();

    const autoApprove = settings?.auto_approve_profiles ?? false;
    const initialStatus = autoApprove ? 'active' : 'pending';

    // 3. Insert or update profile in profiles table via admin client (bypasses RLS & handles automatic triggers)
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .upsert({
        auth_id: authData.user.id,
        email: sanitizeStr(email, 254),
        full_name: sanitizeStr(profileData.fullName, 100),
        phone: sanitizeStr(profileData.phone, 20),
        gender: sanitizeStr(profileData.gender, 20),
        dob: sanitizeStr(profileData.dob, 20),
        education: sanitizeStr(profileData.education, 100),
        occupation: sanitizeStr(profileData.occupation, 100),
        city: sanitizeStr(profileData.city, 100),
        district: sanitizeStr(profileData.district, 100),
        gothra: sanitizeStr(profileData.gothra, 50),
        bio: sanitizeStr(profileData.bio, 1000),
        height: sanitizeStr(profileData.height, 20),
        weight: sanitizeStr(profileData.weight, 20),
        complexion: sanitizeStr(profileData.complexion, 50),
        marital_status: sanitizeStr(profileData.maritalStatus, 50),
        annual_income: sanitizeStr(profileData.annualIncome, 50),
        nakshatra: sanitizeStr(profileData.nakshatra, 50),
        rashi: sanitizeStr(profileData.rashi, 50),
        native_place: sanitizeStr(profileData.nativePlace, 100),
        state: sanitizeStr(profileData.state || 'Karnataka', 100),
        father_name: sanitizeStr(profileData.fatherName, 100),
        father_occupation: sanitizeStr(profileData.fatherOccupation, 100),
        mother_name: sanitizeStr(profileData.motherName, 100),
        mother_occupation: sanitizeStr(profileData.motherOccupation, 100),
        siblings: sanitizeStr(profileData.siblings, 200),
        pref_age_min: sanitizeStr(profileData.prefAgeMin, 10),
        pref_age_max: sanitizeStr(profileData.prefAgeMax, 10),
        pref_height_min: sanitizeStr(profileData.prefHeightMin, 20),
        pref_district: sanitizeStr(profileData.prefDistrict, 100),
        pref_education: sanitizeStr(profileData.prefEducation, 100),
        profile_photo: '',
        status: initialStatus,
        role: 'user', // Hardcoded user role prevents privilege escalation
        admin_reviewed: autoApprove,
      }, { onConflict: 'auth_id' })
      .select()
      .single();

    if (profileError) {
      // Clean up the created auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    return NextResponse.json({ profile, user: authData.user });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
