"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import {
  Heart, Check, X, Clock, MapPin, MessageCircle,
  ArrowRight, User, GraduationCap, Briefcase, Sparkles,
  CheckCircle2, Star,
} from "lucide-react";

export default function InterestsPage() {
  const { interests, profiles, currentUser, updateInterestStatus, sendMessage, toggleShortlist, sendInterest } = useStore();
  const [activeTab, setActiveTab] = useState<"received" | "sent" | "accepted" | "shortlisted">("received");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const getProfile = (id: string) => profiles.find((p) => p.id === id);

  const myId = currentUser.id;
  const isMyId = (id: string) => id === myId;

  const received = interests.filter((i) => isMyId(i.toId) && i.status === "pending");
  const sent = interests.filter((i) => isMyId(i.fromId));
  const accepted = interests.filter(
    (i) => (isMyId(i.toId) || isMyId(i.fromId)) && i.status === "accepted"
  );

  const shortlistedList = profiles
    .filter((p) => currentUser.shortlistedIds?.includes(p.id))
    .map((p) => ({
      id: `shortlist-${p.id}`,
      fromId: p.id,
      toId: currentUser.id,
      status: "shortlisted" as const,
      timestamp: p.joinDate || new Date().toISOString(),
    }));

  const tabs = [
    { id: "received" as const, label: "Received", count: received.length, icon: Heart },
    { id: "sent" as const, label: "Sent", count: sent.length, icon: ArrowRight },
    { id: "accepted" as const, label: "Mutual Matches", count: accepted.length, icon: CheckCircle2 },
    { id: "shortlisted" as const, label: "Shortlisted", count: shortlistedList.length, icon: Star },
  ];

  const handleAccept = (interestId: string, fromId: string) => {
    updateInterestStatus(interestId, "accepted");
    const profile = getProfile(fromId);
    if (profile) {
      // Send an automatic greeting message
      sendMessage(fromId, `Namaste! I've accepted your interest. Looking forward to connecting with you. 🙏`);
    }
    setToast({ message: "Interest accepted! You can now message each other.", type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDecline = (interestId: string) => {
    updateInterestStatus(interestId, "declined");
    setToast({ message: "Interest declined.", type: "warning" });
    setTimeout(() => setToast(null), 3000);
  };

  const formatTimeAgo = (iso: string) => {
    if (!iso) return "recently";
    try {
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    } catch {
      return "recently";
    }
  };

  const getActiveList = () => {
    switch (activeTab) {
      case "received": return received;
      case "sent": return sent;
      case "accepted": return accepted;
      case "shortlisted": return shortlistedList;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, color: "#1e2a44", marginBottom: "4px" }}>
          Interests
        </h1>
        <p style={{ fontSize: "14px", color: "#5f6368" }}>
          Manage your sent, received, and accepted interests
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {tabs.map((tab, i) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="stat-card" style={{
            ["--stat-color" as string]: tab.id === 'received' ? "#c6a55c" : tab.id === 'sent' ? "#3b82f6" : "#16a34a",
            cursor: "pointer", border: activeTab === tab.id ? "2px solid #1e2a44" : "2px solid transparent",
            textAlign: "left",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <tab.icon style={{ width: "18px", height: "18px", color: tab.id === 'received' ? "#c6a55c" : tab.id === 'sent' ? "#3b82f6" : "#16a34a" }} />
              <span style={{ fontSize: "12px", color: "#5f6368", fontWeight: 600 }}>{tab.label}</span>
            </div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#1e2a44" }}>{tab.count}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {getActiveList().length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%", background: "#f0ece4",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
            }}>
              <Heart style={{ width: "32px", height: "32px", color: "#a0aec0" }} />
            </div>
            <h3 style={{ fontWeight: 600, fontSize: "18px", color: "#1e2a44" }}>
              {activeTab === 'accepted' ? 'No mutual matches' : activeTab === 'shortlisted' ? 'No shortlisted profiles' : `No ${activeTab} interests`}
            </h3>
            <p style={{ fontSize: "14px", color: "#5f6368", marginTop: "4px" }}>
              {activeTab === "received" ? "You haven't received any new interests yet." : activeTab === "sent" ? "You haven't sent any interests yet." : activeTab === "shortlisted" ? "You haven't bookmarked any profiles yet." : "No mutual matches yet. Accept or send more interests!"}
            </p>
            {activeTab !== "received" && (
              <Link href="/dashboard/browse" className="btn-primary" style={{ marginTop: "16px", display: "inline-flex" }}>
                <span>Browse Matches</span> <ArrowRight style={{ width: "14px", height: "14px" }} />
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {getActiveList().map((interest, idx) => {
              const partnerId = activeTab === "shortlisted" ? interest.fromId : (activeTab === "sent" ? interest.toId : activeTab === "received" ? interest.fromId : (isMyId(interest.fromId) ? interest.toId : interest.fromId));
              const profile = getProfile(partnerId);
              if (!profile) return null;

              return (
                <div key={interest.id} className="card-premium flex-col-mobile" style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "18px 20px",
                  animation: `fadeInUp 0.4s ease ${idx * 0.05}s both`,
                }}>
                  {/* Avatar with Photo */}
                  <div style={{
                    width: "60px", height: "60px", borderRadius: "50%", flexShrink: 0,
                    background: profile.profilePhoto ? `url('${profile.profilePhoto}') center/cover no-repeat` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "22px", fontWeight: 700,
                    border: activeTab === 'accepted' ? "3px solid rgba(22,163,106,0.3)" : "3px solid rgba(198,165,92,0.2)",
                  }}>
                    {!profile.profilePhoto && profile.name[0]}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
                    <h4 style={{ fontWeight: 600, fontSize: "16px", color: "#1e2a44", marginBottom: "4px" }}>{profile.name}</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", color: "#5f6368", display: "flex", alignItems: "center", gap: "4px" }}>
                        <User style={{ width: "10px", height: "10px", color: "#a0aec0" }} /> {profile.age} yrs, {profile.height}
                      </span>
                      <span style={{ fontSize: "12px", color: "#5f6368", display: "flex", alignItems: "center", gap: "4px" }}>
                        <GraduationCap style={{ width: "10px", height: "10px", color: "#a0aec0" }} /> {profile.education}
                      </span>
                      <span style={{ fontSize: "12px", color: "#5f6368", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Briefcase style={{ width: "10px", height: "10px", color: "#a0aec0" }} /> {profile.occupation}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", color: "#a0aec0", display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin style={{ width: "10px", height: "10px" }} /> {profile.location}
                      </span>
                      <span style={{ fontSize: "11px", color: "#a0aec0", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Sparkles style={{ width: "10px", height: "10px" }} /> {profile.gothra}
                      </span>
                      <span style={{ fontSize: "10px", color: "#a0aec0" }}>• {formatTimeAgo(interest.timestamp)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0, alignItems: "center", flexWrap: "wrap" }}>
                    {activeTab === "received" && (
                      <>
                        <button
                          onClick={() => handleAccept(interest.id, interest.fromId)}
                          className="btn-success"
                          style={{ borderRadius: "50px", display: "flex", alignItems: "center", gap: "6px" }}
                          title="Accept Interest"
                        >
                          <Check style={{ width: "14px", height: "14px" }} /> Accept
                        </button>
                        <button
                          onClick={() => handleDecline(interest.id)}
                          className="btn-danger"
                          style={{ borderRadius: "50px", display: "flex", alignItems: "center", gap: "6px" }}
                          title="Decline Interest"
                        >
                          <X style={{ width: "14px", height: "14px" }} /> Decline
                        </button>
                      </>
                    )}
                    {activeTab === "sent" && (
                      <div style={{
                        padding: "6px 14px", borderRadius: "50px", fontSize: "12px", fontWeight: 600,
                        display: "flex", alignItems: "center", gap: "6px",
                        background: interest.status === "accepted" ? "rgba(22,163,106,0.1)" : interest.status === "declined" ? "rgba(220,38,38,0.1)" : "rgba(245,158,11,0.1)",
                        color: interest.status === "accepted" ? "#16a34a" : interest.status === "declined" ? "#dc2626" : "#d97706",
                      }}>
                        {interest.status === "pending" && <Clock style={{ width: "12px", height: "12px" }} />}
                        {interest.status === "accepted" && <Check style={{ width: "12px", height: "12px" }} />}
                        {interest.status === "declined" && <X style={{ width: "12px", height: "12px" }} />}
                        <span style={{ textTransform: "capitalize" }}>{interest.status}</span>
                      </div>
                    )}
                    {activeTab === "accepted" && (
                      <Link href="/dashboard/messages" style={{
                        padding: "8px 16px", borderRadius: "50px", fontSize: "13px", fontWeight: 600,
                        background: "#1e2a44", color: "#fff",
                        textDecoration: "none",
                        display: "flex", alignItems: "center", gap: "6px",
                        transition: "all 0.2s ease",
                      }}>
                        <MessageCircle style={{ width: "14px", height: "14px" }} /> Message
                      </Link>
                    )}
                    {activeTab === "shortlisted" && (
                      <>
                        <button
                          onClick={async () => {
                            const success = await sendInterest(profile.id);
                            if (success) {
                              setToast({ message: "Interest sent successfully! 💕", type: "success" });
                            } else {
                              setToast({ message: "Interest already sent to this profile.", type: "warning" });
                            }
                            setTimeout(() => setToast(null), 3000);
                          }}
                          disabled={interests.some(i => isMyId(i.fromId) && i.toId === profile.id)}
                          className="btn-primary"
                          style={{
                            padding: "6px 14px", borderRadius: "50px", fontSize: "12px",
                            opacity: interests.some(i => isMyId(i.fromId) && i.toId === profile.id) ? 0.5 : 1,
                          }}
                        >
                          {interests.some(i => isMyId(i.fromId) && i.toId === profile.id) ? "Sent" : "Connect"}
                        </button>
                        <button
                          onClick={() => toggleShortlist(profile.id)}
                          className="btn-danger"
                          style={{ padding: "6px 14px", borderRadius: "50px", fontSize: "12px" }}
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 style={{ width: "16px", height: "16px" }} />}
          {toast.type === 'warning' && <Clock style={{ width: "16px", height: "16px" }} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
