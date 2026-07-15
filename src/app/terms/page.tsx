import { Metadata } from "next";
import { Scale, Users, ShieldAlert, Award, FileText, Lock, ShieldAlert as WarningIcon, UserCheck, HelpCircle, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Maduvedibbana — Okkaliga Community Matrimony",
  description: "Read the Terms and Conditions of Maduvedibbana Matrimony. By registering or using the platform, you agree to be legally bound by these terms.",
};

export default function TermsPage() {
  const sections = [
    {
      icon: HelpCircle,
      title: "1. Nature of the Platform",
      content: "Acts solely as an intermediary/facilitator; does not guarantee matches/marriage, does not necessarily conduct full background checks, doesn't certify accuracy of user info, and doesn't endorse any user/profile. Users interact at their own risk.",
    },
    {
      icon: Users,
      title: "2. Eligibility",
      content: "Must be legally competent under Indian law; minimum age 18 (women) / 21 (men); info must be true and complete; registration must be genuinely for matrimonial purposes, not fraudulent/commercial. Platform has absolute discretion on eligibility.",
    },
    {
      icon: FileCheck,
      title: "3. Community-Based Registration",
      content: "May be restricted to specific communities/regions/families; platform has unrestricted discretion to approve/reject; no right to registration or continued access.",
    },
    {
      icon: UserCheck,
      title: "4. Profile Approval & Administrative Rights",
      content: "Absolute rights to approve/reject, request ID proof, suspend/delete profiles, remove content, restrict communication, block users without notice. Admin decisions are final; no obligation to give reasons.",
    },
    {
      icon: Scale,
      title: "5. User Obligations",
      content: "Provide genuine/accurate info; no impersonation; no false/vulgar/obscene/defamatory/illegal content; no misuse of others' info; no harassment/stalking/blackmail; no commercial solicitation; no scraping/reproducing platform data. Users must independently verify all info.",
    },
    {
      icon: FileText,
      title: "6. User Content",
      content: "Users solely responsible for all profile info, photos, communications, documents, messages, uploads. Platform can edit/remove content, reject materials, disable profiles; not liable for user-generated content.",
    },
    {
      icon: Award,
      title: "7. Verification Disclaimer",
      content: "Verification (if done) is limited, not foolproof; users must independently verify identity, background, financial/marital/health status, etc. No guarantee of authenticity or character of any user.",
    },
    {
      icon: WarningIcon,
      title: "8. No Warranty or Guarantee",
      content: "Disclaims all warranties re: successful matchmaking, compatibility, accuracy, character, conduct, financial/medical/educational claims, and uninterrupted/secure service. Use is at user's own risk.",
    },
    {
      icon: ShieldAlert,
      title: "9. Limitation of Liability",
      content: "Not liable for matrimonial disputes, fraud/misrepresentation, emotional distress, failed relationships, financial/reputational loss, cyber incidents, data loss, or indirect/consequential damages. Max liability capped at amount actually paid by the user for services.",
    },
    {
      icon: Lock,
      title: "10. Indemnification",
      content: "Users must indemnify the platform/owners/admins/employees/affiliates against claims, losses, damages, liabilities, penalties, legal proceedings, and fees arising from user conduct, Terms violations, false info, third-party disputes, misuse, or unlawful acts.",
    },
    {
      icon: FileText,
      title: "11. Privacy & Data Usage",
      content: "Subject to Privacy Policy; users consent to data collection/storage/processing, profile display, verification, and communication via phone/email/SMS. Reasonable but not absolute security guaranteed.",
    },
    {
      icon: Scale,
      title: "12. Intellectual Property Rights",
      content: "Website design, logo, branding, database, text, graphics, software, and layout are exclusive property of platform owners; no copying/scraping/reproduction/commercial exploitation without written permission.",
    },
    {
      icon: FileText,
      title: "13. Paid Services, Payments & Refunds",
      content: "If introduced: fees generally non-refundable; pricing can change without notice; access may be suspended for payment disputes/chargebacks; refunds solely at platform's discretion.",
    },
    {
      icon: ShieldAlert,
      title: "14. Termination & Suspension",
      content: "Platform can suspend/terminate any account anytime without notice for false info, complaints, objectionable conduct, Terms violations, or platform interest. No liability created by termination.",
    },
    {
      icon: Users,
      title: "15. Third-Party Interactions",
      content: "Users interact at their own risk; platform not responsible for offline meetings, communications, financial dealings, marriage arrangements, disputes, or criminal acts. Independent caution/due diligence advised.",
    },
    {
      icon: WarningIcon,
      title: "16. Force Majeure",
      content: "Not liable for delays/failures due to technical failures, cyberattacks, server downtime, government restrictions, natural disasters, internet disruptions, power failures, or acts of God.",
    },
    {
      icon: FileText,
      title: "17. Modification of Terms",
      content: "Platform can modify Terms anytime without notice; continued use = acceptance.",
    },
    {
      icon: Scale,
      title: "18. Governing Law & Jurisdiction",
      content: "Governed by Indian law; disputes subject to courts at \"____________________\".",
    },
    {
      icon: FileText,
      title: "19. Contact Information",
      content: "Email: maduvedibbana@gmail.com | Phone: +91 89518 72744 | Website: www.maduvedibbana.com",
    },
  ];

  return (
    <section style={{ minHeight: "calc(100vh - 80px)", background: "#EFEBE3", padding: "40px 20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="badge" style={{ marginBottom: "16px", display: "inline-block" }}>Legal Agreement</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: 700, color: "#1e2a44", marginBottom: "16px" }}>
            Terms & Conditions
          </h1>
          <p style={{ fontSize: "16px", color: "#5f6368", maxWidth: "680px", margin: "0 auto", lineHeight: 1.8 }}>
            Using the platform in any way (browsing, registering, uploading, communicating) means agreeing to be legally bound by these Terms, Privacy Policy, and applicable laws. Disagreement means the user must stop using the platform.
          </p>
          <div className="ornament" style={{ margin: "24px auto 0" }} />
          <p style={{ fontSize: "13px", color: "#a0aec0", marginTop: "16px" }}>
            Effective Date: May 2026
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {sections.map((section, idx) => (
            <div key={idx} className="card" style={{ padding: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
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
              <p style={{ fontSize: "15px", color: "#5f6368", lineHeight: 1.7, margin: 0, paddingLeft: "56px" }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* User Consent Declaration */}
        <div style={{
          marginTop: "32px", padding: "32px", borderRadius: "16px",
          background: "rgba(30,42,68,0.03)", border: "1px solid rgba(30,42,68,0.08)",
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#1e2a44", marginBottom: "12px" }}>
            User Consent Declaration
          </h3>
          <p style={{ fontSize: "14px", color: "#5f6368", lineHeight: 1.7, margin: 0 }}>
            By registering, users declare: info submitted is true; consent to data collection/processing for matrimonial purposes; understand platform only facilitates interaction; will independently verify all profiles/info; agree to comply with Privacy Policy & Terms; understand approval is solely at admin discretion.
          </p>
        </div>

        {/* Footer info details */}
        <div style={{
          textAlign: "center", marginTop: "48px", padding: "32px",
          borderRadius: "16px", background: "rgba(30,42,68,0.04)",
          border: "1px solid rgba(30,42,68,0.08)",
        }}>
          <p style={{ fontSize: "14px", color: "#5f6368", lineHeight: 1.7, fontStyle: "italic", marginBottom: "16px" }}>
            &ldquo;Maduvedibbana Matrimony connects Okkaliga communities through trusted and meaningful relationships.&rdquo;
          </p>
          <p style={{ fontSize: "13px", color: "#5f6368", lineHeight: 1.6, marginBottom: "8px" }}>
            In association with <strong>UTTHANA UTTARA KANNADA OKKALU SANGAMA (Reg.), Bengaluru</strong>.
          </p>
          <p style={{ fontSize: "12px", color: "#a0aec0", marginTop: "16px" }}>
            © 2026 Maduvedibbana Matrimony, designed by Metromindz.
          </p>
        </div>
      </div>
    </section>
  );
}
