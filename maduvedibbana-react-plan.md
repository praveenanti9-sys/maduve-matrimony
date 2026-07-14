# Maduvedibbana — React Rebuild: Full End-to-End Plan

> Okkaliga Community Matrimony Platform  
> Rebuilding from WordPress → Modern React Stack

---

## 1. Project Overview

**Site:** Maduvedibbana Matrimony  
**Association:** Utthana Uttara Kannada Okkalu Sangama (Reg.), Bengaluru  
**Goal:** Replace WordPress with a fast, scalable, fully-functional React application with auth, profiles, matchmaking, and admin.

---

## 2. Tech Stack

### Frontend
| Layer | Choice | Why |
|---|---|---|
| Framework | **React 18 + Vite** | Fast HMR, modern tooling |
| Language | **TypeScript** | Type safety across the codebase |
| Routing | **React Router v6** | Nested routes, protected routes |
| State | **Zustand** | Lightweight global state for auth/user |
| Server State | **TanStack Query (React Query v5)** | API caching, pagination, optimistic updates |
| Forms | **React Hook Form + Zod** | Validation, schema-first forms |
| UI Components | **shadcn/ui + Tailwind CSS** | Accessible, customizable, no overhead |
| Styling | **Tailwind CSS v3** | Utility-first, responsive |
| Animations | **Framer Motion** | Page transitions, hero section |
| Icons | **Lucide React** | Consistent icon set |
| Image Upload | **React Dropzone** | Profile photo uploads |

### Backend
| Layer | Choice | Why |
|---|---|---|
| Runtime | **Node.js + Express** (or **Hono** for edge) | Familiar, fast setup |
| Language | **TypeScript** | End-to-end type safety |
| Database | **PostgreSQL** (via Supabase or Railway) | Relational data for profiles + matching |
| ORM | **Prisma** | Type-safe queries, auto migrations |
| Auth | **Supabase Auth** (or JWT + bcrypt) | Email/OTP login, secure sessions |
| File Storage | **Supabase Storage** (or S3/Cloudflare R2) | Profile photos |
| Email | **Resend** (or Nodemailer) | OTP emails, notifications |
| API Style | **REST** with versioned routes `/api/v1/` | Simple, easy to consume from React |

### DevOps & Hosting
| Layer | Choice |
|---|---|
| Frontend Hosting | **Vercel** (free tier + great DX) |
| Backend Hosting | **Railway** or **Render** |
| Database | **Supabase** (Postgres + Auth + Storage bundled) |
| CI/CD | **GitHub Actions** |
| Domain | Custom domain with HTTPS (existing or new) |
| Monitoring | **Sentry** (errors) + Vercel Analytics |

---

## 3. Pages & Routes

```
/                          → Home (public)
/register                  → Registration Step 1: Basic Info
/register/profile          → Step 2: Profile Details (protected, after email verify)
/login                     → Login page
/forgot-password           → Reset password
/contact                   → Contact page
/privacy-policy            → Privacy policy
/terms-and-conditions      → T&C

/dashboard                 → User dashboard (protected)
/dashboard/profile         → View/edit own profile
/dashboard/matches         → Browse matches
/dashboard/profile/:id     → View another member's profile
/dashboard/interests       → Sent & received interest requests
/dashboard/messages        → Basic messaging (v2)
/dashboard/settings        → Account settings, change password

/admin                     → Admin dashboard (admin-only)
/admin/members             → All registered members
/admin/members/:id         → View/manage individual member
/admin/approvals           → Pending profile approvals
/admin/reports             → Reports & analytics
```

---

## 4. Feature Modules

### 4.1 Authentication
- Email + password registration
- OTP email verification on signup
- Login with email/password
- "Forgot password" via email link
- Session persistence (JWT in httpOnly cookie or Supabase session)
- Protected route wrapper component

