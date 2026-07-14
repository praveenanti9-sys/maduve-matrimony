"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Heart, Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Shield, AlertCircle, Ban } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser, isLoading } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState<"" | "blocked" | "suspended" | "invalid" | "pending">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError("");
    setErrorType("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setErrorType("invalid");
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      // Check WHY login failed — blocked, suspended, or wrong credentials
      const store = useStore.getState();
      const storeError = store.error;
      const cu = store.currentUser;
      if (cu && cu.email === email) {
        if (cu.status === "blocked") {
          setError("Your account has been blocked by the administrator. Please contact support for more information.");
          setErrorType("blocked");
          return;
        }
        if (cu.status === "suspended") {
          setError(`Your account has been temporarily suspended. Reason: ${cu.statusReason || "Policy violation"}. Please contact support.`);
          setErrorType("suspended");
          return;
        }
        if (cu.status === "pending") {
          setError("Your account is created. We will verify in 2-4 days. You will receive an update over mail once verified.");
          setErrorType("pending");
          return;
        }
      }
      setError(storeError || "Invalid email or password. Please check your credentials or register first.");
      setErrorType("invalid");
    }
  };

  return (
    <section style={{ minHeight: "calc(100vh - 80px)", display: "flex", alignItems: "center", justifyContent: "center", background: "#EFEBE3", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: "460px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #1e2a44, #2a3673)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Heart style={{ width: "28px", height: "28px", color: "#fff" }} fill="currentColor" />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "30px", fontWeight: 700, color: "#1e2a44", marginBottom: "8px" }}>Welcome Back</h1>
          <p style={{ fontSize: "15px", color: "#5f6368" }}>Login to find your perfect life partner</p>
        </div>

        <div className="card" style={{ padding: "32px 40px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {error && (
              <div style={{
                padding: "16px", borderRadius: "12px", fontSize: "13px", fontWeight: 500,
                display: "flex", alignItems: "flex-start", gap: "12px",
                background: errorType === "blocked" ? "rgba(220,38,38,0.06)" : errorType === "suspended" ? "rgba(245,158,11,0.06)" : "rgba(220,38,38,0.06)",
                color: errorType === "blocked" ? "#dc2626" : errorType === "suspended" ? "#d97706" : "#dc2626",
                border: `1px solid ${errorType === "blocked" ? "rgba(220,38,38,0.2)" : errorType === "suspended" ? "rgba(245,158,11,0.2)" : "rgba(220,38,38,0.2)"}`,
                animation: "fadeIn 0.3s ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", borderRadius: "50%", background: errorType === "blocked" ? "rgba(220,38,38,0.1)" : errorType === "suspended" ? "rgba(245,158,11,0.1)" : "rgba(220,38,38,0.1)", flexShrink: 0 }}>
                  {errorType === "blocked" ? <Ban style={{ width: "14px", height: "14px" }} /> :
                   errorType === "suspended" ? <AlertCircle style={{ width: "14px", height: "14px" }} /> :
                   <AlertCircle style={{ width: "14px", height: "14px" }} />}
                </div>
                <div style={{ flex: 1, lineHeight: 1.6 }}>{error}</div>
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e2a44", marginBottom: "8px" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} className="input" style={{ paddingLeft: "44px" }} placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: 600, color: "#1e2a44" }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: "12px", color: "#005AEE", fontWeight: 500, textDecoration: "none" }}>Forgot Password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="input" style={{ paddingLeft: "44px", paddingRight: "44px" }} placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a0aec0" }}>
                  {showPassword ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%", height: "50px", borderRadius: "12px", opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
              <LogIn style={{ width: "16px", height: "16px" }} />
              <span>{isLoading ? "Logging in..." : "Login"}</span>
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e3e8f0" }} />
            <span style={{ fontSize: "12px", color: "#a0aec0", fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "#e3e8f0" }} />
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#5f6368" }}>
              Don&apos;t have an account?{" "}
              <Link href="/register" style={{ color: "#005AEE", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                Register Free <ArrowRight style={{ width: "14px", height: "14px" }} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
