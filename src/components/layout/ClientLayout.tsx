"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isDashboard = pathname.startsWith("/dashboard");

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