### 4.2 Registration Flow (Multi-step)
**Step 1 — Basic Info**
- Full name, gender, date of birth
- Mobile number (with OTP verify optional)
- Email, password
- Accept T&C checkbox

**Step 2 — Profile Details** (after email verify)
- Photo upload (up to 3 photos)
- Height, weight, complexion
- Education, occupation, annual income
- City, district, native place
- Religion details (gothra, nakshatra, rashi)
- Marital status
- About yourself (bio text)
- Family details (father, mother, siblings)
- Partner preferences (age range, height, education, location)

### 4.3 Profile System
- Full profile page with photo carousel
- Blurred contact details until interest accepted (optional privacy setting)
- Profile completeness indicator
- Admin approval gate — profiles shown only after admin approves
- Edit profile (any field, re-upload photos)

### 4.4 Matchmaking / Browse
- Paginated list of approved profiles (opposite gender by default)
- Filters: age range, height, district, education, occupation, nakshatra/rashi
- Search by name or profile ID
- "Send Interest" button on each profile card
- View full profile page

### 4.5 Interest / Connect System
- Send interest to a profile
- Receive interest notifications
- Accept / Decline incoming interests
- View sent interests (with status: pending / accepted / declined)
- View received interests

### 4.6 Contact Details Reveal
- Contact details (mobile, email) visible only after mutual interest OR admin toggle
- "Request Contact" flow (simple)

### 4.7 Admin Panel
- Login with admin credentials
- View all registered members (table with search + filter)
- Approve / reject profiles (with optional rejection note)
- View full profile of any member
- Disable / delete accounts
- Export member list (CSV)
- Dashboard stats: total members, pending approvals, active this week

### 4.8 Contact Page
- Contact form (name, email, message)
- Form submits to backend, stores in DB + sends email notification to admin
- Display phone/WhatsApp and address

---

## 5. Database Schema (Prisma)

```prisma
// Users (auth layer)
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  role          Role      @default(MEMBER)
  emailVerified Boolean   @default(false)
  isApproved    Boolean   @default(false)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  profile       Profile?
  sentInterests     Interest[] @relation("Sender")
  receivedInterests Interest[] @relation("Receiver")
}

// Profile details
model Profile {
  id            String   @id @default(uuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])

  // Personal
  fullName      String
  gender        Gender
  dateOfBirth   DateTime
  height        Int?     // cm
  weight        Int?     // kg
  complexion    String?
  maritalStatus String?
  bio           String?

  // Contact
  mobile        String?
  city          String?
  district      String?
  nativePlace   String?
  state         String   @default("Karnataka")

  // Education & Career
  education     String?
  occupation    String?
  annualIncome  String?

  // Religion
  gothra        String?
  nakshatra     String?
  rashi         String?

  // Family
  fatherName    String?
  fatherOccupation String?
  motherName    String?
  motherOccupation String?
  siblings      String?

  // Partner Preferences
  prefAgeMin    Int?
  prefAgeMax    Int?
  prefHeightMin Int?
  prefDistrict  String?
  prefEducation String?

  photos        Photo[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// Profile photos
model Photo {
  id        String  @id @default(uuid())
  profileId String
  profile   Profile @relation(fields: [profileId], references: [id])
  url       String
  isPrimary Boolean @default(false)
  order     Int     @default(0)
}

// Interest / Connection requests
model Interest {
  id         String         @id @default(uuid())
  senderId   String
  receiverId String
  sender     User           @relation("Sender", fields: [senderId], references: [id])
  receiver   User           @relation("Receiver", fields: [receiverId], references: [id])
  status     InterestStatus @default(PENDING)
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt

  @@unique([senderId, receiverId])
}

// Contact form submissions
model ContactSubmission {
  id        String   @id @default(uuid())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}

enum Role {
  MEMBER
  ADMIN
}

enum Gender {
  MALE
  FEMALE
}

enum InterestStatus {
  PENDING
  ACCEPTED
  DECLINED
}
```

---

## 6. API Endpoints

