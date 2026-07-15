"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Bell, Heart } from "lucide-react";
import { useStore } from "@/store/useStore";
import { ADMIN_UUID, SYSTEM_UUID } from "@/lib/supabase-service";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  
  const { isLoggedIn, currentUser, logout, messages, interests, profiles, readNotificationIds, markNotificationAsRead, markAllNotificationsAsRead, markMessagesRead } = useStore();

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
  const isAdmin = currentUser?.role === 'admin';
  const myIds = isAdmin ? [currentUser?.id, 'admin', ADMIN_UUID] : [currentUser?.id];
  const isMyId = (id: string) => myIds.includes(id);

  const pendingInterests = interests.filter(i => isMyId(i.toId) && i.status === 'pending');
  const unreadMessages = messages.filter(m => isMyId(m.receiverId) && !m.read);
  const pendingProfiles = isAdmin ? profiles.filter(p => p.status === 'pending') : [];

  const getSenderName = (senderId: string, type?: string) => {
    if (type === 'system' || senderId === SYSTEM_UUID || senderId === 'system') return '🔔 System';
    if (type === 'admin' || senderId === ADMIN_UUID || senderId === 'admin') return '🛡️ Admin';
    return profiles.find(p => p.id === senderId)?.name || 'Someone';
  };

  const notificationList = [
    ...pendingProfiles.map(p => ({
      id: `profile-${p.id}`,
      senderId: p.id,
      isMessage: false,
      text: `⚠️ New profile pending approval: ${p.name || 'New User'}`,
      link: '/dashboard/admin',
      time: p.joinDate || new Date().toISOString(),
    })),
    ...pendingInterests.map(i => ({
      id: `interest-${i.id}`,
      senderId: i.fromId,
      isMessage: false,
      text: `${getSenderName(i.fromId)} sent you an interest!`,
      link: '/dashboard/interests',
      time: i.timestamp,
    })),
    ...unreadMessages.map(m => ({
      id: `msg-${m.id}`,
      senderId: m.senderId,
      isMessage: true,
      text: `New message from ${getSenderName(m.senderId, m.senderType)}: "${m.text.length > 30 ? m.text.substring(0, 30) + '...' : m.text}"`,
      link: '/dashboard/messages',
      time: m.timestamp,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const unreadNotificationList = notificationList.filter(item => !(readNotificationIds || []).includes(item.id));
  const notifCount = unreadNotificationList.length;

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
        maxWidth: "1280px", margin: "0 auto", padding: "0 20px",
        height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href={isLoggedIn ? "/dashboard" : "/"} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <Image
            src="https://maduvedibbana.com/wp-content/uploads/2026/04/cropped-Untitled-design-22.png"
            alt="Maduvedibbana Logo"
            width={44}
            height={44}
            style={{ borderRadius: "8px", objectFit: "contain" }}
          />
          <div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "20px", fontWeight: 700, color: "#1e2a44",
              letterSpacing: "-0.3px", display: "block", lineHeight: 1.1,
            }}>
              Maduvedibbana
            </span>
            <span style={{
              fontSize: "10px", fontWeight: 600, color: "#c6a55c",
              letterSpacing: "1.5px", textTransform: "uppercase",
            }}>
              Matrimony
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Public) */}
        {showPublicLinks && (
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }} className="hidden md:flex">
            {[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Contact Us", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: "none", fontSize: "14px", fontWeight: isActive(link.href) ? 600 : 500,
                  color: isActive(link.href) ? "#1e2a44" : "#5f6368",
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right Side Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                style={{
                  textDecoration: "none", fontSize: "13px", fontWeight: 600,
                  color: "#1e2a44", padding: "8px 16px", borderRadius: "999px",
                  background: "#f1f5f9", transition: "all 0.2s",
                }}
                className="hidden md:block"
              >
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
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    width: "min(340px, calc(100vw - 32px))", background: "#fff", borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.12)", border: "1px solid #e3e8f0",
                    overflow: "hidden", zIndex: 100,
                  }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #e3e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>Notifications</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {notifCount > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAllNotificationsAsRead(notificationList.map(n => n.id));
                              unreadMessages.forEach(m => markMessagesRead(m.senderId));
                            }}
                            style={{
                              fontSize: "11px", fontWeight: 600, color: "#1d4ed8", background: "rgba(29,78,216,0.08)",
                              border: "none", padding: "4px 8px", borderRadius: "6px", cursor: "pointer"
                            }}
                          >
                            Mark all read
                          </button>
                        )}
                        {notifCount > 0 && (
                          <span style={{ fontSize: "11px", fontWeight: 600, color: "#dc2626", background: "rgba(220,38,38,0.08)", padding: "2px 8px", borderRadius: "999px" }}>
                            {notifCount} New
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                      {notificationList.length > 0 ? (
                        notificationList.map((item) => {
                          const isUnread = !(readNotificationIds || []).includes(item.id);
                          return (
                            <Link
                              key={item.id}
                              href={item.link}
                              onClick={() => {
                                setNotifMenuOpen(false);
                                markNotificationAsRead(item.id);
                                if (item.isMessage) {
                                  markMessagesRead(item.senderId);
                                }
                              }}
                              style={{
                                display: "block", padding: "12px 16px",
                                borderBottom: "1px solid #f1f5f9", textDecoration: "none",
                                transition: "background 0.2s", color: "#1e2a44",
                                background: isUnread ? "rgba(198,165,92,0.12)" : "transparent",
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isUnread ? "rgba(198,165,92,0.18)" : "#fafcff"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isUnread ? "rgba(198,165,92,0.12)" : "transparent"}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                                <p style={{ fontSize: "12px", lineHeight: 1.4, margin: 0, fontWeight: isUnread ? 600 : 500 }}>
                                  {item.text}
                                </p>
                                {isUnread && (
                                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#dc2626", flexShrink: 0, marginTop: "4px" }} />
                                )}
                              </div>
                              <span style={{ fontSize: "10px", color: "#a0aec0", marginTop: "4px", display: "block" }}>
                                {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </Link>
                          );
                        })
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
                    background: currentUser.profilePhoto ? undefined : (currentUser.role === 'admin' ? "linear-gradient(135deg, #c6a55c, #d4b36a)" : "linear-gradient(135deg, #1e2a44, #c6a55c)"),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "14px", fontWeight: 700,
                  }}>
                    {currentUser.profilePhoto ? null : (currentUser.role === 'admin' ? "🛡️" : (currentUser.fullName ? currentUser.fullName[0].toUpperCase() : "U"))}
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e2a44" }} className="hidden sm:inline">
                    {currentUser.role === 'admin' ? "Super Admin" : (currentUser.fullName ? currentUser.fullName.split(" ")[0] : "Account")}
                  </span>
                  <ChevronDown style={{ width: "14px", height: "14px", color: "#5f6368" }} />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    width: "min(220px, calc(100vw - 32px))", background: "#fff", borderRadius: "12px",
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
