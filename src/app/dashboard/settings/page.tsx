"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import {
  Settings as SettingsIcon, Bell, Lock, Eye, Shield, Smartphone,
  Mail, CheckCircle2, Save, Trash2, LogOut, AlertCircle,
  User, Key,
} from "lucide-react";

export default function SettingsPage() {
  const { currentUser, updateProfile, logout, systemSettings, updateSystemSettings, uploadPhoto } = useStore();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [settingsEmail, setSettingsEmail] = useState(currentUser.email);
  const [settingsPhone, setSettingsPhone] = useState(currentUser.phone);
  const [settingsPhoto, setSettingsPhoto] = useState(currentUser.profilePhoto || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isAdmin = currentUser.role === 'admin';

  // Privacy toggles
  const [profileVisible, setProfileVisible] = useState(currentUser.profileVisible ?? true);
  const [photoPrivacy, setPhotoPrivacy] = useState(currentUser.photoPrivacy ?? false);
  const [contactHidden, setContactHidden] = useState(currentUser.contactHidden ?? true);

  // Notification toggles
  const [notifMessages, setNotifMessages] = useState(currentUser.notifMessages ?? true);
  const [notifInterests, setNotifInterests] = useState(currentUser.notifInterests ?? true);
  const [notifAccepted, setNotifAccepted] = useState(currentUser.notifAccepted ?? true);
  const [notifMatches, setNotifMatches] = useState(currentUser.notifMatches ?? true);
  const [notifPromo, setNotifPromo] = useState(currentUser.notifPromo ?? false);

  // Super Admin settings states
  const [interestLimit, setInterestLimit] = useState(systemSettings?.dailyInterestLimit ?? 10);
  const [autoApprove, setAutoApprove] = useState(systemSettings?.autoApproveProfiles ?? true);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        return;
      }
      const url = await uploadPhoto(file);
      if (url) {
        setSettingsPhoto(url);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    const updateData: Partial<typeof currentUser> = {
      email: settingsEmail,
      phone: settingsPhone,
      profilePhoto: settingsPhoto,
      profileVisible,
      photoPrivacy,
      contactHidden,
      notifMessages,
      notifInterests,
      notifAccepted,
      notifMatches,
      notifPromo,
    };

    if (newPassword) {
      if (newPassword.length < 8) {
        setPasswordError("Password must be at least 8 characters");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
      updateData.password = newPassword;
    }

    updateProfile(updateData);

    if (isAdmin) {
      updateSystemSettings({
        dailyInterestLimit: Number(interestLimit),
        autoApproveProfiles: autoApprove,
      });
    }

    setSaved(true);
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteAccount = () => {
    useStore.getState().deleteSelfAccount();
    router.push("/");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: "48px", height: "26px", borderRadius: "999px",
        background: checked ? "#1e2a44" : "#e3e8f0",
        border: "none", cursor: "pointer",
        position: "relative", transition: "all 0.3s ease",
        flexShrink: 0,
      }}
    >
      <div style={{
        width: "20px", height: "20px", borderRadius: "50%",
        background: "#fff", position: "absolute",
        top: "3px", left: checked ? "25px" : "3px",
        transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
      }} />
    </button>
  );

  const privacyItems = [
    { title: "Profile Visibility", desc: "Show my profile in search results to other users", icon: Eye, checked: profileVisible, onChange: setProfileVisible },
    { title: "Photo Privacy", desc: "Only allow accepted interests to see my photos", icon: Lock, checked: photoPrivacy, onChange: setPhotoPrivacy },
    { title: "Contact Details", desc: "Hide my phone number from all users until interest is accepted", icon: Smartphone, checked: contactHidden, onChange: setContactHidden },
  ];

  const notifItems = [
    { label: "New Messages", checked: notifMessages, onChange: setNotifMessages },
    { label: "New Interests", checked: notifInterests, onChange: setNotifInterests },
    { label: "Interest Accepted", checked: notifAccepted, onChange: setNotifAccepted },
    { label: "Profile Matches", checked: notifMatches, onChange: setNotifMatches },
    { label: "Promotional Offers", checked: notifPromo, onChange: setNotifPromo },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, color: "#1e2a44", marginBottom: "4px" }}>
          Settings
        </h1>
        <p style={{ fontSize: "14px", color: "#5f6368" }}>
          Manage your account preferences and privacy
        </p>
      </div>

      {saved && (
        <div className="toast toast-success" style={{ position: "relative", bottom: "auto", right: "auto" }}>
          <CheckCircle2 style={{ width: "16px", height: "16px" }} /> Settings saved successfully!
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Super Admin Settings (Only visible to admin) */}
          {isAdmin && (
            <div className="card" style={{ padding: "24px", border: "1px solid rgba(198,165,92,0.3)", background: "linear-gradient(135deg, #fff, rgba(198,165,92,0.02))" }}>
              <h3 style={{ fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#1e2a44" }}>
                <Shield style={{ width: "20px", height: "20px", color: "#c6a55c" }} />
                Super Admin System Settings
              </h3>
              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Daily Interest Limit per User</label>
                    <input
                      type="number"
                      value={interestLimit}
                      onChange={(e) => setInterestLimit(Number(e.target.value))}
                      className="input"
                      min={1}
                      max={100}
                      required
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", paddingLeft: "12px" }}>
                    <div>
                      <h4 style={{ fontWeight: 600, fontSize: "13px", color: "#1e2a44" }}>Auto-Approve Profiles</h4>
                      <p style={{ fontSize: "11px", color: "#5f6368", marginTop: "2px" }}>Approve signups automatically</p>
                    </div>
                    <Toggle checked={autoApprove} onChange={setAutoApprove} />
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Account Settings */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#1e2a44" }}>
              <User style={{ width: "20px", height: "20px", color: "#1e2a44" }} />
              Account Settings
            </h3>
            <form style={{ display: "flex", flexDirection: "column", gap: "16px" }} onSubmit={handleSave}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#e3e8f0", overflow: "hidden", border: "2px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", flexShrink: 0 }}>
                  {settingsPhoto ? (
                    <img src={settingsPhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <User style={{ width: "32px", height: "32px", color: "#a0aec0", margin: "16px" }} />
                  )}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "4px" }}>Profile Photo</label>
                  <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handlePhotoUpload} style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <Mail style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                    <input type="email" value={settingsEmail} onChange={(e) => setSettingsEmail(e.target.value)} className="input" style={{ paddingLeft: "42px" }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Phone Number</label>
                  <div style={{ position: "relative" }}>
                    <Smartphone style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                    <input type="tel" value={settingsPhone} onChange={(e) => setSettingsPhone(e.target.value)} className="input" style={{ paddingLeft: "42px" }} />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                <Key style={{ width: "16px", height: "16px", color: "#c6a55c" }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#5f6368" }}>Change Password</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>New Password</label>
                  <div style={{ position: "relative" }}>
                    <Lock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                    <input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPasswordError(""); }} placeholder="Min. 8 characters" className={`input ${passwordError ? 'input-error' : ''}`} style={{ paddingLeft: "42px" }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <Lock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                    <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); }} placeholder="Re-enter password" className={`input ${passwordError ? 'input-error' : ''}`} style={{ paddingLeft: "42px" }} />
                  </div>
                </div>
              </div>
              {passwordError && (
                <span className="error-text"><AlertCircle style={{ width: "12px", height: "12px" }} /> {passwordError}</span>
              )}

              <div style={{ paddingTop: "8px" }}>
                <button type="submit" className="btn-primary" style={{ padding: "10px 24px", fontSize: "14px" }}>
                  {saved ? <CheckCircle2 style={{ width: "16px", height: "16px" }} /> : <Save style={{ width: "16px", height: "16px" }} />}
                  <span>{saved ? "Saved!" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Privacy (Only for regular users) */}
          {!isAdmin && (
            <div className="card" style={{ padding: "24px" }}>
              <h3 style={{ fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#1e2a44" }}>
                <Shield style={{ width: "20px", height: "20px", color: "#c6a55c" }} />
                Privacy & Visibility
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {privacyItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < privacyItems.length - 1 ? "1px solid #f0ece4" : "none" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        background: item.checked ? "rgba(30,42,68,0.06)" : "#f0ece4",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        transition: "all 0.2s ease",
                      }}>
                        <item.icon style={{ width: "18px", height: "18px", color: item.checked ? "#1e2a44" : "#a0aec0" }} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, fontSize: "14px", color: "#1e2a44" }}>{item.title}</h4>
                        <p style={{ fontSize: "12px", color: "#5f6368", marginTop: "2px" }}>{item.desc}</p>
                      </div>
                    </div>
                    <Toggle checked={item.checked} onChange={item.onChange} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Account Info */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#1e2a44" }}>
              <User style={{ width: "20px", height: "20px", color: "#c6a55c" }} />
              Account Info
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0ece4" }}>
                <span style={{ fontSize: "13px", color: "#5f6368" }}>Profile ID</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e2a44" }}>{currentUser.id.toUpperCase().slice(0, 8)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0ece4" }}>
                <span style={{ fontSize: "13px", color: "#5f6368" }}>Status</span>
                <span style={{
                  fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px",
                  background: currentUser.status === 'active' ? "rgba(22,163,106,0.1)" : "rgba(245,158,11,0.1)",
                  color: currentUser.status === 'active' ? "#16a34a" : "#d97706",
                }}>
                  {currentUser.status === 'active' ? '✓ Active' : currentUser.status}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0ece4" }}>
                <span style={{ fontSize: "13px", color: "#5f6368" }}>Role</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e2a44" }}>{currentUser.role === 'admin' ? '🛡️ Admin' : '👤 User'}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                <span style={{ fontSize: "13px", color: "#5f6368" }}>Gender</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e2a44" }}>{currentUser.gender === 'MALE' ? '👨 Male' : currentUser.gender === 'FEMALE' ? '👩 Female' : '—'}</span>
              </div>
            </div>
          </div>

          {/* Notifications (Only for regular users) */}
          {!isAdmin && (
            <div className="card" style={{ padding: "24px" }}>
              <h3 style={{ fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#1e2a44" }}>
                <Bell style={{ width: "20px", height: "20px", color: "#f59e0b" }} />
                Notifications
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {notifItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "14px", color: "#1e2a44", fontWeight: 500 }}>{item.label}</span>
                    <Toggle checked={item.checked} onChange={item.onChange} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logout */}
          <button onClick={handleLogout} style={{
            width: "100%", padding: "14px", borderRadius: "12px",
            border: "1px solid #e3e8f0", background: "#fff", color: "#1e2a44",
            fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          }}>
            <LogOut style={{ width: "16px", height: "16px" }} /> Logout
          </button>

          {/* Danger Zone (Only for regular users) */}
          {!isAdmin && (
            <div style={{
              padding: "20px", borderRadius: "16px",
              border: "1px solid rgba(220,38,38,0.2)",
              background: "rgba(220,38,38,0.03)",
            }}>
              <h3 style={{ fontWeight: 600, color: "#dc2626", marginBottom: "6px", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Trash2 style={{ width: "16px", height: "16px" }} /> Danger Zone
              </h3>
              <p style={{ fontSize: "12px", color: "#5f6368", marginBottom: "14px", lineHeight: 1.5 }}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              {!showDeleteConfirm ? (
                <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger" style={{ width: "100%", justifyContent: "center" }}>
                  <Trash2 style={{ width: "14px", height: "14px" }} /> Delete Account
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#dc2626" }}>⚠️ Are you sure? This cannot be undone!</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setShowDeleteConfirm(false)} className="btn-outline" style={{ flex: 1, fontSize: "12px", padding: "8px", justifyContent: "center" }}>Cancel</button>
                    <button onClick={handleDeleteAccount} className="btn-danger" style={{ flex: 1, fontSize: "12px", padding: "8px", justifyContent: "center" }}>
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
