"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Bell, Heart, Search, MessageSquare, Shield } from "lucide-react";
import { useStore } from "@/store/useStore";
import { ADMIN_UUID, SYSTEM_UUID } from "@/lib/supabase-service";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  
  const [currentLang, setCurrentLang] = useState<"en" | "kn">("en");
  
  const { isLoggedIn, currentUser, logout, messages, interests, profiles, readNotificationIds, markNotificationAsRead, markAllNotificationsAsRead, markMessagesRead } = useStore();

  const triggerGoogleTranslate = (lang: string) => {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem("preferred_lang", lang);
    }
    setCurrentLang(lang as "en" | "kn");
  };

  useEffect(() => {
    // 1. Define global callback for Google Translate
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,kn',
        autoDisplay: false
      }, 'google_translate_element');

      // Auto-trigger language from local storage once combo box is loaded
      let attempts = 0;
      const interval = setInterval(() => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        const saved = localStorage.getItem("preferred_lang") || "en";
        if (select) {
          clearInterval(interval);
          setCurrentLang(saved as "en" | "kn");
          select.value = saved;
          select.dispatchEvent(new Event('change'));
        }
        attempts++;
        if (attempts > 30) clearInterval(interval);
      }, 500);
    };

    // 2. Inject Google Translate Script
    const scriptId = 'google-translate-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    }

    // 3. Inject Clean/Premium Custom Styles to hide ugly banners, frames, tooltips & highlight
    const styleId = 'google-translate-custom-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .goog-te-banner-frame.skiptranslate, .goog-te-banner-frame, .goog-te-banner, #goog-gt-tt, .goog-te-balloon-frame { 
          display: none !important; 
          visibility: hidden !important;
        }
        body { top: 0px !important; }
        .goog-logo-link { display: none !important; }
        .goog-te-gadget { color: transparent !important; font-size: 0px !important; }
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
          box-sizing: border-box !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Re-trigger Google Translate when pathname changes (SPA navigation)
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem("preferred_lang") : null;
    if (saved && saved !== 'en') {
      const timer = setTimeout(() => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (select) {
          select.value = saved;
          select.dispatchEvent(new Event('change'));
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

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
        <Link href={isLoggedIn ? "/dashboard" : "/"} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <Image
            src="https://maduvedibbana.com/wp-content/uploads/2026/04/cropped-Untitled-design-22.png"
            alt="Maduvedibbana Logo"
            width={56}
            height={56}
            style={{ borderRadius: "8px", objectFit: "contain" }}
          />
          <div className="hidden sm:block" style={{ minWidth: 0 }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "18px", fontWeight: 700, color: "#1e2a44",
              letterSpacing: "-0.3px", display: "block", lineHeight: 1.1,
              whiteSpace: "nowrap"
            }}>
              Maduvedibbana
            </span>
            <span style={{
              fontSize: "9px", fontWeight: 600, color: "#c6a55c",
              letterSpacing: "1.5px", textTransform: "uppercase",
              display: "block"
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
          {/* Custom Styled Switcher Buttons */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
            background: "rgba(255, 255, 255, 0.95)",
            padding: "3px",
            borderRadius: "8px",
            fontSize: "11px",
            fontWeight: 700,
            border: "1px solid rgba(30, 42, 68, 0.12)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            flexShrink: 0,
            marginRight: "4px"
          }}>
            <button
              onClick={() => triggerGoogleTranslate('en')}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: currentLang === 'en' ? "linear-gradient(135deg, #1e2a44, #2a3a6a)" : "transparent",
                color: currentLang === 'en' ? "#fff" : "#5f6368",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "11px",
                transition: "all 0.2s ease",
                boxShadow: currentLang === 'en' ? "0 2px 6px rgba(30,42,68,0.2)" : "none"
              }}
            >
              EN
            </button>
            <button
              onClick={() => triggerGoogleTranslate('kn')}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: currentLang === 'kn' ? "linear-gradient(135deg, #1e2a44, #2a3a6a)" : "transparent",
                color: currentLang === 'kn' ? "#fff" : "#5f6368",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "11px",
                transition: "all 0.2s ease",
                boxShadow: currentLang === 'kn' ? "0 2px 6px rgba(30,42,68,0.2)" : "none"
              }}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* Hidden Google Translate mount point */}
          <div id="google_translate_element" style={{ position: "absolute", opacity: 0, width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }} />
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
              <div style={{ position: "relative" }} className="hidden md:block">
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
              <div style={{ position: "relative" }} className="hidden md:block">
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
                    {currentUser.role === 'admin' ? "Admin Panel" : (currentUser.fullName ? currentUser.fullName.split(" ")[0] : "Account")}
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
                Register Profile
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
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          animation: "slideDown 0.2s ease-out",
          zIndex: 49,
        }} className="md:hidden">
          <ul style={{ padding: "0 0 16px 0", margin: 0, listStyle: "none" }}>
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
                {/* User Profile Card Header */}
                <div style={{
                  padding: "20px 24px",
                  background: "linear-gradient(135deg, rgba(30,42,68,0.02), rgba(198,165,92,0.04))",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "8px"
                }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    backgroundImage: currentUser.profilePhoto ? `url('${currentUser.profilePhoto}')` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    background: currentUser.profilePhoto ? undefined : (currentUser.role === 'admin' ? "linear-gradient(135deg, #c6a55c, #d4b36a)" : "linear-gradient(135deg, #1e2a44, #c6a55c)"),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "18px", fontWeight: 700,
                    border: "2px solid #fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    flexShrink: 0,
                  }}>
                    {currentUser.profilePhoto ? null : (currentUser.role === 'admin' ? "🛡️" : (currentUser.fullName ? currentUser.fullName[0].toUpperCase() : "U"))}
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2a44", margin: 0, lineHeight: 1.2 }}>
                      {currentUser.fullName || "Member"}
                    </h4>
                    <p style={{ fontSize: "12px", color: "#5f6368", margin: "3px 0 0", wordBreak: "break-all", opacity: 0.8 }}>
                      {currentUser.email}
                    </p>
                    {currentUser.role === 'admin' && (
                      <span style={{ display: "inline-block", marginTop: "6px", fontSize: "9px", fontWeight: 700, padding: "1px 6px", borderRadius: "4px", background: "rgba(198,165,92,0.15)", color: "#c6a55c" }}>
                        🛡️ Administrator
                      </span>
                    )}
                  </div>
                </div>

                {/* Dashboard Nav Items */}
                {[
                  ...(currentUser.role === 'admin' ? [
                    { name: "Admin Panel", href: "/dashboard/admin", icon: Shield, badge: pendingProfiles.length }
                  ] : []),
                  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
                  { name: "Browse Matches", href: "/dashboard/browse", icon: Search },
                  { name: "Interests", href: "/dashboard/interests", icon: Heart, badge: pendingInterests.length },
                  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: unreadMessages.length },
                  ...(currentUser.role !== 'admin' ? [
                    { name: "My Profile", href: "/dashboard/profile", icon: User }
                  ] : []),
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 24px",
                        fontSize: "15px",
                        fontWeight: 600,
                        color: isActive(item.href) ? "#1e2a44" : "#5f6368",
                        background: isActive(item.href) ? "rgba(30,42,68,0.04)" : "transparent",
                        textDecoration: "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <item.icon style={{ width: "18px", height: "18px", color: isActive(item.href) ? "#c6a55c" : "#5f6368" }} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span style={{
                          background: item.name === "Admin Panel" ? "#d97706" : "#dc2626",
                          color: "#fff", fontSize: "10px", fontWeight: 700,
                          padding: "2px 6px", borderRadius: "999px",
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}

                <li style={{ borderTop: "1px solid #e5e7eb", marginTop: "12px", paddingTop: "8px" }}>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px", width: "100%",
                      padding: "14px 24px", fontSize: "15px", fontWeight: 600,
                      color: "#dc2626", background: "none", border: "none",
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <LogOut style={{ width: "18px", height: "18px" }} />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <li style={{ padding: "16px 24px", display: "flex", gap: "10px", borderTop: "1px solid #e5e7eb", marginTop: "8px" }}>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    flex: 1, display: "block", textAlign: "center",
                    padding: "12px", borderRadius: "10px", border: "1px solid #e3e8f0",
                    fontSize: "14px", fontWeight: 600, color: "#1e2a44",
                    textDecoration: "none", background: "#fff",
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    flex: 1, display: "block", textAlign: "center",
                    padding: "12px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #1e2a44, #2a3a6a)", color: "#fff",
                    fontSize: "14px", fontWeight: 600, textDecoration: "none",
                  }}
                >
                  Register Profile
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
