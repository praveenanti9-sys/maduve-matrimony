import { NextResponse } from 'next/server';
import { submitContactInquiry } from '@/lib/supabase-service';
import { sendEmail } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    const { name, email, message, phone } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // 1. Save to Database
    const dbResult = await submitContactInquiry(name, email, message, phone);
    if (dbResult.error) {
      console.error("Error saving contact inquiry to DB:", dbResult.error);
      return NextResponse.json({ error: 'Failed to save inquiry to database' }, { status: 500 });
    }

    // 2. Send Email Notification to Admin
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'contact@maduvedibbana.com';
    const emailSubject = `New Contact Inquiry from ${name} - Maduvedibbana Matrimony`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0ece4; border-radius: 12px; background-color: #fff;">
        <h2 style="color: #1e2a44; font-family: Georgia, serif; font-size: 20px; border-bottom: 1px solid #f0ece4; padding-bottom: 12px;">New Contact Inquiry</h2>
        
        <div style="margin: 20px 0;">
          <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p style="margin: 8px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; border-left: 4px solid #c6a55c; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #5f6368; font-size: 14px; text-transform: uppercase;">Message:</h4>
          <p style="white-space: pre-wrap; color: #1e2a44; line-height: 1.5; margin-bottom: 0;">${message}</p>
        </div>
        
        <p style="font-size: 13px; color: #a0aec0; margin-top: 24px;">This message was submitted via the Maduvedibbana Contact Form.</p>
      </div>
    `;

    const emailResult = await sendEmail(adminEmail, emailSubject, emailHtml);
    
    if (!emailResult.success) {
      console.error("Failed to send contact inquiry email:", emailResult.error);
      // We still return success to the user since the DB insert succeeded
      return NextResponse.json({ success: true, emailSent: false });
    }

    return NextResponse.json({ success: true, emailSent: true });
  } catch (error) {
    console.error("Error in contact API:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
