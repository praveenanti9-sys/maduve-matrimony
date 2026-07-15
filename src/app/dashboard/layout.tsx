"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  LayoutDashboard, User, Search, Heart, MessageCircle,
  Settings, LogOut, ChevronRight, Shield, Loader2,
} from "lucide-react";

const userLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/dashboard/profile", icon: User },
  { label: "Browse Matches", href: "/dashboard/browse", icon: Search },
  { label: "Interests", href: "/dashboard/interests", icon: Heart },
  { label: "Messages", href: "/dashboard/messages", icon: MessageCircle },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Admin Panel", href: "/dashboard/admin", icon: Shield },
  { label: "Browse Profiles", href: "/dashboard/browse", icon: Search },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, currentUser, initializeSession, isLoggedIn, isLoading } = useStore();
  const [sessionChecked, setSessionChecked] = useState(false);

  // Initialize session on load
  useEffect(() => {
    const init = async () => {
      await initializeSession();
      setSessionChecked(true);
    };
    init();
  }, [initializeSession]);

  // Protect route: redirect to login if session resolves to not logged in
  useEffect(() => {
    if (sessionChecked && !isLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [sessionChecked, isLoading, isLoggedIn, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isAdmin = currentUser.role === 'admin';
  const allLinks = isAdmin ? adminLinks : userLinks;

  // Show a premium loading screen while verifying auth to prevent content flash/leak
  if (isLoading || !isLoggedIn || !sessionChecked) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "#f0ece4", gap: "16px",
        fontFamily: "'Inter', sans-serif"
      }}>
        <Loader2 style={{ width: "40px", height: "40px", color: "#c6a55c", animation: "spin 1s linear infinite" }} />
        <p style={{ fontSize: "14px", color: "#1e2a44", fontWeight: 500 }}>Securing session...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 80px)", background: "#f0ece4", display: "flex" }}>
      {/* Desktop Sidebar */}
      <aside style={{
        display: "none",
        width: "260px",
        background: "#fff",
        borderRight: "1px solid #e3e8f0",
        position: "sticky",
        top: "80px",
        height: "calc(100vh - 80px)",
        flexDirection: "column",
        flexShrink: 0,
        zIndex: 30,
      }} className="lg:!flex">
        <div style={{ flex: 1, padding: "24px 16px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {/* User Mini Profile */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "16px", marginBottom: "12px",
            background: isAdmin
              ? "linear-gradient(135deg, rgba(198,165,92,0.1), rgba(198,165,92,0.04))"
              : "linear-gradient(135deg, rgba(30,42,68,0.04), rgba(198,165,92,0.06))",
            borderRadius: "12px",
            border: isAdmin ? "1px solid rgba(198,165,92,0.15)" : "1px solid transparent",
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              backgroundImage: (!isAdmin && currentUser.profilePhoto) ? `url('${currentUser.profilePhoto}')` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              background: (!isAdmin && currentUser.profilePhoto) ? undefined : (isAdmin ? "linear-gradient(135deg, #c6a55c, #d4b36a)" : "linear-gradient(135deg, #1e2a44, #c6a55c)"),
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "16px", fontWeight: 700, flexShrink: 0,
            }}>
              {(!isAdmin && currentUser.profilePhoto) ? null : (isAdmin ? "🛡️" : (currentUser.fullName ? currentUser.fullName[0].toUpperCase() : "U"))}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e2a44", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {isAdmin ? "Super Admin" : (currentUser.fullName || "User")}
              </div>
              <div style={{ fontSize: "11px", color: isAdmin ? "#c6a55c" : "#5f6368", fontWeight: isAdmin ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {isAdmin ? "Administrator" : (currentUser.email || "Complete your profile")}
              </div>
            </div>
          </div>

          {isAdmin && (
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#a0aec0", textTransform: "uppercase" as const, letterSpacing: "1px", padding: "4px 16px 8px", marginTop: "4px" }}>
              ADMIN MENU
            </div>
          )}

          {allLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            const isAdminLink = link.href === "/dashboard/admin";
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  color: isAdminLink ? (isActive ? "#c6a55c" : "#c6a55c") : (isActive ? "#1e2a44" : "#5f6368"),
                  background: isActive ? (isAdminLink ? "rgba(198,165,92,0.08)" : "rgba(30,42,68,0.06)") : "transparent",
                  borderLeft: isActive ? `3px solid ${isAdminLink ? "#c6a55c" : "#1e2a44"}` : "3px solid transparent",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                <link.icon style={{ width: "20px", height: "20px", flexShrink: 0 }} />
                {link.label}
                {isActive && <ChevronRight style={{ width: "16px", height: "16px", marginLeft: "auto" }} />}
              </Link>
            );
          })}
        </div>
        <div style={{ padding: "16px", borderTop: "1px solid #e3e8f0" }}>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "12px 16px", borderRadius: "12px", fontSize: "14px",
            fontWeight: 500, color: "#dc2626", background: "none",
            border: "none", cursor: "pointer", width: "100%",
            transition: "all 0.2s",
          }}>
            <LogOut style={{ width: "20px", height: "20px" }} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: "1px solid #e3e8f0",
        zIndex: 40, display: "flex", alignItems: "center",
        justifyContent: "space-around", padding: "8px 8px max(8px, env(safe-area-inset-bottom)) 8px",
      }} className="lg:!hidden">
        {allLinks.slice(0, 5).map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "2px", padding: "6px 12px", borderRadius: "12px",
                fontSize: "10px", fontWeight: 500,
                color: isActive ? "#1e2a44" : "#5f6368",
                textDecoration: "none",
              }}
            >
              <link.icon style={{ width: "20px", height: "20px" }} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, minHeight: "calc(100vh - 80px)", paddingBottom: "24px" }} className="dashboard-main-content">
        <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }} className="responsive-pad">
          {children}
        </div>
      </main>
    </div>
  );
}
