import { Metadata } from "next";
import { FileText, Users, AlertTriangle, Scale, Heart, Ban } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Maduvedibbana — Okkaliga Community Matrimony",
  description:
    "Read the terms and conditions for using Maduvedibbana Matrimony, the trusted matrimonial platform for the Okkaliga community.",
};

export default function TermsPage() {
  const sections = [
    {
      icon: Users,
      title: "Eligibility & Registration",
      items: [
        "You must be at least 18 years of age (21 for male members) to register on Maduvedibbana Matrimony.",
        "Registration is exclusively available to members of the Okkaliga community.",
        "You must provide accurate and truthful information during registration. Providing false information may result in account suspension.",
        "One person may create only one profile. Duplicate accounts will be removed.",
        "All profiles are subject to admin review and approval before they become visible to other members.",
        "You are responsible for maintaining the confidentiality of your login credentials.",
      ],
    },
    {
      icon: Heart,
      title: "Profile & Matchmaking",
      items: [
        "Profile information you submit will be displayed to other verified members for matchmaking purposes.",
        "Photographs uploaded must be recent and clearly identifiable. Misleading or inappropriate photos will be removed.",
        "Contact details (phone number, email) are shared only after mutual interest acceptance or as per your privacy settings.",
        "We do not guarantee the accuracy of information provided by other members. We encourage families to independently verify details.",
        "Maduvedibbana acts as a platform facilitator and does not participate in or guarantee the outcome of any marriage discussions.",
      ],
    },
    {
      icon: Ban,
      title: "Prohibited Conduct",
      items: [
        "Using the platform for any purpose other than genuine matrimonial matchmaking.",
        "Harassing, threatening, or abusing other members through messages or any other means.",
        "Sharing explicit, offensive, or inappropriate content on the platform.",
        "Impersonating another person or creating fake profiles.",
        "Collecting or harvesting personal information of other members for commercial or unauthorized purposes.",
        "Attempting to circumvent platform security measures or access admin features without authorization.",
        "Using automated bots, scrapers, or similar tools to access the platform.",
      ],
    },
    {
      icon: Scale,
      title: "Rights & Responsibilities",
      items: [
        "Maduvedibbana reserves the right to suspend, disable, or delete any account that violates these terms.",
        "We may modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.",
        "All content, design, and intellectual property on the platform belongs to Maduvedibbana and Utthana Uttara Kannada Okkalu Sangama.",
        "Members retain ownership of their personal photos and information, granting us a license to display them on the platform.",
        "We are not liable for any disputes, disagreements, or issues arising between members outside the platform.",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Limitation of Liability",
      items: [
        "Maduvedibbana is provided \"as is\" without warranties of any kind, express or implied.",
        "We do not guarantee uninterrupted or error-free service and may perform maintenance as needed.",
        "We are not responsible for any loss, damage, or inconvenience caused by reliance on information provided by other members.",
        "Our total liability shall not exceed the amount paid by you for platform services, if any.",
        "We strongly recommend that families conduct their own due diligence before proceeding with marriage discussions.",
      ],
    },
    {
      icon: FileText,
      title: "Account Termination & Data",
      items: [
        "You may delete your account at any time from the Settings page of your dashboard.",
        "Upon account deletion, your profile will be removed from search results immediately.",
        "Personal data will be permanently deleted within 30 days of account deletion request.",
        "We may retain anonymized, non-identifiable data for analytics and improvement purposes.",
        "Maduvedibbana reserves the right to terminate accounts that remain inactive for more than 12 months.",
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
            Terms & Conditions
          </h1>
          <p style={{ fontSize: "16px", color: "#5f6368", maxWidth: "600px", margin: "0 auto", lineHeight: 1.8 }}>
            Please read these terms carefully before using Maduvedibbana Matrimony.
            By registering, you agree to be bound by these terms.
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
              <ol style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", counterReset: "item" }}>
                {section.items.map((item, i) => (
                  <li key={i} style={{
                    position: "relative", paddingLeft: "28px",
                    fontSize: "14px", color: "#5f6368", lineHeight: 1.7,
                  }}>
                    <span style={{
                      position: "absolute", left: 0, top: "2px",
                      width: "20px", height: "20px", borderRadius: "50%",
                      background: "rgba(198,165,92,0.15)", color: "#8B6914",
                      fontSize: "10px", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Governing Law */}
        <div style={{
          marginTop: "32px", padding: "32px", borderRadius: "16px",
          background: "rgba(30,42,68,0.03)", border: "1px solid rgba(30,42,68,0.08)",
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#1e2a44", marginBottom: "12px" }}>
            Governing Law & Jurisdiction
          </h3>
          <p style={{ fontSize: "14px", color: "#5f6368", lineHeight: 1.7 }}>
            These terms shall be governed by and construed in accordance with the laws of India.
            Any disputes arising out of or in connection with these terms shall be subject to
            the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
          </p>
        </div>

        {/* Bottom Note */}
        <div style={{ textAlign: "center", marginTop: "32px", padding: "24px" }}>
          <p style={{ fontSize: "14px", color: "#5f6368", lineHeight: 1.7 }}>
            For any questions about these terms, please contact us at{" "}
            <strong style={{ color: "#1e2a44" }}>legal@maduvedibbana.com</strong>
          </p>
          <p style={{ fontSize: "13px", color: "#a0aec0", marginTop: "12px" }}>
            © 2026 Maduvedibbana Matrimony — Utthana Uttara Kannada Okkalu Sangama (Reg.), Bengaluru
          </p>
        </div>
      </div>
    </section>
  );
}
