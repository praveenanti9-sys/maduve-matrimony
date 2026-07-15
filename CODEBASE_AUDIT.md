# Maduvedibbana Matrimony — End-to-End Codebase Review & Audit Report

This document presents an exhaustive, line-by-line inspection and review of the **Maduvedibbana Matrimony** codebase evaluated from three distinct professional lenses:
1. **Top Developer / Software Architect Perspective** (Architecture, Security, State Management, Scalability)
2. **Senior QA Tester Perspective** (User Flows, Edge Cases, Race Conditions, Reliability)
3. **Product UX Perspective** (User Experience, Ergonomics, Clarity, Responsive Behavior)

---

## 1. Core Data & API Layer (`src/lib/` & `src/app/api/`)

### A. `src/lib/supabase-service.ts`
- **Purpose**: Acts as the central Repository layer. Encapsulates Supabase client initialization, database CRUD queries (`profiles`, `messages`, `interests`, `system_settings`), real-time channel subscriptions, and object transformations between `snake_case` DB rows and `camelCase` TypeScript models.
- **Architectural Analysis**:
  - **The Good**: Clean separation of data types (`DbProfile`, `DbMessage`, `DbInterest`) and robust mapping helpers (`dbProfileToUserProfile`, `dbProfileToMatchProfile`). Normalizing `admin` and `system` string IDs to valid UUIDs (`ADMIN_UUID = '00000000-0000-0000-0000-00000000a111'`) prevents Postgres `invalid input syntax for type uuid` crashes.
  - **The Risk (Client vs. Server Boundaries)**:
    - `getSupabaseAdmin()` uses `SUPABASE_SERVICE_ROLE_KEY` to bypass Row-Level Security (RLS). While properly kept to server-side code (`/api/auth/register/route.ts`), functions like `blockUser`, `suspendUser`, `approveUser`, and `rejectUser` (lines 516–623) currently execute using `getSupabase()` (the anon client). For these updates to succeed, RLS policies on the `profiles` table must evaluate whether the JWT belongs to an `admin` user. If RLS policies are misconfigured or relaxed, any authenticated user could tamper with status fields.
    - **Recommendation**: Transition all administrative mutation operations (`approve`, `block`, `suspend`, `verify`) to a unified, authenticated server API endpoint (e.g., `/api/admin/action`) where the server explicitly verifies the caller's admin token before invoking the service role key.

### B. Server API Endpoints (`src/app/api/`)
- **Files**: `/api/auth/register/route.ts`, `/api/admin/setup/route.ts`, `/api/admin/delete-user/route.ts`, `/api/messages/system/route.ts`, `/api/send-email/route.ts`.
- **Architectural & Security Audit**:
  - **CRITICAL VULNERABILITY (Missing Authorization Guards)**:
    - `/api/admin/delete-user/route.ts`, `/api/messages/system/route.ts`, and `/api/send-email/route.ts` accept JSON payloads (`profileId`, `receiverId`, `to`, `html`) and execute privileged actions (`supabaseAdmin.auth.admin.deleteUser()`, inserting system messages, dispatching Resend emails) **without verifying the caller's session or role**.
    - **Exploit Scenario**: An unauthenticated or malicious attacker could issue a `POST` request to `/api/admin/delete-user` with any user's `profileId` and permanently delete their account and Supabase Auth credentials.
    - **Fix Required**: Every privileged endpoint must inspect `request.headers.get('Authorization')` or parse the user session cookie, verify via `supabase.auth.getUser(token)`, and confirm that `profile.role === 'admin'` (or that the user is deleting their own account if `selfDelete === true`) before proceeding.

---

## 2. State Management (`src/store/useStore.ts`)

- **Purpose**: Global Zustand state store controlling user sessions, profile lists, active chats, real-time message/interest synchronization, and administrative status updates.
- **Architectural Analysis**:
  - **The Good**: Well-structured action dispatchers (`login`, `logout`, `fetchProfiles`, `sendMessage`). Automatically subscribes to Supabase Realtime channels (`subscribeToMessages`, `subscribeToProfiles`, `subscribeToInterests`) when a user logs in and cleanly unsubscribes on logout (`clearSubscriptions()`).
  - **CRITICAL VULNERABILITY (Client-Side Admin Credentials)**:
    - In `useStore.ts` line 529: `const adminEmail = getClientEnv('NEXT_PUBLIC_ADMIN_EMAIL') || 'admin@maduvedibbana.com';`
    - Combined with `src/app/layout.tsx` (line 138), where `NEXT_PUBLIC_ADMIN_PASSWORD` is injected into `<script>window.__ENV__ = { ... }</script>`, this exposes the Super Admin credentials to anyone viewing the website's HTML source or browser console.
    - **Fix Required**: Remove `NEXT_PUBLIC_ADMIN_PASSWORD` and `NEXT_PUBLIC_ADMIN_EMAIL` from `window.__ENV__` and client bundles completely. Admin identification should rely solely on `profile.role === 'admin'` returned securely from the database after standard `signInWithPassword` authentication.

---

## 3. Dashboard & User Flows (`src/app/dashboard/`)