```
# Auth
POST   /api/v1/auth/register          Register new user + send verify email
POST   /api/v1/auth/verify-email      Verify OTP/token
POST   /api/v1/auth/login             Login → set session
POST   /api/v1/auth/logout            Clear session
POST   /api/v1/auth/forgot-password   Send reset link
POST   /api/v1/auth/reset-password    Set new password

# Profile (authenticated)
GET    /api/v1/profile/me             Own profile
POST   /api/v1/profile                Create profile (step 2)
PUT    /api/v1/profile/me             Update own profile
POST   /api/v1/profile/photos         Upload photos
DELETE /api/v1/profile/photos/:id     Delete photo

# Members / Browse (authenticated)
GET    /api/v1/members                Paginated list with filters
GET    /api/v1/members/:id            Single profile (approved + active only)

# Interests
POST   /api/v1/interests              Send interest
GET    /api/v1/interests/sent         My sent interests
GET    /api/v1/interests/received     My received interests
PUT    /api/v1/interests/:id          Accept/decline

# Contact
POST   /api/v1/contact                Submit contact form

# Admin (admin role required)
GET    /api/v1/admin/members          All members
GET    /api/v1/admin/members/:id      Any member profile
PUT    /api/v1/admin/members/:id/approve   Approve
PUT    /api/v1/admin/members/:id/disable   Disable
DELETE /api/v1/admin/members/:id      Delete
GET    /api/v1/admin/stats            Dashboard counts
GET    /api/v1/admin/contact-submissions  All contact form entries
```

---

## 7. Frontend Component Tree

```
src/
├── App.tsx                    # Router + providers
├── main.tsx

├── components/
│   ├── layout/
│   │   ├── Navbar.tsx         # Logo, nav links, login/register CTA
│   │   ├── Footer.tsx         # Quick links, logos, copyright
│   │   └── AdminLayout.tsx    # Sidebar + topbar for admin
│   ├── ui/                    # shadcn/ui re-exports + custom primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   └── shared/
│       ├── ProfileCard.tsx    # Member card for browse grid
│       ├── PhotoCarousel.tsx  # Profile photo slider
│       ├── InterestButton.tsx # Send/accept/decline interest
│       ├── FilterBar.tsx      # Browse page filters
│       ├── LoadingSpinner.tsx
│       └── EmptyState.tsx

├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register/
│   │   ├── RegisterStep1.tsx
│   │   └── RegisterStep2.tsx
│   ├── ForgotPassword.tsx
│   ├── Contact.tsx
│   ├── PrivacyPolicy.tsx
│   ├── Terms.tsx
│   ├── dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── MyProfile.tsx
│   │   ├── Browse.tsx
│   │   ├── ProfileView.tsx
│   │   ├── Interests.tsx
│   │   └── Settings.tsx
│   └── admin/
│       ├── AdminDashboard.tsx
│       ├── AdminMembers.tsx
│       ├── AdminMemberView.tsx
│       └── AdminApprovals.tsx

├── hooks/
│   ├── useAuth.ts             # Auth state from Zustand
│   ├── useProfile.ts          # Own profile query
│   ├── useMembers.ts          # Browse members with filters
│   └── useInterests.ts        # Sent/received interests

├── store/
│   └── authStore.ts           # Zustand: user, token, login/logout

├── lib/
│   ├── api.ts                 # Axios instance with auth headers
│   ├── validations.ts         # Zod schemas
│   └── utils.ts               # cn(), formatters

└── types/
    └── index.ts               # Shared TS types
```

---

## 8. Design System & Aesthetic

**Theme:** Warm, traditional, trustworthy — saffron gold + deep maroon + cream white  
**Fonts:** `Playfair Display` (headings) + `Noto Serif Kannada` (Kannada text) + `Inter` (body/UI)  
**Color Palette:**
```
Primary:   #8B1A1A  (deep maroon / trust)
Accent:    #C9922A  (saffron gold / auspicious)
Surface:   #FBF7F0  (warm cream / clean)
Text:      #1A1208  (near-black warm)
Muted:     #7A6550  (warm gray)
```

