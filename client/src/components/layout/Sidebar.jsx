import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// ── Icons ─────────────────────────────────────────────────────────────────────
const GridIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const InboxIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: "/dashboard",  label: "Dashboard",     icon: <GridIcon /> },
  { to: "/inquiries",  label: "Inquiries",     icon: <InboxIcon /> },
  { to: "/profile",    label: "Vendor Profile", icon: <UserIcon /> },
];

// ── Nav Link Item ─────────────────────────────────────────────────────────────
const SidebarNavItem = ({ to, label, icon, onClick }) => (
  <li>
    <NavLink
      to={to}
      onClick={onClick}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 12px",
        borderRadius: "10px",
        textDecoration: "none",
        fontSize: "13.5px",
        fontWeight: isActive ? "600" : "400",
        color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
        backgroundColor: isActive ? "var(--color-primary-light)" : "transparent",
        transition: "all 0.15s ease",
        position: "relative",
      })}
    >
      {({ isActive }) => (
        <>
          {/* Active indicator line */}
          {isActive && (
            <span
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: "3px",
                height: "16px",
                borderRadius: "0 3px 3px 0",
                background: "var(--color-primary)",
              }}
            />
          )}
          <span style={{ flexShrink: 0, marginLeft: isActive ? "4px" : "0", transition: "margin 0.15s" }}>
            {icon}
          </span>
          {label}
        </>
      )}
    </NavLink>
  </li>
);

// ── Main Sidebar ──────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, isMobile, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 300);
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "V";

  return (
    <>
      <aside
        style={{
          width: "var(--sidebar-width)",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          backgroundColor: "var(--color-surface)",
          borderRight: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          transform: isMobile ? (isOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isMobile && isOpen ? "var(--shadow-xl)" : "none",
        }}
      >
        {/* ── Logo ── */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid var(--color-border)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Logo mark */}
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "900",
                fontSize: "17px",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
              }}
            >
              S
            </div>
            <div>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "800",
                  color: "var(--color-text)",
                  letterSpacing: "-0.4px",
                  display: "block",
                  lineHeight: 1.2,
                }}
              >
                StarVnt
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "var(--color-primary)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Vendor Dashboard
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "700",
              color: "var(--color-text-subtle)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              padding: "0 12px",
              marginBottom: "8px",
            }}
          >
            Navigation
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "2px" }}>
            {NAV_ITEMS.map((item) => (
              <SidebarNavItem key={item.to} {...item} onClick={onClose} />
            ))}
          </ul>

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--color-border)", margin: "16px 12px" }} />

          {/* External link */}
          <a
            href="/submit-inquiry"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "13.5px",
              fontWeight: "400",
              color: "var(--color-text-muted)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-surface-2)";
              e.currentTarget.style.color = "var(--color-text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            <ExternalIcon />
            Public Form
          </a>
        </nav>

        {/* ── User section ── */}
        <div
          style={{
            padding: "12px",
            borderTop: "1px solid var(--color-border)",
            flexShrink: 0,
          }}
        >
          {/* User card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "10px",
              marginBottom: "6px",
              backgroundColor: "var(--color-surface-2)",
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
                fontWeight: "800",
                fontSize: "13px",
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
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
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "9px 12px",
              borderRadius: "10px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              color: "var(--color-text-muted)",
              transition: "all 0.15s ease",
              opacity: loggingOut ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-rejected-bg)";
              e.currentTarget.style.color = "var(--color-rejected)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            <LogoutIcon />
            {loggingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
