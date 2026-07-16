import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Find your perfect life partner within the Okkaliga community. Trusted matrimony platform by Utthana Uttara Kannada Okkalu Sangama.",
};

export default function Home() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* ═══════════════════════════════════════════════════
          SECTION 1: HERO — Fullscreen slider image
          Live site uses Matrimonyyy.webp as the slider bg
      ═══════════════════════════════════════════════════ */}
      <section style={{ position: "relative", width: "100%", height: "100vh", minHeight: "700px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: "60px", overflow: "hidden" }}>
        <Image
          src="/Matrimonyyy.webp"
          alt="Traditional Indian Wedding"
          fill
          style={{ objectFit: "cover", objectPosition: "top center" }}
          priority
        />

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          {/* Login/Register gold button */}
          <Link href="/login" style={{ display: "inline-block", backgroundColor: "#e2a844", color: "#fff", padding: "8px 24px", borderRadius: "25px", fontSize: "24px", fontWeight: 700, fontFamily: "'Roboto', sans-serif", textDecoration: "none", marginBottom: "8px" }}>
            Login/Register
          </Link>
          
          {/* MADUVEDIBBANA pill */}
          <div style={{ backgroundColor: "#1a3261", color: "#fff", padding: "8px 32px", borderRadius: "30px", fontSize: "32px", fontWeight: 600, fontFamily: "'Poppins', sans-serif", textTransform: "uppercase" as const, letterSpacing: "1px" }}>
            MADUVEDIBBANA
          </div>
          
          {/* MATRIMONY pill */}
          <div style={{ backgroundColor: "#1a3261", color: "#fff", padding: "6px 32px", borderRadius: "30px", fontSize: "28px", fontWeight: 600, fontFamily: "'Poppins', sans-serif", textTransform: "uppercase" as const, letterSpacing: "1px" }}>
            Matrimony
          </div>

          {/* IN ASSOCIATION WITH */}
          <div style={{ backgroundColor: "rgba(12,0,0,0.39)", color: "#fff", padding: "6px 20px", borderRadius: "30px", fontSize: "18px", fontWeight: 600, fontFamily: "'Poppins', sans-serif", textTransform: "uppercase" as const, letterSpacing: "1px", marginTop: "4px" }}>
            In association with
          </div>

          {/* Utthana pill */}
          <div style={{ backgroundColor: "rgba(12,0,0,0.35)", color: "#fff", padding: "6px 20px", borderRadius: "30px", fontSize: "18px", fontWeight: 600, fontFamily: "'Poppins', sans-serif", textTransform: "uppercase" as const, letterSpacing: "1px" }}>
            Utthana Uttara Kannada Okkalu Sangama
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2: A Trusted Platform for the Okkaliga Community
          (shingara-section on the live site)
      ═══════════════════════════════════════════════════ */}
      <section style={{ padding: "100px 20px", background: "#EFEBE3" }}>
        <div className="home-section-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          <div>
            <Image
              src="/madhuve.webp"
              alt="Maduvedibbana Matrimony"
              width={550}
              height={400}
              style={{ width: "100%", height: "auto", borderRadius: "14px" }}
            />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "44px", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.3px", color: "#1e2a44", marginBottom: "12px" }}>
              A Trusted Platform for the Okkaliga Community
            </h2>
            <p style={{ fontSize: "16.5px", lineHeight: 1.9, color: "#5f6368", marginBottom: "12px" }}>
              Maduvedibbana Matrimony is thoughtfully designed to help Okkaliga families
              find meaningful matches rooted in shared values, traditions, and trust.
            </p>
            <ul style={{ marginTop: "15px", padding: 0, listStyle: "none" }}>
              {["Exclusive to Okkaliga Community", "Verified & Genuine Profiles", "Privacy-Focused & Secure Platform", "Simple and Transparent Matchmaking Process"].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", fontSize: "15px", fontWeight: 700, color: "#1e2a44" }}>
                  <CheckCircle2 style={{ width: "22px", height: "22px", color: "#c6a55c", flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3: Built on Tradition & Meaningful Relationships
          (relationship-section on live site)
      ═══════════════════════════════════════════════════ */}
      <section style={{ padding: "100px 20px", background: "#f8fafc" }}>
        <div className="home-section-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "44px", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.3px", color: "#1e2a44", marginBottom: "12px" }}>
              Built on Tradition & Meaningful Relationships
            </h2>
            <p style={{ fontSize: "16.5px", lineHeight: 1.9, color: "#5f6368", marginBottom: "12px" }}>
              Maduvedibbana Matrimony is thoughtfully created to help individuals
              and families within the Okkaliga community find the right life partner.
            </p>
            <p style={{ fontSize: "16.5px", lineHeight: 1.9, color: "#5f6368", marginBottom: "12px" }}>
              We believe marriage is not just between two individuals, but a connection
              of families, values, and traditions that shape a meaningful future.
            </p>
            <p style={{ fontSize: "16.5px", lineHeight: 1.9, color: "#5f6368", marginBottom: "24px" }}>
              Our platform provides a safe, respectful, and trusted space where genuine
              relationships are built with confidence.
            </p>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "13px 26px", borderRadius: "50px", backgroundColor: "#1e2a44", color: "#fff", fontSize: "14px", fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.5)", transition: "0.3s" }}>
              Contact Us <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", fontSize: "12px" }}>→</span>
            </Link>
          </div>
          <div>
            <Image
              src="/matrimonyyyy.webp"
              alt="Built on Tradition"
              width={550}
              height={700}
              style={{ width: "100%", height: "auto", borderRadius: "14px" }}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4: Maduvedibbana (Gold background)
      ═══════════════════════════════════════════════════ */}
      <section style={{ padding: "100px 20px", background: "#f7f2e8" }}>
        <div className="home-section-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          <div>
            <Image
              src="/matrimonny.webp"
              alt="Maduvedibbana"
              width={550}
              height={700}
              style={{ width: "100%", height: "auto", borderRadius: "14px" }}
            />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "44px", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.3px", color: "#1e2a44", marginBottom: "12px" }}>
              Maduvedibbana
            </h2>
            <p style={{ fontSize: "16.5px", lineHeight: 1.9, color: "#5f6368", marginBottom: "12px" }}>
              <strong style={{ color: "#1e2a44" }}>In association with UTTHANA UTTARA KANNADA OKKALU SANGAMA(Reg.), Bengaluru</strong>
            </p>
            <p style={{ fontSize: "16.5px", lineHeight: 1.9, color: "#5f6368", marginBottom: "12px" }}>
              Maduvedibbana is established to bring together members of the community
              and strengthen cultural values, traditions, and relationships through meaningful
              matrimonial connections.
            </p>
            <p style={{ fontSize: "16.5px", lineHeight: 1.9, color: "#5f6368", marginBottom: "12px" }}>
              The initiative aims to create a trusted platform where families can connect
              with confidence and shared values.
            </p>
            <p style={{ fontSize: "16.5px", lineHeight: 1.9, color: "#1e2a44", fontWeight: 600 }}>
              &ldquo;For the union of cultured families – MaduveDibbana&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 5: Our Objectives (White background)
      ═══════════════════════════════════════════════════ */}
      <section style={{ padding: "100px 20px", background: "#ffffff" }}>
        <div className="home-section-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "44px", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.3px", color: "#1e2a44", marginBottom: "12px" }}>
              Our Objectives
            </h2>
            <p style={{ fontSize: "16.5px", lineHeight: 1.9, color: "#5f6368", marginBottom: "12px" }}>
              Our primary goal is to simplify the process of finding a suitable life partner
              within the community while promoting strong cultural values and relationships.
            </p>
            <ul style={{ marginTop: "15px", padding: 0, listStyle: "none" }}>
              {["Connecting Okkaliga families across regions", "Providing verified and trustworthy bride & groom profiles", "Offering guidance from elders and experienced members"].map((item, i) => (
                <li key={i} style={{ position: "relative", paddingLeft: "22px", fontSize: "15px", color: "#5f6368", marginBottom: "10px" }}>
                  <span style={{ position: "absolute", left: 0, color: "#c6a55c" }}>●</span>
                  {item}
                </li>
              ))}
            </ul>
            <h4 style={{ fontSize: "16px", color: "#1e2a44", fontWeight: 600, marginTop: "20px", marginBottom: "8px" }}>
              Platform Features
            </h4>
            <ul style={{ marginTop: "15px", padding: 0, listStyle: "none" }}>
              {["Trusted platform under Uttara Kannada Sangama", "High priority for privacy and data protection", "Simple and transparent matchmaking process", "Strong community support and guidance"].map((item, i) => (
                <li key={i} style={{ position: "relative", paddingLeft: "22px", fontSize: "15px", color: "#5f6368", marginBottom: "10px" }}>
                  <span style={{ position: "absolute", left: 0, color: "#c6a55c" }}>●</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Image
              src="/Jai-Lord-Sri-Venkateshwara.webp"
              alt="Our Objectives"
              width={550}
              height={700}
              style={{ width: "100%", height: "auto", borderRadius: "14px" }}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6: Join the Community (Dark Navy CTA)
      ═══════════════════════════════════════════════════ */}
      <section style={{ padding: "100px 20px", background: "#1e2a44", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "44px", fontWeight: 600, lineHeight: 1.25, color: "#ffffff", marginBottom: "12px" }}>
            Join the Community
          </h2>
          <p style={{ fontSize: "16.5px", lineHeight: 1.9, color: "rgba(255,255,255,0.85)", marginBottom: "12px" }}>
            Become part of a trusted platform designed to connect families
            and build meaningful relationships within the community.
          </p>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginTop: "35px", padding: "13px 26px", borderRadius: "50px", border: "1px solid rgba(255,255,255,0.5)", color: "#fff", fontSize: "14px", textDecoration: "none" }}>
            Register Now <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", fontSize: "12px" }}>→</span>
          </Link>
          <p style={{ marginTop: "20px", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
            Start your journey towards a meaningful relationship today.
          </p>
        </div>
      </section>
    </div>
  );
}
