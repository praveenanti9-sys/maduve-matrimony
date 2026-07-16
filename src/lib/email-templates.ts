const EMAIL_HEADER = `
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://maduvedibbana.com/wp-content/uploads/2026/04/cropped-Untitled-design-22.png" alt="Maduvedibbana" style="width: 60px; height: auto; margin-bottom: 12px; border-radius: 12px;" />
    <h1 style="font-family: Georgia, serif; color: #1e2a44; margin: 0; font-size: 26px; font-weight: 700;">Maduvedibbana Matrimony</h1>
    <p style="color: #c6a55c; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin: 4px 0 0;">Okkaliga Community</p>
  </div>
`;

const EMAIL_FOOTER = `
  <div style="border-top: 1px solid #f0ece4; padding-top: 20px; margin-top: 30px; text-align: center; color: #718096; font-size: 13px; line-height: 1.6;">
    <p style="margin: 0;">Need assistance? Contact our support team at <br/><a href="mailto:contact@maduvedibbana.com" style="color: #c6a55c; text-decoration: none; font-weight: 600;">contact@maduvedibbana.com</a></p>
    <p style="margin: 12px 0 0;">© ${new Date().getFullYear()} Maduvedibbana Matrimony. All rights reserved.</p>
  </div>
`;

export function getRegistrationWelcomeHtml(name: string, originUrl: string = 'https://maduvedibbana.com') {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #f0ece4; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
      ${EMAIL_HEADER}
      
      <div style="padding: 24px; background-color: #f8fafc; border-radius: 12px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e2a44; font-size: 20px; margin-top: 0; margin-bottom: 16px;">Namaste ${name},</h2>
        <p style="color: #4a5568; font-size: 15px; line-height: 1.7; margin-bottom: 12px;">Welcome to <strong>Maduvedibbana Matrimony</strong>! We are absolutely delighted to have you join our community.</p>
        <p style="color: #4a5568; font-size: 15px; line-height: 1.7; margin-bottom: 12px;">Your registration has been successfully received. To ensure a safe and genuine environment for all brides and grooms, your profile is currently undergoing a standard security and verification review by our administrative team.</p>
        <p style="color: #4a5568; font-size: 15px; line-height: 1.7; margin-bottom: 0;">You will receive another notification the moment your account is activated and approved.</p>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${originUrl}/login" style="background: linear-gradient(135deg, #1e2a44, #2b3c61); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(30,42,68,0.2);">Check Account Status</a>
      </div>
      
      ${EMAIL_FOOTER}
    </div>
  `;
}

export function getAccountActivatedHtml(name: string, originUrl: string = 'https://maduvedibbana.com') {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #f0ece4; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
      ${EMAIL_HEADER}
      
      <div style="padding: 24px; background-color: rgba(56,161,105,0.04); border: 1px solid rgba(56,161,105,0.15); border-radius: 12px; margin-bottom: 24px;">
        <h2 style="color: #276749; font-size: 20px; margin-top: 0; margin-bottom: 16px;">🎉 Profile Approved & Activated!</h2>
        <p style="color: #4a5568; font-size: 15px; line-height: 1.7; margin-bottom: 12px;">Namaste <strong>${name}</strong>,</p>
        <p style="color: #4a5568; font-size: 15px; line-height: 1.7; margin-bottom: 12px;">We are pleased to inform you that your profile on <strong>Maduvedibbana Matrimony</strong> has been verified and activated by our team.</p>
        <p style="color: #4a5568; font-size: 15px; line-height: 1.7; margin-bottom: 0;">Your profile is now live! You can immediately begin exploring verified matches, sending connection interests, and chatting with prospects.</p>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${originUrl}/login" style="background: linear-gradient(135deg, #1e2a44, #2b3c61); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(30,42,68,0.2);">Log In to Your Dashboard</a>
      </div>
      
      ${EMAIL_FOOTER}
    </div>
  `;
}

export function getPasswordResetHtml(resetLink: string) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #f0ece4; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
      ${EMAIL_HEADER}
      
      <div style="padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #1e2a44; font-size: 20px; margin-top: 0; margin-bottom: 16px; text-align: center;">Reset Your Password</h2>
        <p style="color: #4a5568; font-size: 15px; line-height: 1.7; margin-bottom: 12px; text-align: center;">We received a request to reset the password for your Maduvedibbana account. Click the button below to securely choose a new password:</p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="background: linear-gradient(135deg, #1e2a44, #2b3c61); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(30,42,68,0.2);">Reset Password</a>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 24px;">
          <p style="font-size: 13px; color: #718096; line-height: 1.6; word-break: break-all; margin: 0;">If the button above does not work, copy and paste this link into your browser:<br/>
            <a href="${resetLink}" style="color: #c6a55c; text-decoration: none;">${resetLink}</a>
          </p>
        </div>
        
        <p style="font-size: 13px; color: #a0aec0; line-height: 1.6; margin-top: 24px; text-align: center;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      </div>
      
      ${EMAIL_FOOTER}
    </div>
  `;
}
