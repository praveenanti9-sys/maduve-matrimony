import { Metadata } from "next";
import { Shield, Lock, Eye, Database, Mail, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Maduvedibbana — Okkaliga Community Matrimony",
  description:
    "Read our privacy policy to understand how Maduvedibbana Matrimony collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      items: [
        "Personal details such as name, date of birth, gender, and contact information provided during registration.",
        "Profile information including education, occupation, family details, and photographs uploaded by you.",
        "Religious and community-specific details like gothra, nakshatra, and rashi for matchmaking purposes.",
        "Communication data including messages exchanged between members on the platform.",
        "Technical data such as IP address, browser type, and device information for security and analytics.",
      ],
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      items: [
        "To create and maintain your matrimonial profile on the platform.",
        "To facilitate matchmaking by displaying your profile to other registered members.",
        "To process interest requests, messages, and contact information sharing between matched members.",
        "To communicate important updates, notifications, and platform announcements.",
        "To improve our platform, user experience, and customer service based on usage patterns.",
        "To verify the authenticity of profiles and prevent fraudulent accounts.",
      ],
    },
    {
      icon: Lock,
      title: "Data Protection & Security",
      items: [
        "All personal data is encrypted using industry-standard SSL/TLS encryption during transmission.",
        "Passwords are hashed and never stored in plain text.",
        "Access to personal data is restricted to authorized administrators only.",
        "Regular security audits are conducted to identify and address vulnerabilities.",
        "Contact details (phone number, email) are shared only after mutual interest is accepted by both parties.",
      ],
    },
    {
      icon: Shield,
      title: "Your Rights & Choices",
      items: [
        "You may view, edit, or delete your profile information at any time from your dashboard.",
        "You can control the visibility of your profile through privacy settings.",
        "You may choose to hide your contact details from all users until mutual interest is established.",
        "You have the right to request complete deletion of your account and all associated data.",
        "You can opt-out of promotional emails and notifications through your account settings.",
      ],
    },
    {
      icon: FileText,
      title: "Information Sharing",
      items: [
        "We do not sell, rent, or trade your personal information to any third parties.",
        "Profile information is shared only with registered and verified members of the platform.",
        "We may disclose information if required by law, court order, or government regulation.",
        "Aggregated, non-identifiable data may be used for research and improvement purposes.",
        "In case of a merger or acquisition, user data will be transferred with appropriate safeguards.",
      ],
    },
    {
      icon: Mail,
      title: "Contact & Grievance",
      items: [
        "For any privacy-related concerns, email us at privacy@maduvedibbana.com.",
        "For data deletion requests, contact our support team with your registered email.",
        "Grievance Officer: Utthana Uttara Kannada Okkalu Sangama (Reg.), Bengaluru.",
        "We aim to respond to all privacy-related queries within 48 business hours.",
      ],
    },
  ];

  return (
    <section style={{ minHeight: "calc(100vh - 80px)", background: "#EFEBE3", padding: "40px 20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="badge" style={{ marginBottom: "16px", display: "inline-block" }}>Legal</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: 700, color: "#1e2a44", marginBottom: "16px" }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: "16px", color: "#5f6368", maxWidth: "600px", margin: "0 auto", lineHeight: 1.8 }}>
            Your privacy is important to us. This policy outlines how Maduvedibbana Matrimony
            collects, uses, and protects your personal information.
          </p>
          <div className="ornament" style={{ margin: "24px auto 0" }} />
          <p style={{ fontSize: "13px", color: "#a0aec0", marginTop: "16px" }}>
            Last updated: June 1, 2026
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {sections.map((section, idx) => (
            <div key={idx} className="card" style={{ padding: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "linear-gradient(135deg, rgba(30,42,68,0.08), rgba(198,165,92,0.08))",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <section.icon style={{ width: "22px", height: "22px", color: "#1e2a44" }} />
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, color: "#1e2a44" }}>
                  {section.title}
                </h2>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                {section.items.map((item, i) => (
                  <li key={i} style={{
                    position: "relative", paddingLeft: "20px",
                    fontSize: "14px", color: "#5f6368", lineHeight: 1.7,
                  }}>
                    <span style={{ position: "absolute", left: 0, top: "8px", width: "6px", height: "6px", borderRadius: "50%", background: "#c6a55c" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div style={{
          textAlign: "center", marginTop: "48px", padding: "32px",
          borderRadius: "16px", background: "rgba(30,42,68,0.04)",
          border: "1px solid rgba(30,42,68,0.08)",
        }}>
          <p style={{ fontSize: "14px", color: "#5f6368", lineHeight: 1.7 }}>
            By using Maduvedibbana Matrimony, you agree to this Privacy Policy.
            We may update this policy from time to time, and any changes will be posted on this page.
          </p>
          <p style={{ fontSize: "13px", color: "#a0aec0", marginTop: "12px" }}>
            © 2026 Maduvedibbana Matrimony — Utthana Uttara Kannada Okkalu Sangama (Reg.), Bengaluru
          </p>
        </div>
      </div>
    </section>
  );
}
