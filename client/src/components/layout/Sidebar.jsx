// components/layout/Sidebar.jsx
// Left navigation sidebar — permanently visible on desktop, a slide-in drawer on mobile.
//
// Props (from AppLayout):
//   isOpen   — boolean, controls the mobile drawer open/closed state
//   isMobile — boolean, true when viewport < 768px
//   onClose  — function called when a NavLink is clicked (closes the drawer)
//
// ANIMATION STRATEGY:
// We use CSS `transform: translateX()` to slide the sidebar in/out.
// The sidebar is ALWAYS rendered in the DOM; we just move it off-screen.
// This is more performant than mount/unmount and lets the transition play.
//
//   Hidden (mobile): translateX(-100%)  → off the left edge
//   Visible:         translateX(0)      → in normal position
//   Transition:      cubic-bezier gives a natural, springy feel

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// ── SVG Icons ────────────────────────────────────────────────────────────────

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const InquiryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ── Nav links config ─────────────────────────────────────────────────────────

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { to: "/profile", label: "Vendor Profile", icon: <ProfileIcon /> },
  { to: "/inquiries", label: "Inquiries", icon: <InquiryIcon /> },
];

// ── Component ────────────────────────────────────────────────────────────────

const Sidebar = ({ isOpen, isMobile, onClose }) => {
  const { user, logout } = useAuth();

  // On desktop the sidebar is always visible (no translateX shift needed).
  // On mobile we slide it in from the left.
  const translateX = isMobile ? (isOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)";

  return (
    <aside
      style={{
        // Layout
        width: "var(--sidebar-width)",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,           // above backdrop (40) and topbar (39)

        // Appearance
        backgroundColor: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",

        // Slide animation
        transform: translateX,
        // cubic-bezier(0.4, 0, 0.2, 1) is Material Design's "standard" easing:
        // fast acceleration at the start, gentle deceleration at the end.
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

        // On mobile, cast a shadow so the drawer lifts above content
        boxShadow: isMobile && isOpen ? "4px 0 24px rgba(0,0,0,0.15)" : "none",
      }}
    >
      {/* ── Brand ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Logo mark */}
          <div
            style={{
              width: "34px",
              height: "34px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "800",
              fontSize: "16px",
              flexShrink: 0,
            }}
          >
            S
          </div>
          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "var(--color-text)",
              letterSpacing: "-0.3px",
            }}
          >
            StarVnt
          </span>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: "600",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "0 8px",
            marginBottom: "8px",
          }}
        >
          Menu
        </p>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {navLinks.map((link) => (
            <li key={link.to}>
              {/*
                onClose is called when a link is clicked.
                AppLayout's useEffect also closes on route change,
                but calling onClose here gives instant visual feedback.
              */}
              <NavLink
                to={link.to}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: isActive ? "600" : "400",
                  color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                  backgroundColor: isActive ? "var(--color-primary-light)" : "transparent",
                  transition: "all 0.15s ease",
                })}
              >
                {link.icon}
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── User info + logout ─────────────────────────────────────────────── */}
      <div
        style={{
          padding: "16px 12px",
          borderTop: "1px solid var(--color-border)",
          flexShrink: 0,
        }}
      >
        {/* User avatar + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "700",
              fontSize: "13px",
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || "V"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--color-text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name || "Vendor"}
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "var(--color-text-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email || ""}
            </p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500",
            color: "#ef4444",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <LogoutIcon />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
