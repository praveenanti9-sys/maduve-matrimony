"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, CheckCircle2 } from "lucide-react";


export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, phone })
      });
      
      const result = await response.json();
      
      if (!response.ok || result.error) {
        setSubmitError("Failed to send message. Please try again or email us directly.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: "Phone / WhatsApp", value: "+91 8951872744", href: "tel:+918951872744" },
    { icon: Mail, label: "Email", value: "maduvedibbana@gmail.com", href: "mailto:maduvedibbana@gmail.com" },
    { icon: MapPin, label: "Association", value: "In association with UTTHANA UTTARA KANNADA OKKALU SANGAMA(Reg.), Bengaluru", href: "#" },
    { icon: Clock, label: "Working Hours", value: "Mon – Sat, 10 AM – 6 PM", href: "#" },
  ];

  return (
    <section style={{ minHeight: "calc(100vh - 80px)", background: "#EFEBE3", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="badge" style={{ marginBottom: "16px", display: "inline-block" }}>Get in Touch</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: 700, color: "#1e2a44", marginBottom: "16px" }}>
            Contact Us
          </h1>
          <p style={{ fontSize: "16px", color: "#5f6368", maxWidth: "500px", margin: "0 auto" }}>
            Have questions or need assistance? We&apos;re here to help you on
            your journey to finding the perfect match.
          </p>
          <div className="ornament" style={{ margin: "24px auto 0" }} />
        </div>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: "32px" }}>
          {/* Contact Info Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {contactInfo.map((item, i) => (
              <a key={i} href={item.href} className="card" style={{ padding: "20px", display: "flex", alignItems: "flex-start", gap: "16px", textDecoration: "none", color: "inherit" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(30,42,68,0.08), rgba(198,165,92,0.08))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.icon style={{ width: "20px", height: "20px", color: "#1e2a44" }} />
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#5f6368", fontWeight: 500, marginBottom: "2px" }}>{item.label}</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#1e2a44" }}>{item.value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="card" style={{ padding: "32px" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(56,161,105,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <CheckCircle2 style={{ width: "32px", height: "32px", color: "#38A169" }} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Message Sent!</h3>
                <p style={{ fontSize: "14px", color: "#5f6368" }}>Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setName(""); setEmail(""); setPhone(""); setMessage(""); }} className="btn-outline" style={{ marginTop: "24px", fontSize: "14px" }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(198,165,92,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MessageSquare style={{ width: "20px", height: "20px", color: "#8B6914" }} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1e2a44" }}>Send a Message</h3>
                    <p style={{ fontSize: "12px", color: "#5f6368" }}>We usually respond within a few hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {submitError && (
                    <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(220,38,38,0.08)", color: "#dc2626", fontSize: "13px", fontWeight: 500 }}>
                      {submitError}
                    </div>
                  )}
                  <div className="contact-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Your Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Full name" required />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Contact Number</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="10-digit mobile number" required />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Message</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="input" style={{ minHeight: "120px", resize: "none", height: "auto" }} placeholder="How can we help you?" rows={4} required />
                  </div>
                  <button type="submit" className="btn-primary" style={{ height: "50px", opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
                    <Send style={{ width: "16px", height: "16px" }} /> <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
