# StarVnt — Vendor Booking Dashboard

A full-stack Vendor Booking Management System built as part of the StarVnt engineering assignment. This application allows event vendors (photographers, DJs, decorators, etc.) to manage client booking inquiries through a dedicated dashboard — while giving clients a public-facing form to submit those inquiries without needing an account.

---

## 🚀 Live Demo

> Run locally with the instructions below. Demo credentials are available after running the seed script.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 (Vite), Tailwind CSS v4, React Router v7 |
| **Backend** | Node.js (ESM), Express.js v5 |
| **Database** | MongoDB + Mongoose v9 |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **SEO** | react-helmet-async |

---

## 🗂️ Project Structure

```
StarVnt/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── api/                # Axios instance with auth interceptor
│       ├── components/
│       │   ├── layout/         # AppLayout, Sidebar, Topbar
│       │   └── ui/             # Badge, Modal, StatCard
│       ├── context/            # AuthContext (JWT state)
│       ├── pages/
│       │   ├── PublicInquiry.jsx   # 🌐 Public — no auth needed
│       │   ├── Login.jsx           # Vendor login/register
│       │   ├── Dashboard.jsx       # Overview + stats
│       │   ├── Inquiries.jsx       # Full inquiry management
│       │   └── VendorProfile.jsx   # Profile editor
│       └── App.jsx             # Route definitions
│
└── server/                     # Express backend
    ├── config/db.js            # MongoDB connection
    ├── controllers/
    │   ├── controller.auth.js
    │   ├── controller.inquiry.js
    │   └── controller.vendor.js
    ├── middleware/
    │   └── middleware.auth.js  # JWT protect middleware
    ├── models/
    │   ├── model.user.js
    │   ├── model.inquiry.js
    │   └── model.vendorProfile.js
    ├── routes/
    │   ├── route.auth.js
    │   ├── route.inquiry.js
    │   └── route.vendor.js
    ├── seed.js                 # Demo data seeder
    └── server.js               # App entry point
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone <repo-url>
cd StarVnt
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file (see `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/starvnt
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

Start the server:

```bash
npm run dev        # Development (nodemon)
# or
npm start          # Production
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🌱 Seed Demo Data

To populate the database with realistic sample data, run from the `/server` directory:

```bash
npm run seed
```

This creates:
- **3 vendor accounts** across different categories
- **12 sample inquiries** spread across all 4 statuses

### Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 📷 Photographer | `aditya@starvnt.com` | `password123` |
| 🎨 Decorator | `priya@starvnt.com` | `password123` |
| 🎧 DJ | `rahul@starvnt.com` | `password123` |

---

## 🔌 API Reference

### Auth Routes (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register a new vendor account |
| `POST` | `/auth/login` | ❌ | Login and receive JWT token |
| `GET` | `/auth/me` | ✅ | Get current logged-in user |

### Vendor Routes (`/api/vendors`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/vendors/public` | ❌ | List all vendors (for public inquiry form) |
| `GET` | `/vendors/profile` | ✅ | Get authenticated vendor's profile |
| `PUT` | `/vendors/profile` | ✅ | Update vendor profile |

### Inquiry Routes (`/api/inquiries`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/inquiries` | ❌ | **Public** — Submit a new inquiry |
| `GET` | `/inquiries` | ✅ | Get all inquiries for authenticated vendor |
| `GET` | `/inquiries/:id` | ✅ | Get single inquiry |
| `PUT` | `/inquiries/:id` | ✅ | Update inquiry details |
| `PUT` | `/inquiries/:id/status` | ✅ | Update inquiry status only |
| `DELETE` | `/inquiries/:id` | ✅ | Delete inquiry |
| `POST` | `/inquiries/manual` | ✅ | Manually create inquiry from dashboard |

---

## 🔐 Authentication Flow

1. Vendor registers or logs in → receives a **JWT token** (expires in 7 days)
2. Token stored in `localStorage` as `starvnt_token`
3. Every protected API call sends `Authorization: Bearer <token>` header
4. Backend `middleware.auth.js` verifies the token and attaches `req.user`
5. Logout clears token from localStorage

> **Note**: Public inquiry submission (`POST /api/inquiries`) and vendor listing (`GET /api/vendors/public`) are intentionally unprotected so clients can submit inquiries without creating an account.

---

## 🎯 Inquiry Workflow

```
[Public Client]
    ↓ visits /submit-inquiry (no login)
    ↓ selects vendor from dropdown
    ↓ fills event details & submits
    ↓ POST /api/inquiries → Inquiry created (status: "New")

[Vendor Dashboard]
    ↓ sees new inquiry on Dashboard
    ↓ opens Inquiries page
    ↓ reviews details in modal
    ↓ updates status:
       New → Contacted → Confirmed / Rejected
```

### Inquiry Status Flow

```
New  →  Contacted  →  Confirmed
 └──────────────────→  Rejected
```

---

## 🗃️ Database Schema

### User
```js
{ name, email, password (bcrypt), role: "vendor"|"admin", timestamps }
```

### VendorProfile
```js
{ user (ref: User), vendorName, category, location, contact, bio, timestamps }
```

### Inquiry
```js
{
  vendor (ref: VendorProfile),
  clientName, clientEmail, clientPhone,
  eventType, eventDate, message,
  status: "New"|"Contacted"|"Confirmed"|"Rejected",
  timestamps
}
```

**Design decision**: Inquiry references `VendorProfile._id` (not `User._id`) because a vendor's public identity is their profile — not their auth account. This allows future separation of auth from profile (e.g., team accounts).

---

## 🧠 Design Decisions & Assumptions

1. **One profile per vendor**: Each registered user gets exactly one `VendorProfile`, auto-created at registration. This simplifies the data model for the assignment scope.

2. **Public inquiry submission**: Inquiries don't require client accounts. This matches real-world usage — clients shouldn't need to sign up just to contact a vendor. The vendor is identified by their `vendorId` (VendorProfile._id).

3. **No real-time updates**: Status changes are persisted immediately via API but require a page refresh to see cross-tab. WebSockets/polling was intentionally omitted for assignment scope.

4. **No email notifications**: In production, status changes would trigger email notifications to the client. This was not implemented in this scope.

5. **Role-based access (partial)**: The `User` model has a `role` field (`vendor` | `admin`) ready for future admin-only features. All registered accounts are currently vendors by default.

6. **Inquiry ownership**: Vendors can only view/edit/delete their own inquiries. This is enforced at the controller level by comparing `VendorProfile._id`.

7. **Input validation**: Required fields (vendorId, clientName, eventDate) are validated on both frontend and backend. The backend is the source of truth.

---

## 📄 License

This project was built as an engineering assignment for StarVnt. All rights reserved.
