
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VendorProfile from "./pages/VendorProfile.jsx";
import Inquiries from "./pages/Inquiries.jsx";
import PublicInquiry from "./pages/PublicInquiry.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── Public Routes (no auth required) ─────────────────────────── */}
        {/* Public inquiry submission form for clients */}
        <Route path="/submit-inquiry" element={<PublicInquiry />} />

        {/* Vendor/admin login */}
        <Route path="/login" element={<Login />} />

        {/* ─── Protected Routes (vendor must be logged in) ───────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<VendorProfile />} />
            <Route path="/inquiries" element={<Inquiries />} />
          </Route>
        </Route>

        {/* ─── Default redirects ─────────────────────────────────────────── */}
        {/* Root → dashboard (ProtectedRoute will push to /login if not authed) */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all → dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
