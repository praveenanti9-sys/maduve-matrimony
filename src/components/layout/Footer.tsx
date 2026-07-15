import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer style={{ background: "#0b0b0b", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      {/* Main Footer */}
      <div style={{
        maxWidth: "1100px", margin: "0 auto", padding: "60px 20px",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "50px",
      }}>
        {/* Col 1 — Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "10px" }}>
          <Image
            src="https://maduvedibbana.com/wp-content/uploads/2026/04/cropped-Untitled-design-22.png"
            alt="Maduvedibbana"
            width={70}
            height={70}
          />
          <p style={{ fontSize: "13px", color: "#aaa", lineHeight: 1.6 }}>
            Maduvedibbana Matrimony connects Okkaliga communities
            through trusted and meaningful relationships.
          </p>
        </div>

        {/* Col 2 — 2nd Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "10px" }}>
          <Image
            src="https://maduvedibbana.com/wp-content/uploads/2026/04/2nd-logo-maduve-dibbana.webp"
            alt="In Association With"
            width={70}
            height={70}
          />
          <p style={{ fontSize: "13px", color: "#aaa", lineHeight: 1.6 }}>
            In association with UTTHANA UTTARA KANNADA OKKALU SANGAMA(Reg.), Bengaluru
          </p>
        </div>

        {/* Col 3 — Quick Links */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "10px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginTop: "10px", marginBottom: "5px" }}>Quick Links</h4>
          {[
            { name: "Home", href: "/" },
            { name: "About Us", href: "/about" },
            { name: "Register", href: "/register" },
            { name: "Login", href: "/login" },
            { name: "Contact", href: "/contact" },
          ].map((link) => (
            <Link key={link.name} href={link.href} style={{ fontSize: "14px", color: "#aaa", textDecoration: "none", transition: "0.2s" }}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Col 4 — Support */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "10px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginTop: "10px", marginBottom: "5px" }}>Support</h4>
          {[
            { name: "Privacy Policy", href: "/privacy-policy" },
            { name: "Terms & Conditions", href: "/terms" },
            { name: "Forgot Password", href: "/forgot-password" },
            { name: "Contact Support", href: "/contact" },
          ].map((link) => (
            <Link key={link.name} href={link.href} style={{ fontSize: "14px", color: "#aaa", textDecoration: "none", transition: "0.2s" }}>
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: "1100px", margin: "0 auto", padding: "15px 20px",
        borderTop: "1px solid #222", textAlign: "center",
        fontSize: "13px", color: "#777",
      }}>
        © 2026 Maduvedibbana Matrimony. Designed by <strong style={{ fontWeight: 600, color: "#999" }}>Metromindz</strong>
      </div>
    </footer>
  );
}
