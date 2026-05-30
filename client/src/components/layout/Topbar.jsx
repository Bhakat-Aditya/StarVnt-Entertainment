import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const pageMeta = {
  "/dashboard":  { title: "Dashboard",      subtitle: "Overview & quick stats" },
  "/inquiries":  { title: "Inquiries",       subtitle: "Manage your booking requests" },
  "/profile":    { title: "Vendor Profile",  subtitle: "Update your public information" },
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const MenuIcon = ({ isOpen }) => (
  <div style={{ width: "18px", height: "12px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <span style={{ display: "block", height: "1.5px", borderRadius: "2px", backgroundColor: "currentColor", transition: "all 0.25s ease", transform: isOpen ? "translateY(5.25px) rotate(45deg)" : "none" }} />
    <span style={{ display: "block", height: "1.5px", borderRadius: "2px", backgroundColor: "currentColor", transition: "opacity 0.2s ease", opacity: isOpen ? 0 : 1 }} />
    <span style={{ display: "block", height: "1.5px", borderRadius: "2px", backgroundColor: "currentColor", transition: "all 0.25s ease", transform: isOpen ? "translateY(-5.25px) rotate(-45deg)" : "none" }} />
  </div>
);

// ── Topbar ────────────────────────────────────────────────────────────────────
const Topbar = ({ onToggleSidebar, sidebarOpen, isMobile }) => {
  const { user } = useAuth();
  const location = useLocation();
  const meta = pageMeta[location.pathname] || { title: "StarVnt", subtitle: "" };

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("starvnt_theme") === "dark"
  );
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) { root.classList.add("dark"); localStorage.setItem("starvnt_theme", "dark"); }
    else { root.classList.remove("dark"); localStorage.setItem("starvnt_theme", "light"); }
  }, [isDark]);

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const iconBtn = {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
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

  const formattedDate = time.toLocaleDateString("en-IN", {
    weekday: "short", month: "short", day: "numeric",
  });
  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });

  return (
    <header
      style={{
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        padding: "0 24px",
        height: "var(--topbar-height)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        position: "sticky",
        top: 0,
        zIndex: 39,
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Left side */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
        {isMobile && (
          <button
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            style={iconBtn}
          >
            <MenuIcon isOpen={sidebarOpen} />
          </button>
        )}

        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "var(--color-text)",
              letterSpacing: "-0.3px",
              lineHeight: 1.2,
            }}
          >
            {meta.title}
          </h1>
          <p
            style={{
              fontSize: "11px",
              color: "var(--color-text-muted)",
              marginTop: "1px",
              whiteSpace: "nowrap",
            }}
          >
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        {/* Live clock */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "8px",
              backgroundColor: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              fontSize: "12px",
              color: "var(--color-text-muted)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span className="live-dot" style={{ width: "6px", height: "6px" }} />
            <span style={{ fontWeight: "500", color: "var(--color-text)" }}>{formattedTime}</span>
            <span>·</span>
            <span>{formattedDate}</span>
          </div>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={iconBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-primary)";
            e.currentTarget.style.borderColor = "var(--color-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-muted)";
            e.currentTarget.style.borderColor = "var(--color-border)";
          }}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* User avatar */}
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "800",
            fontSize: "13px",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
            cursor: "default",
          }}
          title={user?.name}
        >
          {user?.name?.charAt(0)?.toUpperCase() || "V"}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