**Key UI Patterns:**
- Hero: Full-bleed with couple/family illustration + CTA
- Profile Cards: Photo + name + key details + "Send Interest" CTA
- Multi-step registration: Step indicator at top, animated transitions between steps
- Dashboard: Sidebar nav (desktop) / bottom tab bar (mobile)
- Admin: Data-dense table layout with inline actions

---

## 9. Build Phases & Timeline

### Phase 1 — Foundation (Week 1–2)
- [ ] Repo setup: Vite + React + TypeScript + Tailwind + shadcn
- [ ] Routing structure, layout components (Navbar, Footer)
- [ ] Supabase project: auth, DB, storage
- [ ] Prisma schema + migrations
- [ ] Auth: register, verify email, login, logout, JWT middleware
- [ ] Protected route component

### Phase 2 — Registration & Profile (Week 3–4)
- [ ] Multi-step registration form (Step 1 + Step 2)
- [ ] Form validation with Zod + React Hook Form
- [ ] Photo upload to Supabase Storage
- [ ] Profile view page (own profile)
- [ ] Edit profile

### Phase 3 — Browse & Matchmaking (Week 5)
- [ ] Browse members page with pagination
- [ ] Filter bar (age, height, district, nakshatra)
- [ ] Profile detail page (another member)
- [ ] Send interest / Accept / Decline flow
- [ ] Interests received/sent pages

### Phase 4 — Admin Panel (Week 6)
- [ ] Admin login + role guard
- [ ] Members list with search + filter
- [ ] Approve / disable members
- [ ] Stats dashboard
- [ ] Contact submissions view

### Phase 5 — Polish & Deploy (Week 7)
- [ ] Home page hero + all sections (match site content)
- [ ] Contact page + form backend
- [ ] Privacy Policy & T&C pages
- [ ] Mobile responsiveness audit
- [ ] Loading states, empty states, error boundaries
- [ ] SEO meta tags (react-helmet-async)
- [ ] Deploy frontend to Vercel, backend to Railway
- [ ] Custom domain + SSL
- [ ] Sentry error tracking

### Phase 6 — Nice-to-Haves (Post-launch)
- [ ] Basic in-app messaging (WebSocket or polling)
- [ ] Email notifications (new interest, accepted interest)
- [ ] SMS OTP on registration (Twilio / MSG91)
- [ ] Kannada language toggle (i18n with react-i18next)
- [ ] Profile share link (public-safe preview)
- [ ] Admin: CSV export of member data

---

## 10. Key Files to Create First

```
1. schema.prisma           (DB models — defines everything)
2. authStore.ts            (Zustand auth state)
3. api.ts                  (Axios instance — all API calls go here)
4. validations.ts          (Zod schemas for all forms)
5. Navbar.tsx + Footer.tsx (Visible on every page)
6. ProtectedRoute.tsx      (Guards dashboard + admin routes)
7. RegisterStep1.tsx       (Entry point for new users)
```

---

## 11. Environment Variables

```env
# Frontend (.env)
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=...

# Backend (.env)
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=...
JWT_SECRET=...
RESEND_API_KEY=...
FRONTEND_URL=http://localhost:5173
PORT=4000
```

---

## 12. What to Build First (Recommended Order)

1. **Supabase project** — get DB + auth + storage URLs
2. **Backend boilerplate** — Express + Prisma + auth middleware
3. **Register + Login** — users can create accounts
4. **Profile creation** — multi-step form
5. **Browse page** — see other approved members
6. **Admin approval** — admin can approve profiles
7. **Interest system** — send/accept/decline
8. **Home page** — public landing with content matching current site
9. **Deploy** — Vercel + Railway

---

*Designed by plan to match maduvedibbana.com — Okkaliga Community Matrimony*
