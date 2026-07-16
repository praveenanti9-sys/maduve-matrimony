import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-service';
import { sendResendEmail } from '@/lib/email-service';
import { getRegistrationWelcomeHtml } from '@/lib/email-templates';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, profileData = {} } = body;

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

    // Sanitize string helpers
    const sanitizeStr = (val: any, maxLen = 150): string => {
      if (typeof val !== 'string') return '';
      return val.trim().slice(0, maxLen);
    };

    const adminClient = getSupabaseAdmin();

    // 1. Create user in Supabase Auth via admin auth API (auto-confirms email!)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
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

    // Map ARMember field names to profiles columns
    const firstName = sanitizeStr(profileData.text_6lo7p, 100);
    const lastName = sanitizeStr(profileData.text_uuxfr, 100);
    const fullName = `${firstName} ${lastName}`.trim() || 'User';

    // 3. Insert or update profile in profiles table via admin client
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .upsert({
        auth_id: authData.user.id,
        email: sanitizeStr(email, 254),
        full_name: fullName,
        username: sanitizeStr(profileData.user_login || email.split('@')[0] + Math.floor(Math.random() * 1000), 50),
        first_name: firstName,
        last_name: lastName,
        posted_by: sanitizeStr(profileData.select_y9qog, 50),
        phone: sanitizeStr(profileData.text_vlenr, 20), // Mobile Number
        gender: sanitizeStr(profileData.gender, 20),
        dob: sanitizeStr(profileData.date_ucelp, 20), // DOB
        marital_status: sanitizeStr(profileData.radio_6yahf, 50), // Marital Status
        height: sanitizeStr(profileData.select_vbkvr, 20), // Height
        weight: sanitizeStr(profileData.text_ckkxj, 20), // Weight
        body_type: sanitizeStr(profileData.radio_cm5s8, 50),
        skin_tone: sanitizeStr(profileData.radio_5pnjy, 50),
        disability: sanitizeStr(profileData.radio_w3rke, 50),
        blood_group: sanitizeStr(profileData.select_lehdo, 20),
        eating_habits: sanitizeStr(
          Array.isArray(profileData.checkbox_rjekv)
            ? profileData.checkbox_rjekv.join(', ')
            : profileData.checkbox_rjekv,
          150
        ),
        drinking_habits: sanitizeStr(profileData.select_rv5zv, 50),
        smoking_habits: sanitizeStr(profileData.select_z7uro, 50),
        birth_time: sanitizeStr(profileData.birth_time, 20),
        birth_place: sanitizeStr(profileData.text_pivyw, 100),
        rashi: sanitizeStr(profileData.select_jeakk, 50), // Raashi
        nakshatra: sanitizeStr(profileData.select_vjmu2, 50), // Nakshathra
        gana: sanitizeStr(profileData.select_qeo3m, 50),
        dosham: sanitizeStr(profileData.radio_so79q, 20),
        education: sanitizeStr(profileData.select_3fxzr, 100), // Highest Education
        education_field: sanitizeStr(profileData.select_xtyxy, 100),
        college: sanitizeStr(profileData.text_b1gvp, 100),
        working_with: sanitizeStr(profileData.select_giore, 100),
        occupation: sanitizeStr(profileData.select_yr1hd, 100), // Working As / Occupation
        organization: sanitizeStr(profileData.text_w7iyw, 100),
        city: sanitizeStr(profileData.text_3a4em, 100), // Work Location mapped to city
        work_location: sanitizeStr(profileData.text_3a4em, 100),
        annual_income: sanitizeStr(profileData.select_3iunu, 50),
        family_value: sanitizeStr(profileData.radio_xdzu9, 50),
        family_type: sanitizeStr(profileData.radio_tyzfs, 50),
        family_status: sanitizeStr(profileData.radio_4pzno, 50),
        father_name: sanitizeStr(profileData.text_4obie, 100),
        father_status: sanitizeStr(profileData.select_tmkwh, 100),
        mother_name: sanitizeStr(profileData.text_fxamj, 100),
        mother_status: sanitizeStr(profileData.select_3dm9u, 100),
        brothers: sanitizeStr(profileData.text_yaxmk, 20),
        brothers_married: sanitizeStr(profileData.text_qswpw, 20),
        sisters: sanitizeStr(profileData.text_pqeee, 20),
        sisters_married: sanitizeStr(profileData.text_3qceb, 20),
        family_location: sanitizeStr(profileData.text_wjnit, 100),
        guardian_phone: sanitizeStr(profileData.text_t6hil, 50),
        family_origin: sanitizeStr(profileData.text_fqhn4, 100),
        bio: sanitizeStr(profileData.textarea_d8efs, 1000), // About Me
        profile_photo: sanitizeStr(profileData.profile_photo || '', 300),
        status: initialStatus,
        role: 'user',
        admin_reviewed: autoApprove,

        // Payment fields mapping
        payment_status: sanitizeStr(profileData.payment_status || 'pending_verification', 30),
        payment_utr: sanitizeStr(profileData.payment_utr, 12),
        payment_screenshot: sanitizeStr(profileData.payment_screenshot || '', 300),
        payment_amount: Number(profileData.payment_amount) || 1000,
        payment_date: new Date().toISOString(),
      }, { onConflict: 'auth_id' })
      .select()
      .single();

    if (profileError) {
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    // Dispatch welcome email (non-blocking)
    try {
      const originUrl = request.headers.get('origin') || 'https://maduvedibbana.com';
      const welcomeHtml = getRegistrationWelcomeHtml(profile.full_name || 'User', originUrl);
      await sendResendEmail(profile.email, 'Welcome to Maduvedibbana Matrimony! Account Registered 💍', welcomeHtml);
    } catch (emailErr) {
      console.error('Failed to dispatch registration welcome email:', emailErr);
    }

    return NextResponse.json({ profile, user: authData.user });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
