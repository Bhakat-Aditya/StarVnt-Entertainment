# StarVnt — Vendor Booking Dashboard

> A full-stack, production-ready SaaS platform that lets event vendors manage client booking inquiries — and gives clients a seamless public-facing form to submit them.

[![Live Demo](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://starvnt-entertainment.vercel.app)
[![API](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com)
[![Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?logo=react)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📖 Table of Contents

1. [What Is StarVnt?](#-what-is-starvnt)
2. [How It Helps Businesses](#-how-it-helps-businesses)
3. [How It Works — End to End](#-how-it-works--end-to-end)
4. [Features at a Glance](#-features-at-a-glance)
5. [Tech Stack](#-tech-stack)
6. [File Structure](#-file-structure)
7. [Database Design](#-database-design)
8. [API Reference](#-api-reference)
9. [Authentication Flow](#-authentication-flow)
10. [Local Development Setup](#-local-development-setup)
11. [Production Deployment](#-production-deployment)
12. [Demo Credentials](#-demo-credentials)
13. [Design Decisions](#-design-decisions)

---

## 🌟 What Is StarVnt?

StarVnt is a **Vendor Booking Management System** designed for the Indian events industry. It solves a very real problem: event vendors — photographers, DJs, decorators, makeup artists, caterers, anchors, and event planners — receive booking inquiries through scattered channels (WhatsApp, Instagram DMs, phone calls) and have no structured way to track, respond to, or manage them.

StarVnt gives every vendor a **personal dashboard** to:
- See every inquiry in one place
- Track which stage each client is at
- Confirm or reject bookings
- Share a professional public booking form link with potential clients

And it gives **clients** a clean, no-login-required booking form where they can browse available vendors and submit inquiries in under 2 minutes.

---

## 💼 How It Helps Businesses

### For Independent Vendors (Photographers, DJs, etc.)

| Problem Without StarVnt | Solution With StarVnt |
|---|---|
| Inquiries scattered across WhatsApp, Instagram, email | Single dashboard inbox — every inquiry in one place |
| No way to track who you've replied to | Status workflow: New → Contacted → Confirmed / Rejected |
| Forgetting upcoming event dates | "Upcoming Events" stat card with date-sorted list |
| Sharing a messy phone number for bookings | Shareable professional inquiry link (`/submit-inquiry`) |
| Manually saving client details | Structured database with name, email, phone, event date, type |
| No overview of business performance | Dashboard stats: total inquiries, confirmed bookings, pending review |

### For Event Management Companies (like StarVnt itself)

- **Multi-vendor architecture** — each vendor has their own scoped account, only seeing their own inquiries
- **Public inquiry form** — one link shared across marketing materials, social media, or client emails
- **Admin overview** — each vendor's dashboard shows their own analytics independently
- **Scalable foundation** — the role system (`vendor` | `admin`) is already in the User model, ready for a future admin panel
- **Client-first UX** — clients don't need to create accounts, reducing drop-off dramatically

### Real Business Impact

> A photographer who gets 50 DMs a month can now: share one link → clients self-serve → inquiries auto-appear in dashboard → vendor updates status in one click → never loses a lead again.

---

## ⚙️ How It Works — End to End

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
│                                                             │
│  Client visits /login or /submit-inquiry                    │
│       ↓                                                     │
│  Sees the PUBLIC INQUIRY FORM (no login needed)             │
│       ↓                                                     │
│  Selects a vendor → fills event details → submits           │
│       ↓                                                     │
│  POST /api/inquiries  (unprotected route)                   │
│       ↓                                                     │
│  Inquiry saved in MongoDB with status = "New"               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       VENDOR SIDE                           │
│                                                             │
│  Vendor logs in at /login (right panel)                     │
│       ↓                                                     │
│  JWT token issued → stored in localStorage                  │
│       ↓                                                     │
│  Vendor sees Dashboard with live stats + recent inquiries   │
│       ↓                                                     │
│  Goes to Inquiries page → sees all their inquiries          │
│       ↓                                                     │
│  Updates status inline:                                     │
│    New → Contacted → Confirmed ✅                           │
│    New → Rejected ❌                                        │
│       ↓                                                     │
│  Can edit details, add notes, or delete old inquiries       │
│       ↓                                                     │
│  Shares their inquiry form link from the Dashboard          │
└─────────────────────────────────────────────────────────────┘
```

### Inquiry Status Lifecycle

```
            ┌──────────────────┐
            │      NEW         │  ← Client submits inquiry
            └────────┬─────────┘
                     │
          ┌──────────▼──────────┐
          │    CONTACTED         │  ← Vendor has reached out
          └──────────┬──────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
  ┌─────────────┐       ┌──────────────┐
  │  CONFIRMED  │       │   REJECTED   │
  │  ✅ Booked  │       │  ❌ Declined │
  └─────────────┘       └──────────────┘
```

---

## ✨ Features at a Glance

### 🌐 Public Inquiry Form (`/submit-inquiry` & embedded in `/login`)
- **No account required** for clients
- Vendor selector with category icons (📷 🎨 🎧 💄 🍽️ 🎤 📋)
- 3-section form: Choose Vendor → Client Info → Event Details
- Input validation on both frontend and backend
- Animated success confirmation with inquiry summary
- Mobile responsive — works on any device

### 📊 Vendor Dashboard (`/dashboard`)
- Personalized greeting with time of day
- **4 animated stat cards** with live count-up animation:
  - Total Inquiries
  - Pending Review (New + Contacted)
  - Confirmed Bookings
  - Upcoming Events
- **Refresh button** — manually fetch new inquiries (with spinning animation)
- **Auto-refresh** every 60 seconds in the background
- Live green dot with relative timestamp ("Updated 2m ago")
- Shareable inquiry form link with one-click copy
- Recent inquiries table (last 5) with hover-interactive rows

### 📋 Inquiries Management (`/inquiries`)
- Full inquiry table with all vendor's inquiries
- **Search** by client name, email, or event type
- **Status filter tabs** with live counts per status
- **Sortable columns** — click column headers to sort by name, date, or received time
- **Inline status dropdown** — change status directly from the table row
- **Hover-reveal action buttons** — View, Edit, Delete fade in on row hover
- **Detail modal** with full inquiry info + status update buttons
- **Edit modal** with full form to update any field
- **Delete confirmation** modal
- **Add Inquiry manually** — vendors can log phone inquiries directly
- Skeleton loading state while fetching
- Empty state with call-to-action

### 👤 Vendor Profile (`/profile`)
- Edit vendor name, category, location, contact, bio
- Category selection (Photographer, DJ, Decorator, etc.)
- Changes reflected across the public vendor list immediately

### 🔐 Authentication
- Register & Login on the same split-screen page
- JWT-based authentication with 7-day expiry
- Auto-redirect to `/login` on 401 response
- Persistent login via localStorage

### 🎨 UI/UX
- **Dark / Light mode** toggle (persists in localStorage)
- Premium dark design: deep slate backgrounds, indigo/purple accents
- CSS animations: fade-in-up, scale-in, shimmer skeleton, spin, pulse dot
- Animated stat card counters (ease-out count-up)
- Live clock in topbar with green activity dot
- Fully responsive — Sidebar collapses to drawer on mobile

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool + dev server |
| React Router | 7 | Client-side routing |
| Tailwind CSS | 4 | Utility classes (minimal use) |
| Axios | 1.x | HTTP client with interceptors |
| react-helmet-async | 3.x | SEO meta tags per page |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime (ES Modules) |
| Express | 5 | HTTP server + routing |
| Mongoose | 9 | MongoDB ODM |
| jsonwebtoken | 9 | JWT auth |
| bcryptjs | 3 | Password hashing |
| cors | 2.x | Cross-origin requests |
| dotenv | 17 | Environment variables |

### Infrastructure
| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting (CDN, auto-deploy from GitHub) |
| **Render** | Backend hosting (Node.js web service) |
| **MongoDB Atlas** | Managed MongoDB database |
| **GitHub** | Source control + CI/CD trigger |

---

## 📁 File Structure

```
StarVnt/
│
├── README.md                        ← You are here
├── .gitignore                       ← Root-level safety gitignore
│
├── client/                          ← React Frontend (Vite)
│   ├── vercel.json                  ← SPA routing fix (rewrites → index.html)
│   ├── vite.config.js               ← Dev proxy: /api → localhost:5000
│   ├── .env.example                 ← Template: set VITE_API_URL on Vercel
│   ├── .env                         ← Local env (gitignored)
│   ├── index.html                   ← HTML entry point
│   └── src/
│       ├── main.jsx                 ← React root: HelmetProvider + AuthProvider
│       ├── App.jsx                  ← All routes defined here
│       ├── index.css                ← Design system: tokens, animations, utilities
│       │
│       ├── api/
│       │   └── axios.js             ← Axios instance: baseURL + JWT interceptor + 401 handler
│       │
│       ├── context/
│       │   └── AuthContext.jsx      ← Global auth state: user, token, login(), logout()
│       │
│       ├── components/
│       │   ├── ProtectedRoute.jsx   ← Redirects to /login if not authenticated
│       │   ├── layout/
│       │   │   ├── AppLayout.jsx    ← Shell: Sidebar + Topbar + <Outlet />
│       │   │   ├── Sidebar.jsx      ← Nav links, logo, user card, logout
│       │   │   └── Topbar.jsx       ← Page title, live clock, dark mode toggle
│       │   └── ui/
│       │       ├── Badge.jsx        ← Status pill with animated pulse dot
│       │       ├── Modal.jsx        ← Reusable modal: scale-in anim, Escape key, scroll lock
│       │       └── StatCard.jsx     ← Animated counter card with hover glow
│       │
│       └── pages/
│           ├── Login.jsx            ← Split-screen: Public inquiry form + Vendor login
│           ├── PublicInquiry.jsx    ← Standalone /submit-inquiry page
│           ├── Dashboard.jsx        ← Overview: stats, refresh, recent inquiries, share link
│           ├── Inquiries.jsx        ← Full inquiry management table
│           └── VendorProfile.jsx    ← Edit vendor profile
│
└── server/                          ← Express Backend (Node.js ESM)
    ├── server.js                    ← Entry point: CORS, middleware, routes, error handler
    ├── seed.js                      ← Demo data: 3 vendors + 12 inquiries
    ├── .env.example                 ← Template: MONGO_URI, JWT_SECRET, CLIENT_URL, PORT
    ├── .env                         ← Local secrets (gitignored)
    ├── .gitignore
    ├── package.json                 ← start: "node server.js", dev: "nodemon server.js"
    │
    ├── config/
    │   └── db.js                    ← MongoDB connection via Mongoose
    │
    ├── models/                      ← Mongoose schemas (naming: model.[name].js)
    │   ├── model.user.js            ← User: name, email, password (hashed), role
    │   ├── model.vendorProfile.js   ← VendorProfile: user ref, vendorName, category, location, bio
    │   └── model.inquiry.js         ← Inquiry: vendor ref, client info, event details, status
    │
    ├── middleware/                  ← (naming: middleware.[name].js)
    │   └── middleware.auth.js       ← JWT verify: decodes token, attaches req.user
    │
    ├── controllers/                 ← (naming: controller.[name].js)
    │   ├── controller.auth.js       ← register(), login(), getMe()
    │   ├── controller.vendor.js     ← getProfile(), updateProfile(), getPublicVendors()
    │   └── controller.inquiry.js    ← getAllInquiries(), createInquiry(), updateInquiry(), etc.
    │
    └── routes/                      ← (naming: route.[name].js)
        ├── route.auth.js            ← /api/auth/*
        ├── route.vendor.js          ← /api/vendor/*
        └── route.inquiry.js         ← /api/inquiries/*
```

---

## 🗃️ Database Design

### Collections

#### `users`
```js
{
  _id:       ObjectId,
  name:      String,         // Vendor's display name
  email:     String,         // Unique, used for login
  password:  String,         // bcrypt hashed (never returned in API responses)
  role:      "vendor"|"admin", // Future: admin panel access
  createdAt: Date,
  updatedAt: Date
}
```

#### `vendorprofiles`
```js
{
  _id:        ObjectId,
  user:       ObjectId → users._id,  // 1-to-1 relationship
  vendorName: String,                // Business name
  category:   "Photographer"|"Decorator"|"DJ"|...,
  location:   String,                // City/area
  contact:    String,                // Public contact info
  bio:        String,                // Short description
  createdAt:  Date,
  updatedAt:  Date
}
```

#### `inquiries`
```js
{
  _id:         ObjectId,
  vendor:      ObjectId → vendorprofiles._id,  // Which vendor this is for
  clientName:  String,     // Required
  clientEmail: String,     // Optional
  clientPhone: String,     // Optional
  eventType:   "Wedding"|"Corporate"|"Birthday"|...,
  eventDate:   Date,       // Required
  message:     String,     // Client's notes / requirements
  status:      "New"|"Contacted"|"Confirmed"|"Rejected",  // Default: "New"
  createdAt:   Date,
  updatedAt:   Date
}
```

### Key Design Decisions

> **Why does `inquiry.vendor` reference `VendorProfile` instead of `User`?**
> A vendor's *public identity* is their profile (business name, category), not their auth account. This also allows future team accounts where multiple users manage one vendor profile.

> **Why is there a separate `VendorProfile` model instead of storing everything on `User`?**
> Separation of concerns — auth data (email/password) and business data (category/bio/location) have different lifecycles and access patterns. Keeps the User model clean.

---

## 📡 API Reference

Base URL: `https://your-app.onrender.com/api`

### Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/auth/register` | ❌ | `{ name, email, password }` | Register new vendor, creates VendorProfile |
| `POST` | `/auth/login` | ❌ | `{ email, password }` | Returns `{ user, token }` |
| `GET` | `/auth/me` | ✅ Bearer | — | Returns current user from token |

### Vendors — `/api/vendor`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/vendor/public` | ❌ | List all vendor profiles (safe public fields only) |
| `GET` | `/vendor/profile` | ✅ | Get authenticated vendor's full profile |
| `PUT` | `/vendor/profile` | ✅ | Update authenticated vendor's profile |

### Inquiries — `/api/inquiries`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/inquiries` | ✅ | Get all inquiries for authenticated vendor + stats |
| `POST` | `/inquiries` | ❌ | **Public** — Submit a new inquiry (client form) |
| `POST` | `/inquiries/manual` | ✅ | Vendor manually creates an inquiry (phone bookings) |
| `GET` | `/inquiries/:id` | ✅ | Get single inquiry (ownership verified) |
| `PUT` | `/inquiries/:id` | ✅ | Update full inquiry (ownership verified) |
| `PUT` | `/inquiries/:id/status` | ✅ | Update status only |
| `DELETE` | `/inquiries/:id` | ✅ | Delete inquiry (ownership verified) |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns `{ success: true, message: "StarVnt API is running 🚀" }` |

---

## 🔐 Authentication Flow

```
1. Vendor submits login form
        ↓
2. POST /api/auth/login
        ↓
3. Server verifies email + bcrypt.compare(password, hash)
        ↓
4. jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" })
        ↓
5. Token returned to client → stored in localStorage as "starvnt_token"
        ↓
6. All subsequent API calls include: Authorization: Bearer <token>
        ↓
7. middleware.auth.js decodes token → finds user → attaches to req.user
        ↓
8. Controller uses req.user._id to scope data (vendor sees only their inquiries)
        ↓
9. On logout: token removed from localStorage
        ↓
10. On 401 response: Axios interceptor auto-clears token + redirects to /login
```

**Security notes:**
- Passwords are hashed with `bcryptjs` (10 salt rounds) — never stored or returned in plaintext
- JWT secret is an env var — never committed to git
- All protected routes verify token on every request (stateless)
- Inquiry ownership is double-checked in every update/delete controller

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/Bhakat-Aditya/StarVnt-Entertainment
cd StarVnt
```

### 2. Backend setup

```bash
cd server
npm install
```

Create `.env` (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env`:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/starvnt
JWT_SECRET=generate_a_long_random_string_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
PORT=5000
```

Start the server:
```bash
npm run dev        # nodemon — auto-restarts on changes
```

### 3. Seed demo data

```bash
# From the /server directory
npm run seed
```

This creates 3 vendor accounts and 12 inquiries across all statuses.

### 4. Frontend setup

```bash
cd ../client
npm install
npm run dev        # Vite dev server at http://localhost:5173
```

> No `.env` file needed for local dev — the Vite proxy handles `/api` → `localhost:5000` automatically.

### 5. Open the app

| URL | Purpose |
|---|---|
| `http://localhost:5173/login` | Split-screen: Client form + Vendor login |
| `http://localhost:5173/submit-inquiry` | Standalone client inquiry form |
| `http://localhost:5173/dashboard` | Vendor dashboard (requires login) |
| `http://localhost:5173/inquiries` | Full inquiry table (requires login) |
| `http://localhost:5000/api/health` | Backend health check |

---

## 🌐 Production Deployment

### Vercel (Frontend)

1. Import the GitHub repo on Vercel
2. Set **Root Directory**: `client`
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Add environment variable:
   ```
   VITE_API_URL = https://your-app.onrender.com/api
   ```
6. The `client/vercel.json` file handles React Router — all routes resolve to `index.html`

### Render (Backend)

1. Create a new **Web Service** on Render
2. Set **Root Directory**: `server`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add environment variables:
   ```
   MONGO_URI        = mongodb+srv://...
   JWT_SECRET       = <64-char random string>
   JWT_EXPIRES_IN   = 7d
   CLIENT_URL       = https://your-app.vercel.app
   ```

### MongoDB Atlas

- Go to **Network Access → Add IP Address**
- Add `0.0.0.0/0` (allow all) — required for Render's dynamic IPs

---

## 🎭 Demo Credentials

After running `npm run seed` from `/server`:

| Vendor | Email | Password | Category |
|---|---|---|---|
| Aditya Kapoor Photography | `aditya@starvnt.com` | `password123` | 📷 Photographer |
| Priya Decor Studio | `priya@starvnt.com` | `password123` | 🎨 Decorator |
| DJ Rahul – The Beat Master | `rahul@starvnt.com` | `password123` | 🎧 DJ |

Each vendor has 4 sample inquiries across all statuses (New, Contacted, Confirmed, Rejected).

---

## 🧠 Design Decisions

### Why no Redux / Zustand?
The app's state is simple enough for React's built-in `useState` + `useContext`. Adding a state management library would be premature complexity for this scale.

### Why no email notifications?
Email notifications (e.g. "you have a new inquiry") would be the obvious next feature, but require an email service (Resend, SendGrid). Left out of scope intentionally. The `createdAt` timestamp and "New" status badge give vendors enough signal.

### Why split-screen login?
Vendors and clients both land on the same URL. A split-screen avoids confusion — clients see the booking form front-and-center; vendors see the login panel. Zero navigation needed for either user type.

### Why does `POST /api/inquiries` have no auth?
Clients submit inquiries without accounts. The `vendorId` in the request body is validated against the DB — so even though the route is public, you can't create ghost inquiries for non-existent vendors.

### Why `VendorProfile` instead of embedding in `User`?
Clean separation: auth credentials live in `User`, business identity lives in `VendorProfile`. Future: one user could manage multiple vendor profiles, or an admin account could exist without a profile.

### Why Render instead of Railway or Fly.io?
Render has a generous free tier with no sleep on newer plans, good Node.js support, and straightforward env var management. The trade-off is cold-start latency (~30s) on the free plan.

---

## 🛣️ Roadmap (Future Features)

- [ ] **Email notifications** — notify client when status changes (Resend / SendGrid)
- [ ] **Admin panel** — view all vendors + all inquiries across the platform
- [ ] **Analytics** — monthly inquiry trends, conversion rate (New → Confirmed)
- [ ] **Availability calendar** — vendors mark blocked dates, clients can't book those days
- [ ] **Multi-photo vendor profiles** — portfolio gallery per vendor
- [ ] **Client review system** — post-event ratings
- [ ] **WhatsApp integration** — one-click "Contact on WhatsApp" from inquiry detail
- [ ] **Subscription tiers** — free (5 inquiries/mo), Pro (unlimited + analytics)

---

## 📄 License

This project was built as a StarVnt engineering assignment. All rights reserved © 2026 StarVnt.

---

<div align="center">
  <p>Built with ❤️ for the Indian events industry</p>
  <p>
    <a href="https://starvnt-entertainment.vercel.app">Live Demo</a> •
    <a href="https://github.com/Bhakat-Aditya/StarVnt-Entertainment">GitHub</a>
  </p>
</div>
