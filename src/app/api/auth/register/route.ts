import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-service';

export async function POST(request: Request) {
  try {
    const { email, password, profileData } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

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

    // 2. Insert or update profile in profiles table via admin client (bypasses RLS & handles automatic triggers)
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .upsert({
        auth_id: authData.user.id,
        email,
        full_name: profileData.fullName || '',
        phone: profileData.phone || '',
        gender: profileData.gender || '',
        dob: profileData.dob || '',
        education: profileData.education || '',
        occupation: profileData.occupation || '',
        city: profileData.city || '',
        district: profileData.district || '',
        gothra: profileData.gothra || '',
        bio: profileData.bio || '',
        height: profileData.height || '',
        weight: profileData.weight || '',
        complexion: profileData.complexion || '',
        marital_status: profileData.maritalStatus || '',
        annual_income: profileData.annualIncome || '',
        nakshatra: profileData.nakshatra || '',
        rashi: profileData.rashi || '',
        native_place: profileData.nativePlace || '',
        state: profileData.state || 'Karnataka',
        father_name: profileData.fatherName || '',
        father_occupation: profileData.fatherOccupation || '',
        mother_name: profileData.motherName || '',
        mother_occupation: profileData.motherOccupation || '',
        siblings: profileData.siblings || '',
        pref_age_min: profileData.prefAgeMin || '',
        pref_age_max: profileData.prefAgeMax || '',
        pref_height_min: profileData.prefHeightMin || '',
        pref_district: profileData.prefDistrict || '',
        pref_education: profileData.prefEducation || '',
        profile_photo: '',
        status: 'pending', // defaults to pending review
        role: 'user',
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
