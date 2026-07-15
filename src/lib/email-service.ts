import { Resend } from 'resend';
import nodemailer from 'nodemailer';

export async function sendResendEmail(to: string, subject: string, html: string) {
  // Option 1: Direct SMTP via Zoho Mail / Nodemailer if configured
  const smtpUser = process.env.SMTP_USER;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser || smtpHost) {
    try {
      const host = smtpHost || 'smtp.zoho.in';
      const port = Number(process.env.SMTP_PORT) || 465;
      const secure = port === 465 || process.env.SMTP_SECURE === 'true';
      const from = process.env.SMTP_FROM_EMAIL || `Maduvedibbana <${smtpUser || 'contact@maduvedibbana.com'}>`;

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: smtpUser || 'contact@maduvedibbana.com',
          pass: smtpPass || '',
        },
      });

      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      return { success: true, data: info };
    } catch (smtpError) {
      console.error('Exception when sending via Zoho SMTP:', smtpError);
      return { success: false, error: (smtpError as Error).message };
    }
  }

  // Option 2: Fallback to Resend API if SMTP not configured
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('Neither SMTP nor RESEND_API_KEY is set. Email dispatch skipped.');
    return { success: false, error: 'Email service is not configured (missing SMTP or Resend credentials).' };
  }

  try {
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM_EMAIL || 'Maduvedibbana <noreply@maduvedibbana.com>';

    const data = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
    });

    if (data.error) {
      console.error('Resend API returned error:', data.error);
      return { success: false, error: data.error.message || 'Error sending email via Resend' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception when sending Resend email:', error);
    return { success: false, error: (error as Error).message };
  }
}

export const sendEmail = sendResendEmail;

export { getRegistrationWelcomeHtml, getAccountActivatedHtml } from './email-templates';
