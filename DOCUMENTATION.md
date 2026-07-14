# Maduvedibbana Matrimony - Project Documentation

## 1. Overview
Maduvedibbana is a premium, modern matrimony web application built to connect individuals looking for marriage. It features a rich, responsive UI with glassmorphism effects, a robust client-side state management architecture, and a comprehensive Super Admin dashboard for platform moderation.

### Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **State Management:** Zustand (with `localStorage` persistence)
- **Styling:** Vanilla CSS (`globals.css`) with modern variables, flexbox/grid, and micro-animations.
- **Icons:** `lucide-react`
- **Deployment:** Vercel / Next.js production build

---

## 2. Architecture & Data Flow

### State Management (`store/useStore.ts`)
The application relies entirely on client-side state managed by Zustand. To eginsure data persistence across sessions, the store state is serialized to `localStorage` under the key `maduvedibbana_state`.

#### The "Dual-Slot" Auth Architecture
To allow a Super Admin to log into the platform without overwriting the actual registered user's data, the store implements a dual-slot system:
1. `registeredUser`: The persistent record of the user who signed up on the device.
2. `currentUser`: The active session user. When a user logs in, `currentUser` is populated from `registeredUser`. When the Admin logs in, `currentUser` becomes the Admin, leaving `registeredUser` safely untouched in the background.

### Key Data Entities
- **UserProfile:** Represents authenticated users (Admin or Registered User) with full PII, credentials, and account status (`active`, `pending`, `suspended`, `blocked`).
- **MatchProfile:** Represents the mock/browseable profiles displayed in the app.
- **Message:** Represents a chat message or a system notification.
- **Interest:** Represents an interest request sent from one user to another (status: `pending`, `accepted`, `rejected`).

---

## 3. End-to-End Functionality

### A. Authentication & Onboarding

#### Registration Flow
The registration process captures core user metrics (Full Name, Email, Password, DOB, Gender). 
1. **Validation:** The system runs a pre-check to ensure the email `admin@maduvedibbana.com` cannot be registered by a standard user.
2. **State Injection:** Upon successful validation, a `UserProfile` object is created and injected into BOTH the `currentUser` and `registeredUser` store slots simultaneously.
3. **Approval Logic:** If the system setting `autoApproveProfiles` is enabled, the user is immediately granted the `active` status and can access all features. If disabled, they are assigned `pending` status.
4. **Mailing Trigger:** A welcome message is fired into the user's Inbox, and a notification is sent to the Admin Inbox alerting them of the new sign-up.

#### Login Mechanics & Dual-Slot Architecture
The login system is uniquely designed to support Administrative over-the-shoulder management without corrupting the local session state.
- **User Login:** 
  - The system cross-references the submitted credentials against the `registeredUser` slot (not `currentUser`). 
  - If a match is found, it evaluates the `status`. 
  - If `blocked`, the login halts and an explicit error toast is shown. 
  - If `suspended`, the login halts, and the user is shown the exact *reason* the Admin provided during suspension.
  - If valid, `currentUser` is populated with the `registeredUser`'s data, granting access to the `/dashboard`.
- **Super Admin Login:** 
  - The Admin authenticates using dedicated credentials (`admin@maduvedibbana.com` / `admin123`). 
  - When the Admin logs in, ONLY the `currentUser` slot is overwritten with the Admin profile. 
  - The `registeredUser` slot remains completely untouched. This is what allows the Admin to view, block, or delete the actual registered user from the same browser session without data loss (the "Ghost User" fix).

#### Logout & Session Termination
- **User Logout:** The system saves the current state of `currentUser` back to `registeredUser` (persisting any changes made during the session), and then empties the `currentUser` slot.
- **Admin Logout:** The system simply clears the `currentUser` slot, leaving the `registeredUser` untouched and ready for the real user to log back in.

### B. User Dashboard
- **Overview:** Displays profile statistics, recent messages, and platform activity.
- **Browse Matches:** Users can filter and sort profiles by age, height, education, district, etc.
- **Sending Interests:** Users can send interests to profiles. This is governed by a `dailyInterestLimit` (default 10). Blocked/suspended users are restricted from sending interests.
- **Messaging:** Users can chat with profiles they match with. 
- **Settings:** Users can update their profile information or permanently delete their account (which scrubs all their data from the platform).

### C. Super Admin Dashboard
The Admin dashboard is the command center for platform moderation.
- **Analytics:** Real-time stats on active, pending, suspended, and blocked users.
- **User Management:** The Admin can view the `registeredUser` alongside all mock profiles. Actions include:
  - **Approve/Reject:** For pending users.
  - **Suspend:** Temporarily disable a user with a specific reason.
  - **Block:** Permanently restrict access.
  - **Activate:** Restore access to restricted users.
  - **Delete:** Permanently scrub a user and all their messages/interests from the platform.
- **Global Settings:** Adjust platform constraints like `dailyInterestLimit` and `autoApproveProfiles`.

### D. System Notifications (Mailing System)
The platform features an automated in-app notification system that sends messages directly to user Inboxes using virtual profiles (`System Notifications` and `Super Admin`).
- **Welcome Emails:** Sent upon registration.
- **Admin Alerts:** Admin receives an inbox message when a new user registers or deletes their account.
- **Moderation Alerts:** Users receive direct messages if they are suspended, blocked, or reactivated.
- **Approval Alerts:** Users are notified when their profile is verified and approved.

---

## 4. UI/UX & Design System

### Visual Identity
The platform uses a premium, elegant color palette:
- **Primary:** Deep Navy Blue (`#1e2a44`)
- **Accent:** Royal Gold (`#c6a55c`)
- **Backgrounds:** Soft warm white (`#fcfbf8`) and clean white (`#ffffff`)

### Design Patterns
- **Glassmorphism:** Navigation bars, dropdowns, and floating cards use semi-transparent backgrounds with backdrop filters.
- **Micro-animations:** Buttons, cards, and links feature smooth `transform` and `box-shadow` transitions on hover.
- **Responsive Layouts:** The app uses CSS Grid and Flexbox to transition seamlessly from multi-column desktop views to stacked mobile views.
- **Toasts:** Non-intrusive floating notifications (success/warning/error) provide immediate feedback for actions like sending interests or updating settings.

---

## 5. Security & Fallbacks

- **Route Protection:** Users attempting to access `/dashboard` without being logged in are aggressively redirected to `/login`.
- **Admin Isolation:** Admin operations are isolated from standard user operations. The Admin cannot delete themselves, and users cannot access the `/dashboard/admin` route.
- **Form Validation:** All auth and settings forms utilize HTML5 validation and React state checks to prevent malformed data.
- **Graceful Fallbacks:** If the `localStorage` payload becomes corrupted or fails to parse, the application falls back to a clean `defaultUser` state without crashing.
