import { create } from 'zustand';
import * as svc from '@/lib/supabase-service';
import type { DbProfile, DbMessage, DbInterest, DbSystemSettings } from '@/lib/supabase-service';

// ── Constants ──
export const DAILY_INTEREST_LIMIT = 10;

// ── Frontend-facing types (kept for backward compatibility with pages) ──
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  gender: 'MALE' | 'FEMALE' | '';
  dob: string;
  education: string;
  occupation: string;
  city: string;
  district: string;
  gothra: string;
  bio: string;
  height: string;
  weight: string;
  complexion: string;
  maritalStatus: string;
  annualIncome: string;
  isVerified?: boolean;
  nakshatra: string;
  rashi: string;
  nativePlace: string;
  state: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  prefAgeMin: string;
  prefAgeMax: string;
  prefHeightMin: string;
  prefDistrict: string;
  prefEducation: string;
  isLoggedIn: boolean;
  profilePhoto: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'blocked' | 'pending';
  statusReason: string;
  dailyInterestCount: number;
  lastInterestDate: string;
  profileVisible: boolean;
  photoPrivacy: boolean;
  contactHidden: boolean;
  notifMessages: boolean;
  notifInterests: boolean;
  notifAccepted: boolean;
  notifMatches: boolean;
  notifPromo: boolean;
  profileViews: number;
  adminReviewed?: boolean;
  shortlistedIds?: string[];
}

export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  height: string;
  location: string;
  education: string;
  occupation: string;
  gothra: string;
  gender: string;
  nakshatra: string;
  rashi: string;
  maritalStatus: string;
  annualIncome: string;
  bio: string;
  district: string;
  profilePhoto: string;
  phone: string;
  email: string;
  weight: string;
  complexion: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  prefAgeMin: string;
  prefAgeMax: string;
  prefHeightMin: string;
  prefDistrict: string;
  prefEducation: string;
  nativePlace: string;
  state: string;
  status: 'active' | 'suspended' | 'blocked' | 'pending';
  statusReason: string;
  joinDate: string;
  adminReviewed?: boolean;
  isVerified?: boolean;
  photoPrivacy?: boolean;
  role?: 'user' | 'admin';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read?: boolean;
  senderType?: 'user' | 'admin' | 'system';
}

export interface Interest {
  id: string;
  fromId: string;
  toId: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
}

// ── Converters: DB ↔ Frontend ──

function dbProfileToUserProfile(db: DbProfile): UserProfile {
  return {
    id: db.id,
    fullName: db.full_name,
    email: db.email,
    phone: db.phone,
    password: '', // never stored client-side
    gender: db.gender as 'MALE' | 'FEMALE' | '',
    dob: db.dob,
    education: db.education,
    occupation: db.occupation,
    city: db.city,
    district: db.district,
    gothra: db.gothra,
    bio: db.bio,
    height: db.height,
    weight: db.weight,
    complexion: db.complexion,
    maritalStatus: db.marital_status,
    annualIncome: db.annual_income,
    isVerified: db.is_verified,
    nakshatra: db.nakshatra,
    rashi: db.rashi,
    nativePlace: db.native_place,
    state: db.state,
    fatherName: db.father_name,
    fatherOccupation: db.father_occupation,
    motherName: db.mother_name,
    motherOccupation: db.mother_occupation,
    siblings: db.siblings,
    prefAgeMin: db.pref_age_min,
    prefAgeMax: db.pref_age_max,
    prefHeightMin: db.pref_height_min,
    prefDistrict: db.pref_district,
    prefEducation: db.pref_education,
    isLoggedIn: true,
    profilePhoto: db.profile_photo,
    role: db.role as 'user' | 'admin',
    status: db.status as 'active' | 'suspended' | 'blocked' | 'pending',
    statusReason: db.status_reason,
    dailyInterestCount: db.daily_interest_count,
    lastInterestDate: db.last_interest_date,
    profileVisible: db.profile_visible,
    photoPrivacy: db.photo_privacy,
    contactHidden: db.contact_hidden,
    notifMessages: db.notif_messages,
    notifInterests: db.notif_interests,
    notifAccepted: db.notif_accepted,
    notifMatches: db.notif_matches,
    notifPromo: db.notif_promo,
    profileViews: db.profile_views,
    adminReviewed: db.admin_reviewed,
    shortlistedIds: db.shortlisted_ids || [],
  };
}

