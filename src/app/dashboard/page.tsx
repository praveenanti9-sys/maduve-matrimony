"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import {
  Users, Heart, Eye, MessageCircle, TrendingUp, ArrowRight,
  Sparkles, Bell, Zap, Crown, Shield, CheckCircle2,
  AlertTriangle, Ban, Activity, BarChart3,
} from "lucide-react";

export default function DashboardPage() {
  const {
    currentUser, interests, messages, profiles,
    getActiveProfiles, getRemainingInterests, incrementProfileViews
  } = useStore();
  
  const isAdmin = currentUser.role === 'admin';

  // Increment views dynamically on load
  useEffect(() => {
    if (!isAdmin) {
      incrementProfileViews();
    }
  }, [isAdmin, incrementProfileViews]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
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

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
              Managing {totalUsers} users across the platform. {pendingUsers > 0 ? `${pendingUsers} pending approval.` : ''} {suspendedUsers > 0 ? `${suspendedUsers} suspended.` : ''} {blockedUsers > 0 ? `${blockedUsers} blocked.` : ''} {pendingInterests} pending interests across all users.
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

        {/* Secondary Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {[
            { label: "Total Messages", value: totalMessages, icon: MessageCircle, color: "#8b5cf6" },
            { label: "Total Interests", value: totalInterests, icon: Heart, color: "#c6a55c" },
            { label: "Male Profiles", value: maleCount, icon: Users, color: "#3b82f6" },
            { label: "Female Profiles", value: femaleCount, icon: Users, color: "#ec4899" },
          ].map((stat, i) => (
            <div key={i} className="stat-card" style={{ ["--stat-color" as string]: stat.color }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <stat.icon style={{ width: "16px", height: "16px", color: stat.color }} />
                <span style={{ fontSize: "11px", color: "#5f6368", fontWeight: 600 }}>{stat.label}</span>
              </div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#1e2a44" }}>{stat.value}</div>
            </div>
          ))}
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

        {/* Recent Users — Clickable to Admin User Detail */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e2a44", display: "flex", alignItems: "center", gap: "8px" }}>
              <Users style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> All Registered Users
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
              {profiles.slice(0, 10).map((p) => {
                const pMessages = messages.filter(m => m.senderId === p.id || m.receiverId === p.id).length;
                const pInterests = interests.filter(i => i.fromId === p.id || i.toId === p.id).length;
                return (
                  <Link key={p.id} href="/dashboard/admin" style={{
                    display: "flex", alignItems: "center", gap: "12px", padding: "12px 8px",
                    borderBottom: "1px solid #f0ece4", cursor: "pointer", textDecoration: "none", color: "inherit",
                    transition: "background 0.15s",
                  }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                      backgroundImage: p.profilePhoto ? `url('${p.profilePhoto}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                      backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "14px", fontWeight: 700,
                    }}>
                      {!p.profilePhoto && p.name[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e2a44" }}>{p.name}</div>
                      <div style={{ fontSize: "11px", color: "#a0aec0" }}>{p.email}</div>
                    </div>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "11px", color: "#5f6368", display: "flex", alignItems: "center", gap: "4px" }}>
                        <MessageCircle style={{ width: "12px", height: "12px" }} /> {pMessages}
                      </span>
                      <span style={{ fontSize: "11px", color: "#5f6368", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Heart style={{ width: "12px", height: "12px" }} /> {pInterests}
                      </span>
                      <span style={{
                        padding: "3px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: 600,
                        background: p.status === 'active' ? "rgba(22,163,106,0.1)" : p.status === 'pending' ? "rgba(245,158,11,0.1)" : "rgba(220,38,38,0.1)",
                        color: p.status === 'active' ? "#16a34a" : p.status === 'pending' ? "#d97706" : "#dc2626",
                      }}>
                        {p.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
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

  const recentActivity: { name: string; action: string; time: string; photo?: string }[] = [];
  interests.forEach((i) => {
    const p = isMyId(i.fromId) ? getProfile(i.toId) : getProfile(i.fromId);
    if (!p) return;
    if (!isMyId(i.fromId) && i.status === "pending") {
      recentActivity.push({ name: p.name, action: "sent you an interest", time: "Recently", photo: p.profilePhoto });
    } else if (i.status === "accepted") {
      recentActivity.push({ name: p.name, action: "accepted interest", time: "Recently", photo: p.profilePhoto });
    }
  });
  messages.filter((m) => !isMyId(m.senderId)).slice(-3).forEach((m) => {
    const p = getProfile(m.senderId);
    if (p) recentActivity.push({ name: p.name, action: "sent you a message", time: "Recently", photo: p.profilePhoto });
  });

  const dailyLimit = useStore.getState().systemSettings?.dailyInterestLimit ?? 10;

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

      {/* Welcome Banner */}
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
            {currentUser.adminReviewed && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 8px", background: "rgba(59, 130, 246, 0.2)", borderRadius: "12px", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#93c5fd", fontSize: "11px", fontWeight: 600 }}>
                <CheckCircle2 style={{ width: "12px", height: "12px" }} /> Verified by Admin
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

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="dashboard-grid">
        {/* Suggested Matches */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontWeight: 600, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px", color: "#1e2a44" }}>
              <Sparkles style={{ width: "20px", height: "20px", color: "#c6a55c" }} /> Suggested Matches
            </h2>
            <Link href="/dashboard/browse" style={{ fontSize: "14px", color: "#1e2a44", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              View All <ArrowRight style={{ width: "14px", height: "14px" }} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {activeProfiles
              .filter((p) => !currentUser.gender || (currentUser.gender === "MALE" ? p.gender === "FEMALE" : p.gender === "MALE"))
              .slice(0, 4)
              .map((profile, idx) => (
                <div key={profile.id} style={{
                  display: "flex", alignItems: "center", gap: "14px", padding: "12px",
                  border: "1px solid #e3e8f0", borderRadius: "12px",
                  animation: `slideInRight 0.4s ease ${idx * 0.1}s both`,
                }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    backgroundImage: profile.profilePhoto ? `url('${profile.profilePhoto}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
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
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontWeight: 600, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px", color: "#1e2a44" }}>
              <Bell style={{ width: "20px", height: "20px", color: "#c6a55c" }} /> Recent Activity
            </h2>
            <Link href="/dashboard/interests" style={{ fontSize: "14px", color: "#1e2a44", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              View All <ArrowRight style={{ width: "14px", height: "14px" }} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentActivity.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px", color: "#5f6368" }}>
                <Heart style={{ width: "32px", height: "32px", color: "#a0aec0", margin: "0 auto 12px" }} />
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#1e2a44" }}>No recent activity yet</p>
                <p style={{ fontSize: "12px", marginTop: "4px" }}>Browse matches and send interests!</p>
              </div>
            ) : (
              recentActivity.slice(0, 5).map((activity, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "14px", padding: "12px", borderRadius: "12px",
                  animation: `fadeInUp 0.4s ease ${i * 0.1}s both`,
                }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                    backgroundImage: activity.photo ? `url('${activity.photo}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "14px", fontWeight: 700,
                  }}>
                    {!activity.photo && activity.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "14px" }}><span style={{ fontWeight: 600, color: "#1e2a44" }}>{activity.name}</span>{" "}<span style={{ color: "#5f6368" }}>{activity.action}</span></p>
                    <p style={{ fontSize: "12px", color: "#a0aec0" }}>{activity.time}</p>
                  </div>
                  <ArrowRight style={{ width: "16px", height: "16px", color: "#a0aec0", flexShrink: 0 }} />
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
