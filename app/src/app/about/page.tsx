import { Metadata } from "next";
import { Shield, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Maduvedibbana — Okkaliga Community Matrimony",
  description:
    "Learn about Maduvedibbana, a trusted matrimony platform by Utthana Uttara Kannada Okkalu Sangama for the Okkaliga community.",
};

export default function AboutPage() {
  const values = [
    { title: "Trust & Transparency", desc: "Every profile is manually verified by our admin team before being made visible to other members." },
    { title: "Community Values", desc: "We respect and preserve the rich traditions and customs of the Okkaliga community while embracing modern matchmaking." },
    { title: "Privacy & Security", desc: "Contact details are shared only after mutual interest. Your data is encrypted and never sold to third parties." },
    { title: "Dedicated Support", desc: "Our team is available to guide families through every step — from registration to marriage." },
  ];

  return (
    <section style={{ minHeight: "calc(100vh - 80px)", background: "#EFEBE3", padding: "40px 20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <span className="badge" style={{ marginBottom: "16px", display: "inline-block" }}>About Us</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: 700, color: "#1e2a44", marginBottom: "16px" }}>
            Our Story
          </h1>
          <p style={{ fontSize: "16px", color: "#5f6368", maxWidth: "640px", margin: "0 auto", lineHeight: 1.8 }}>
            Maduvedibbana is an initiative by{" "}
            <strong style={{ color: "#1e2a44" }}>Utthana Uttara Kannada Okkalu Sangama (Reg.), Bengaluru</strong>{" "}
            — a trusted community organization dedicated to the welfare of
            Okkaliga families across Karnataka and beyond.
          </p>
          <div className="ornament" style={{ margin: "24px auto 0" }} />
        </div>

        {/* Mission Card */}
        <div className="card" style={{ padding: "48px", marginBottom: "48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "160px", height: "160px", background: "linear-gradient(to bottom-left, rgba(198,165,92,0.1), transparent)", borderBottomLeftRadius: "100px" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "16px", background: "rgba(30,42,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield style={{ width: "24px", height: "24px", color: "#1e2a44" }} />
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, color: "#1e2a44" }}>
                Our Mission
              </h2>
            </div>
            <p style={{ fontSize: "16px", color: "#5f6368", lineHeight: 1.8 }}>
              To provide a safe, trusted, and modern platform that helps
              Okkaliga families find suitable life partners for their children.
              We bridge tradition with technology — offering verified profiles,
              smart matchmaking, in-app communication, and full admin oversight
              to ensure every member has a respectful and meaningful experience.
            </p>
          </div>
        </div>

        {/* Values */}
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700, color: "#1e2a44", textAlign: "center", marginBottom: "32px" }}>
          What We Stand For
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {values.map((v, i) => (
            <div key={i} className="card" style={{ padding: "24px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <CheckCircle2 style={{ width: "20px", height: "20px", color: "#16a34a", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: "4px", fontSize: "16px", color: "#1e2a44" }}>{v.title}</h3>
                <p style={{ fontSize: "14px", color: "#5f6368", lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
