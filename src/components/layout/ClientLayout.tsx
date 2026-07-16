"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useStore } from "@/store/useStore";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const isDashboard = pathname.startsWith("/dashboard");
  const initializeSession = useStore((s) => s.initializeSession);

  // Catch Supabase Auth Redirects globally
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (hash.includes('type=recovery') && !pathname.includes('forgot-password')) {
      router.push(`/forgot-password${hash}`);
    }
  }, [pathname, router]);

  // Initialize session once at app-level — no need to call in Navbar or dashboard/layout
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  if (isDashboard) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "100vh", background: "#f0ece4", paddingTop: "80px" }}>{children}</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "80px" }}>{children}</main>
      <Footer />
    </>
  );
}
