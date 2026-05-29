// App.jsx
// The root application component — contains ONLY route definitions.
// No UI, no state, no logic. This keeps it clean and easy to navigate.
//
// ROUTING STRUCTURE:
// /                   → redirect to /dashboard
// /login              → Login page (public)
// /dashboard          → Dashboard (protected)
// /profile            → Vendor Profile (protected)
// /inquiries          → Inquiries (protected)

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VendorProfile from "./pages/VendorProfile.jsx";
import Inquiries from "./pages/Inquiries.jsx";

const App = () => {
  return (
    // BrowserRouter enables client-side routing using the HTML5 History API
    <BrowserRouter>
      <Routes>
        {/* === PUBLIC ROUTES === */}
        {/* The Login page is accessible to everyone */}
        <Route path="/login" element={<Login />} />

        {/* === PROTECTED ROUTES === */}
        {/*
          ProtectedRoute wraps all private routes.
          If not authenticated → redirect to /login.
          AppLayout wraps all pages with Sidebar + Topbar.
          <Outlet /> inside AppLayout renders the matched child route.
        */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<VendorProfile />} />
            <Route path="/inquiries" element={<Inquiries />} />
          </Route>
        </Route>

        {/* Default: redirect root "/" to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all: redirect any unknown URL to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
