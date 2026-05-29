// components/layout/Topbar.jsx
// The top header bar displayed on every authenticated page.
// On mobile it shows a hamburger / X button to toggle the sidebar drawer.
//
// Props (from AppLayout):
//   onToggleSidebar — function called when the burger button is clicked
//   sidebarOpen     — boolean, tells us whether to show ☰ or ✕
//   isMobile        — boolean, controls whether the burger button renders at all

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/profile": "Vendor Profile",
  "/inquiries": "Inquiries",
};

// ── Icon components ──────────────────────────────────────────────────────────

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// Animated hamburger / X icon.
// Three bars animate into an X when 'isOpen' is true.
// We draw this with plain divs so it can transition smoothly with CSS.
const HamburgerIcon = ({ isOpen }) => (
  <div
    style={{
      width: "20px",
      height: "14px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    {/* Top bar */}
    <span
      style={{
        display: "block",
        height: "2px",
        borderRadius: "2px",
        backgroundColor: "currentColor",
        transformOrigin: "center",
        transition: "transform 0.25s ease, opacity 0.25s ease, top 0.25s ease",
        transform: isOpen ? "translateY(6px) rotate(45deg)" : "none",
      }}
    />
    {/* Middle bar — fades out when open */}
    <span
      style={{
        display: "block",
        height: "2px",
        borderRadius: "2px",
        backgroundColor: "currentColor",
        transition: "opacity 0.2s ease",
        opacity: isOpen ? 0 : 1,
      }}
    />
    {/* Bottom bar */}
    <span
      style={{
        display: "block",
        height: "2px",
        borderRadius: "2px",
        backgroundColor: "currentColor",
        transformOrigin: "center",
        transition: "transform 0.25s ease, opacity 0.25s ease",
        transform: isOpen ? "translateY(-6px) rotate(-45deg)" : "none",
      }}
    />
  </div>
);

// ── Component ────────────────────────────────────────────────────────────────

const Topbar = ({ onToggleSidebar, sidebarOpen, isMobile }) => {
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || "StarVnt";

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("starvnt_theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("starvnt_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("starvnt_theme", "light");
    }
  }, [isDark]);

  // Shared icon-button style used for theme toggle + hamburger
  const iconBtn = {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "1px solid var(--color-border)",
    background: "var(--color-surface-2)",
    color: "var(--color-text-muted)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
    flexShrink: 0,
  };

  return (
    <header
      style={{
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        padding: "0 20px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        position: "sticky",
        top: 0,
        zIndex: 39,   // below backdrop (40) and sidebar (50)
      }}
    >
      {/* ── Left side: hamburger (mobile) + page title ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        {/* Hamburger button — only visible on mobile */}
        {isMobile && (
          <button
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
            style={iconBtn}
          >
            <HamburgerIcon isOpen={sidebarOpen} />
          </button>
        )}

        {/* Page title + date */}
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: "17px",
              fontWeight: "700",
              color: "var(--color-text)",
              letterSpacing: "-0.3px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentTitle}
          </h1>
          <p
            style={{
              fontSize: "11px",
              color: "var(--color-text-muted)",
              marginTop: "1px",
              whiteSpace: "nowrap",
            }}
          >
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* ── Right side: theme toggle ── */}
      <button
        onClick={() => setIsDark(!isDark)}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        style={iconBtn}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
};

export default Topbar;