### A. Dashboard Home (`dashboard/page.tsx`)
- **Purpose**: Provides quick overview stats (`Daily Interest Limit`, `Active Profiles`, `Pending Approvals`), profile search shortcuts, and recent interest activity.
- **QA & UX Perspective**:
  - **Flow**: Clear, scannable cards with distinct actions (`Browse Profiles`, `Upgrade Membership`).
  - **Responsiveness**: `Interest Limit Card` and action grids utilize `.flex-col-mobile` and responsive utility rules, ensuring zero horizontal overflow across phones and tablets.

### B. Browse Profiles (`dashboard/browse/page.tsx`)
- **Purpose**: Main matchmaking engine allowing users to filter profiles by age, height, district, gender, education, and marital status.
- **QA & UX Perspective**:
  - **Flow**: Daily interest counters (`remainingInterests`) prevent spam and enforce membership limits cleanly (`getRemainingInterests()`).
  - **Responsiveness**: Profile cards transition fluidly across 1 column (`< 640px`), 2 columns (`640px–1024px`), and 3 columns (`> 1024px`). Search and filter controls wrap neatly on narrow viewports.

### C. Messaging System (`dashboard/messages/page.tsx`)
- **Purpose**: Real-time direct chat between registered users and system/admin notifications.
- **QA & UX Perspective**:
  - **Single-Pane Mobile UX**: On viewports under `640px`, the layout shifts from a side-by-side split view to a single-pane native messaging flow (`.mobile-chat-list` vs `.mobile-chat-main`). Tapping a conversation hides the sidebar and shows the chat box with an intuitive **Back to Conversations** button (`ArrowLeft`).
  - **Reliability**: Normalized UUID handling guarantees that messages sent to or from the Super Admin (`ADMIN_UUID`) or System (`SYSTEM_UUID`) render correctly without database syntax failures.

### D. Super Admin Panel (`dashboard/admin/page.tsx`)
- **Purpose**: Central command center for Super Admins to monitor users (`Overview`, `User Management`, `Pending Approvals`), inspect direct user-to-user chat histories (`All Messages`), and configure system policies (`System Settings`).
- **QA & UX Perspective**:
  - **Table Ergonomics**: All user management and approval tables (`table.admin-table`) are enclosed within horizontal overflow wrappers (`overflowX: "auto"`). On mobile, administrators can swipe through table columns without breaking the page layout.
  - **User Activity Audit**: In the `User Detail` view (`activeView === 'user-detail'`), administrators have complete visibility into individual activity metrics (`Interests Sent`, `Interests Received`, `Messages`, `Accepted Matches`) alongside quick-action status toggles (`Approve`, `Suspend`, `Block`, `Revoke Verification`).
  - **All Messages Monitoring**: Adopts the same single-pane responsive pattern on mobile as user messaging, enabling admins to easily inspect conversations on mobile devices.

---

## 4. Public Landing & Auth Pages (`src/app/` & `src/components/`)

### A. Landing Page (`src/app/page.tsx`) & Info Pages (`about`, `contact`)
- **Purpose**: Establishes trust and cultural authenticity (*Utthana Uttara Kannada Okkalu Sangama*) and presents platform objectives and registration incentives.
- **UX & Aesthetics**:
  - **Visual Excellence**: Rich, curated color palettes (`#1e2a44` Navy, `#c6a55c` Gold, `#EFEBE3` Warm Cream) combined with modern Google fonts (`Playfair Display` headers and `Inter` body text) create a premium feeling.
  - **Responsiveness**: `.home-section-grid` ensures every 2-column section (Hero, Okkaliga Platform, Tradition, Objectives) collapses smoothly into a single column on mobile and tablet devices.

### B. Auth Pages (`login`, `register`, `forgot-password`)
- **Purpose**: Secure onboarding and authentication entry points.
- **QA & UX Perspective**:
  - **Error Messaging**: When users attempt to log in while `pending`, `suspended`, or `blocked`, the interface intercepts the session and displays explicit, helpful feedback (e.g., *"Your profile is pending admin review..."* or *"Your account has been temporarily suspended. Reason:..."*) rather than generic errors.
  - **Mobile Padding**: Card containers automatically scale their padding from `32px 40px` down to `16px !important` on narrow phones (`<= 480px`), giving form fields comfortable breathing space.

---

## 5. Actionable Priority Roadmap

### Immediate Priority (P0 - Security Fixes)
1. **Sanitize Client Environment Bundles**: Remove `NEXT_PUBLIC_ADMIN_PASSWORD` and `NEXT_PUBLIC_ADMIN_EMAIL` from `src/app/layout.tsx` (`window.__ENV__`) and `.env` exports so credentials cannot be read from the browser console.
2. **Secure Server API Routes**: Add session verification middleware or token checks to `/api/admin/delete-user`, `/api/messages/system`, and `/api/send-email` to ensure only authenticated Super Admin users can trigger deletions, system broadcasts, or transactional emails.

### High Priority (P1 - Architectural Hardening)
1. **Server-Side Admin Action Proxy**: Migrate client-side calls to `blockUser`, `suspendUser`, `approveUser`, and `rejectUser` (`src/lib/supabase-service.ts`) to a secure `/api/admin/action` server endpoint using `SUPABASE_SERVICE_ROLE_KEY` after verifying the caller's admin token.
2. **Strict RLS Policy Validation**: Verify that database RLS policies on `profiles`, `messages`, and `interests` strictly prevent regular `user` roles from modifying fields outside their own `auth_id`.
