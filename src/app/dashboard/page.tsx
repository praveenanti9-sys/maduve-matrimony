"use client";


import Link from "next/link";
import { useStore } from "@/store/useStore";
import {
  Users, Heart, Eye, MessageCircle, TrendingUp, ArrowRight,
  Sparkles, Bell, Zap, Crown, Shield, CheckCircle2,
  AlertTriangle, Ban, Activity, BarChart3, Clock,
  Star, MapPin, Mail, Inbox,
} from "lucide-react";

export default function DashboardPage() {
  const {
    currentUser, interests, messages, profiles,
    getActiveProfiles, getRemainingInterests,
    contactInquiries, auditLog,
  } = useStore();
  
  const isAdmin = currentUser.role === 'admin';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  // ── Admin Dashboard ──
  if (isAdmin) {
    const totalUsers = profiles.length;
    const activeUsers = profiles.filter(p => p.status === 'active').length;
    const suspendedUsers = profiles.filter(p => p.status === 'suspended').length;
    const blockedUsers = profiles.filter(p => p.status === 'blocked').length;
    const pendingUsers = profiles.filter(p => p.status === 'pending').length;
    const totalMessages = messages.length;
    const totalInterests = interests.length;
    const pendingInterests = interests.filter(i => i.status === 'pending').length;
    const maleCount = profiles.filter(p => p.gender === 'MALE').length;
    const femaleCount = profiles.filter(p => p.gender === 'FEMALE').length;
    const unreadInquiries = contactInquiries.filter(i => !i.isRead).length;

    // Registration trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    const regTrend = last7Days.map(day => ({
      day: new Date(day).toLocaleDateString('en-IN', { weekday: 'short' }),
      count: profiles.filter(p => p.joinDate === day).length,
    }));
    const maxReg = Math.max(...regTrend.map(r => r.count), 1);

    // Gender ratio for donut
    const total = maleCount + femaleCount || 1;
    const malePerc = Math.round((maleCount / total) * 100);
    const femalePerc = 100 - malePerc;
    const maleAngle = (malePerc / 100) * 360;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Pending Approvals Alert */}
        {pendingUsers > 0 && (
          <div style={{
            padding: "16px 24px", borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))",
            border: "1px solid rgba(245,158,11,0.3)",
            display: "flex", alignItems: "center", gap: "16px",
            animation: "fadeIn 0.3s ease",
          }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <AlertTriangle style={{ width: "24px", height: "24px", color: "#f59e0b" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#92400e" }}>{pendingUsers} Profile{pendingUsers > 1 ? 's' : ''} Pending Approval</h3>
              <p style={{ fontSize: "12px", color: "#78716c", marginTop: "2px" }}>New registrations are waiting for your review and verification.</p>
            </div>
            <Link href="/dashboard/admin" style={{
              padding: "10px 20px", borderRadius: "10px",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "#fff", fontSize: "13px", fontWeight: 600,
              textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0,
            }}>
              Review Now <ArrowRight style={{ width: "14px", height: "14px" }} />
            </Link>
          </div>
        )}

        {/* Admin Welcome Banner */}
        <div style={{
          background: "linear-gradient(135deg, #1e2a44 0%, #2a3a6a 50%, #1e2a44 100%)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 6s ease infinite",
          borderRadius: "20px", padding: "32px", color: "#fff", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(198,165,92,0.08)" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "40%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(198,165,92,0.05)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Shield style={{ width: "22px", height: "22px", color: "#c6a55c" }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: 500 }}>Administrator Panel</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700, marginBottom: "8px", color: "#fff" }}>
              {greeting()}, Admin
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", maxWidth: "520px" }}>
              Managing {totalUsers} users across the platform. {pendingUsers > 0 ? `${pendingUsers} pending approval.` : ''} {pendingInterests} pending interests. {unreadInquiries > 0 ? `${unreadInquiries} unread contact inquiries.` : ''}
            </p>
            <Link href="/dashboard/admin" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "16px", padding: "10px 20px", background: "linear-gradient(135deg, #c6a55c, #d4b36a)", borderRadius: "50px", fontSize: "14px", fontWeight: 600, color: "#fff", textDecoration: "none" }}>
              <Shield style={{ width: "14px", height: "14px" }} /> Go to Admin Panel <ArrowRight style={{ width: "14px", height: "14px" }} />
            </Link>
          </div>
        </div>

        {/* Admin Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {[
            { label: "Total Users", value: totalUsers, icon: Users, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
            { label: "Active Users", value: activeUsers, icon: Activity, color: "#16a34a", bg: "rgba(22,163,106,0.08)" },
            { label: "Pending Approval", value: pendingUsers, icon: AlertTriangle, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
            { label: "Blocked & Suspended", value: blockedUsers + suspendedUsers, icon: Ban, color: "#dc2626", bg: "rgba(220,38,38,0.08)" },
          ].map((stat, i) => (
            <div key={i} className="stat-card" style={{ ["--stat-color" as string]: stat.color }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <stat.icon style={{ width: "20px", height: "20px", color: stat.color }} />
                </div>
              </div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#1e2a44" }}>{stat.value}</div>
              <div style={{ fontSize: "12px", color: "#5f6368", marginTop: "2px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="dashboard-grid">
          {/* Registration Trend Chart */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e2a44", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <BarChart3 style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> Registration Trend (7 Days)
            </h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px" }}>
              {regTrend.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#1e2a44" }}>{d.count}</span>
                  <div style={{
                    width: "100%", minHeight: "4px",
                    height: `${Math.max(4, (d.count / maxReg) * 90)}px`,
                    background: d.count > 0 ? "linear-gradient(180deg, #c6a55c, #1e2a44)" : "#e3e8f0",
                    borderRadius: "6px 6px 2px 2px",
                    transition: "height 0.5s ease",
                  }} />
                  <span style={{ fontSize: "10px", color: "#5f6368" }}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Distribution + Secondary Stats */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e2a44", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <Users style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> Platform Overview
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              {/* SVG Donut */}
              <div style={{ position: "relative", width: "100px", height: "100px", flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ width: "100px", height: "100px", transform: "rotate(-90deg)" }}>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e3e8f0" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4"
                    strokeDasharray={`${malePerc * 0.88} ${100 - malePerc * 0.88}`} strokeLinecap="round" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#ec4899" strokeWidth="4"
                    strokeDasharray={`${femalePerc * 0.88} ${100 - femalePerc * 0.88}`}
                    strokeDashoffset={`-${malePerc * 0.88}`} strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: "#1e2a44" }}>{totalUsers}</span>
                  <span style={{ fontSize: "9px", color: "#5f6368" }}>Users</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#3b82f6" }} />
                  <span style={{ fontSize: "13px", color: "#1e2a44", fontWeight: 500 }}>Male — {maleCount} ({malePerc}%)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ec4899" }} />
                  <span style={{ fontSize: "13px", color: "#1e2a44", fontWeight: 500 }}>Female — {femaleCount} ({femalePerc}%)</span>
                </div>
                <div style={{ height: "1px", background: "#f0ece4", margin: "4px 0" }} />
                <div style={{ display: "flex", gap: "16px" }}>
                  <div><span style={{ fontSize: "18px", fontWeight: 700, color: "#8b5cf6" }}>{totalMessages}</span><br /><span style={{ fontSize: "10px", color: "#5f6368" }}>Messages</span></div>
                  <div><span style={{ fontSize: "18px", fontWeight: 700, color: "#c6a55c" }}>{totalInterests}</span><br /><span style={{ fontSize: "10px", color: "#5f6368" }}>Interests</span></div>
                  <div><span style={{ fontSize: "18px", fontWeight: 700, color: "#f59e0b" }}>{unreadInquiries}</span><br /><span style={{ fontSize: "10px", color: "#5f6368" }}>Inquiries</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }} className="home-section-grid">
          {[
            { title: "User Management", desc: "Approve, block, or suspend users", icon: Users, href: "/dashboard/admin", color: "#3b82f6" },
            { title: "All Messages", desc: "Monitor conversations between users", icon: MessageCircle, href: "/dashboard/admin", color: "#8b5cf6" },
            { title: "Platform Settings", desc: "Configure system preferences", icon: BarChart3, href: "/dashboard/settings", color: "#16a34a" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="card" style={{ padding: "24px", textDecoration: "none", display: "flex", flexDirection: "column", gap: "12px", transition: "all 0.2s" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <item.icon style={{ width: "22px", height: "22px", color: item.color }} />
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1e2a44", marginBottom: "4px" }}>{item.title}</h3>
                <p style={{ fontSize: "12px", color: "#5f6368" }}>{item.desc}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 500, color: item.color, marginTop: "auto" }}>
                Open <ArrowRight style={{ width: "12px", height: "12px" }} />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Row: Recent Users + Activity Log */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="dashboard-grid">
          {/* Recent Users */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e2a44", display: "flex", alignItems: "center", gap: "8px" }}>
                <Users style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> Recent Registrations
              </h3>
              <Link href="/dashboard/admin" style={{ fontSize: "12px", fontWeight: 500, color: "#1e2a44", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                Manage All <ArrowRight style={{ width: "12px", height: "12px" }} />
              </Link>
            </div>
            {profiles.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px", color: "#a0aec0" }}>
                <Users style={{ width: "28px", height: "28px", margin: "0 auto 8px" }} />
                <p style={{ fontSize: "13px" }}>No users registered yet</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {profiles.slice(0, 8).map((p) => (
                  <Link key={p.id} href="/dashboard/admin" style={{
                    display: "flex", alignItems: "center", gap: "12px", padding: "10px 8px",
                    borderBottom: "1px solid #f0ece4", cursor: "pointer", textDecoration: "none", color: "inherit",
                    transition: "background 0.15s",
                  }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                      backgroundImage: p.profilePhoto ? `url('${p.profilePhoto}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                      backgroundSize: "cover", backgroundPosition: "center",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "13px", fontWeight: 700,
                    }}>
                      {!p.profilePhoto && p.name[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e2a44", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      <div style={{ fontSize: "11px", color: "#a0aec0" }}>{p.email}</div>
                    </div>
                    <span style={{
                      padding: "3px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: 600,
                      background: p.status === 'active' ? "rgba(22,163,106,0.1)" : p.status === 'pending' ? "rgba(245,158,11,0.1)" : "rgba(220,38,38,0.1)",
                      color: p.status === 'active' ? "#16a34a" : p.status === 'pending' ? "#d97706" : "#dc2626",
                    }}>
                      {p.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Admin Activity Log */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e2a44", display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> Admin Activity Log
              </h3>
            </div>
            {auditLog.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px", color: "#a0aec0" }}>
                <Activity style={{ width: "28px", height: "28px", margin: "0 auto 8px" }} />
                <p style={{ fontSize: "13px" }}>No admin actions recorded yet</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {auditLog.slice(0, 8).map((entry) => {
                  const targetProfile = profiles.find(p => p.id === entry.targetUserId);
                  const actionColors: Record<string, string> = { approve: "#16a34a", activate: "#16a34a", block: "#dc2626", suspend: "#f59e0b", reject: "#dc2626", delete: "#dc2626", verify: "#3b82f6" };
                  const actionIcons: Record<string, string> = { approve: "✅", activate: "✅", block: "🚫", suspend: "⚠️", reject: "❌", delete: "🗑️", verify: "🔵" };
                  return (
                    <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 8px", borderBottom: "1px solid #f0ece4" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: `${actionColors[entry.action] || '#5f6368'}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "14px" }}>
                        {actionIcons[entry.action] || "📋"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "12px", color: "#1e2a44" }}>
                          <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{entry.action}</span>{" "}
                          <span style={{ color: "#5f6368" }}>{targetProfile?.name || entry.targetUserId.slice(0, 8)}</span>
                        </p>
                        {entry.details && <p style={{ fontSize: "11px", color: "#a0aec0", marginTop: "1px" }}>{entry.details}</p>}
                      </div>
                      <span style={{ fontSize: "10px", color: "#a0aec0", flexShrink: 0 }}>{timeAgo(entry.createdAt)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Contact Inquiries Preview */}
        {contactInquiries.length > 0 && (
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e2a44", display: "flex", alignItems: "center", gap: "8px" }}>
                <Inbox style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> Contact Inquiries
                {unreadInquiries > 0 && (
                  <span style={{ padding: "2px 8px", borderRadius: "999px", background: "rgba(220,38,38,0.1)", color: "#dc2626", fontSize: "11px", fontWeight: 700 }}>
                    {unreadInquiries} new
                  </span>
                )}
              </h3>
              <Link href="/dashboard/admin" style={{ fontSize: "12px", fontWeight: 500, color: "#1e2a44", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                View All <ArrowRight style={{ width: "12px", height: "12px" }} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {contactInquiries.slice(0, 4).map((inquiry) => (
                <div key={inquiry.id} style={{
                  padding: "14px 20px", borderRadius: "12px",
                  border: inquiry.isRead ? "1px solid #e3e8f0" : "1px solid rgba(198,165,92,0.25)",
                  background: inquiry.isRead ? "#fff" : "rgba(198,165,92,0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  transition: "all 0.2s",
                }} className="flex-col-mobile">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: inquiry.isRead ? "#f0ece4" : "rgba(198,165,92,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: inquiry.isRead ? "#5f6368" : "#8B6914",
                      fontWeight: 700, fontSize: "14px", flexShrink: 0
                    }}>
                      {inquiry.name[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: inquiry.isRead ? 600 : 700, color: "#1e2a44" }}>{inquiry.name}</span>
                        {!inquiry.isRead && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#dc2626" }} />}
                      </div>
                      <p style={{ fontSize: "13px", color: inquiry.isRead ? "#5f6368" : "#1e2a44", fontWeight: inquiry.isRead ? 400 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {inquiry.message}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: "11px", color: "#a0aec0", flexShrink: 0 }}>
                    <div>{inquiry.email} {inquiry.phone && `· ${inquiry.phone}`}</div>
                    <div style={{ marginTop: "2px" }}>{timeAgo(inquiry.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── User Dashboard ──
  const isMyId = (id: string) => id === currentUser.id;
  
  const receivedInterests = interests.filter((i) => isMyId(i.toId));
  const unreadMessages = messages.filter((m) => isMyId(m.receiverId) && !m.read);
  const sentInterests = interests.filter((i) => isMyId(i.fromId));
  const acceptedInterests = interests.filter((i) => (isMyId(i.toId) || isMyId(i.fromId)) && i.status === "accepted");
  const remainingInterests = getRemainingInterests();
  const activeProfiles = getActiveProfiles();

  const allFields = [
    currentUser.fullName, currentUser.email, currentUser.phone, currentUser.gender, currentUser.dob,
    currentUser.education, currentUser.occupation, currentUser.city, currentUser.height, currentUser.maritalStatus,
    currentUser.gothra, currentUser.nakshatra, currentUser.rashi, currentUser.bio, currentUser.weight,
    currentUser.complexion, currentUser.annualIncome, currentUser.nativePlace, currentUser.fatherName,
    currentUser.fatherOccupation, currentUser.motherName, currentUser.motherOccupation, currentUser.siblings,
    currentUser.prefAgeMin, currentUser.prefAgeMax, currentUser.prefHeightMin, currentUser.prefDistrict, currentUser.prefEducation
  ];
  const filledFields = allFields.filter(Boolean).length;
  const completeness = Math.round((filledFields / allFields.length) * 100);

  const stats = [
    { label: "Profile Views", value: String(currentUser.profileViews || 0), icon: Eye, change: "All time", color: "#3b82f6" },
    { label: "Interests Received", value: String(receivedInterests.length), icon: Heart, change: `+${receivedInterests.filter((i) => i.status === "pending").length} new`, color: "#1e2a44" },
    { label: "Matches", value: String(acceptedInterests.length), icon: Users, change: "mutual", color: "#16a34a" },
    { label: "Messages", value: String(unreadMessages.length), icon: MessageCircle, change: `${unreadMessages.length} unread`, color: "#c6a55c" },
  ];

  const getProfile = (id: string) => profiles.find((p) => p.id === id);

  // Build activity timeline with timestamps
  const activityTimeline: { id: string; name: string; action: string; time: string; photo?: string; icon: string; color: string }[] = [];
  interests.forEach((i) => {
    const p = isMyId(i.fromId) ? getProfile(i.toId) : getProfile(i.fromId);
    if (!p) return;
    if (!isMyId(i.fromId) && i.status === "pending") {
      activityTimeline.push({ id: `int-${i.id}`, name: p.name, action: "sent you an interest", time: i.timestamp, photo: p.profilePhoto, icon: "💕", color: "#ec4899" });
    } else if (i.status === "accepted") {
      activityTimeline.push({ id: `acc-${i.id}`, name: p.name, action: "is now a mutual match", time: i.timestamp, photo: p.profilePhoto, icon: "🎉", color: "#16a34a" });
    }
  });
  messages.filter((m) => !isMyId(m.senderId)).slice(-5).forEach((m) => {
    const p = getProfile(m.senderId);
    if (p) activityTimeline.push({ id: `msg-${m.id}`, name: p.name, action: "sent you a message", time: m.timestamp, photo: p.profilePhoto, icon: "💬", color: "#3b82f6" });
  });
  activityTimeline.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const dailyLimit = useStore.getState().systemSettings?.dailyInterestLimit ?? 10;

  // Age from DOB
  const myAge = currentUser.dob ? Math.floor((Date.now() - new Date(currentUser.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Pending Approval Warning Banner */}
      {currentUser.status === 'pending' && (
        <div style={{
          padding: "16px 24px", borderRadius: "16px",
          background: "rgba(245,158,11,0.06)",
          border: "1px solid rgba(245,158,11,0.25)",
          color: "#d97706",
          display: "flex", alignItems: "flex-start", gap: "12px",
          animation: "fadeIn 0.3s ease",
        }}>
          <AlertTriangle style={{ width: "20px", height: "20px", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h4 style={{ fontWeight: 700, fontSize: "14px", color: "#d97706" }}>Profile Pending Approval</h4>
            <p style={{ fontSize: "13px", color: "#5f6368", marginTop: "2px", lineHeight: 1.4 }}>
              Your profile has been created successfully and is currently undergoing review by our administrators. You will be able to search and connect with matches once approved.
            </p>
          </div>
        </div>
      )}

      {/* Welcome Banner + Quick Profile Card */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "stretch" }} className="dashboard-grid">
        <div style={{
          background: "linear-gradient(135deg, #1e2a44 0%, #2a3a6a 50%, #1e2a44 100%)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 6s ease infinite",
          borderRadius: "20px", padding: "32px", color: "#fff", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Sparkles style={{ width: "20px", height: "20px", color: "#c6a55c" }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: 500 }}>Welcome back!</span>
              {currentUser.isVerified && (
                <span style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 8px", background: "rgba(59, 130, 246, 0.2)", borderRadius: "12px", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#93c5fd", fontSize: "11px", fontWeight: 600 }}>
                  <CheckCircle2 style={{ width: "12px", height: "12px" }} /> Verified
                </span>
              )}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700, marginBottom: "8px", color: "#fff" }}>
              {greeting()}, {currentUser.fullName || "User"}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", maxWidth: "480px" }}>
              You have {receivedInterests.filter((i) => i.status === "pending").length} new interests and {unreadMessages.length} unread messages.
              {completeness < 100 ? ` Your profile is ${completeness}% complete — complete it to get more matches!` : ''}
            </p>
            {completeness < 100 && (
              <Link href="/dashboard/profile" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "16px", padding: "8px 16px", background: "rgba(255,255,255,0.15)", borderRadius: "50px", fontSize: "14px", fontWeight: 500, color: "#fff", textDecoration: "none", backdropFilter: "blur(10px)" }}>
                Complete Profile <ArrowRight style={{ width: "16px", height: "16px" }} />
              </Link>
            )}
          </div>
        </div>

        {/* Quick Profile Card */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", minWidth: "200px", justifyContent: "center" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            backgroundImage: currentUser.profilePhoto ? `url('${currentUser.profilePhoto}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
            backgroundSize: "cover", backgroundPosition: "center",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "28px", fontWeight: 700,
            border: "3px solid rgba(198,165,92,0.3)",
          }}>
            {!currentUser.profilePhoto && (currentUser.fullName?.[0]?.toUpperCase() || "U")}
          </div>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2a44" }}>{currentUser.fullName || "User"}</h3>
            <p style={{ fontSize: "11px", color: "#5f6368", marginTop: "2px" }}>
              {[myAge && `${myAge} yrs`, currentUser.height, currentUser.city].filter(Boolean).join(" · ") || "Complete your profile"}
            </p>
          </div>
          {/* Horoscope info */}
          {(currentUser.rashi || currentUser.nakshatra || currentUser.gothra) && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
              {currentUser.rashi && <span style={{ padding: "2px 8px", borderRadius: "8px", background: "rgba(139,92,246,0.08)", color: "#7c3aed", fontSize: "10px", fontWeight: 600 }}>☽ {currentUser.rashi}</span>}
              {currentUser.nakshatra && <span style={{ padding: "2px 8px", borderRadius: "8px", background: "rgba(198,165,92,0.1)", color: "#92400e", fontSize: "10px", fontWeight: 600 }}>✦ {currentUser.nakshatra}</span>}
              {currentUser.gothra && <span style={{ padding: "2px 8px", borderRadius: "8px", background: "rgba(30,42,68,0.06)", color: "#1e2a44", fontSize: "10px", fontWeight: 600 }}>🏠 {currentUser.gothra}</span>}
            </div>
          )}
          <span style={{ fontSize: "10px", color: "#a0aec0" }}>ID: {currentUser.id.toUpperCase().slice(0, 8)}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {stats.map((stat, i) => (
          <div key={i} className="stat-card" style={{ ["--stat-color" as string]: stat.color }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <stat.icon style={{ width: "20px", height: "20px", color: stat.color }} />
              </div>
              <span style={{ fontSize: "12px", color: parseInt(stat.value) > 0 ? "#16a34a" : "#a0aec0", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
                {parseInt(stat.value) > 0 && <TrendingUp style={{ width: "12px", height: "12px" }} />} {stat.change}
              </span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "#1e2a44" }}>{stat.value}</div>
            <div style={{ fontSize: "12px", color: "#5f6368", marginTop: "2px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Interest Limit Card */}
      <div className="card flex-col-mobile" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(198,165,92,0.15), rgba(198,165,92,0.05))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Zap style={{ width: "22px", height: "22px", color: "#c6a55c" }} />
        </div>
        <div style={{ flex: 1, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#1e2a44" }}>Daily Interests</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: remainingInterests <= 2 ? "#dc2626" : "#16a34a" }}>
              {remainingInterests}/{dailyLimit} remaining
            </span>
          </div>
          <div className="limit-bar">
            <div className="limit-bar-fill" style={{ width: `${(Math.max(0, dailyLimit - remainingInterests) / dailyLimit) * 100}%` }} />
          </div>
          <p style={{ fontSize: "12px", color: "#5f6368", marginTop: "6px" }}>
            {remainingInterests > 0 ? "Send interests to profiles you like. Resets daily at midnight." : "You've used all interests today. Come back tomorrow!"}
          </p>
        </div>
      </div>

      {/* Today's Picks — Highlighted profile cards */}
      {activeProfiles.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontWeight: 600, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px", color: "#1e2a44" }}>
              <Star style={{ width: "20px", height: "20px", color: "#c6a55c" }} /> Today&apos;s Top Picks
            </h2>
            <Link href="/dashboard/browse" style={{ fontSize: "14px", color: "#1e2a44", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              Browse All <ArrowRight style={{ width: "14px", height: "14px" }} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }} className="home-section-grid">
            {activeProfiles.slice(0, 3).map((profile, idx) => (
              <Link key={profile.id} href="/dashboard/browse" style={{ textDecoration: "none", animation: `fadeInUp 0.4s ease ${idx * 0.1}s both` }}>
                <div className="card" style={{ padding: "0", overflow: "hidden", transition: "all 0.2s", cursor: "pointer" }}>
                  {/* Profile photo area */}
                  <div style={{
                    height: "160px", position: "relative",
                    backgroundImage: profile.profilePhoto ? `url('${profile.profilePhoto}')` : "linear-gradient(135deg, #1e2a44 0%, #2a3a6a 50%, #c6a55c 100%)",
                    backgroundSize: "cover", backgroundPosition: "center",
                  }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                    {!profile.profilePhoto && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "48px", fontWeight: 700, opacity: 0.3 }}>
                        {profile.name[0]}
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: "12px", left: "14px", right: "14px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>{profile.name}, {profile.age}</h3>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin style={{ width: "11px", height: "11px" }} /> {profile.location || profile.district}
                      </p>
                    </div>
                  </div>
                  {/* Info */}
                  <div style={{ padding: "14px" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                      {profile.education && <span style={{ padding: "3px 8px", borderRadius: "6px", background: "#f0ece4", color: "#5f6368", fontSize: "10px", fontWeight: 500 }}>{profile.education}</span>}
                      {profile.height && <span style={{ padding: "3px 8px", borderRadius: "6px", background: "#f0ece4", color: "#5f6368", fontSize: "10px", fontWeight: 500 }}>{profile.height}</span>}
                      {profile.gothra && <span style={{ padding: "3px 8px", borderRadius: "6px", background: "rgba(139,92,246,0.08)", color: "#7c3aed", fontSize: "10px", fontWeight: 500 }}>{profile.gothra}</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#c6a55c", fontWeight: 600 }}>
                      View Profile <ArrowRight style={{ width: "12px", height: "12px" }} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="dashboard-grid">
        {/* Suggested Matches */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontWeight: 600, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px", color: "#1e2a44" }}>
              <Sparkles style={{ width: "20px", height: "20px", color: "#c6a55c" }} /> More Matches
            </h2>
            <Link href="/dashboard/browse" style={{ fontSize: "14px", color: "#1e2a44", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              View All <ArrowRight style={{ width: "14px", height: "14px" }} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {activeProfiles.slice(3, 7).map((profile, idx) => (
              <div key={profile.id} style={{
                display: "flex", alignItems: "center", gap: "14px", padding: "12px",
                border: "1px solid #e3e8f0", borderRadius: "12px",
                animation: `slideInRight 0.4s ease ${idx * 0.1}s both`,
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  backgroundImage: profile.profilePhoto ? `url('${profile.profilePhoto}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                  backgroundSize: "cover", backgroundPosition: "center",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: "16px", fontWeight: 700, flexShrink: 0,
                  border: "2px solid rgba(198,165,92,0.2)",
                }}>
                  {!profile.profilePhoto && profile.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#1e2a44", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.name}</h4>
                  <p style={{ fontSize: "12px", color: "#5f6368", marginTop: "2px" }}>
                    {profile.age} yrs • {profile.height} • {profile.location}
                  </p>
                  {profile.nakshatra && <p style={{ fontSize: "10px", color: "#7c3aed", marginTop: "2px" }}>✦ {profile.nakshatra} {profile.rashi ? `· ☽ ${profile.rashi}` : ''}</p>}
                </div>
                <Link href="/dashboard/browse" style={{
                  padding: "6px 14px", borderRadius: "8px", background: "#1e2a44", color: "#fff",
                  fontSize: "11px", fontWeight: 600, textDecoration: "none",
                  display: "flex", alignItems: "center", gap: "4px",
                }}>
                  View <ArrowRight style={{ width: "10px", height: "10px" }} />
                </Link>
              </div>
            ))}
            {activeProfiles.length <= 3 && activeProfiles.length > 0 && (
              <div style={{ textAlign: "center", padding: "20px", color: "#5f6368" }}>
                <p style={{ fontSize: "13px" }}>More matches coming soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontWeight: 600, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px", color: "#1e2a44" }}>
              <Bell style={{ width: "20px", height: "20px", color: "#c6a55c" }} /> Activity Timeline
            </h2>
            <Link href="/dashboard/interests" style={{ fontSize: "14px", color: "#1e2a44", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              View All <ArrowRight style={{ width: "14px", height: "14px" }} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0", position: "relative" }}>
            {/* Timeline line */}
            {activityTimeline.length > 0 && (
              <div style={{ position: "absolute", left: "19px", top: "20px", bottom: "20px", width: "2px", background: "#f0ece4" }} />
            )}
            {activityTimeline.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px", color: "#5f6368" }}>
                <Heart style={{ width: "32px", height: "32px", color: "#a0aec0", margin: "0 auto 12px" }} />
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#1e2a44" }}>No recent activity yet</p>
                <p style={{ fontSize: "12px", marginTop: "4px" }}>Browse matches and send interests!</p>
              </div>
            ) : (
              activityTimeline.slice(0, 6).map((activity, i) => (
                <div key={activity.id} style={{
                  display: "flex", alignItems: "flex-start", gap: "14px", padding: "12px 0",
                  animation: `fadeInUp 0.4s ease ${i * 0.08}s both`,
                  position: "relative",
                }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                    backgroundImage: activity.photo ? `url('${activity.photo}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                    backgroundSize: "cover", backgroundPosition: "center",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "14px", fontWeight: 700,
                    border: "3px solid #fff", position: "relative", zIndex: 1,
                  }}>
                    {!activity.photo && activity.name[0]}
                  </div>
                  <div style={{ flex: 1, paddingTop: "2px" }}>
                    <p style={{ fontSize: "13px", lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 600, color: "#1e2a44" }}>{activity.name}</span>{" "}
                      <span style={{ color: "#5f6368" }}>{activity.action}</span>
                      <span style={{ marginLeft: "6px" }}>{activity.icon}</span>
                    </p>
                    <p style={{ fontSize: "11px", color: "#a0aec0", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock style={{ width: "10px", height: "10px" }} /> {timeAgo(activity.time)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Profile Completeness Prompt */}
      {completeness < 100 && (
        <div style={{
          padding: "20px 24px", borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(198,165,92,0.08), rgba(30,42,68,0.04))",
          border: "1px solid rgba(198,165,92,0.15)",
          display: "flex", alignItems: "center", gap: "16px",
        }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(198,165,92,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Crown style={{ width: "24px", height: "24px", color: "#c6a55c" }} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1e2a44", marginBottom: "4px" }}>Complete Your Profile for Better Matches</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1, height: "6px", background: "#e3e8f0", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: `${completeness}%`, height: "100%", background: "linear-gradient(90deg, #c6a55c, #1e2a44)", borderRadius: "999px", transition: "width 0.5s" }} />
              </div>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#c6a55c" }}>{completeness}%</span>
            </div>
          </div>
          <Link href="/dashboard/profile" style={{
            padding: "10px 18px", borderRadius: "10px",
            background: "linear-gradient(135deg, #c6a55c, #d4b36a)",
            color: "#fff", fontSize: "13px", fontWeight: 600,
            textDecoration: "none", display: "flex", alignItems: "center", gap: "6px",
            flexShrink: 0,
          }}>
            <CheckCircle2 style={{ width: "14px", height: "14px" }} /> Complete Now
          </Link>
        </div>
      )}
    </div>
  );
}