function dbProfileToMatchProfile(db: DbProfile): MatchProfile {
  const age = db.dob
    ? Math.floor((Date.now() - new Date(db.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : 0;
  return {
    id: db.id,
    name: db.full_name,
    age,
    height: db.height,
    location: [db.city, db.state].filter(Boolean).join(', ') || db.district,
    education: db.education,
    occupation: db.occupation,
    gothra: db.gothra,
    gender: db.gender,
    nakshatra: db.nakshatra,
    rashi: db.rashi,
    maritalStatus: db.marital_status,
    annualIncome: db.annual_income,
    bio: db.bio,
    district: db.district,
    profilePhoto: db.profile_photo,
    phone: db.phone,
    email: db.email,
    weight: db.weight,
    complexion: db.complexion,
    fatherName: db.father_name,
    fatherOccupation: db.father_occupation,
    motherName: db.mother_name,
    motherOccupation: db.mother_occupation,
    siblings: db.siblings,
    prefAgeMin: db.pref_age_min,
    prefAgeMax: db.pref_age_max,
    prefHeightMin: db.pref_height_min,
    prefDistrict: db.pref_district,
    prefEducation: db.pref_education,
    nativePlace: db.native_place,
    state: db.state,
    status: db.status as 'active' | 'suspended' | 'blocked' | 'pending',
    statusReason: db.status_reason,
    joinDate: db.created_at?.split('T')[0] || '',
    adminReviewed: db.admin_reviewed,
    isVerified: db.is_verified,
    photoPrivacy: db.photo_privacy,
    role: db.role as 'user' | 'admin',
  };
}

function dbMessageToMessage(db: DbMessage): Message {
  return {
    id: db.id,
    senderId: db.sender_type === 'system' ? 'system' : (db.sender_type === 'admin' ? 'admin' : db.sender_id),
    receiverId: db.receiver_id,
    text: db.text,
    timestamp: db.created_at,
    read: db.read,
    senderType: db.sender_type,
  };
}

function dbInterestToInterest(db: DbInterest): Interest {
  return {
    id: db.id,
    fromId: db.from_id,
    toId: db.to_id,
    status: db.status as 'pending' | 'accepted' | 'declined',
    timestamp: db.created_at,
  };
}

function userProfileToDbUpdate(data: Partial<UserProfile>): Partial<DbProfile> {
  const map: Record<string, string> = {
    fullName: 'full_name', email: 'email', phone: 'phone', gender: 'gender',
    dob: 'dob', education: 'education', occupation: 'occupation', city: 'city',
    district: 'district', gothra: 'gothra', bio: 'bio', height: 'height',
    weight: 'weight', complexion: 'complexion', maritalStatus: 'marital_status',
    annualIncome: 'annual_income', nakshatra: 'nakshatra', rashi: 'rashi',
    nativePlace: 'native_place', state: 'state', fatherName: 'father_name',
    fatherOccupation: 'father_occupation', motherName: 'mother_name',
    motherOccupation: 'mother_occupation', siblings: 'siblings',
    prefAgeMin: 'pref_age_min', prefAgeMax: 'pref_age_max',
    prefHeightMin: 'pref_height_min', prefDistrict: 'pref_district',
    prefEducation: 'pref_education', profilePhoto: 'profile_photo',
    profileVisible: 'profile_visible', photoPrivacy: 'photo_privacy',
    contactHidden: 'contact_hidden', notifMessages: 'notif_messages',
    notifInterests: 'notif_interests', notifAccepted: 'notif_accepted',
    notifMatches: 'notif_matches', notifPromo: 'notif_promo',
    statusReason: 'status_reason',
    shortlistedIds: 'shortlisted_ids',
  };
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const dbKey = map[key];
    if (dbKey) result[dbKey] = value;
  }
  return result as Partial<DbProfile>;
}

// ── Default empty user ──
const defaultUser: UserProfile = {
  id: '', fullName: '', email: '', phone: '', password: '', gender: '',
  dob: '', education: '', occupation: '', city: '', district: '', gothra: '',
  bio: '', height: '', weight: '', complexion: '', maritalStatus: '',
  annualIncome: '', nakshatra: '', rashi: '', nativePlace: '', state: 'Karnataka',
  fatherName: '', fatherOccupation: '', motherName: '', motherOccupation: '',
  siblings: '', prefAgeMin: '', prefAgeMax: '', prefHeightMin: '',
  prefDistrict: '', prefEducation: '', isLoggedIn: false, profilePhoto: '',
  role: 'user', status: 'active', statusReason: '', dailyInterestCount: 0,
  lastInterestDate: '', profileVisible: true, photoPrivacy: false,
  contactHidden: true, notifMessages: true, notifInterests: true,
  notifAccepted: true, notifMatches: true, notifPromo: false, profileViews: 0,
  adminReviewed: false, isVerified: false,
  shortlistedIds: [],
};

// ── Store Interface ──
interface AppState {
  // Auth
  currentUser: UserProfile;
  registeredUser: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  register: (data: Partial<UserProfile> & { password?: string }) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  deleteSelfAccount: () => Promise<void>;
  initializeSession: () => Promise<void>;

  // Matches
  profiles: MatchProfile[];
  getActiveProfiles: () => MatchProfile[];
  fetchProfiles: () => Promise<void>;
  toggleShortlist: (profileId: string) => Promise<void>;

  // Messages
  messages: Message[];
  sendMessage: (receiverId: string, text: string, senderId?: string) => Promise<void>;
  markMessagesRead: (partnerId: string) => Promise<void>;
  fetchMessages: () => Promise<void>;

  // Interests
  interests: Interest[];
  sendInterest: (toId: string) => Promise<boolean>;
  updateInterestStatus: (interestId: string, status: 'accepted' | 'declined') => Promise<void>;
  getRemainingInterests: () => number;
  fetchInterests: () => Promise<void>;

  // Admin
  blockUser: (userId: string) => Promise<void>;
  suspendUser: (userId: string, reason: string) => Promise<void>;
  activateUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  verifyUser: (userId: string, verified: boolean) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;

  // System Settings
  systemSettings: {
    dailyInterestLimit: number;
    autoApproveProfiles: boolean;
  };
  updateSystemSettings: (settings: Partial<{ dailyInterestLimit: number; autoApproveProfiles: boolean }>) => Promise<void>;
  fetchSystemSettings: () => Promise<void>;

  // Views
  incrementProfileViews: () => void;
  uploadPhoto: (file: File) => Promise<string | null>;
}

// ── Module-level subscription variables ──
let messageSubscriptionUnsubscribe: (() => void) | null = null;
let interestSubscriptionUnsubscribe: (() => void) | null = null;

const setupSubscriptions = (profileId: string, set: any, get: any) => {
  // Clean up any existing subscriptions first
  if (messageSubscriptionUnsubscribe) messageSubscriptionUnsubscribe();
  if (interestSubscriptionUnsubscribe) interestSubscriptionUnsubscribe();

  messageSubscriptionUnsubscribe = svc.subscribeToMessages(profileId, (newMsg) => {
    const state = get();
    const formattedMsg = dbMessageToMessage(newMsg);
    if (!state.messages.some((m: any) => m.id === formattedMsg.id)) {
      set({ messages: [...state.messages, formattedMsg] });
    }
  });

  interestSubscriptionUnsubscribe = svc.subscribeToInterests(profileId, (newInterest) => {
    const state = get();
    const formattedInterest = dbInterestToInterest(newInterest);
    const index = state.interests.findIndex((i: any) => i.id === formattedInterest.id);
    if (index !== -1) {
      const updatedInterests = [...state.interests];
      updatedInterests[index] = formattedInterest;
      set({ interests: updatedInterests });
    } else {
      set({ interests: [...state.interests, formattedInterest] });
    }
  });
};

const clearSubscriptions = () => {
  if (messageSubscriptionUnsubscribe) {
    messageSubscriptionUnsubscribe();
    messageSubscriptionUnsubscribe = null;
  }
  if (interestSubscriptionUnsubscribe) {
    interestSubscriptionUnsubscribe();
    interestSubscriptionUnsubscribe = null;
  }
};

export const useStore = create<AppState>((set, get) => ({
  currentUser: defaultUser,
  registeredUser: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
  profiles: [],
  messages: [],
  interests: [],
  systemSettings: { dailyInterestLimit: 10, autoApproveProfiles: false },

  // ── Initialize session on app load ──
  initializeSession: async () => {
    try {
      set({ isLoading: true });
      const profile = await svc.fetchMyProfile();
      if (profile) {
        const userProfile = dbProfileToUserProfile(profile);
        set({
          currentUser: userProfile,
          registeredUser: userProfile,
          isLoggedIn: true,
          isLoading: false,
        });
        
        // Setup subscriptions for realtime updates
        setupSubscriptions(profile.id, set, get);

        // Fetch all data in parallel
        const state = get();
        await Promise.all([
          state.fetchProfiles(),
          state.fetchMessages(),
          state.fetchInterests(),
          state.fetchSystemSettings(),
        ]);
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  // ── Auth ──
  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const email = data.email || '';
      const password = data.password || '';

      const dbData: Partial<DbProfile> = userProfileToDbUpdate(data);
      dbData.full_name = data.fullName || '';

      const { profile, error } = await svc.registerUser(email, password, dbData);
      if (error || !profile) {
        set({ isLoading: false, error: error || 'Registration failed' });
        return false;
      }

      const userProfile = dbProfileToUserProfile(profile);
      set({
        currentUser: userProfile,
        registeredUser: userProfile,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });

      // Setup subscriptions for realtime updates
      setupSubscriptions(profile.id, set, get);

      // Fetch data
      const state = get();
      await Promise.all([state.fetchProfiles(), state.fetchMessages(), state.fetchSystemSettings()]);
      return true;
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message });
      return false;
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      // If logging in as admin, trigger admin setup API route first to ensure admin exists in DB
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@maduvedibbana.com';
      if (email === adminEmail) {
        try {
          await fetch('/api/admin/setup', { method: 'POST' });
        } catch (err) {
          console.error('Admin setup failed:', err);
        }
      }

      const { profile, error } = await svc.loginUser(email, password);

      if (error) {
        // If profile exists but user is blocked/suspended, set currentUser so login page can read status
        if (profile) {
          const userProfile = dbProfileToUserProfile(profile);
          set({ currentUser: userProfile, isLoading: false, error });
        } else {
          set({ isLoading: false, error });
        }
        return false;
      }

      if (!profile) {
        set({ isLoading: false, error: 'Login failed' });
        return false;
      }

      const userProfile = dbProfileToUserProfile(profile);
      set({
        currentUser: userProfile,
        registeredUser: userProfile,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });

      // Setup subscriptions for realtime updates
      setupSubscriptions(profile.id, set, get);

      // Fetch all data
      const state = get();
      await Promise.all([
        state.fetchProfiles(),
        state.fetchMessages(),
        state.fetchInterests(),
        state.fetchSystemSettings(),
      ]);
      return true;
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message });
      return false;
    }
  },

  logout: async () => {
    clearSubscriptions();
    await svc.logoutUser();
    set({
      currentUser: defaultUser,
      registeredUser: null,
      isLoggedIn: false,
      profiles: [],
      messages: [],
      interests: [],
    });
  },

  updateProfile: async (data) => {
    const state = get();
    const profileId = state.currentUser.id;
    if (!profileId) return;

    const dbData = userProfileToDbUpdate(data);
    await svc.updateProfile(profileId, dbData);

    const updatedUser = { ...state.currentUser, ...data };
    set({
      currentUser: updatedUser,
      registeredUser: state.currentUser.role !== 'admin' ? updatedUser : state.registeredUser,
    });
  },

  deleteSelfAccount: async () => {
    clearSubscriptions();
    const state = get();
    await svc.deleteSelfAccount(state.currentUser.id);
    set({
      currentUser: defaultUser,
      registeredUser: null,
      isLoggedIn: false,
      profiles: [],
      messages: [],
      interests: [],
    });
  },

  // ── Profiles ──
  getActiveProfiles: () => {
    return get().profiles.filter(p => p.status === 'active');
  },

  fetchProfiles: async () => {
    const state = get();
    let dbProfiles: DbProfile[];
    if (state.currentUser.role === 'admin') {
      dbProfiles = await svc.fetchAllProfiles();
    } else {
      dbProfiles = await svc.fetchActiveProfiles();
    }
    const profiles = dbProfiles
      .filter(p => p.id !== state.currentUser.id) // exclude self
      .map(dbProfileToMatchProfile);
    set({ profiles });
  },

  toggleShortlist: async (profileId) => {
    const state = get();
    const myProfileId = state.currentUser.id;
    if (!myProfileId) return;

    const currentShortlist = state.currentUser.shortlistedIds || [];
    let updatedShortlist: string[];

    if (currentShortlist.includes(profileId)) {
      updatedShortlist = currentShortlist.filter(id => id !== profileId);
    } else {
      updatedShortlist = [...currentShortlist, profileId];
    }

    // Write to Supabase using updateProfile service helper
    await svc.updateProfile(myProfileId, { shortlisted_ids: updatedShortlist });

    // Update local state
    const updatedUser = { ...state.currentUser, shortlistedIds: updatedShortlist };
    set({
      currentUser: updatedUser,
      registeredUser: state.currentUser.role !== 'admin' ? updatedUser : state.registeredUser,
    });
  },

  // ── Messages ──
  fetchMessages: async () => {
    const state = get();
    const profileId = state.currentUser.id;
    if (!profileId) return;

    let dbMessages: DbMessage[];
    if (state.currentUser.role === 'admin') {
      dbMessages = await svc.fetchAllMessages();
    } else {
      dbMessages = await svc.fetchUserMessages(profileId);
    }
    const messages = dbMessages.map(dbMessageToMessage);
    set({ messages });
  },

  sendMessage: async (receiverId, text, senderId) => {
    const state = get();
    const actualSenderId = senderId || state.currentUser.id;
    const senderType = senderId === 'system' ? 'system' : (state.currentUser.role === 'admin' ? 'admin' : 'user');

    const { message } = await svc.sendMessage(actualSenderId, receiverId, text, senderType);
    if (message) {
      const newMsg = dbMessageToMessage(message);
      set({ messages: [...state.messages, newMsg] });
    }
  },

  markMessagesRead: async (partnerId) => {
    const state = get();
    const myId = state.currentUser.id;
    await svc.markMessagesRead(myId, partnerId);

    const newMessages = state.messages.map(m =>
      m.senderId === partnerId && m.receiverId === myId && !m.read ? { ...m, read: true } : m
    );
    set({ messages: newMessages });
  },

  // ── Interests ──
  fetchInterests: async () => {
    const state = get();
    const profileId = state.currentUser.id;
    if (!profileId) return;

    let dbInterests: DbInterest[];
    if (state.currentUser.role === 'admin') {
      dbInterests = await svc.fetchAllInterests();
    } else {
      dbInterests = await svc.fetchUserInterests(profileId);
    }
    const interests = dbInterests.map(dbInterestToInterest);
    set({ interests });
  },

  sendInterest: async (toId) => {
    const state = get();
    const fromId = state.currentUser.id;

    const { interest, error } = await svc.sendInterest(fromId, toId);
    if (error || !interest) return false;

    const newInterest = dbInterestToInterest(interest);
    set({ interests: [...state.interests, newInterest] });
    return true;
  },

  updateInterestStatus: async (interestId, status) => {
    await svc.updateInterestStatus(interestId, status);
    const state = get();
    const newInterests = state.interests.map(i =>
      i.id === interestId ? { ...i, status } : i
    );
    set({ interests: newInterests });
  },

  getRemainingInterests: () => {
    const state = get();
    const limit = state.systemSettings?.dailyInterestLimit ?? 10;
    if (state.currentUser.role === 'admin') return limit;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = state.interests.filter(
      i => i.fromId === state.currentUser.id && i.timestamp.startsWith(todayStr)
    ).length;
    return Math.max(0, limit - todayCount);
  },

  // ── Admin Actions ──
  blockUser: async (userId) => {
    const state = get();
    await svc.blockUser(userId, state.currentUser.id);
    set({
      profiles: state.profiles.map(p =>
        p.id === userId ? { ...p, status: 'blocked' as const, statusReason: 'Blocked by admin' } : p
      ),
    });
  },

  suspendUser: async (userId, reason) => {
    const state = get();
    await svc.suspendUser(userId, reason, state.currentUser.id);
    set({
      profiles: state.profiles.map(p =>
        p.id === userId ? { ...p, status: 'suspended' as const, statusReason: reason } : p
      ),
    });
  },

  activateUser: async (userId) => {
    const state = get();
    await svc.activateUser(userId, state.currentUser.id);
    set({
      profiles: state.profiles.map(p =>
        p.id === userId ? { ...p, status: 'active' as const, statusReason: '' } : p
      ),
    });
  },

  deleteUser: async (userId) => {
    const state = get();
    await svc.deleteUserByAdmin(userId, state.currentUser.id);
    set({
      profiles: state.profiles.filter(p => p.id !== userId),
      messages: state.messages.filter(m => m.senderId !== userId && m.receiverId !== userId),
      interests: state.interests.filter(i => i.fromId !== userId && i.toId !== userId),
    });
  },

  approveUser: async (userId) => {
    const state = get();
    await svc.approveUser(userId, state.currentUser.id);
    set({
      profiles: state.profiles.map(p =>
        p.id === userId ? { ...p, status: 'active' as const, statusReason: '', adminReviewed: true } : p
      ),
    });
  },

  rejectUser: async (userId) => {
    const state = get();
    await svc.rejectUser(userId, state.currentUser.id);
    set({
      profiles: state.profiles.map(p =>
        p.id === userId ? { ...p, status: 'blocked' as const, statusReason: 'Rejected by admin' } : p
      ),
    });
  },

  verifyUser: async (userId, verified) => {
    const state = get();
    await svc.verifyUser(userId, verified, state.currentUser.id);
    set({
      profiles: state.profiles.map(p =>
        p.id === userId ? { ...p, isVerified: verified } : p
      ),
    });
  },

  resetPassword: async (email) => {
    const { error } = await svc.resetPassword(email);
    return !error;
  },

  // ── System Settings ──
  fetchSystemSettings: async () => {
    const settings = await svc.fetchSystemSettings();
    if (settings) {
      set({
        systemSettings: {
          dailyInterestLimit: settings.daily_interest_limit,
          autoApproveProfiles: settings.auto_approve_profiles,
        },
      });
    }
  },

  updateSystemSettings: async (data) => {
    const dbData: Partial<DbSystemSettings> = {};
    if (data.dailyInterestLimit !== undefined) dbData.daily_interest_limit = data.dailyInterestLimit;
    if (data.autoApproveProfiles !== undefined) dbData.auto_approve_profiles = data.autoApproveProfiles;
    await svc.updateSystemSettings(dbData);
    set((state) => ({
      systemSettings: { ...state.systemSettings, ...data },
    }));
  },

  // ── Views ──
  incrementProfileViews: () => {
    const state = get();
    if (state.currentUser.id) {
      svc.incrementProfileViews(state.currentUser.id);
    }
  },

  uploadPhoto: async (file) => {
    const state = get();
    const profileId = state.currentUser.id;
    if (!profileId) return null;

    set({ isLoading: true, error: null });

    // Client-side image compression helper
    const compressImage = (imageFile: File): Promise<File> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(imageFile);
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          let width = img.width;
          let height = img.height;
          const maxDim = 600;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(imageFile);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], imageFile.name, { type: 'image/jpeg' }));
              } else {
                resolve(imageFile);
              }
            },
            'image/jpeg',
            0.75
          );
        };
        img.onerror = () => resolve(imageFile);
      });
    };

    try {
      const compressedFile = await compressImage(file);
      const { url, error } = await svc.uploadProfilePhoto(profileId, compressedFile);
      if (error || !url) {
        set({ error: error || 'Failed to upload photo', isLoading: false });
        return null;
      }
      // Update local state
      set({
        currentUser: { ...state.currentUser, profilePhoto: url },
        registeredUser: state.currentUser.role !== 'admin' ? { ...state.currentUser, profilePhoto: url } : state.registeredUser,
        isLoading: false,
      });
      return url;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      return null;
    }
  },
}));
