"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import {
  Search, Filter, MapPin, GraduationCap, Briefcase, Heart,
  User, CheckCircle2, X, SlidersHorizontal, Sparkles,
  Phone, Mail, AlertCircle, Crown, Users, Calendar,
  Zap, Ban, AlertTriangle, UserCheck, Shield, Eye, Ruler, Star,
} from "lucide-react";

export default function BrowseMatchesPage() {
  const {
    profiles, getActiveProfiles, sendInterest, interests, getRemainingInterests,
    currentUser, blockUser, suspendUser, activateUser, toggleShortlist,
  } = useStore();

  const isAdmin = currentUser.role === 'admin';

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("default");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filters
  const [filterGender, setFilterGender] = useState("");
  const [filterAgeMin, setFilterAgeMin] = useState("");
  const [filterAgeMax, setFilterAgeMax] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterGothra, setFilterGothra] = useState("");
  const [filterHeight, setFilterHeight] = useState("");
  const [filterEducation, setFilterEducation] = useState("");
  const [filterNakshatra, setFilterNakshatra] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Admin modals
  const [showSuspendModal, setShowSuspendModal] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [showBlockConfirm, setShowBlockConfirm] = useState<string | null>(null);

  const remainingInterests = getRemainingInterests();
  // Admin sees ALL profiles (including suspended/blocked), users see only active
  const browseProfiles = isAdmin ? profiles : getActiveProfiles();

  const filteredProfiles = browseProfiles
    .filter((p) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!p.name.toLowerCase().includes(term) &&
            !p.location.toLowerCase().includes(term) &&
            !p.occupation.toLowerCase().includes(term) &&
            !p.education.toLowerCase().includes(term) &&
            !p.email.toLowerCase().includes(term)) return false;
      }
      if (filterGender && p.gender !== filterGender) return false;
      if (filterAgeMin && p.age < parseInt(filterAgeMin)) return false;
      if (filterAgeMax && p.age > parseInt(filterAgeMax)) return false;
      if (filterDistrict && p.district !== filterDistrict) return false;
      if (filterGothra && p.gothra.toLowerCase() !== filterGothra.toLowerCase()) return false;
      if (filterHeight && p.height !== filterHeight) return false;
      if (filterEducation && p.education !== filterEducation) return false;
      if (filterNakshatra && p.nakshatra !== filterNakshatra) return false;
      if (filterStatus && p.status !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "age-asc") return a.age - b.age;
      if (sortBy === "age-desc") return b.age - a.age;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "newest") return new Date(b.joinDate || 0).getTime() - new Date(a.joinDate || 0).getTime();
      if (sortBy === "location") return a.location.localeCompare(b.location);
      return 0;
    });

  const hasSentInterest = (toId: string) => interests.some((i) => i.fromId === currentUser.id && i.toId === toId);

  // Check if mutual interest accepted (both parties accepted)
  const isMutualMatch = (profileId: string) => {
    return interests.some((i) =>
      ((i.fromId === currentUser.id && i.toId === profileId) || (i.fromId === profileId && i.toId === currentUser.id)) &&
      i.status === "accepted"
    );
  };

  const activeFilterCount = [
    filterGender, filterAgeMin, filterAgeMax, filterDistrict, filterGothra,
    filterHeight, filterEducation, filterNakshatra, filterStatus
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterGender(""); setFilterAgeMin(""); setFilterAgeMax(""); setFilterDistrict(""); setFilterGothra("");
    setFilterHeight(""); setFilterEducation(""); setFilterNakshatra(""); setFilterStatus("");
  };

  const uniqueDistricts = Array.from(new Set(browseProfiles.map(p => p.district))).sort();
  const uniqueGothras = Array.from(new Set(browseProfiles.map(p => p.gothra))).sort();
  const uniqueHeights = Array.from(new Set(browseProfiles.map(p => p.height))).sort();
  const uniqueEducations = Array.from(new Set(browseProfiles.map(p => p.education))).sort();
  const uniqueNakshatras = Array.from(new Set(browseProfiles.map(p => p.nakshatra))).sort();

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterGender, filterAgeMin, filterAgeMax, filterDistrict, filterGothra, filterHeight, filterEducation, filterNakshatra, filterStatus, sortBy]);

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProfiles = filteredProfiles.slice(startIndex, startIndex + itemsPerPage);
  const detailProfile = selectedProfile ? profiles.find(p => p.id === selectedProfile) : null;

  const showToast = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSendInterest = async (profileId: string) => {
    if (isAdmin) return; // Admin cannot send interests
    if (currentUser.status === 'blocked' || currentUser.status === 'suspended') {
      showToast("Your account is restricted. You cannot send interests.", "error");
      return;
    }
    if (remainingInterests <= 0) {
      showToast("Daily interest limit reached! Try again tomorrow.", "warning");
      return;
    }
    const success = await sendInterest(profileId);
    if (success) {
      showToast("Interest sent successfully! 💕", "success");
    } else {
      showToast("Interest already sent to this profile", "warning");
    }
  };

  const handleAdminBlock = (userId: string) => {
    blockUser(userId);
    setShowBlockConfirm(null);
    showToast("User has been blocked", "error");
  };

  const handleAdminSuspend = (userId: string) => {
    if (!suspendReason.trim()) return;
    suspendUser(userId, suspendReason);
    setShowSuspendModal(null);
    setSuspendReason("");
    showToast("User has been suspended", "warning");
  };

  const handleAdminActivate = (userId: string) => {
    activateUser(userId);
    showToast("User has been activated", "success");
  };

  const getMatchScore = (profileId: string): number => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return 70;
    let score = 60; // base score
    let checks = 0;
    let matches = 0;

    // Age preference match
    if (currentUser.prefAgeMin && currentUser.prefAgeMax) {
      checks++;
      const min = parseInt(currentUser.prefAgeMin);
      const max = parseInt(currentUser.prefAgeMax);
      if (profile.age >= min && profile.age <= max) matches++;
    }
    // District match
    if (currentUser.prefDistrict) {
      checks++;
      if (profile.district === currentUser.prefDistrict) matches++;
    }
    // Education match
    if (currentUser.prefEducation) {
      checks++;
      if (profile.education === currentUser.prefEducation) matches++;
    }
    // Height preference — parse to inches for proper numeric comparison
    if (currentUser.prefHeightMin) {
      checks++;
      const parseHeightToInches = (h: string): number => {
        const match = h.match(/(\d+)'(\d+)/);
        return match ? parseInt(match[1]) * 12 + parseInt(match[2]) : 0;
      };
      if (parseHeightToInches(profile.height) >= parseHeightToInches(currentUser.prefHeightMin)) matches++;
    }
    // Same community (gothra should NOT match — exogamy rule)
    if (currentUser.gothra && profile.gothra) {
      checks++;
      if (currentUser.gothra.toLowerCase() !== profile.gothra.toLowerCase()) matches++;
    }

    if (checks > 0) {
      score = 50 + Math.round((matches / checks) * 45); // 50-95 range
    } else {
      // Fallback: deterministic hash if no preferences set
      const hash = profileId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      score = 65 + (hash % 30);
    }
    return Math.min(95, Math.max(50, score));
  };

  const getAvatarGradient = (name: string) => {
    const gradients = [
      "linear-gradient(135deg, #1e2a44, #3b5998)",
      "linear-gradient(135deg, #2d3436, #636e72)",
      "linear-gradient(135deg, #6c5ce7, #a29bfe)",
      "linear-gradient(135deg, #e17055, #fdcb6e)",
      "linear-gradient(135deg, #00b894, #00cec9)",
      "linear-gradient(135deg, #d63031, #e17055)",
      "linear-gradient(135deg, #0984e3, #74b9ff)",
      "linear-gradient(135deg, #1e2a44, #c6a55c)",
    ];
    return gradients[name.charCodeAt(0) % gradients.length];
  };

  const getStatusBadge = (status: string) => {
    const cfg: Record<string, { bg: string; color: string; label: string }> = {
      active: { bg: "rgba(22,163,106,0.15)", color: "#16a34a", label: "Active" },
      suspended: { bg: "rgba(245,158,11,0.15)", color: "#d97706", label: "Suspended" },
      blocked: { bg: "rgba(220,38,38,0.15)", color: "#dc2626", label: "Blocked" },
    };
    const s = cfg[status] || cfg.active;
    return (
      <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px", background: s.bg, color: s.color }}>
        {s.label}
      </span>
    );
  };

  const selectStyle: React.CSSProperties = {
    padding: "8px 32px 8px 12px", background: "#fafcff",
    border: "1px solid #e3e8f0", borderRadius: "8px",
    fontSize: "13px", color: "#1e2a44", outline: "none", height: "38px",
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, color: "#1e2a44", marginBottom: "4px" }}>
            {isAdmin ? "All User Profiles" : "Browse Matches"}
          </h1>
          <p style={{ fontSize: "14px", color: "#5f6368" }}>
            {filteredProfiles.length} profiles found
            {isAdmin && <span style={{ marginLeft: "8px", fontSize: "11px", padding: "2px 8px", borderRadius: "999px", background: "rgba(198,165,92,0.1)", color: "#c6a55c", fontWeight: 600 }}>🛡️ Admin View</span>}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Interest Limit — only for normal users */}
          {!isAdmin && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 14px", borderRadius: "12px",
              background: remainingInterests <= 2 ? "rgba(220,38,38,0.06)" : "rgba(22,163,106,0.06)",
              border: `1px solid ${remainingInterests <= 2 ? "rgba(220,38,38,0.15)" : "rgba(22,163,106,0.15)"}`,
            }}>
              <Zap style={{ width: "14px", height: "14px", color: remainingInterests <= 2 ? "#dc2626" : "#16a34a" }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: remainingInterests <= 2 ? "#dc2626" : "#16a34a" }}>
                {remainingInterests}/{useStore.getState().systemSettings?.dailyInterestLimit ?? 10} interests today
              </span>
            </div>
          )}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ ...selectStyle, width: "auto" }}>
            <option value="default">Sort: Default</option>
            <option value="newest">Sort: Newest</option>
            <option value="age-asc">Age: Low to High</option>
            <option value="age-desc">Age: High to Low</option>
            <option value="name">Name: A-Z</option>
            <option value="location">Location: A-Z</option>
          </select>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="card" style={{ padding: "12px 16px", display: "flex", gap: "12px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
          <input type="text" placeholder={isAdmin ? "Search by name, email, location..." : "Search by name, location, education..."} className="input" style={{ paddingLeft: "40px", height: "44px" }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-outline" style={{ height: "44px", padding: "0 16px", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, position: "relative" }}>
          <SlidersHorizontal style={{ width: "16px", height: "16px" }} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span style={{ position: "absolute", top: "-6px", right: "-6px", width: "20px", height: "20px", borderRadius: "50%", background: "#1e2a44", color: "#fff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", animation: "slideDown 0.3s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1e2a44", display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter style={{ width: "16px", height: "16px", color: "#c6a55c" }} /> Filter Profiles
            </h3>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} style={{ fontSize: "12px", fontWeight: 500, color: "#dc2626", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                <X style={{ width: "12px", height: "12px" }} /> Clear All
              </button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Gender</label>
              <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} style={{ ...selectStyle, width: "100%" }}>
                <option value="">All</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Age From</label>
              <input type="number" value={filterAgeMin} onChange={(e) => setFilterAgeMin(e.target.value)} placeholder="18" className="input" style={{ height: "38px", fontSize: "13px", padding: "8px 12px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Age To</label>
              <input type="number" value={filterAgeMax} onChange={(e) => setFilterAgeMax(e.target.value)} placeholder="40" className="input" style={{ height: "38px", fontSize: "13px", padding: "8px 12px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>District</label>
              <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} style={{ ...selectStyle, width: "100%" }}>
                <option value="">All</option>
                {uniqueDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Gothra</label>
              <select value={filterGothra} onChange={(e) => setFilterGothra(e.target.value)} style={{ ...selectStyle, width: "100%" }}>
                <option value="">All</option>
                {uniqueGothras.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Education</label>
              <select value={filterEducation} onChange={(e) => setFilterEducation(e.target.value)} style={{ ...selectStyle, width: "100%" }}>
                <option value="">All</option>
                {uniqueEducations.map(ed => <option key={ed} value={ed}>{ed}</option>)}
              </select>
            </div>
            {/* Admin-only status filter */}
            {isAdmin && (
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Status</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...selectStyle, width: "100%" }}>
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {paginatedProfiles.map((profile) => {
          const sent = hasSentInterest(profile.id);
          const matched = isMutualMatch(profile.id);
          const matchScore = getMatchScore(profile.id);
          return (
            <div key={profile.id} className="profile-card" style={{ display: "flex", flexDirection: "column", opacity: profile.status !== 'active' ? 0.7 : 1 }}>
              {/* Avatar Area */}
              <div style={{
                height: "180px",
                backgroundImage: (profile.photoPrivacy && !matched && !isAdmin) ? "linear-gradient(135deg, #1e2a44, #c6a55c)" : (profile.profilePhoto ? `url('${profile.profilePhoto}')` : getAvatarGradient(profile.name)),
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", cursor: "pointer",
              }} onClick={() => setSelectedProfile(profile.id)}>
                <div className="photo-overlay" />
                {!profile.profilePhoto && (
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid rgba(255,255,255,0.3)", fontSize: "32px", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
                    {profile.name[0]}
                  </div>
                )}
                {/* Shortlist Star button (user only) */}
                {!isAdmin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleShortlist(profile.id); }}
                    style={{
                      position: "absolute", top: "12px", right: "12px",
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
                      border: "none", cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center", zIndex: 10,
                      transition: "all 0.2s"
                    }}
                    title={currentUser.shortlistedIds?.includes(profile.id) ? "Remove from Shortlist" : "Add to Shortlist"}
                  >
                    <Star
                      style={{ width: "16px", height: "16px", color: currentUser.shortlistedIds?.includes(profile.id) ? "#fbbf24" : "#fff" }}
                      fill={currentUser.shortlistedIds?.includes(profile.id) ? "#fbbf24" : "none"}
                    />
                  </button>
                )}
                {/* Gender badge */}
                <div style={{ position: "absolute", top: "12px", right: isAdmin ? "12px" : "50px", padding: "4px 10px", borderRadius: "20px", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", fontSize: "11px", fontWeight: 600, color: "#fff" }}>
                  {profile.gender === "MALE" ? "👨 Groom" : "👩 Bride"}
                </div>
                {/* Admin: show status badge */}
                {isAdmin && (
                  <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                    {getStatusBadge(profile.status)}
                  </div>
                )}
                {/* User: show match score */}
                {!isAdmin && (
                  <div style={{ position: "absolute", top: "12px", left: "12px", padding: "4px 10px", borderRadius: "20px", background: "linear-gradient(135deg, rgba(198,165,92,0.9), rgba(180,140,60,0.9))", fontSize: "11px", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Crown style={{ width: "10px", height: "10px" }} /> {matchScore}% Match
                  </div>
                )}
                {/* Name on photo */}
                <div style={{ position: "absolute", bottom: "12px", left: "16px", right: "16px", zIndex: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <h3 style={{ fontWeight: 700, fontSize: "18px", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.5)", margin: 0 }}>{profile.name}</h3>
                    {profile.isVerified && (
                      <div title="Verified by Admin" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px", borderRadius: "50%", background: "#3b82f6", color: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                        <CheckCircle2 style={{ width: "10px", height: "10px" }} />
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", textShadow: "0 1px 2px rgba(0,0,0,0.5)", margin: "2px 0 0 0" }}>
                    {profile.age} yrs, {profile.height} • {profile.maritalStatus}
                  </p>
                </div>
              </div>

              {/* Profile Info */}
              <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#5f6368" }}>
                    <MapPin style={{ width: "14px", height: "14px", color: "#a0aec0", flexShrink: 0 }} /> <span>{profile.location}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#5f6368" }}>
                    <GraduationCap style={{ width: "14px", height: "14px", color: "#a0aec0", flexShrink: 0 }} /> <span>{profile.education}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#5f6368" }}>
                    <Briefcase style={{ width: "14px", height: "14px", color: "#a0aec0", flexShrink: 0 }} /> <span>{profile.occupation}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#5f6368" }}>
                    <Sparkles style={{ width: "14px", height: "14px", color: "#c6a55c", flexShrink: 0 }} /> <span>{profile.gothra} • {profile.nakshatra}</span>
                  </div>
                  {/* Admin: show contact directly on card */}
                  {isAdmin && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#3b82f6", marginTop: "2px" }}>
                      <Phone style={{ width: "12px", height: "12px", flexShrink: 0 }} /> <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", paddingTop: "12px", borderTop: "1px solid #e3e8f0" }}>
                  {isAdmin ? (
                    /* ── ADMIN ACTIONS ── */
                    <>
                      {profile.status === 'active' && (
                        <>
                          <button onClick={() => setShowSuspendModal(profile.id)} style={{ flex: 1, padding: "10px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, border: "1px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.06)", color: "#d97706", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                            <AlertTriangle style={{ width: "12px", height: "12px" }} /> Suspend
                          </button>
                          <button onClick={() => setShowBlockConfirm(profile.id)} style={{ flex: 1, padding: "10px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.06)", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                            <Ban style={{ width: "12px", height: "12px" }} /> Block
                          </button>
                        </>
                      )}
                      {profile.status === 'suspended' && (
                        <>
                          <button onClick={() => handleAdminActivate(profile.id)} style={{ flex: 1, padding: "10px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, border: "1px solid rgba(22,163,106,0.3)", background: "rgba(22,163,106,0.06)", color: "#16a34a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                            <UserCheck style={{ width: "12px", height: "12px" }} /> Activate
                          </button>
                          <button onClick={() => setShowBlockConfirm(profile.id)} style={{ flex: 1, padding: "10px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.06)", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                            <Ban style={{ width: "12px", height: "12px" }} /> Block
                          </button>
                        </>
                      )}
                      {profile.status === 'blocked' && (
                        <button onClick={() => handleAdminActivate(profile.id)} style={{ flex: 1, padding: "10px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, border: "1px solid rgba(22,163,106,0.3)", background: "rgba(22,163,106,0.06)", color: "#16a34a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                          <UserCheck style={{ width: "12px", height: "12px" }} /> Unblock & Activate
                        </button>
                      )}
                      <button onClick={() => setSelectedProfile(profile.id)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e3e8f0", borderRadius: "10px", background: "#fff", cursor: "pointer", color: "#5f6368", flexShrink: 0 }} title="View Full Profile">
                        <Eye style={{ width: "16px", height: "16px" }} />
                      </button>
                    </>
                  ) : (
                    /* ── USER ACTIONS ── */
                    <>
                      <button
                        onClick={() => handleSendInterest(profile.id)}
                        disabled={sent || remainingInterests <= 0}
                        style={{
                          flex: 1, padding: "10px", borderRadius: "10px", fontSize: "13px",
                          fontWeight: 600, border: "none",
                          cursor: sent || remainingInterests <= 0 ? "default" : "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                          background: sent ? "rgba(22,163,106,0.1)" : remainingInterests <= 0 ? "#e3e8f0" : "#1e2a44",
                          color: sent ? "#16a34a" : remainingInterests <= 0 ? "#a0aec0" : "#fff",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {sent ? <><CheckCircle2 style={{ width: "14px", height: "14px" }} /> Interest Sent</> :
                         remainingInterests <= 0 ? <><AlertCircle style={{ width: "14px", height: "14px" }} /> Limit Reached</> :
                         <><Heart style={{ width: "14px", height: "14px" }} /> Send Interest</>}
                      </button>
                      <button onClick={() => setSelectedProfile(profile.id)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e3e8f0", borderRadius: "10px", background: "#fff", cursor: "pointer", color: "#5f6368", flexShrink: 0 }} title="View Profile">
                        <User style={{ width: "16px", height: "16px" }} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="btn-outline" style={{ padding: "8px 16px", height: "38px", fontSize: "13px", opacity: currentPage === 1 ? 0.5 : 1 }}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} style={{ width: "38px", height: "38px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, border: "1px solid #e3e8f0", cursor: "pointer", background: currentPage === page ? "#1e2a44" : "#fff", color: currentPage === page ? "#fff" : "#1e2a44" }}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="btn-outline" style={{ padding: "8px 16px", height: "38px", fontSize: "13px", opacity: currentPage === totalPages ? 0.5 : 1 }}>Next</button>
        </div>
      )}

      {filteredProfiles.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "48px" }}>
          <Search style={{ width: "48px", height: "48px", color: "#a0aec0", margin: "0 auto 12px" }} />
          <h3 style={{ fontWeight: 600, fontSize: "18px", color: "#1e2a44" }}>No profiles found</h3>
          <p style={{ fontSize: "14px", color: "#5f6368", marginTop: "4px" }}>Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* ═══ Profile Detail Modal ═══ */}
      {detailProfile && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setSelectedProfile(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "640px", maxHeight: "90vh", overflowY: "auto", background: "#fff", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "scaleIn 0.3s ease" }}>
            {/* Header */}
            <div style={{
              height: "200px",
              backgroundImage: detailProfile.profilePhoto ? `url('${detailProfile.profilePhoto}')` : getAvatarGradient(detailProfile.name),
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              borderRadius: "20px 20px 0 0"
            }}>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }} />
              <button onClick={() => setSelectedProfile(null)} style={{ position: "absolute", top: "16px", right: "16px", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                <X style={{ width: "20px", height: "20px" }} />
              </button>
              {/* Admin status badge or user match score */}
              <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 2 }}>
                {isAdmin ? getStatusBadge(detailProfile.status) : (
                  <div style={{ padding: "6px 14px", borderRadius: "20px", background: "linear-gradient(135deg, rgba(198,165,92,0.9), rgba(180,140,60,0.9))", fontSize: "12px", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Crown style={{ width: "12px", height: "12px" }} /> {getMatchScore(detailProfile.id)}% Match
                  </div>
                )}
              </div>
              {!detailProfile.profilePhoto && (
                <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid rgba(255,255,255,0.3)", fontSize: "40px", fontWeight: 700, color: "rgba(255,255,255,0.9)", zIndex: 2 }}>
                  {detailProfile.name[0]}
                </div>
              )}
              <div style={{ position: "absolute", bottom: "16px", left: "24px", zIndex: 2 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.4)" }}>{detailProfile.name}</h2>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", marginTop: "2px" }}>
                  {detailProfile.age} years • {detailProfile.height} • {detailProfile.maritalStatus}
                </p>
              </div>
            </div>

            <div style={{ padding: "24px 32px" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                <span className="badge">{detailProfile.gender === "MALE" ? "👨 Groom" : "👩 Bride"}</span>
                <span className="badge">{detailProfile.gothra}</span>
                <span className="badge">{detailProfile.annualIncome}</span>
                {isAdmin && <span className="badge" style={{ background: "rgba(198,165,92,0.1)", color: "#c6a55c" }}>🛡️ Admin View</span>}
              </div>

              {/* Bio */}
              {detailProfile.bio && (
                <div style={{ padding: "16px", background: "rgba(30,42,68,0.03)", borderRadius: "12px", marginBottom: "24px" }}>
                  <p style={{ fontSize: "14px", color: "#5f6368", lineHeight: 1.7, fontStyle: "italic" }}>&ldquo;{detailProfile.bio}&rdquo;</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Personal Details */}
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#c6a55c", textTransform: "uppercase" as const, letterSpacing: "1px", borderBottom: "1px solid #e3e8f0", paddingBottom: "6px", marginBottom: "12px" }}>Personal & Astro Details</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
                    {[
                      { label: "Location", value: detailProfile.location, icon: MapPin },
                      { label: "District", value: detailProfile.district, icon: MapPin },
                      { label: "Education", value: detailProfile.education, icon: GraduationCap },
                      { label: "Occupation", value: detailProfile.occupation, icon: Briefcase },
                      { label: "Annual Income", value: detailProfile.annualIncome, icon: Briefcase },
                      { label: "Gothra", value: detailProfile.gothra, icon: Heart },
                      { label: "Nakshatra", value: detailProfile.nakshatra, icon: Sparkles },
                      { label: "Rashi", value: detailProfile.rashi, icon: Sparkles },
                      { label: "Weight", value: detailProfile.weight ? `${detailProfile.weight} kg` : "", icon: User },
                      { label: "Complexion", value: detailProfile.complexion, icon: User },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <item.icon style={{ width: "16px", height: "16px", color: "#a0aec0", marginTop: "2px", flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: "10px", color: "#a0aec0", fontWeight: 500, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{item.label}</div>
                          <div style={{ fontSize: "13px", fontWeight: 500, color: "#1e2a44", marginTop: "1px" }}>{item.value || "—"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Family */}
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#c6a55c", textTransform: "uppercase" as const, letterSpacing: "1px", borderBottom: "1px solid #e3e8f0", paddingBottom: "6px", marginBottom: "12px" }}>Family Background</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
                    {[
                      { label: "Father", value: detailProfile.fatherName, icon: User },
                      { label: "Father's Occupation", value: detailProfile.fatherOccupation, icon: Briefcase },
                      { label: "Mother", value: detailProfile.motherName, icon: User },
                      { label: "Mother's Occupation", value: detailProfile.motherOccupation, icon: Briefcase },
                      { label: "Siblings", value: detailProfile.siblings, icon: Users },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", gridColumn: item.label === "Siblings" ? "span 2" : undefined }}>
                        <item.icon style={{ width: "16px", height: "16px", color: "#a0aec0", marginTop: "2px", flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: "10px", color: "#a0aec0", fontWeight: 500, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{item.label}</div>
                          <div style={{ fontSize: "13px", fontWeight: 500, color: "#1e2a44", marginTop: "1px" }}>{item.value || "—"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Details — DIFFERENT for admin vs user */}
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#c6a55c", textTransform: "uppercase" as const, letterSpacing: "1px", borderBottom: "1px solid #e3e8f0", paddingBottom: "6px", marginBottom: "12px" }}>Contact Details</h4>
                  {isAdmin ? (
                    /* Admin sees ALL contact details always */
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", background: "rgba(198,165,92,0.04)", padding: "14px 16px", borderRadius: "10px", border: "1px solid rgba(198,165,92,0.15)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Phone style={{ width: "16px", height: "16px", color: "#c6a55c" }} />
                        <div>
                          <div style={{ fontSize: "10px", color: "#c6a55c", fontWeight: 600 }}>Mobile Number</div>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>{detailProfile.phone}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Mail style={{ width: "16px", height: "16px", color: "#c6a55c" }} />
                        <div>
                          <div style={{ fontSize: "10px", color: "#c6a55c", fontWeight: 600 }}>Email Address</div>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>{detailProfile.email}</div>
                        </div>
                      </div>
                      <div style={{ gridColumn: "span 2", fontSize: "10px", color: "#a0aec0", fontStyle: "italic", marginTop: "4px" }}>
                        🛡️ Visible to you as admin. Normal users can only see this after mutual interest acceptance.
                      </div>
                    </div>
                  ) : isMutualMatch(detailProfile.id) ? (
                    /* User sees contact only after mutual match */
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", background: "rgba(22,163,106,0.05)", padding: "14px 16px", borderRadius: "10px", border: "1px solid rgba(22,163,106,0.15)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Phone style={{ width: "16px", height: "16px", color: "#16a34a" }} />
                        <div>
                          <div style={{ fontSize: "10px", color: "#16a34a", fontWeight: 600 }}>Mobile Number</div>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>{detailProfile.phone}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Mail style={{ width: "16px", height: "16px", color: "#16a34a" }} />
                        <div>
                          <div style={{ fontSize: "10px", color: "#16a34a", fontWeight: 600 }}>Email Address</div>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>{detailProfile.email}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* User: contact hidden */
                    <div style={{ background: "rgba(30,42,68,0.03)", padding: "18px", borderRadius: "12px", border: "1px solid #e3e8f0", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e2a44" }}>🔒 Contact Details Hidden</span>
                      <span style={{ fontSize: "12px", color: "#5f6368", maxWidth: "400px" }}>
                        Mobile number and email will be visible once you both accept each other&apos;s interest. Send an interest to get started!
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e3e8f0" }}>
                {isAdmin ? (
                  /* Admin: moderation actions in modal */
                  <>
                    {detailProfile.status === 'active' && (
                      <>
                        <button onClick={() => { setShowSuspendModal(detailProfile.id); }} style={{ flex: 1, height: "48px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, border: "1px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.06)", color: "#d97706", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                          <AlertTriangle style={{ width: "16px", height: "16px" }} /> Suspend User
                        </button>
                        <button onClick={() => setShowBlockConfirm(detailProfile.id)} style={{ flex: 1, height: "48px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.06)", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                          <Ban style={{ width: "16px", height: "16px" }} /> Block User
                        </button>
                      </>
                    )}
                    {detailProfile.status === 'suspended' && (
                      <button onClick={() => { handleAdminActivate(detailProfile.id); }} style={{ flex: 1, height: "48px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, border: "1px solid rgba(22,163,106,0.3)", background: "rgba(22,163,106,0.06)", color: "#16a34a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <UserCheck style={{ width: "16px", height: "16px" }} /> Activate User
                      </button>
                    )}
                    {detailProfile.status === 'blocked' && (
                      <button onClick={() => { handleAdminActivate(detailProfile.id); }} style={{ flex: 1, height: "48px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, border: "1px solid rgba(22,163,106,0.3)", background: "rgba(22,163,106,0.06)", color: "#16a34a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <UserCheck style={{ width: "16px", height: "16px" }} /> Unblock User
                      </button>
                    )}
                    <button onClick={() => setSelectedProfile(null)} className="btn-outline" style={{ flex: 1, height: "48px" }}><span>Close</span></button>
                  </>
                ) : (
                  /* User: send interest / close */
                  <>
                    <button
                      onClick={() => handleSendInterest(detailProfile.id)}
                      disabled={hasSentInterest(detailProfile.id) || remainingInterests <= 0}
                      className="btn-primary"
                      style={{
                        flex: 1, height: "48px",
                        background: hasSentInterest(detailProfile.id) ? "rgba(22,163,106,0.1)" : remainingInterests <= 0 ? "#e3e8f0" : undefined,
                        color: hasSentInterest(detailProfile.id) ? "#16a34a" : remainingInterests <= 0 ? "#a0aec0" : undefined,
                        boxShadow: hasSentInterest(detailProfile.id) || remainingInterests <= 0 ? "none" : undefined,
                      }}
                    >
                      {hasSentInterest(detailProfile.id) ? <><CheckCircle2 style={{ width: "16px", height: "16px" }} /> <span>Interest Sent</span></> :
                       remainingInterests <= 0 ? <><AlertCircle style={{ width: "16px", height: "16px" }} /> <span>Limit Reached</span></> :
                       <><Heart style={{ width: "16px", height: "16px" }} /> <span>Send Interest</span></>}
                    </button>
                    <button onClick={() => setSelectedProfile(null)} className="btn-outline" style={{ flex: 1, height: "48px" }}><span>Close</span></button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Suspend Modal ═══ */}
      {showSuspendModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setShowSuspendModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "440px", background: "#fff", borderRadius: "20px", padding: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "scaleIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle style={{ width: "20px", height: "20px", color: "#d97706" }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1e2a44" }}>Suspend User</h3>
                <p style={{ fontSize: "12px", color: "#5f6368" }}>User: {profiles.find(p => p.id === showSuspendModal)?.name}</p>
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Reason for suspension *</label>
              <textarea value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} className="input" style={{ height: "auto", minHeight: "80px", resize: "none" }} placeholder="Provide a reason..." rows={3} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => { setShowSuspendModal(null); setSuspendReason(""); }} className="btn-outline" style={{ flex: 1, height: "44px" }}>Cancel</button>
              <button onClick={() => handleAdminSuspend(showSuspendModal)} disabled={!suspendReason.trim()} style={{ flex: 1, height: "44px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, border: "none", background: suspendReason.trim() ? "#d97706" : "#e3e8f0", color: suspendReason.trim() ? "#fff" : "#a0aec0", cursor: suspendReason.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <AlertTriangle style={{ width: "14px", height: "14px" }} /> Confirm Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Block Confirm Modal ═══ */}
      {showBlockConfirm && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setShowBlockConfirm(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "440px", background: "#fff", borderRadius: "20px", padding: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "scaleIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(220,38,38,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ban style={{ width: "20px", height: "20px", color: "#dc2626" }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1e2a44" }}>Block User</h3>
                <p style={{ fontSize: "12px", color: "#5f6368" }}>User: {profiles.find(p => p.id === showBlockConfirm)?.name}</p>
              </div>
            </div>
            <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "20px", lineHeight: 1.6, background: "rgba(220,38,38,0.04)", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(220,38,38,0.1)" }}>
              ⚠️ This will permanently block the user. They will not be able to login or appear in search results.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setShowBlockConfirm(null)} className="btn-outline" style={{ flex: 1, height: "44px" }}>Cancel</button>
              <button onClick={() => handleAdminBlock(showBlockConfirm)} style={{ flex: 1, height: "44px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <Ban style={{ width: "14px", height: "14px" }} /> Block User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 style={{ width: "16px", height: "16px" }} />}
          {toast.type === 'warning' && <AlertCircle style={{ width: "16px", height: "16px" }} />}
          {toast.type === 'error' && <Ban style={{ width: "16px", height: "16px" }} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
