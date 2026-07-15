"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, Send, Lock, Eye, EyeOff } from "lucide-react";
import { useStore } from "@/store/useStore";
import { getSupabase } from "@/lib/supabase-service";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset" | "done" | "success">("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Detect if URL hash has access token for recovery
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (hash.includes('access_token=') && (hash.includes('type=recovery') || hash.includes('type=signup'))) {
      setStep("reset");
    }

    // 2. Subscribe to auth state changes to catch PASSWORD_RECOVERY event
    const supabase = getSupabase();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStep("reset");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const success = await useStore.getState().resetPassword(email);
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

  const getPasswordStrength = (): number => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) score++;
    return score;
  };

  const strengthColors = ["#e3e8f0", "#dc2626", "#d97706", "#3b82f6", "#16a34a"];
  const strengthLabels = ["Empty", "Weak", "Fair", "Good", "Strong"];

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setIsSubmitting(false);
      return;
    }

    if (getPasswordStrength() < 3) {
      setError("Password is too weak. Ensure uppercase, number, and special character are included.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: resetError } = await useStore.getState().updatePassword(newPassword);
      if (resetError) {
        setError(resetError || "Failed to update password. Try again.");
      } else {
        setStep("success");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{ minHeight: "calc(100vh - 80px)", display: "flex", alignItems: "center", justifyContent: "center", background: "#EFEBE3", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: "460px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #1e2a44, #2a3673)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            {step === "reset" ? (
              <Lock style={{ width: "28px", height: "28px", color: "#fff" }} />
            ) : (
              <Mail style={{ width: "28px", height: "28px", color: "#fff" }} />
            )}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "30px", fontWeight: 700, color: "#1e2a44", marginBottom: "8px" }}>
            {step === "email" && "Forgot Password?"}
            {step === "done" && "Check Your Email!"}
            {step === "reset" && "Choose New Password"}
            {step === "success" && "Password Updated!"}
          </h1>
          <p style={{ fontSize: "15px", color: "#5f6368" }}>
            {step === "email" && "Enter your email to receive a password reset link"}
            {step === "done" && `We've sent a password reset link to ${email}`}
            {step === "reset" && "Specify a secure new password for your account"}
            {step === "success" && "Your password has been changed successfully"}
          </p>
        </div>

        <div className="card" style={{ padding: "32px 40px" }}>
          {error && (
            <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(220,38,38,0.08)", color: "#dc2626", fontSize: "13px", fontWeight: 500, marginBottom: "20px" }}>
              {error}
            </div>
          )}

          {/* STEP 1: ENTER EMAIL */}
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

          {/* STEP 2: LINK SENT RESPONSE */}
          {step === "done" && (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
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
              <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "24px", lineHeight: 1.5 }}>
                We&apos;ve sent a custom password reset link to <strong>{email}</strong> via email. Please check your inbox and click the button to update your credentials.
              </p>
              <Link href="/login" className="btn-primary" style={{ display: "inline-flex", borderRadius: "12px", textDecoration: "none", width: "100%" }}>
                <span>Go to Login</span>
              </Link>
            </div>
          )}

          {/* STEP 3: RESET PASSWORD FORM */}
          {step === "reset" && (
            <form onSubmit={handleResetSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e2a44", marginBottom: "8px" }}>New Password</label>
                <div style={{ position: "relative" }}>
                  <Lock style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="input" 
                    style={{ paddingLeft: "44px", paddingRight: "44px" }} 
                    placeholder="Enter new password" 
                    required 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a0aec0" }}>
                    {showPassword ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
                  </button>
                </div>
                {newPassword && (
                  <div style={{ marginTop: "8px" }}>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: getPasswordStrength() >= i ? strengthColors[getPasswordStrength()] : "#e3e8f0" }} />
                      ))}
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: strengthColors[getPasswordStrength()] }}>{strengthLabels[getPasswordStrength()]} password</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e2a44", marginBottom: "8px" }}>Confirm New Password</label>
                <div style={{ position: "relative" }}>
                  <Lock style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="input" 
                    style={{ paddingLeft: "44px" }} 
                    placeholder="Confirm new password" 
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", height: "50px", borderRadius: "12px", opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
                <span>{isSubmitting ? "Updating..." : "Update Password"}</span>
              </button>
            </form>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "success" && (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "rgba(22,163,106,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <CheckCircle2 style={{ width: "36px", height: "36px", color: "#16a34a" }} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1e2a44", marginBottom: "8px" }}>
                Success!
              </h3>
              <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "24px", lineHeight: 1.5 }}>
                Your password has been changed. You can now log in using your new credentials.
              </p>
              <Link href="/login" className="btn-primary" style={{ display: "inline-flex", borderRadius: "12px", textDecoration: "none", width: "100%" }}>
                <span>Log In Now</span>
              </Link>
            </div>
          )}

          {step !== "done" && step !== "success" && (
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
