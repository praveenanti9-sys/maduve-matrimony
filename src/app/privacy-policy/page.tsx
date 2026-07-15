import { Metadata } from "next";
import { Shield, Lock, Eye, Database, CheckCircle2, UserCheck, Share2, Info, RefreshCw, Cookie } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Maduvedibbana — Okkaliga Community Matrimony",
  description: "Read the Privacy Policy of Maduvedibbana Matrimony. Learn how we collect, use, verify, and safeguard data on our matrimony platform.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: "1. Information We Collect",
      content: "Name, age, gender, and contact information; community and family background details; location (native place, current residence); educational and professional information; photographs and profile preferences.",
    },
    {
      icon: Eye,
      title: "2. How We Use Your Information",
      content: "To create/manage profiles, match users, improve the platform, send communications/notifications, and ensure authenticity via community-based verification.",
    },
    {
      icon: UserCheck,
      title: "3. Profile Verification & Approval Process",
      content: "All profiles undergo manual approval. Aspirants must belong to the Okkaliga community and be native to or associated with regions such as Bhatkal, Honavar, Kumta, Ankola, Sirsi, Siddapur, Yallapur, Haliyal (second-generation members relocated elsewhere are also eligible). The approving authority verifies details and can reject/remove profiles for false or misleading information.",
    },
    {
      icon: Share2,
      title: "4. Data Sharing & Disclosure",
      content: "No selling/renting of data to third parties; profile info shared only within the platform for matchmaking; disclosure possible if legally required.",
    },
    {
      icon: Lock,
      title: "5. Data Security",
      content: "Measures against unauthorized access, misuse/alteration, and data loss. Users must protect their own login credentials.",
    },
    {
      icon: Shield,
      title: "6. User Responsibility",
      content: "Provide accurate info, don't misuse the platform, respect other users' privacy.",
    },
    {
      icon: Cookie,
      title: "7. Cookies & Tracking",
      content: "Used to enhance experience, track performance, improve service quality.",
    },
    {
      icon: RefreshCw,
      title: "8. Changes to Privacy Policy",
      content: "Maduvedibbana can update the policy; users notified of significant changes.",
    },
    {
      icon: Info,
      title: "9. Contact Us",
      content: "Email: maduvedibbana@gmail.com | Phone: 8951872744",
    },
    {
      icon: CheckCircle2,
      title: "10. Consent",
      content: "Registering implies consent to this policy and the verification process.",
    },
  ];

  return (
    <section style={{ minHeight: "calc(100vh - 80px)", background: "#EFEBE3", padding: "40px 20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="badge" style={{ marginBottom: "16px", display: "inline-block" }}>Legal Document</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: 700, color: "#1e2a44", marginBottom: "16px" }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: "16px", color: "#5f6368", maxWidth: "680px", margin: "0 auto", lineHeight: 1.8 }}>
            Maduvedibbana states it values user trust and explains how it collects, uses, verifies, and safeguards data on its matrimony platform.
          </p>
          <div className="ornament" style={{ margin: "24px auto 0" }} />
          <p style={{ fontSize: "13px", color: "#a0aec0", marginTop: "16px" }}>
            Last updated: May 2026
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

        {/* Bottom Note / Footer details */}
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
