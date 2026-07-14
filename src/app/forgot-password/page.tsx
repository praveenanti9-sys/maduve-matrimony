"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "done">("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const success = await useStore.getState().resetPassword(email, '');
      if (success) {
        setStep("done");
      } else {
        const storeError = useStore.getState().error;
        setError(storeError || "Failed to send reset email. Please check your email and try again.");
      }
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{ minHeight: "calc(100vh - 80px)", display: "flex", alignItems: "center", justifyContent: "center", background: "#EFEBE3", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: "460px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #1e2a44, #2a3673)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Mail style={{ width: "28px", height: "28px", color: "#fff" }} />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "30px", fontWeight: 700, color: "#1e2a44", marginBottom: "8px" }}>
            {step === "done" ? "Check Your Email!" : "Forgot Password?"}
          </h1>
          <p style={{ fontSize: "15px", color: "#5f6368" }}>
            {step === "done" ? `We've sent a password reset link to ${email}` : "Enter your email to receive a password reset link"}
          </p>
        </div>

        <div className="card" style={{ padding: "32px 40px" }}>
          {error && (
            <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(220,38,38,0.08)", color: "#dc2626", fontSize: "13px", fontWeight: 500, marginBottom: "20px" }}>
              {error}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e2a44", marginBottom: "8px" }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" style={{ paddingLeft: "44px" }} placeholder="Enter your registered email" required />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: "100%", height: "50px", borderRadius: "12px", opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
                <Send style={{ width: "16px", height: "16px" }} />
                <span>{isSubmitting ? "Sending..." : "Send Reset Link"}</span>
              </button>
            </form>
          )}

          {step === "done" && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "rgba(22,163,106,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <CheckCircle2 style={{ width: "36px", height: "36px", color: "#16a34a" }} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1e2a44", marginBottom: "8px" }}>
                Reset Link Sent!
              </h3>
              <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "24px" }}>
                We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox (and spam folder) and click the link to reset your password.
              </p>
              <Link href="/login" className="btn-primary" style={{ display: "inline-flex", borderRadius: "12px", textDecoration: "none" }}>
                <span>Go to Login</span>
              </Link>
            </div>
          )}

          {step !== "done" && (
            <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e3e8f0" }}>
              <Link href="/login" style={{ fontSize: "14px", color: "#5f6368", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <ArrowLeft style={{ width: "14px", height: "14px" }} />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
