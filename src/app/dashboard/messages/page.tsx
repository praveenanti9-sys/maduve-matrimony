"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { ADMIN_UUID, SYSTEM_UUID } from "@/lib/supabase-service";
import { Send, User, Search, MoreVertical, MessageCircle, CheckCheck, Check, ArrowLeft } from "lucide-react";

export default function MessagesPage() {
  const { messages, currentUser, profiles, sendMessage, markMessagesRead } = useStore();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAdmin = currentUser.role === 'admin';
  const myId = currentUser.id;
  const myIds = isAdmin ? [myId, 'admin', ADMIN_UUID] : [myId];
  const isMyId = (id: string) => myIds.includes(id);

  const rawPartnerIds = Array.from(
    new Set(
      messages
        .flatMap((m) => [m.senderId, m.receiverId])
        .filter((id) => !isMyId(id))
    )
  );

  const chatPartnerIds = isAdmin
    ? rawPartnerIds
    : Array.from(new Set(['admin', ...rawPartnerIds]));

  const getProfile = (id: string) => {
    if (id === 'system' || id === SYSTEM_UUID) return { id: 'system', name: '🔔 System Notifications', profilePhoto: '', age: 0, height: '', location: '', education: '', occupation: '', gothra: '', gender: '', nakshatra: '', rashi: '', maritalStatus: '', annualIncome: '', bio: '', district: '', phone: '', email: '', weight: '', complexion: '', fatherName: '', fatherOccupation: '', motherName: '', motherOccupation: '', siblings: '', prefAgeMin: '', prefAgeMax: '', prefHeightMin: '', prefDistrict: '', prefEducation: '', nativePlace: '', state: '', status: 'active' as const, statusReason: '', joinDate: '' }
    if (id === 'admin' || id === ADMIN_UUID) return { id: 'admin', name: '🛡️ Super Admin', profilePhoto: '', age: 0, height: '', location: '', education: '', occupation: '', gothra: '', gender: '', nakshatra: '', rashi: '', maritalStatus: '', annualIncome: '', bio: '', district: '', phone: '', email: '', weight: '', complexion: '', fatherName: '', fatherOccupation: '', motherName: '', motherOccupation: '', siblings: '', prefAgeMin: '', prefAgeMax: '', prefHeightMin: '', prefDistrict: '', prefEducation: '', nativePlace: '', state: '', status: 'active' as const, statusReason: '', joinDate: '' }
    return profiles.find((p) => p.id === id);
  };

  const isPartnerMatch = (id: string, targetId: string) => {
    if (targetId === 'admin') return id === 'admin' || id === ADMIN_UUID;
    if (targetId === 'system') return id === 'system' || id === SYSTEM_UUID;
    return id === targetId;
  };

  const activeChatMessages = activeChat
    ? messages
        .filter((m) => {
          const senderIsMe = isMyId(m.senderId);
          const receiverIsMe = isMyId(m.receiverId);
          const senderIsPartner = isPartnerMatch(m.senderId, activeChat);
          const receiverIsPartner = isPartnerMatch(m.receiverId, activeChat);
          return (senderIsMe && receiverIsPartner) || (senderIsPartner && receiverIsMe);
        })
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  const activeProfile = activeChat ? getProfile(activeChat) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatMessages]);

  useEffect(() => {
    if (activeChat) {
      markMessagesRead(activeChat);
    }
  }, [activeChat, markMessagesRead]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;
    if (currentUser.status === 'blocked' || currentUser.status === 'suspended') {
      alert("Your account is currently restricted. You cannot send messages.");
      return;
    }
    
    sendMessage(activeChat, inputText);
    setInputText("");
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const getUnreadCount = (partnerId: string) => {
    return messages.filter(m => m.senderId === partnerId && isMyId(m.receiverId) && !m.read).length;
  };

  return (
    <div style={{
      height: "calc(100vh - 180px)", minHeight: "450px", display: "flex",
      background: "#fff", borderRadius: "16px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
      overflow: "hidden", border: "1px solid #e3e8f0",
      width: "100%", minWidth: 0, maxWidth: "100%",
    }} className="messages-container">
      {/* Left: Chat List */}
      <div style={{
        borderRight: "1px solid #e3e8f0", background: "#fff", minWidth: 0,
      }} className={activeChat ? "hidden md:flex md:flex-col md:w-[340px] md:flex-shrink-0" : "flex flex-col w-full md:w-[340px] md:flex-shrink-0"}>
        <div style={{ padding: "20px", borderBottom: "1px solid #e3e8f0" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, color: "#1e2a44", marginBottom: "16px" }}>
            Messages
          </h2>
          <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", color: "#a0aec0" }} />
            <input type="text" placeholder="Search messages..." className="input" style={{ paddingLeft: "36px", height: "40px", fontSize: "13px", background: "#f0ece4", width: "100%" }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
          {chatPartnerIds.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#5f6368", fontSize: "14px" }}>
              No conversations yet
            </div>
          ) : (
            chatPartnerIds.map((partnerId) => {
              const profile = getProfile(partnerId);
              if (!profile) return null;

              const partnerMessages = messages
                .filter((m) => {
                  const senderIsMe = isMyId(m.senderId);
                  const receiverIsMe = isMyId(m.receiverId);
                  const senderIsPartner = isPartnerMatch(m.senderId, partnerId);
                  const receiverIsPartner = isPartnerMatch(m.receiverId, partnerId);
                  return (senderIsMe && receiverIsPartner) || (senderIsPartner && receiverIsMe);
                })
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
              const lastMessage = partnerMessages[0];
              const isActive = activeChat === partnerId;
              const unreadCount = getUnreadCount(partnerId);

              return (
                <button
                  key={partnerId}
                  onClick={() => setActiveChat(partnerId)}
                  style={{
                    width: "100%", padding: "14px 16px", display: "flex", alignItems: "center",
                    gap: "12px", border: "none", cursor: "pointer", textAlign: "left",
                    borderBottom: "1px solid rgba(227,232,240,0.5)",
                    background: isActive ? "rgba(30,42,68,0.05)" : "#fff",
                    transition: "0.2s",
                    minWidth: 0,
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "50%",
                      background: profile.profilePhoto ? `url('${profile.profilePhoto}') center/cover no-repeat` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "16px", fontWeight: 700,
                    }}>
                      {!profile.profilePhoto && profile.name[0]}
                    </div>
                    {/* Online indicator */}
                    <div style={{
                      position: "absolute", bottom: "2px", right: "2px",
                      width: "10px", height: "10px", borderRadius: "50%",
                      background: "#16a34a", border: "2px solid #fff",
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <h4 style={{ fontWeight: 600, fontSize: "14px", color: "#1e2a44", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: "6px" }}>{profile.name}</h4>
                      <span style={{ fontSize: "10px", color: "#a0aec0", whiteSpace: "nowrap", flexShrink: 0 }}>
                        {lastMessage ? formatDate(lastMessage.timestamp) : ""}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: "12px", color: unreadCount > 0 ? "#1e2a44" : "#5f6368", fontWeight: unreadCount > 0 ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
                        {lastMessage
                          ? isMyId(lastMessage.senderId)
                            ? `You: ${lastMessage.text}`
                            : lastMessage.text
                          : "Start chatting..."}
                      </p>
                      {unreadCount > 0 && (
                        <span style={{
                          minWidth: "18px", height: "18px", borderRadius: "50%",
                          background: "#1e2a44", color: "#fff", fontSize: "10px", fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          marginLeft: "6px", flexShrink: 0, padding: "0 4px",
                        }}>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right: Chat Window */}
      <div style={{ background: "#fafcff", minWidth: 0, width: "100%", maxWidth: "100%" }} className={!activeChat ? "hidden md:flex md:flex-col md:flex-1" : "flex flex-col flex-1 w-full min-w-0"}>
        {activeProfile ? (
          <>
            {/* Chat Header */}
            <div style={{
              minHeight: "68px", padding: "10px 16px", borderBottom: "1px solid #e3e8f0",
              background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between",
              flexShrink: 0, minWidth: 0, width: "100%", gap: "8px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                <button
                  onClick={() => setActiveChat(null)}
                  style={{
                    padding: "6px", background: "rgba(30,42,68,0.06)", borderRadius: "8px",
                    border: "none", cursor: "pointer", color: "#1e2a44", display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                  className="md:hidden"
                  title="Back to conversations"
                >
                  <ArrowLeft style={{ width: "18px", height: "18px" }} />
                </button>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    background: activeProfile.profilePhoto ? `url('${activeProfile.profilePhoto}') center/cover no-repeat` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "15px", fontWeight: 700,
                  }}>
                    {!activeProfile.profilePhoto && activeProfile.name[0]}
                  </div>
                  <div style={{
                    position: "absolute", bottom: "0px", right: "0px",
                    width: "9px", height: "9px", borderRadius: "50%",
                    background: "#16a34a", border: "2px solid #fff",
                  }} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3 style={{ fontWeight: 600, fontSize: "14px", color: "#1e2a44", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeProfile.name}</h3>
                  <p style={{ fontSize: "11px", fontWeight: 500, color: "#16a34a" }}>Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", minWidth: 0, width: "100%" }}>
              {activeChatMessages.map((msg, idx) => {
                const isMe = msg.senderId === myId;
                // Show date divider
                const prevMsg = idx > 0 ? activeChatMessages[idx - 1] : null;
                const showDateDivider = !prevMsg || formatDate(msg.timestamp) !== formatDate(prevMsg.timestamp);

                return (
                  <div key={msg.id} style={{ minWidth: 0, width: "100%" }}>
                    {showDateDivider && (
                      <div style={{ textAlign: "center", margin: "8px 0" }}>
                        <span style={{ fontSize: "11px", fontWeight: 500, color: "#a0aec0", background: "#fafcff", padding: "0 12px" }}>
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", minWidth: 0, width: "100%" }}>
                      <div style={{ maxWidth: "85%", minWidth: 0 }}>
                        <div style={{
                          padding: "10px 14px", borderRadius: "16px", fontSize: "14px", lineHeight: 1.5,
                          background: isMe ? "#1e2a44" : "#fff",
                          color: isMe ? "#fff" : "#1e2a44",
                          borderBottomRightRadius: isMe ? "4px" : "16px",
                          borderBottomLeftRadius: isMe ? "16px" : "4px",
                          border: isMe ? "none" : "1px solid #e3e8f0",
                          boxShadow: isMe ? "0 2px 8px rgba(30,42,68,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
                          overflowWrap: "break-word", wordBreak: "break-word",
                        }}>
                          {msg.text}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", justifyContent: isMe ? "flex-end" : "flex-start", padding: "0 4px" }}>
                          <span style={{ fontSize: "10px", color: "#a0aec0" }}>
                            {formatTime(msg.timestamp)}
                          </span>
                          {isMe && (
                            msg.read
                              ? <CheckCheck style={{ width: "12px", height: "12px", color: "#16a34a" }} />
                              : <Check style={{ width: "12px", height: "12px", color: "#a0aec0" }} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}



              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "12px 16px", background: "#fff", borderTop: "1px solid #e3e8f0", flexShrink: 0, minWidth: 0, width: "100%" }}>
              <form onSubmit={handleSend} style={{ display: "flex", gap: "8px", minWidth: 0, width: "100%" }}>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="input"
                  style={{ flex: 1, minWidth: 0, background: "#f0ece4", height: "42px" }}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  style={{
                    width: "42px", height: "42px", borderRadius: "12px",
                    background: inputText.trim() ? "#1e2a44" : "#e3e8f0",
                    color: "#fff", border: "none",
                    cursor: inputText.trim() ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.2s ease",
                  }}
                >
                  <Send style={{ width: "18px", height: "18px" }} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#5f6368" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%", background: "#f0ece4",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px",
            }}>
              <MessageCircle style={{ width: "40px", height: "40px", color: "#a0aec0" }} />
            </div>
            <h3 style={{ fontWeight: 600, fontSize: "18px", color: "#1e2a44" }}>Your Messages</h3>
            <p style={{ fontSize: "14px" }}>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
