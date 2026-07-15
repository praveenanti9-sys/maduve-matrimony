export function getRegistrationWelcomeHtml(name: string, originUrl: string = 'https://maduvedibbana.com') {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="font-family: serif; color: #1e2a44; margin: 0; font-size: 24px;">Maduvedibbana Matrimony</h1>
        <p style="color: #c6a55c; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; margin: 4px 0 0;">Trusted Okkaliga Matchmaking</p>
      </div>
      <div style="padding: 20px; background-color: #f8fafc; border-radius: 12px; margin-bottom: 24px;">
        <h2 style="color: #1e2a44; font-size: 18px; margin-top: 0;">Namaste ${name},</h2>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">Welcome to <strong>Maduvedibbana Matrimony</strong>! We are delighted to have you join our community.</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">Your registration has been successfully received and is currently undergoing security and verification review by our administrative team. This ensures a safe, genuine environment for all brides and grooms.</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">You will receive another notification once your account is activated and approved.</p>
      </div>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${originUrl}/login" style="background: linear-gradient(135deg, #1e2a44, #2b3c61); color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Check Account Status</a>
      </div>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; color: #64748b; font-size: 12px;">
        <p style="margin: 0;">Need assistance? Contact our support helpdesk at <a href="mailto:maduvedibbana@gmail.com" style="color: #1e2a44;">maduvedibbana@gmail.com</a></p>
        <p style="margin: 6px 0 0;">© 2026 Maduvedibbana Matrimony. All rights reserved.</p>
      </div>
    </div>
  `;
}

export function getAccountActivatedHtml(name: string, originUrl: string = 'https://maduvedibbana.com') {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="font-family: serif; color: #1e2a44; margin: 0; font-size: 24px;">Maduvedibbana Matrimony</h1>
        <p style="color: #c6a55c; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; margin: 4px 0 0;">Trusted Okkaliga Matchmaking</p>
      </div>
      <div style="padding: 20px; background-color: rgba(56,161,105,0.06); border: 1px solid rgba(56,161,105,0.2); border-radius: 12px; margin-bottom: 24px;">
        <h2 style="color: #276749; font-size: 18px; margin-top: 0;">🎉 Profile Approved & Activated!</h2>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">Namaste <strong>${name}</strong>,</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">We are pleased to inform you that your profile on <strong>Maduvedibbana Matrimony</strong> has been verified and activated by our team.</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">Your profile is now live! You can now explore verified matches, send connection interests, and chat directly.</p>
      </div>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${originUrl}/login" style="background: linear-gradient(135deg, #1e2a44, #2b3c61); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(30,42,68,0.2);">Log In to Your Dashboard</a>
      </div>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; color: #64748b; font-size: 12px;">
        <p style="margin: 0;">Need assistance? Contact our support helpdesk at <a href="mailto:maduvedibbana@gmail.com" style="color: #1e2a44;">maduvedibbana@gmail.com</a></p>
        <p style="margin: 6px 0 0;">© 2026 Maduvedibbana Matrimony. All rights reserved.</p>
      </div>
    </div>
  `;
}
