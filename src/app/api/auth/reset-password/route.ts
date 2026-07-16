import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabase } from '@/lib/supabase-service';
import { sendEmail } from '@/lib/email-service';
import { getPasswordResetHtml } from '@/lib/email-templates';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    // Vercel deployment origin or fallback
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://maduvedibbana.com';

    // Generate recovery link using Supabase Admin Auth API
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${origin}/forgot-password`
      }
    });

    if (error || !data?.properties?.hashed_token) {
      // If admin link generation fails, fall back to Supabase native email
      console.warn("Admin generateLink failed, falling back to Supabase native reset:", error?.message);
      const supabase = getSupabase();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/forgot-password`
      });
      if (resetError) {
        return NextResponse.json({ error: resetError.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, method: 'supabase-native' });
    }

    // Bypass Supabase redirect logic entirely by sending the user directly to our page with the token_hash
    const tokenHash = data.properties.hashed_token;
    const resetLink = `${origin}/forgot-password?token_hash=${tokenHash}`;

    // Build the branded email HTML
    const emailHtml = getPasswordResetHtml(resetLink);

    // Send via shared email service (Zoho SMTP → Resend → error)
    const result = await sendEmail(
      email,
      'Reset Your Password — Maduvedibbana Matrimony 🔑',
      emailHtml
    );

    if (!result.success) {
      // Final fallback: use Supabase's built-in email delivery
      console.warn("Custom email delivery failed, falling back to Supabase native:", result.error);
      const supabase = getSupabase();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/forgot-password`
      });
      if (resetError) {
        return NextResponse.json({ error: resetError.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, method: 'supabase-fallback' });
    }

    return NextResponse.json({ success: true, method: 'custom-email' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
