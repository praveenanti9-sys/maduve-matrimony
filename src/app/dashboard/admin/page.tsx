"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import {
  Shield, Users, Search, Ban, AlertTriangle, CheckCircle2,
  Eye, UserX, UserCheck, X, BarChart3,
  Activity, Mail, Calendar, MapPin, Filter,
  MessageCircle, Heart, ArrowLeft, User, Briefcase,
  GraduationCap, Sparkles, Clock, Check, Trash2,
  Phone, ChevronRight, Send, Settings,
} from "lucide-react";

type AdminView = 'overview' | 'users' | 'approvals' | 'user-detail' | 'messages' | 'settings';

export default function AdminPage() {
  const { 
    currentUser, profiles, messages, interests, blockUser, suspendUser, 
    activateUser, deleteUser, approveUser, rejectUser, verifyUser, 
    registeredUser, systemSettings, fetchSystemSettings, updateSystemSettings 
  } = useStore();
  
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "suspended" | "blocked" | "pending">("");
  const [genderFilter, setGenderFilter] = useState("");
  const [showSuspendModal, setShowSuspendModal] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [showConfirmBlock, setShowConfirmBlock] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedConvoPartners, setSelectedConvoPartners] = useState<[string, string] | null>(null);

  // Settings tab local state
  const [interestLimit, setInterestLimit] = useState(10);
  const [autoApprove, setAutoApprove] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    fetchSystemSettings();
  }, [fetchSystemSettings]);

  useEffect(() => {
    if (systemSettings) {
      setInterestLimit(systemSettings.dailyInterestLimit);
      setAutoApprove(systemSettings.autoApproveProfiles);
    }
  }, [systemSettings]);

  // Redirect non-admins
  if (currentUser.role !== 'admin') {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(220,38,38,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Shield style={{ width: "40px", height: "40px", color: "#dc2626" }} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, color: "#1e2a44" }}>Access Denied</h2>
        <p style={{ fontSize: "14px", color: "#5f6368", maxWidth: "400px", textAlign: "center" }}>
          You don&apos;t have permission to access the Admin Panel. Please login with administrator credentials.
        </p>
      </div>
    );
  }

  const showToast = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBlock = (userId: string) => {
    blockUser(userId);
    setShowConfirmBlock(null);
    showToast("User has been blocked successfully", "error");
  };

  const handleSuspend = (userId: string) => {
    if (!suspendReason.trim()) return;
    suspendUser(userId, suspendReason);
    setShowSuspendModal(null);
    setSuspendReason("");
    showToast("User has been suspended", "warning");
  };

  const handleActivate = (userId: string) => {
    activateUser(userId);
    showToast("User has been activated", "success");
  };

  const handleDelete = (userId: string) => {
    deleteUser(userId); // Call actual deleteUser
    setShowConfirmDelete(null);
    setSelectedUserId(null);
    setActiveView('users');
    showToast("User profile has been deleted permanently", "error");
  };

  const viewUserDetail = (userId: string) => {
    setSelectedUserId(userId);
    setActiveView('user-detail');
  };

  // ── Inject registered user into profiles for admin view (excluding admins) ──
  const allProfiles = (() => {
    // Filter profiles from store to exclude admin accounts
    const clientProfiles = profiles.filter(p => p.role !== 'admin' && p.id !== currentUser.id);

    if (!registeredUser || !registeredUser.email || registeredUser.role === 'admin') {
      return clientProfiles;
    }

    // Convert the registered user to a MatchProfile-like object (only if not admin)
    const regProfile = {
      id: registeredUser.id || currentUser.id,
      name: registeredUser.fullName || 'Registered User',
      age: registeredUser.dob ? Math.floor((Date.now() - new Date(registeredUser.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0,
      height: registeredUser.height || '',
      location: [registeredUser.city, 'Karnataka'].filter(Boolean).join(', ') || 'Karnataka',
      education: registeredUser.education || '',
      occupation: registeredUser.occupation || '',
      gothra: registeredUser.gothra || '',
      gender: registeredUser.gender || '',
      nakshatra: registeredUser.nakshatra || '',
      rashi: registeredUser.rashi || '',
      maritalStatus: registeredUser.maritalStatus || '',
      annualIncome: registeredUser.annualIncome || '',
      bio: registeredUser.bio || '',
      district: registeredUser.district || '',
      profilePhoto: registeredUser.profilePhoto || '',
      phone: registeredUser.phone || '',
      email: registeredUser.email || '',
      weight: registeredUser.weight || '',
      complexion: registeredUser.complexion || '',
      fatherName: registeredUser.fatherName || '',
      fatherOccupation: registeredUser.fatherOccupation || '',
      motherName: registeredUser.motherName || '',
      motherOccupation: registeredUser.motherOccupation || '',
      siblings: registeredUser.siblings || '',
      prefAgeMin: registeredUser.prefAgeMin || '',
      prefAgeMax: registeredUser.prefAgeMax || '',
      prefHeightMin: registeredUser.prefHeightMin || '',
      prefDistrict: registeredUser.prefDistrict || '',
      prefEducation: registeredUser.prefEducation || '',
      nativePlace: registeredUser.nativePlace || '',
      state: registeredUser.state || 'Karnataka',
      status: registeredUser.status as 'active' | 'suspended' | 'blocked' | 'pending',
      statusReason: registeredUser.statusReason || '',
      joinDate: new Date().toISOString().split('T')[0],
      adminReviewed: registeredUser.adminReviewed,
      isVerified: registeredUser.isVerified,
      photoPrivacy: registeredUser.photoPrivacy,
      role: registeredUser.role as 'user' | 'admin',
    };
    return [regProfile, ...clientProfiles];
  })();

  // ── Stats ── (use allProfiles so registered user is counted)
  const totalUsers = allProfiles.length;
  const activeUsers = allProfiles.filter(p => p.status === 'active').length;
  const suspendedUsers = allProfiles.filter(p => p.status === 'suspended').length;
  const blockedUsers = allProfiles.filter(p => p.status === 'blocked').length;
  const pendingApprovalsCount = allProfiles.filter(p => p.status === 'pending').length;
  const totalMessages = messages.length;
  const totalInterests = interests.length;

  // ── Filtered profiles (use allProfiles) ──
  const filteredProfiles = allProfiles.filter(p => {
    if (search) {
      const term = search.toLowerCase();
      if (!p.name.toLowerCase().includes(term) && !p.email.toLowerCase().includes(term) && !p.id.toLowerCase().includes(term)) return false;
    }
    if (statusFilter && p.status !== statusFilter) return false;
    if (genderFilter && p.gender !== genderFilter) return false;
    return true;
  });

  // ── User detail data ──
  const selectedUser = selectedUserId ? allProfiles.find(p => p.id === selectedUserId) : null;
  const userMessages = selectedUserId ? messages.filter(m => m.senderId === selectedUserId || m.receiverId === selectedUserId) : [];
  const userInterests = selectedUserId ? interests.filter(i => i.fromId === selectedUserId || i.toId === selectedUserId) : [];
  const userSentInterests = userInterests.filter(i => i.fromId === selectedUserId);
  const userReceivedInterests = userInterests.filter(i => i.toId === selectedUserId);

  // ── All conversations for messages view ──
  const allConversationPairs: { user1: string; user2: string; lastMsg: typeof messages[0]; count: number }[] = [];
  const pairSet = new Set<string>();
  messages.forEach(m => {
    const key = [m.senderId, m.receiverId].sort().join('|');
    if (!pairSet.has(key)) {
      pairSet.add(key);
      const pairMsgs = messages.filter(
        msg => (msg.senderId === m.senderId && msg.receiverId === m.receiverId) ||
               (msg.senderId === m.receiverId && msg.receiverId === m.senderId)
      ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      allConversationPairs.push({
        user1: m.senderId,
        user2: m.receiverId,
        lastMsg: pairMsgs[0],
        count: pairMsgs.length,
      });
    }
  });

  const getProfileName = (id: string) => {
    if (id === currentUser.id) return registeredUser?.fullName || 'Registered User';
    if (id === 'admin') return 'Super Admin';
    if (id === 'system') return '🔔 System';
    const p = allProfiles.find(pr => pr.id === id);
    return p ? p.name : id;
  };

  const getProfilePhoto = (id: string) => {
    if (id === currentUser.id) return registeredUser?.profilePhoto || '';
    const p = allProfiles.find(pr => pr.id === id);
    return p?.profilePhoto || '';
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; icon: React.ElementType }> = {
      active: { bg: "rgba(22,163,106,0.1)", color: "#16a34a", icon: CheckCircle2 },
      suspended: { bg: "rgba(245,158,11,0.1)", color: "#d97706", icon: AlertTriangle },
      blocked: { bg: "rgba(220,38,38,0.1)", color: "#dc2626", icon: Ban },
      pending: { bg: "rgba(245,158,11,0.1)", color: "#d97706", icon: Clock },
    };
    const s = styles[status] || styles.active;
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, background: s.bg, color: s.color }}>
        <s.icon style={{ width: "12px", height: "12px" }} />
        {status === 'pending' ? 'Pending Approval' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const selectStyle: React.CSSProperties = {
    padding: "8px 32px 8px 12px", background: "#fafcff",
    border: "1px solid #e3e8f0", borderRadius: "8px",
    fontSize: "13px", color: "#1e2a44", outline: "none", height: "38px",
    appearance: "none" as const, cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
  };

  // ── Navigation Tabs ──
  const navTabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3, count: 0 },
    { id: 'users' as const, label: 'User Management', icon: Users, count: totalUsers },
    { id: 'approvals' as const, label: 'Pending Approvals', icon: Clock, count: pendingApprovalsCount },
    { id: 'messages' as const, label: 'All Messages', icon: MessageCircle, count: totalMessages },
    { id: 'settings' as const, label: 'System Settings', icon: Settings, count: 0 },
  ];

  // ── Selected conversation messages ──
  const convoMessages = selectedConvoPartners
    ? messages.filter(m =>
        (m.senderId === selectedConvoPartners[0] && m.receiverId === selectedConvoPartners[1]) ||
        (m.senderId === selectedConvoPartners[1] && m.receiverId === selectedConvoPartners[0])
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            {activeView === 'user-detail' && (
              <button onClick={() => { setActiveView('users'); setSelectedUserId(null); }} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #e3e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#5f6368" }}>
                <ArrowLeft style={{ width: "16px", height: "16px" }} />
              </button>
            )}
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #c6a55c, #d4b36a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield style={{ width: "20px", height: "20px", color: "#fff" }} />
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, color: "#1e2a44", margin: 0 }}>
              {activeView === 'user-detail' && selectedUser ? `${selectedUser.name}` : 'Admin Panel'}
            </h1>
          </div>
          <p style={{ fontSize: "14px", color: "#5f6368", marginLeft: activeView === 'user-detail' ? "78px" : "46px" }}>
            {activeView === 'user-detail' ? 'User profile, activity, and messages' : 'Manage users, monitor activity, and view messages'}
          </p>
        </div>
        <span style={{ padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, background: "linear-gradient(135deg, #c6a55c, #d4b36a)", color: "#fff" }}>
          🛡️ Super Admin
        </span>
      </div>

      {/* Navigation Tabs */}
      {activeView !== 'user-detail' && (
        <div style={{ display: "flex", gap: "4px", background: "#fff", padding: "4px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", overflowX: "auto" }}>
          {navTabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveView(tab.id); setSelectedConvoPartners(null); }} style={{
              flex: 1, padding: "12px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              border: "none", cursor: "pointer", transition: "all 0.2s",
              background: activeView === tab.id ? "#1e2a44" : "transparent",
              color: activeView === tab.id ? "#fff" : "#5f6368",
              whiteSpace: "nowrap",
            }}>
              <tab.icon style={{ width: "16px", height: "16px" }} />
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  padding: "2px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 700,
                  background: tab.id === 'approvals' ? "#dc2626" : (activeView === tab.id ? "rgba(255,255,255,0.2)" : "#e3e8f0"),
                  color: tab.id === 'approvals' ? "#fff" : (activeView === tab.id ? "#fff" : "#5f6368"),
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════
          OVERVIEW TAB
         ═══════════════════════════════════════════ */}
      {activeView === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="admin-stats-grid">
            {[
              { label: "Total Users", value: totalUsers, icon: Users, color: "#3b82f6", bg: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.2))" },
              { label: "Active", value: activeUsers, icon: Activity, color: "#16a34a", bg: "linear-gradient(135deg, rgba(22,163,106,0.1), rgba(22,163,106,0.2))" },
              { label: "Pending Approvals", value: pendingApprovalsCount, icon: Clock, color: "#d97706", bg: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.2))" },
              { label: "Blocked & Suspended", value: blockedUsers + suspendedUsers, icon: Ban, color: "#dc2626", bg: "linear-gradient(135deg, rgba(220,38,38,0.1), rgba(220,38,38,0.2))" },
              { label: "Total Messages", value: totalMessages, icon: MessageCircle, color: "#8b5cf6", bg: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.2))" },
              { label: "Total Interests", value: totalInterests, icon: Heart, color: "#c6a55c", bg: "linear-gradient(135deg, rgba(198,165,92,0.1), rgba(198,165,92,0.2))" },
            ].map((stat, i) => (
              <div key={i} className="stat-card" style={{ 
                ["--stat-color" as string]: stat.color,
                background: "rgba(255, 255, 255, 0.7)", 
                backdropFilter: "blur(12px)", 
                border: "1px solid rgba(255, 255, 255, 0.4)", 
                borderRadius: "16px", 
                padding: "16px 12px", 
                boxShadow: "0 8px 32px rgba(31, 38, 135, 0.05)",
                display: "flex", flexDirection: "column", gap: "8px",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                minWidth: "0",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <stat.icon style={{ width: "18px", height: "18px", color: stat.color }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#1e2a44", lineHeight: "1.2" }}>{stat.value}</div>
                  <div style={{ fontSize: "11px", color: "#5f6368", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={stat.label}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Recent Users */}
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e2a44", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Users style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> Recent Users
                </h3>
                <button onClick={() => setActiveView('users')} style={{ fontSize: "12px", fontWeight: 500, color: "#1e2a44", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  View All <ChevronRight style={{ width: "12px", height: "12px" }} />
                </button>
              </div>
              {profiles.slice(-5).reverse().map(p => (
                <div key={p.id} onClick={() => viewUserDetail(p.id)} style={{
                  display: "flex", alignItems: "center", gap: "12px", padding: "10px 0",
                  borderBottom: "1px solid #f0ece4", cursor: "pointer",
                }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                    backgroundImage: p.profilePhoto ? `url('${p.profilePhoto}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                    backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "13px", fontWeight: 700,
                  }}>
                    {!p.profilePhoto && p.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e2a44" }}>{p.name}</div>
                    <div style={{ fontSize: "11px", color: "#a0aec0" }}>{p.email}</div>
                  </div>
                  {getStatusBadge(p.status)}
                </div>
              ))}
            </div>

            {/* Recent Messages */}
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e2a44", display: "flex", alignItems: "center", gap: "8px" }}>
                  <MessageCircle style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> Recent Messages
                </h3>
                <button onClick={() => setActiveView('messages')} style={{ fontSize: "12px", fontWeight: 500, color: "#1e2a44", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  View All <ChevronRight style={{ width: "12px", height: "12px" }} />
                </button>
              </div>
              {messages.slice(-5).reverse().map(m => (
                <div key={m.id} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 0", borderBottom: "1px solid #f0ece4" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                    backgroundImage: getProfilePhoto(m.senderId) ? `url('${getProfilePhoto(m.senderId)}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                    backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "11px", fontWeight: 700,
                  }}>
                    {!getProfilePhoto(m.senderId) && getProfileName(m.senderId)[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", marginBottom: "2px" }}>
                      <span style={{ fontWeight: 600, color: "#1e2a44" }}>{getProfileName(m.senderId)}</span>
                      <span style={{ color: "#a0aec0" }}> → </span>
                      <span style={{ fontWeight: 600, color: "#1e2a44" }}>{getProfileName(m.receiverId)}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#5f6368", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.text}</div>
                    <div style={{ fontSize: "10px", color: "#a0aec0", marginTop: "2px" }}>{formatTime(m.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════
          USER MANAGEMENT TAB
         ═══════════════════════════════════════════ */}
      {activeView === 'users' && (
        <>
          {/* Search & Filters */}
          <div className="card" style={{ padding: "16px 20px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
              <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
              <input type="text" placeholder="Search by name, email, or ID..." className="input" style={{ paddingLeft: "40px", height: "40px", fontSize: "13px" }} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter style={{ width: "14px", height: "14px", color: "#a0aec0" }} />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "")} style={selectStyle}>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="blocked">Blocked</option>
              </select>
              <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} style={selectStyle}>
                <option value="">All Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <span style={{ fontSize: "13px", color: "#5f6368", fontWeight: 500 }}>{filteredProfiles.length} of {totalUsers} users</span>
          </div>

          {/* User Table */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Location</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile) => (
                    <tr key={profile.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => viewUserDetail(profile.id)}>
                          <div style={{
                            width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                            backgroundImage: profile.profilePhoto ? `url('${profile.profilePhoto}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                            backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: "14px", fontWeight: 700,
                            opacity: profile.status === 'blocked' ? 0.5 : 1,
                          }}>
                            {!profile.profilePhoto && profile.name[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "14px", color: profile.status === 'blocked' ? "#a0aec0" : "#1e2a44", display: "flex", alignItems: "center", gap: "6px" }}>
                              {profile.name}
                              {profile.isVerified && <CheckCircle2 style={{ width: "12px", height: "12px", color: "#16a34a" }} />}
                              <Eye style={{ width: "12px", height: "12px", color: "#a0aec0" }} />
                            </div>
                            <div style={{ fontSize: "11px", color: "#a0aec0" }}>ID: {profile.id.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td><div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#5f6368" }}><Mail style={{ width: "12px", height: "12px", color: "#a0aec0" }} />{profile.email}</div></td>
                      <td><span style={{ fontSize: "13px" }}>{profile.gender === "MALE" ? "👨 Male" : "👩 Female"}</span></td>
                      <td><div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#5f6368" }}><MapPin style={{ width: "12px", height: "12px", color: "#a0aec0" }} />{profile.district}</div></td>
                      <td><div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#5f6368" }}><Calendar style={{ width: "12px", height: "12px", color: "#a0aec0" }} />{profile.joinDate ? new Date(profile.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}</div></td>
                      <td>{getStatusBadge(profile.status)}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                          <button onClick={() => viewUserDetail(profile.id)} className="btn-outline" style={{ padding: "5px 8px", fontSize: "11px", borderRadius: "6px" }} title="View Details">
                            <Eye style={{ width: "12px", height: "12px" }} />
                          </button>
                          {profile.status === 'pending' && (
                            <>
                              <button onClick={() => { approveUser(profile.id); showToast("User profile approved!", "success"); }} className="btn-success" style={{ padding: "5px 8px", fontSize: "11px", borderRadius: "6px" }} title="Approve">
                                <UserCheck style={{ width: "12px", height: "12px" }} />
                              </button>
                            </>
                          )}
                          {profile.status === 'active' && (
                            <>
                              <button onClick={() => setShowSuspendModal(profile.id)} className="btn-warning" style={{ padding: "5px 8px", fontSize: "11px", borderRadius: "6px" }} title="Suspend">
                                <AlertTriangle style={{ width: "12px", height: "12px" }} />
                              </button>
                              <button onClick={() => setShowConfirmBlock(profile.id)} className="btn-danger" style={{ padding: "5px 8px", fontSize: "11px", borderRadius: "6px" }} title="Block">
                                <Ban style={{ width: "12px", height: "12px" }} />
                              </button>
                            </>
                          )}
                          {profile.status === 'suspended' && (
                            <>
                              <button onClick={() => handleActivate(profile.id)} className="btn-success" style={{ padding: "5px 8px", fontSize: "11px", borderRadius: "6px" }} title="Activate">
                                <UserCheck style={{ width: "12px", height: "12px" }} />
                              </button>
                              <button onClick={() => setShowConfirmBlock(profile.id)} className="btn-danger" style={{ padding: "5px 8px", fontSize: "11px", borderRadius: "6px" }} title="Block">
                                <Ban style={{ width: "12px", height: "12px" }} />
                              </button>
                            </>
                          )}
                          {profile.status === 'blocked' && (
                            <button onClick={() => handleActivate(profile.id)} className="btn-success" style={{ padding: "5px 8px", fontSize: "11px", borderRadius: "6px" }} title="Unblock">
                              <UserCheck style={{ width: "12px", height: "12px" }} />
                            </button>
                          )}
                          <button onClick={() => setShowConfirmDelete(profile.id)} style={{ padding: "5px 8px", fontSize: "11px", borderRadius: "6px", background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.15)", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center" }} title="Delete Profile">
                            <Trash2 style={{ width: "12px", height: "12px" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProfiles.length === 0 && (
              <div style={{ padding: "48px", textAlign: "center" }}>
                <UserX style={{ width: "40px", height: "40px", color: "#a0aec0", margin: "0 auto 12px" }} />
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1e2a44" }}>No users found</h3>
                <p style={{ fontSize: "13px", color: "#5f6368", marginTop: "4px" }}>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════
          PENDING APPROVALS TAB
         ═══════════════════════════════════════════ */}
      {activeView === 'approvals' && (
        <>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Location</th>
                    <th>Education</th>
                    <th>Gothra</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allProfiles.filter(p => p.status === 'pending').map((profile) => (
                    <tr key={profile.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => viewUserDetail(profile.id)}>
                          <div style={{
                            width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                            backgroundImage: profile.profilePhoto ? `url('${profile.profilePhoto}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                            backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: "14px", fontWeight: 700,
                          }}>
                            {!profile.profilePhoto && profile.name[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e2a44", display: "flex", alignItems: "center", gap: "6px" }}>
                              {profile.name}
                              <Eye style={{ width: "12px", height: "12px", color: "#a0aec0" }} />
                            </div>
                            <div style={{ fontSize: "11px", color: "#a0aec0" }}>ID: {profile.id.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td><div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#5f6368" }}><Mail style={{ width: "12px", height: "12px", color: "#a0aec0" }} />{profile.email}</div></td>
                      <td><span style={{ fontSize: "13px" }}>{profile.gender === "MALE" ? "👨 Male" : "👩 Female"}</span></td>
                      <td><div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#5f6368" }}><MapPin style={{ width: "12px", height: "12px", color: "#a0aec0" }} />{profile.district}</div></td>
                      <td><span style={{ fontSize: "13px" }}>{profile.education}</span></td>
                      <td><span style={{ fontSize: "13px" }}>{profile.gothra}</span></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <button onClick={() => { approveUser(profile.id); showToast("User profile has been approved!", "success"); }} className="btn-success" style={{ padding: "6px 12px", fontSize: "12px", borderRadius: "8px" }}>
                            <CheckCircle2 style={{ width: "14px", height: "14px" }} /> Approve
                          </button>
                          <button onClick={() => { rejectUser(profile.id); showToast("User profile has been rejected.", "error"); }} className="btn-danger" style={{ padding: "6px 12px", fontSize: "12px", borderRadius: "8px" }}>
                            <Ban style={{ width: "14px", height: "14px" }} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {allProfiles.filter(p => p.status === 'pending').length === 0 && (
              <div style={{ padding: "48px", textAlign: "center" }}>
                <CheckCircle2 style={{ width: "40px", height: "40px", color: "#16a34a", margin: "0 auto 12px" }} />
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1e2a44" }}>No pending approvals</h3>
                <p style={{ fontSize: "13px", color: "#5f6368", marginTop: "4px" }}>All profiles have been reviewed.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════
          USER DETAIL VIEW
         ═══════════════════════════════════════════ */}
      {activeView === 'user-detail' && selectedUser && (
        <>
          {/* Profile Header */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{
              height: "140px",
              backgroundImage: selectedUser.profilePhoto ? `url('${selectedUser.profilePhoto}')` : "linear-gradient(135deg, #1e2a44, #2a3a6a)",
              backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
              position: "relative",
            }}>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }} />
              <div style={{ position: "absolute", bottom: "16px", left: "24px", display: "flex", alignItems: "center", gap: "16px", zIndex: 2 }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%", border: "3px solid #fff",
                  backgroundImage: selectedUser.profilePhoto ? `url('${selectedUser.profilePhoto}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                  backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: "24px", fontWeight: 700, flexShrink: 0,
                }}>
                  {!selectedUser.profilePhoto && selectedUser.name[0]}
                </div>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>{selectedUser.name}</h2>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>{selectedUser.age} yrs • {selectedUser.gender === 'MALE' ? 'Male' : 'Female'} • {selectedUser.location}</p>
                </div>
              </div>
              <div style={{ position: "absolute", top: "12px", right: "16px", zIndex: 2 }}>{getStatusBadge(selectedUser.status)}</div>
            </div>

            {/* Quick actions */}
            <div style={{ padding: "16px 24px", display: "flex", gap: "8px", borderBottom: "1px solid #e3e8f0", flexWrap: "wrap" }}>
              {selectedUser.status === 'pending' && (
                <>
                  <button onClick={() => { approveUser(selectedUser.id); showToast("User profile approved!", "success"); }} className="btn-success" style={{ fontSize: "12px" }}>
                    <CheckCircle2 style={{ width: "12px", height: "12px" }} /> Approve Profile
                  </button>
                  <button onClick={() => { rejectUser(selectedUser.id); showToast("User profile rejected.", "error"); }} className="btn-danger" style={{ fontSize: "12px" }}>
                    <Ban style={{ width: "12px", height: "12px" }} /> Reject Profile
                  </button>
                </>
              )}
              {selectedUser.status === 'active' && (
                <>
                  <button onClick={() => setShowSuspendModal(selectedUser.id)} className="btn-warning" style={{ fontSize: "12px" }}>
                    <AlertTriangle style={{ width: "12px", height: "12px" }} /> Suspend
                  </button>
                  <button onClick={() => setShowConfirmBlock(selectedUser.id)} className="btn-danger" style={{ fontSize: "12px" }}>
                    <Ban style={{ width: "12px", height: "12px" }} /> Block
                  </button>
                </>
              )}
              {selectedUser.status === 'suspended' && (
                <button onClick={() => handleActivate(selectedUser.id)} className="btn-success" style={{ fontSize: "12px" }}>
                  <UserCheck style={{ width: "12px", height: "12px" }} /> Activate
                </button>
              )}
              {selectedUser.status === 'blocked' && (
                <button onClick={() => handleActivate(selectedUser.id)} className="btn-success" style={{ fontSize: "12px" }}>
                  <UserCheck style={{ width: "12px", height: "12px" }} /> Unblock
                </button>
              )}
              <button onClick={() => setShowConfirmDelete(selectedUser.id)} className="btn-danger" style={{ fontSize: "12px" }}>
                <Trash2 style={{ width: "12px", height: "12px" }} /> Delete Profile
              </button>
              {/* Verify / Unverify Toggle */}
              {selectedUser.status === 'active' && (
                <button
                  onClick={() => { verifyUser(selectedUser.id, !selectedUser.isVerified); showToast(selectedUser.isVerified ? "Verification revoked" : "User verified successfully!", selectedUser.isVerified ? "warning" : "success"); }}
                  style={{
                    padding: "6px 12px", fontSize: "12px", borderRadius: "8px",
                    display: "flex", alignItems: "center", gap: "6px",
                    cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
                    background: selectedUser.isVerified ? "rgba(245,158,11,0.08)" : "rgba(22,163,106,0.08)",
                    border: `1px solid ${selectedUser.isVerified ? "rgba(245,158,11,0.2)" : "rgba(22,163,106,0.2)"}`,
                    color: selectedUser.isVerified ? "#d97706" : "#16a34a",
                  }}
                >
                  <CheckCircle2 style={{ width: "12px", height: "12px" }} />
                  {selectedUser.isVerified ? "Revoke Verification" : "Verify User"}
                </button>
              )}
            </div>
          </div>

          {/* Activity Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {[
              { label: "Interests Sent", value: userSentInterests.length, icon: Send, color: "#3b82f6" },
              { label: "Interests Received", value: userReceivedInterests.length, icon: Heart, color: "#c6a55c" },
              { label: "Messages", value: userMessages.length, icon: MessageCircle, color: "#8b5cf6" },
              { label: "Accepted Matches", value: userInterests.filter(i => i.status === 'accepted').length, icon: CheckCircle2, color: "#16a34a" },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ ["--stat-color" as string]: s.color, padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <s.icon style={{ width: "16px", height: "16px", color: s.color }} />
                  <span style={{ fontSize: "11px", color: "#5f6368", fontWeight: 600 }}>{s.label}</span>
                </div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#1e2a44" }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="dashboard-grid">
            {/* Profile Details */}
            <div className="card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1e2a44", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <User style={{ width: "16px", height: "16px", color: "#c6a55c" }} /> Profile Details
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Email", value: selectedUser.email, icon: Mail },
                  { label: "Phone", value: selectedUser.phone, icon: Phone },
                  { label: "Education", value: selectedUser.education, icon: GraduationCap },
                  { label: "Occupation", value: selectedUser.occupation, icon: Briefcase },
                  { label: "District", value: selectedUser.district, icon: MapPin },
                  { label: "Income", value: selectedUser.annualIncome, icon: Briefcase },
                  { label: "Gothra", value: selectedUser.gothra, icon: Sparkles },
                  { label: "Nakshatra", value: selectedUser.nakshatra, icon: Sparkles },
                  { label: "Joined", value: selectedUser.joinDate ? new Date(selectedUser.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—', icon: Calendar },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0", borderBottom: "1px solid #f0ece4" }}>
                    <item.icon style={{ width: "14px", height: "14px", color: "#a0aec0", flexShrink: 0 }} />
                    <span style={{ fontSize: "12px", color: "#a0aec0", fontWeight: 500, minWidth: "80px" }}>{item.label}</span>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "#1e2a44" }}>{item.value || "—"}</span>
                  </div>
                ))}
              </div>
              {selectedUser.statusReason && (
                <div style={{ marginTop: "16px", padding: "12px", borderRadius: "8px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#d97706", marginBottom: "4px" }}>SUSPENSION REASON</div>
                  <div style={{ fontSize: "13px", color: "#5f6368" }}>{selectedUser.statusReason}</div>
                </div>
              )}
            </div>

            {/* Interests Activity */}
            <div className="card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1e2a44", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Heart style={{ width: "16px", height: "16px", color: "#c6a55c" }} /> Interest Activity
              </h3>
              {userInterests.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px", color: "#a0aec0" }}>
                  <Heart style={{ width: "24px", height: "24px", margin: "0 auto 8px" }} />
                  <p style={{ fontSize: "13px" }}>No interest activity yet</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
                  {userInterests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(interest => {
                    const isOutgoing = interest.fromId === selectedUserId;
                    const partnerId = isOutgoing ? interest.toId : interest.fromId;
                    const partnerName = getProfileName(partnerId);
                    return (
                      <div key={interest.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", background: "#fafcff", border: "1px solid #f0ece4" }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                          backgroundImage: getProfilePhoto(partnerId) ? `url('${getProfilePhoto(partnerId)}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                          backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontSize: "10px", fontWeight: 700,
                        }}>
                          {!getProfilePhoto(partnerId) && partnerName[0]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "12px" }}>
                            <span style={{ fontWeight: 600, color: "#1e2a44" }}>{isOutgoing ? 'Sent to' : 'Received from'}</span>{' '}
                            <span style={{ color: "#5f6368" }}>{partnerName}</span>
                          </div>
                          <div style={{ fontSize: "10px", color: "#a0aec0" }}>{formatTime(interest.timestamp)}</div>
                        </div>
                        <span style={{
                          padding: "3px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 600,
                          background: interest.status === 'accepted' ? "rgba(22,163,106,0.1)" : interest.status === 'declined' ? "rgba(220,38,38,0.1)" : "rgba(245,158,11,0.1)",
                          color: interest.status === 'accepted' ? "#16a34a" : interest.status === 'declined' ? "#dc2626" : "#d97706",
                        }}>
                          {interest.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* User's Messages */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1e2a44", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <MessageCircle style={{ width: "16px", height: "16px", color: "#c6a55c" }} /> Messages ({userMessages.length})
            </h3>
            {userMessages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px", color: "#a0aec0" }}>
                <MessageCircle style={{ width: "24px", height: "24px", margin: "0 auto 8px" }} />
                <p style={{ fontSize: "13px" }}>No messages from this user</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px", overflowY: "auto" }}>
                {userMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(msg => {
                  const isSender = msg.senderId === selectedUserId;
                  return (
                    <div key={msg.id} style={{
                      display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px",
                      borderRadius: "10px", background: isSender ? "rgba(30,42,68,0.03)" : "rgba(22,163,106,0.03)",
                      border: `1px solid ${isSender ? "rgba(30,42,68,0.08)" : "rgba(22,163,106,0.08)"}`,
                    }}>
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                        background: isSender ? "#1e2a44" : "#16a34a",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: "10px", fontWeight: 700,
                      }}>
                        {isSender ? <Send style={{ width: "12px", height: "12px" }} /> : <Mail style={{ width: "12px", height: "12px" }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 600, color: "#1e2a44" }}>
                            {isSender ? `To: ${getProfileName(msg.receiverId)}` : `From: ${getProfileName(msg.senderId)}`}
                          </span>
                          <span style={{ fontSize: "10px", color: "#a0aec0" }}>{formatTime(msg.timestamp)}</span>
                        </div>
                        <p style={{ fontSize: "13px", color: "#5f6368", lineHeight: 1.5 }}>{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════
          ALL MESSAGES TAB
         ═══════════════════════════════════════════ */}
      {activeView === 'messages' && (
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px", minHeight: "500px" }} className="messages-grid">
          {/* Conversations List */}
          <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e3e8f0" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1e2a44" }}>All Conversations ({allConversationPairs.length})</h3>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {allConversationPairs.map((pair, i) => {
                const isActive = selectedConvoPartners && selectedConvoPartners[0] === pair.user1 && selectedConvoPartners[1] === pair.user2;
                return (
                  <button key={i} onClick={() => setSelectedConvoPartners([pair.user1, pair.user2])} style={{
                    width: "100%", padding: "14px 20px", display: "flex", alignItems: "center", gap: "10px",
                    border: "none", borderBottom: "1px solid rgba(240,236,228,0.5)", cursor: "pointer",
                    background: isActive ? "rgba(30,42,68,0.05)" : "#fff", textAlign: "left",
                    transition: "0.2s",
                  }}>
                    <div style={{ display: "flex", position: "relative", width: "44px", height: "32px", flexShrink: 0 }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        backgroundImage: getProfilePhoto(pair.user1) ? `url('${getProfilePhoto(pair.user1)}')` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: "10px", fontWeight: 700, position: "absolute", left: 0,
                        border: "2px solid #fff",
                      }}>
                        {!getProfilePhoto(pair.user1) && getProfileName(pair.user1)[0]}
                      </div>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        backgroundImage: getProfilePhoto(pair.user2) ? `url('${getProfilePhoto(pair.user2)}')` : "linear-gradient(135deg, #c6a55c, #1e2a44)",
                        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: "10px", fontWeight: 700, position: "absolute", left: "14px",
                        border: "2px solid #fff",
                      }}>
                        {!getProfilePhoto(pair.user2) && getProfileName(pair.user2)[0]}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0, marginLeft: "6px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "#1e2a44", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {getProfileName(pair.user1)} ↔ {getProfileName(pair.user2)}
                      </div>
                      <div style={{ fontSize: "11px", color: "#a0aec0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {pair.lastMsg.text}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                      <span style={{ fontSize: "10px", color: "#a0aec0" }}>{formatTime(pair.lastMsg.timestamp)}</span>
                      <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#1e2a44", color: "#fff", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {pair.count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversation Detail */}
          <div className="card" style={{ padding: 0, display: "flex", flexDirection: "column", background: "#fafcff" }}>
            {selectedConvoPartners ? (
              <>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #e3e8f0", background: "#fff", display: "flex", alignItems: "center", gap: "10px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1e2a44" }}>
                    Conversation: {getProfileName(selectedConvoPartners[0])} ↔ {getProfileName(selectedConvoPartners[1])}
                  </h3>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px" }}>
                  {convoMessages.map(msg => {
                    const isSender1 = msg.senderId === selectedConvoPartners[0];
                    return (
                      <div key={msg.id} style={{ display: "flex", justifyContent: isSender1 ? "flex-start" : "flex-end" }}>
                        <div style={{ maxWidth: "70%" }}>
                          <div style={{
                            padding: "10px 14px", borderRadius: "12px", fontSize: "13px", lineHeight: 1.4,
                            background: isSender1 ? "#fff" : "#1e2a44",
                            color: isSender1 ? "#1e2a44" : "#fff",
                            border: isSender1 ? "1px solid #e3e8f0" : "none",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                          }}>
                            {msg.text}
                          </div>
                          <div style={{ fontSize: "9px", color: "#a0aec0", marginTop: "2px", textAlign: isSender1 ? "left" : "right" }}>
                            {getProfileName(msg.senderId)} • {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", color: "#a0aec0" }}>
                <MessageCircle style={{ width: "40px", height: "40px", marginBottom: "12px" }} />
                <p style={{ fontSize: "14px", fontWeight: 500 }}>Select a conversation from the list to monitor</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          SYSTEM SETTINGS TAB
         ═══════════════════════════════════════════ */}
      {activeView === 'settings' && (
        <div className="card animate-fade-in" style={{ padding: "32px", maxWidth: "600px", margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", borderBottom: "1px solid #f0ece4", paddingBottom: "16px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(198,165,92,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Settings style={{ width: "22px", height: "22px", color: "#c6a55c" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1e2a44", margin: 0 }}>System Configurations</h2>
              <p style={{ fontSize: "12px", color: "#5f6368", margin: 0 }}>Global settings for the Maduvedibbana platform</p>
            </div>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsSavingSettings(true);
            try {
              await updateSystemSettings({
                dailyInterestLimit: Number(interestLimit),
                autoApproveProfiles: autoApprove,
              });
              showToast("System settings updated successfully", "success");
            } catch (err) {
              showToast("Failed to update system settings", "error");
            } finally {
              setIsSavingSettings(false);
            }
          }} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>
                Daily Interest Limit per User
              </label>
              <input
                type="number"
                value={interestLimit}
                onChange={(e) => setInterestLimit(Number(e.target.value))}
                className="input"
                min={1}
                max={100}
                required
              />
              <p style={{ fontSize: "11px", color: "#a0aec0", marginTop: "4px" }}>
                The maximum number of interest requests a regular member can send each day.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "#fafcff", border: "1px solid #e3e8f0", borderRadius: "12px" }}>
              <div style={{ flex: 1, paddingRight: "16px" }}>
                <h4 style={{ fontWeight: 600, fontSize: "13px", color: "#1e2a44", margin: 0 }}>Auto-Approve Profiles</h4>
                <p style={{ fontSize: "11px", color: "#5f6368", margin: "4px 0 0 0" }}>
                  When enabled, newly registered users bypass manual admin validation and become Active immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoApprove(!autoApprove)}
                style={{
                  width: "48px", height: "26px", borderRadius: "999px",
                  background: autoApprove ? "#1e2a44" : "#e3e8f0",
                  border: "none", cursor: "pointer",
                  position: "relative", transition: "all 0.3s ease",
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: "#fff", position: "absolute",
                  top: "3px", left: autoApprove ? "25px" : "3px",
                  transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }} />
              </button>
            </div>

            <button
              type="submit"
              disabled={isSavingSettings}
              className="btn-primary-gold"
              style={{ width: "100%", height: "46px", marginTop: "8px", opacity: isSavingSettings ? 0.7 : 1 }}
            >
              {isSavingSettings ? "Saving Settings..." : "Save Configuration"}
            </button>
          </form>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => { setShowSuspendModal(null); setSuspendReason(""); }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "440px", background: "#fff", borderRadius: "20px", padding: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "scaleIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle style={{ width: "20px", height: "20px", color: "#d97706" }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1e2a44" }}>Suspend User</h3>
                <p style={{ fontSize: "12px", color: "#5f6368" }}>User: {allProfiles.find(p => p.id === showSuspendModal)?.name}</p>
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Reason for suspension *</label>
              <textarea value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} className="input" style={{ height: "auto", minHeight: "80px", resize: "none" }} placeholder="Provide a reason for the suspension..." rows={3} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => { setShowSuspendModal(null); setSuspendReason(""); }} className="btn-outline" style={{ flex: 1, height: "44px" }}>Cancel</button>
              <button onClick={() => handleSuspend(showSuspendModal)} disabled={!suspendReason.trim()} className="btn-warning" style={{ flex: 1, height: "44px", opacity: suspendReason.trim() ? 1 : 0.5, cursor: suspendReason.trim() ? "pointer" : "not-allowed" }}>
                <AlertTriangle style={{ width: "14px", height: "14px" }} /> Confirm Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {showConfirmBlock && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setShowConfirmBlock(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "440px", background: "#fff", borderRadius: "20px", padding: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "scaleIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(220,38,38,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ban style={{ width: "20px", height: "20px", color: "#dc2626" }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1e2a44" }}>Block User</h3>
                <p style={{ fontSize: "12px", color: "#5f6368" }}>User: {allProfiles.find(p => p.id === showConfirmBlock)?.name}</p>
              </div>
            </div>
            <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "20px", lineHeight: 1.6, background: "rgba(220,38,38,0.04)", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(220,38,38,0.1)" }}>
              ⚠️ This will permanently block the user. They will not be able to login or appear in search results.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setShowConfirmBlock(null)} className="btn-outline" style={{ flex: 1, height: "44px" }}>Cancel</button>
              <button onClick={() => handleBlock(showConfirmBlock)} className="btn-danger" style={{ flex: 1, height: "44px" }}><Ban style={{ width: "14px", height: "14px" }} /> Block User</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setShowConfirmDelete(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "440px", background: "#fff", borderRadius: "20px", padding: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "scaleIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(220,38,38,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Trash2 style={{ width: "20px", height: "20px", color: "#dc2626" }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1e2a44" }}>Delete Profile</h3>
                <p style={{ fontSize: "12px", color: "#5f6368" }}>User: {allProfiles.find(p => p.id === showConfirmDelete)?.name}</p>
              </div>
            </div>
            <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "20px", lineHeight: 1.6, background: "rgba(220,38,38,0.04)", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(220,38,38,0.1)" }}>
              🗑️ This will permanently remove the user profile. All their data, messages, and interests will be lost. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setShowConfirmDelete(null)} className="btn-outline" style={{ flex: 1, height: "44px" }}>Cancel</button>
              <button onClick={() => handleDelete(showConfirmDelete)} className="btn-danger" style={{ flex: 1, height: "44px" }}><Trash2 style={{ width: "14px", height: "14px" }} /> Delete Permanently</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`} style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 10000 }}>
          {toast.type === 'success' && <CheckCircle2 style={{ width: "16px", height: "16px" }} />}
          {toast.type === 'warning' && <AlertTriangle style={{ width: "16px", height: "16px" }} />}
          {toast.type === 'error' && <Ban style={{ width: "16px", height: "16px" }} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
