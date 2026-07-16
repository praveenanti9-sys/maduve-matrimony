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
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // Generate recovery link using Supabase Admin Auth API
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${origin}/forgot-password`
      }
    });

    if (error || !data?.properties?.action_link) {
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

    const resetLink = data.properties.action_link;

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
