// components/layout/AppLayout.jsx
// The main application shell that wraps all authenticated pages.
//
// RESPONSIVE BEHAVIOUR:
// - Desktop (≥768px): sidebar is always visible, content shifts right by sidebar width
// - Mobile (<768px):  sidebar is hidden off-screen (translateX(-100%)),
//                     hamburger button in Topbar toggles it open/close,
//                     a dark backdrop renders behind the open sidebar so
//                     tapping outside also closes it.
//
// STATE OWNERSHIP:
// sidebarOpen lives here (AppLayout) because both Sidebar AND Topbar need it.
// We pass it down as props so each component stays focused on its own job.

import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

// Breakpoint at which sidebar is always visible
const DESKTOP_BREAKPOINT = 768;

const AppLayout = () => {
  // Track whether the sidebar drawer is open (only matters on mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Track if we're on a mobile viewport
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < DESKTOP_BREAKPOINT
  );

  const location = useLocation();

  // --- Detect viewport width changes ---
  // When the user resizes the window we update isMobile.
  // On desktop, we also force-close the sidebar drawer (not needed there).
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < DESKTOP_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false); // auto-close drawer on desktop
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Close sidebar on route change (mobile) ---
  // When a NavLink is clicked the URL changes; close the drawer.
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  // --- Lock body scroll while mobile sidebar is open ---
  useEffect(() => {
    document.body.style.overflow =
      isMobile && sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, sidebarOpen]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Dark backdrop (mobile only, shown when sidebar is open) ────────── */}
      {isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,                        // behind sidebar (z-50) but above content
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)",
            // Fade in/out by controlling opacity + pointer events
            opacity: sidebarOpen ? 1 : 0,
            pointerEvents: sidebarOpen ? "auto" : "none",
            transition: "opacity 0.3s ease",
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <div
        style={{
          // On desktop: push content right to make room for the fixed sidebar.
          // On mobile: take full width — sidebar floats above as a drawer.
          marginLeft: isMobile ? 0 : "var(--sidebar-width)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0,          // prevents flex overflow
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Sticky top bar — receives toggle handler + open state */}
        <Topbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
        />

        {/* Page content rendered by the active child route */}
        <main style={{ flex: 1, padding: "24px", overflowX: "hidden" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
