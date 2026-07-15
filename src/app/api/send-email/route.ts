import { NextResponse } from 'next/server';
import { verifyServerAuth } from '@/lib/server-auth';
import { sendResendEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const auth = await verifyServerAuth(request, { requireAdmin: true });
    if (!auth.authorized) return auth.errorResponse!;

    const result = await sendResendEmail(to, subject, html);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
