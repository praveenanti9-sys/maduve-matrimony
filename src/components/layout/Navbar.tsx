"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Bell } from "lucide-react";
import { useStore } from "@/store/useStore";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  
  const { isLoggedIn, currentUser, logout, initializeSession, messages, interests, profiles } = useStore();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClick = () => {
      setUserMenuOpen(false);
      setNotifMenuOpen(false);
    };
    if (userMenuOpen || notifMenuOpen) {
      setTimeout(() => document.addEventListener("click", handleClick), 0);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [userMenuOpen, notifMenuOpen]);

  // Calculate notifications
  const isMyId = (id: string) => id === 'me' || id === currentUser.id;
  
  const pendingInterests = interests.filter(i => isMyId(i.toId) && i.status === 'pending');
  const unreadMessages = messages.filter(m => isMyId(m.receiverId) && !m.read);
  
  const getSenderName = (senderId: string, type?: string) => {
    if (type === 'system') return '🔔 System';
    if (type === 'admin') return '🛡️ Admin';
    return profiles.find(p => p.id === senderId)?.name || 'Someone';
  };

  const notificationList = [
    ...pendingInterests.map(i => ({
      id: i.id,
      text: `${getSenderName(i.fromId)} sent you an interest!`,
      link: '/dashboard/interests',
      time: i.timestamp,
    })),
    ...unreadMessages.map(m => ({
      id: m.id,
      text: `New message from ${getSenderName(m.senderId, m.senderType)}: "${m.text.length > 30 ? m.text.substring(0, 30) + '...' : m.text}"`,
      link: '/dashboard/messages',
      time: m.timestamp,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const notifCount = notificationList.length;

  const showPublicLinks = !isLoggedIn && !pathname.startsWith('/dashboard');

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: "#fff",
      boxShadow: isScrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "0 1px 3px rgba(0,0,0,0.04)",
      transition: "all 0.3s ease",
      height: "80px",
    }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "100%",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "52px", height: "52px", position: "relative" }}>
            <Image
              src="https://maduvedibbana.com/wp-content/uploads/2026/04/cropped-Untitled-design-22.png"
              alt="Maduvedibbana"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#1e2a44", letterSpacing: "0.5px", lineHeight: 1.2 }}>
              Maduvedibbana
            </span>
            <span style={{ fontSize: "10px", fontWeight: 500, color: "#c6a55c", letterSpacing: "1.5px", textTransform: "uppercase" as const }}>
              Matrimony
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="hidden md:flex">
          {showPublicLinks && (
            <ul style={{ display: "flex", alignItems: "center", gap: "4px", listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { name: "Home", href: "/" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: isActive(link.href) ? "#1e2a44" : "#5f6368",
                      background: isActive(link.href) ? "rgba(30,42,68,0.06)" : "transparent",
                      textDecoration: "none",
                      letterSpacing: "0.3px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "8px 16px", borderRadius: "10px",
                  background: "rgba(30,42,68,0.06)", color: "#1e2a44",
                  fontSize: "14px", fontWeight: 600, textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                className="hidden md:inline-flex"
              >
                <LayoutDashboard style={{ width: "16px", height: "16px" }} />
                Dashboard
              </Link>

              {/* Notification Bell Dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setNotifMenuOpen(!notifMenuOpen); setUserMenuOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "40px", height: "40px", borderRadius: "50%",
                    border: "1px solid #e3e8f0", background: notifMenuOpen ? "rgba(30,42,68,0.04)" : "#fff",
                    cursor: "pointer", transition: "all 0.2s ease", position: "relative",
                  }}
                  title="Notifications"
                >
                  <Bell style={{ width: "18px", height: "18px", color: notifCount > 0 ? "#dc2626" : "#5f6368" }} fill={notifCount > 0 ? "rgba(220,38,38,0.2)" : "none"} />
                  {notifCount > 0 && (
                    <span style={{
                      position: "absolute", top: "-2px", right: "-2px",
                      background: "#dc2626", color: "#fff", fontSize: "10px",
                      fontWeight: 700, borderRadius: "50%", width: "18px", height: "18px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "2px solid #fff", boxShadow: "0 2px 6px rgba(220,38,38,0.3)",
                    }}>
                      {notifCount}
                    </span>
                  )}
                </button>

                {notifMenuOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: "-60px",
                    width: "320px", background: "#fff", borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.12)", border: "1px solid #e3e8f0",
                    overflow: "hidden", zIndex: 100,
                  }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #e3e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>Notifications</span>
                      {notifCount > 0 && (
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "#dc2626", background: "rgba(220,38,38,0.08)", padding: "2px 8px", borderRadius: "999px" }}>
                          {notifCount} New
                        </span>
                      )}
                    </div>
                    <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                      {notificationList.length > 0 ? (
                        notificationList.map((item) => (
                          <Link
                            key={item.id}
                            href={item.link}
                            onClick={() => setNotifMenuOpen(false)}
                            style={{
                              display: "block", padding: "12px 16px",
                              borderBottom: "1px solid #f1f5f9", textDecoration: "none",
                              transition: "background 0.2s", color: "#1e2a44",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fafcff"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            <p style={{ fontSize: "12px", lineHeight: 1.4, margin: 0, fontWeight: 500 }}>
                              {item.text}
                            </p>
                            <span style={{ fontSize: "10px", color: "#a0aec0", marginTop: "4px", display: "block" }}>
                              {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </Link>
                        ))
                      ) : (
                        <div style={{ padding: "32px 16px", textAlign: "center" }}>
                          <Bell style={{ width: "24px", height: "24px", color: "#a0aec0", margin: "0 auto 8px" }} />
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "#1e2a44", margin: 0 }}>All caught up! 🎉</p>
                          <p style={{ fontSize: "11px", color: "#5f6368", marginTop: "2px", margin: 0 }}>No new notifications at this time.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "6px 12px 6px 6px", borderRadius: "50px",
                    border: "1px solid #e3e8f0", background: "#fff",
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}
                >
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "50%",
                    backgroundImage: currentUser.profilePhoto ? `url('${currentUser.profilePhoto}')` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    background: currentUser.profilePhoto ? undefined : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "14px", fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {currentUser.profilePhoto ? null : (currentUser.fullName ? currentUser.fullName[0].toUpperCase() : "U")}
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e2a44", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    className="hidden md:inline"
                  >
                    {currentUser.fullName || "User"}
                  </span>
                  <ChevronDown style={{ width: "14px", height: "14px", color: "#5f6368", transition: "transform 0.2s", transform: userMenuOpen ? "rotate(180deg)" : "rotate(0)" }}
                    className="hidden md:inline"
                  />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    width: "220px", background: "#fff", borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.12)", border: "1px solid #e3e8f0",
                    overflow: "hidden", zIndex: 100,
                  }}>
                    <div style={{ padding: "16px", borderBottom: "1px solid #e3e8f0" }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#1e2a44" }}>{currentUser.fullName || "User"}</p>
                      <p style={{ fontSize: "12px", color: "#5f6368", marginTop: "2px" }}>{currentUser.email}</p>
                      {currentUser.role === 'admin' && (
                        <span style={{ display: "inline-block", marginTop: "6px", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: "rgba(198,165,92,0.12)", color: "#c6a55c" }}>🛡️ Administrator</span>
                      )}
                    </div>
                    <div style={{ padding: "4px" }}>
                      {currentUser.role === 'admin' ? (
                        <Link href="/dashboard/admin" onClick={() => setUserMenuOpen(false)} style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "10px 12px", borderRadius: "8px", fontSize: "14px",
                          fontWeight: 500, color: "#1e2a44", textDecoration: "none",
                          transition: "background 0.2s",
                        }}>
                          <LayoutDashboard style={{ width: "16px", height: "16px", color: "#c6a55c" }} />
                          Admin Panel
                        </Link>
                      ) : (
                        <Link href="/dashboard/profile" onClick={() => setUserMenuOpen(false)} style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "10px 12px", borderRadius: "8px", fontSize: "14px",
                          fontWeight: 500, color: "#1e2a44", textDecoration: "none",
                          transition: "background 0.2s",
                        }}>
                          <User style={{ width: "16px", height: "16px", color: "#5f6368" }} />
                          My Profile
                        </Link>
                      )}
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 12px", borderRadius: "8px", fontSize: "14px",
                        fontWeight: 500, color: "#1e2a44", textDecoration: "none",
                        transition: "background 0.2s",
                      }}>
                        <LayoutDashboard style={{ width: "16px", height: "16px", color: "#5f6368" }} />
                        Dashboard
                      </Link>
                    </div>
                    <div style={{ padding: "4px", borderTop: "1px solid #e3e8f0" }}>
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} style={{
                        display: "flex", alignItems: "center", gap: "10px", width: "100%",
                        padding: "10px 12px", borderRadius: "8px", fontSize: "14px",
                        fontWeight: 500, color: "#dc2626", background: "none",
                        border: "none", cursor: "pointer", transition: "background 0.2s",
                      }}>
                        <LogOut style={{ width: "16px", height: "16px" }} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "10px 20px", borderRadius: "10px",
                border: "1px solid #e3e8f0", background: "#fff",
                color: "#1e2a44", fontSize: "14px", fontWeight: 600,
                textDecoration: "none", transition: "all 0.2s ease",
              }}
              className="hidden md:inline-flex"
              >
                Login
              </Link>
              <Link href="/register" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "10px 20px", borderRadius: "10px",
                background: "linear-gradient(135deg, #1e2a44, #2a3a6a)",
                color: "#fff", fontSize: "14px", fontWeight: 600,
                textDecoration: "none", transition: "all 0.2s ease",
                border: "none",
              }}
              className="hidden md:inline-flex"
              >
                Register Free
              </Link>
            </>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: "8px", color: "#1e2a44", background: "none", border: "none", cursor: "pointer" }}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div style={{
          position: "absolute", top: "80px", left: 0, right: 0,
          background: "#fff", borderTop: "1px solid #e5e7eb",
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          animation: "slideDown 0.2s ease-out",
        }} className="md:hidden">
          <ul style={{ padding: "8px 0", margin: 0, listStyle: "none" }}>
            {showPublicLinks && [
              { name: "Home", href: "/" },
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "block", padding: "14px 24px",
                    fontSize: "15px", fontWeight: 600,
                    color: isActive(link.href) ? "#1e2a44" : "#5f6368",
                    background: isActive(link.href) ? "rgba(30,42,68,0.04)" : "transparent",
                    textDecoration: "none",
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <>
                <li style={{ borderTop: "1px solid #e5e7eb" }}>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "14px 24px", fontSize: "15px", fontWeight: 600,
                    color: "#1e2a44", textDecoration: "none",
                  }}>
                    <LayoutDashboard style={{ width: "18px", height: "18px" }} />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: "10px", width: "100%",
                    padding: "14px 24px", fontSize: "15px", fontWeight: 600,
                    color: "#dc2626", background: "none", border: "none",
                    cursor: "pointer", textAlign: "left",
                  }}>
                    <LogOut style={{ width: "18px", height: "18px" }} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li style={{ padding: "12px 24px", display: "flex", gap: "10px", borderTop: "1px solid #e5e7eb" }}>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{
                  flex: 1, display: "block", textAlign: "center",
                  padding: "12px", borderRadius: "10px", border: "1px solid #e3e8f0",
                  fontSize: "14px", fontWeight: 600, color: "#1e2a44",
                  textDecoration: "none",
                }}>Login</Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} style={{
                  flex: 1, display: "block", textAlign: "center",
                  padding: "12px", borderRadius: "10px",
                  background: "#1e2a44", color: "#fff",
                  fontSize: "14px", fontWeight: 600, textDecoration: "none",
                }}>Register</Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
