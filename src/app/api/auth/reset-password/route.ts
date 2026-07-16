import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabase } from '@/lib/supabase-service';

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
      return NextResponse.json({ error: error?.message || 'Failed to generate reset link' }, { status: 400 });
    }

    const resetLink = data.properties.action_link;

    // Send custom email using Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.RESEND_FROM_EMAIL || 'Maduvedibbana <onboarding@resend.dev>';

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not set. Falling back to Supabase native password reset email.");
      // Fallback: use Supabase's built-in email delivery for password reset
      const supabase = getSupabase();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/forgot-password`
      });
      if (resetError) {
        return NextResponse.json({ error: resetError.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, fallback: true });
    }

    // Call Resend API directly to send the custom password reset email
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: resendFrom,
        to: email,
        subject: 'Reset Your Password — Maduvedibbana Matrimony 🔑',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0ece4; border-radius: 12px; background-color: #fff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #1e2a44; font-family: Georgia, serif; font-size: 24px; font-weight: 700; margin: 0;">Maduvedibbana Matrimony</h2>
              <p style="color: #c6a55c; font-size: 13px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Okkaliga Community</p>
            </div>
            
            <p style="font-size: 15px; color: #5f6368; line-height: 1.6;">Hello,</p>
            <p style="font-size: 15px; color: #5f6368; line-height: 1.6;">We received a request to reset the password for your Maduvedibbana account. Click the button below to choose a new password:</p>
            
            <div style="text-align: center; margin: 28px 0;">
              <a href="${resetLink}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #1e2a44, #2a3a6a); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(30,42,68,0.15);">Reset Password</a>
            </div>
            
            <p style="font-size: 13px; color: #a0aec0; line-height: 1.6; word-break: break-all;">If the button above does not work, copy and paste the link below into your browser:<br/>
              <a href="${resetLink}" style="color: #c6a55c; text-decoration: none;">${resetLink}</a>
            </p>
            
            <p style="font-size: 14px; color: #5f6368; line-height: 1.6; margin-top: 24px;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            
            <hr style="border: 0; border-top: 1px solid #f0ece4; margin: 24px 0;"/>
            
            <div style="text-align: center;">
              <p style="font-size: 11px; color: #a0aec0; margin: 0;">© ${new Date().getFullYear()} Maduvedibbana Matrimony. All rights reserved.</p>
            </div>
          </div>
        `
      })
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      return NextResponse.json({ error: `Failed to send email: ${errText}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
