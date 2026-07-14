"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { Send, User, Search, Phone, Video, MoreVertical, MessageCircle, CheckCheck, Check } from "lucide-react";

export default function MessagesPage() {
  const { messages, currentUser, profiles, sendMessage, markMessagesRead } = useStore();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // The store uses 'me' as the current user's ID in messages
  const myId = 'me';

  const chatPartnerIds = Array.from(
    new Set(
      messages
        .flatMap((m) => [m.senderId, m.receiverId])
        .filter((id) => id !== myId && id !== currentUser.id)
    )
  );

  const getProfile = (id: string) => {
    if (id === 'system') return { id: 'system', name: '🔔 System Notifications', profilePhoto: '', age: 0, height: '', location: '', education: '', occupation: '', gothra: '', gender: '', nakshatra: '', rashi: '', maritalStatus: '', annualIncome: '', bio: '', district: '', phone: '', email: '', weight: '', complexion: '', fatherName: '', fatherOccupation: '', motherName: '', motherOccupation: '', siblings: '', prefAgeMin: '', prefAgeMax: '', prefHeightMin: '', prefDistrict: '', prefEducation: '', nativePlace: '', state: '', status: 'active' as const, statusReason: '', joinDate: '' }
    if (id === 'admin') return { id: 'admin', name: '🛡️ Super Admin', profilePhoto: '', age: 0, height: '', location: '', education: '', occupation: '', gothra: '', gender: '', nakshatra: '', rashi: '', maritalStatus: '', annualIncome: '', bio: '', district: '', phone: '', email: '', weight: '', complexion: '', fatherName: '', fatherOccupation: '', motherName: '', motherOccupation: '', siblings: '', prefAgeMin: '', prefAgeMax: '', prefHeightMin: '', prefDistrict: '', prefEducation: '', nativePlace: '', state: '', status: 'active' as const, statusReason: '', joinDate: '' }
    return profiles.find((p) => p.id === id);
  };

  const activeChatMessages = activeChat
    ? messages
        .filter(
          (m) =>
            ((m.senderId === myId || m.senderId === currentUser.id) && m.receiverId === activeChat) ||
            (m.senderId === activeChat && (m.receiverId === myId || m.receiverId === currentUser.id))
        )
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  const activeProfile = activeChat ? getProfile(activeChat) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatMessages, isTyping]);

  useEffect(() => {
    setIsTyping(false);
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

    // Simulate typing and reply
    setTimeout(() => setIsTyping(true), 800);
    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "Dhanyavadagalu for reaching out! Let me check with my parents and we can talk further.",
        "Namaste! Yes, your profile matches what we are looking for. I would love to connect.",
        "Thanks for the message! Where are you currently working?",
        "Sounds good. We can arrange a call this weekend, does that work for you?",
        "I will discuss this with my father and get back to you shortly.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      // sendMessage(receiverId, text, senderId) — the reply comes FROM the partner
      sendMessage(myId, randomReply, activeChat);
    }, 2500);
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
    return messages.filter(m => m.senderId === partnerId && (m.receiverId === myId || m.receiverId === currentUser.id) && !m.read).length;
  };

  return (
    <div style={{
      height: "calc(100vh - 180px)", display: "flex",
      background: "#fff", borderRadius: "16px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
      overflow: "hidden", border: "1px solid #e3e8f0",
    }}>
      {/* Left: Chat List */}
      <div style={{
        width: "340px", display: "flex", flexDirection: "column",
        borderRight: "1px solid #e3e8f0", background: "#fff", flexShrink: 0,
      }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #e3e8f0" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, color: "#1e2a44", marginBottom: "16px" }}>
            Messages
          </h2>
          <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", color: "#a0aec0" }} />
            <input type="text" placeholder="Search messages..." className="input" style={{ paddingLeft: "36px", height: "40px", fontSize: "13px", background: "#f0ece4" }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {chatPartnerIds.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#5f6368", fontSize: "14px" }}>
              No conversations yet
            </div>
          ) : (
            chatPartnerIds.map((partnerId) => {
              const profile = getProfile(partnerId);
              if (!profile) return null;

              const partnerMessages = messages
                .filter(
                  (m) =>
                    ((m.senderId === myId || m.senderId === currentUser.id) && m.receiverId === partnerId) ||
                    (m.senderId === partnerId && (m.receiverId === myId || m.receiverId === currentUser.id))
                )
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
              const lastMessage = partnerMessages[0];
              const isActive = activeChat === partnerId;
              const unreadCount = getUnreadCount(partnerId);

              return (
                <button
                  key={partnerId}
                  onClick={() => setActiveChat(partnerId)}
                  style={{
                    width: "100%", padding: "14px 20px", display: "flex", alignItems: "center",
                    gap: "12px", border: "none", cursor: "pointer", textAlign: "left",
                    borderBottom: "1px solid rgba(227,232,240,0.5)",
                    background: isActive ? "rgba(30,42,68,0.05)" : "#fff",
                    transition: "0.2s",
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "50%",
                      background: profile.profilePhoto ? `url('${profile.profilePhoto}') center/cover no-repeat` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "18px", fontWeight: 700,
                    }}>
                      {!profile.profilePhoto && profile.name[0]}
                    </div>
                    {/* Online indicator */}
                    <div style={{
                      position: "absolute", bottom: "2px", right: "2px",
                      width: "12px", height: "12px", borderRadius: "50%",
                      background: "#16a34a", border: "2px solid #fff",
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <h4 style={{ fontWeight: 600, fontSize: "14px", color: "#1e2a44" }}>{profile.name}</h4>
                      <span style={{ fontSize: "10px", color: "#a0aec0", whiteSpace: "nowrap" }}>
                        {lastMessage ? formatDate(lastMessage.timestamp) : ""}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: "12px", color: unreadCount > 0 ? "#1e2a44" : "#5f6368", fontWeight: unreadCount > 0 ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {lastMessage
                          ? (lastMessage.senderId === myId || lastMessage.senderId === currentUser.id)
                            ? `You: ${lastMessage.text}`
                            : lastMessage.text
                          : "Start chatting..."}
                      </p>
                      {unreadCount > 0 && (
                        <span style={{
                          minWidth: "20px", height: "20px", borderRadius: "50%",
                          background: "#1e2a44", color: "#fff", fontSize: "10px", fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          marginLeft: "8px", flexShrink: 0,
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fafcff" }}>
        {activeProfile ? (
          <>
            {/* Chat Header */}
            <div style={{
              height: "72px", padding: "0 24px", borderBottom: "1px solid #e3e8f0",
              background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: activeProfile.profilePhoto ? `url('${activeProfile.profilePhoto}') center/cover no-repeat` : "linear-gradient(135deg, #1e2a44, #c6a55c)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "16px", fontWeight: 700,
                  }}>
                    {!activeProfile.profilePhoto && activeProfile.name[0]}
                  </div>
                  <div style={{
                    position: "absolute", bottom: "0px", right: "0px",
                    width: "10px", height: "10px", borderRadius: "50%",
                    background: "#16a34a", border: "2px solid #fff",
                  }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: "14px", color: "#1e2a44" }}>{activeProfile.name}</h3>
                  <p style={{ fontSize: "11px", fontWeight: 500, color: "#16a34a" }}>Online</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <button style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "rgba(30,42,68,0.04)", cursor: "pointer", color: "#5f6368", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                  <Phone style={{ width: "16px", height: "16px" }} />
                </button>
                <button style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "rgba(30,42,68,0.04)", cursor: "pointer", color: "#5f6368", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                  <Video style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {activeChatMessages.map((msg, idx) => {
                const isMe = msg.senderId === myId || msg.senderId === currentUser.id;
                // Show date divider
                const prevMsg = idx > 0 ? activeChatMessages[idx - 1] : null;
                const showDateDivider = !prevMsg || formatDate(msg.timestamp) !== formatDate(prevMsg.timestamp);

                return (
                  <div key={msg.id}>
                    {showDateDivider && (
                      <div style={{ textAlign: "center", margin: "8px 0" }}>
                        <span style={{ fontSize: "11px", fontWeight: 500, color: "#a0aec0", background: "#fafcff", padding: "0 12px" }}>
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                      <div style={{ maxWidth: "70%" }}>
                        <div style={{
                          padding: "12px 16px", borderRadius: "16px", fontSize: "14px", lineHeight: 1.5,
                          background: isMe ? "#1e2a44" : "#fff",
                          color: isMe ? "#fff" : "#1e2a44",
                          borderBottomRightRadius: isMe ? "4px" : "16px",
                          borderBottomLeftRadius: isMe ? "16px" : "4px",
                          border: isMe ? "none" : "1px solid #e3e8f0",
                          boxShadow: isMe ? "0 2px 8px rgba(30,42,68,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
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

              {isTyping && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ maxWidth: "70%" }}>
                    <div style={{
                      padding: "12px 16px", borderRadius: "16px", fontSize: "14px", lineHeight: 1.5,
                      background: "#fff", color: "#1e2a44",
                      borderBottomLeftRadius: "4px", border: "1px solid #e3e8f0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      display: "flex", alignItems: "center", gap: "4px"
                    }}>
                      <span style={{ width: "6px", height: "6px", background: "#a0aec0", borderRadius: "50%", display: "inline-block", animation: "bounce 1.4s infinite ease-in-out both" }} />
                      <span style={{ width: "6px", height: "6px", background: "#a0aec0", borderRadius: "50%", display: "inline-block", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.2s" }} />
                      <span style={{ width: "6px", height: "6px", background: "#a0aec0", borderRadius: "50%", display: "inline-block", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "16px", background: "#fff", borderTop: "1px solid #e3e8f0", flexShrink: 0 }}>
              <form onSubmit={handleSend} style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="input"
                  style={{ flex: 1, background: "#f0ece4" }}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: inputText.trim() ? "#1e2a44" : "#e3e8f0",
                    color: "#fff", border: "none",
                    cursor: inputText.trim() ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.2s ease",
                  }}
                >
                  <Send style={{ width: "20px", height: "20px" }} />
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
