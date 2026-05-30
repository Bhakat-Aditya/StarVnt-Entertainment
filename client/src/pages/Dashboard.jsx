import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Helmet } from "react-helmet-async";
import api from "../api/axios.js";
import StatCard from "../components/ui/StatCard.jsx";
import Badge from "../components/ui/Badge.jsx";

// ── Icons ─────────────────────────────────────────────────────────────────────
const InboxIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const RefreshIcon = ({ spinning }) => (
  <svg
    width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: spinning ? "spin 0.7s linear infinite" : "none" }}
  >
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const ZapIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <div style={{ display: "flex", gap: "12px", padding: "14px 20px", alignItems: "center", borderBottom: "1px solid var(--color-border)" }}>
    <div className="skeleton" style={{ width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0 }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
      <div className="skeleton" style={{ width: "160px", height: "13px" }} />
      <div className="skeleton" style={{ width: "100px", height: "11px" }} />
    </div>
    <div className="skeleton" style={{ width: "80px", height: "24px", borderRadius: "999px" }} />
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [stats, setStats]     = useState({ totalInquiries: 0, upcomingEvents: 0, confirmedBookings: 0, pendingReview: 0 });
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated]   = useState(null);
  const [error, setError]     = useState("");
  const [copySuccess, setCopySuccess]   = useState(false);
  const [newCount, setNewCount] = useState(0); // how many new since last refresh
  const prevCountRef = useRef(0);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setError("");

    try {
      const { data } = await api.get("/inquiries");
      const { stats: apiStats, inquiries: all } = data;

      const pendingReview = all.filter((i) => i.status === "New" || i.status === "Contacted").length;

      // Detect newly arrived inquiries on refresh
      if (silent && prevCountRef.current > 0) {
        const diff = all.length - prevCountRef.current;
        if (diff > 0) setNewCount(diff);
      }
      prevCountRef.current = all.length;

      setStats({ ...apiStats, pendingReview });
      setInquiries(all.slice(0, 5));
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(false); }, [fetchData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const id = setInterval(() => fetchData(true), 60000);
    return () => clearInterval(id);
  }, [fetchData]);

  const handleRefresh = () => {
    setNewCount(0);
    fetchData(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/submit-inquiry`).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const formatDate = (ds) =>
    new Date(ds).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const formatRelative = (d) => {
    if (!d) return "";
    const diff = Math.round((Date.now() - d.getTime()) / 1000);
    if (diff < 60)  return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] || "there";
  const inquiryUrl = `${window.location.origin}/submit-inquiry`;

  // ── Loading Skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="anim-fade-in">
        {/* Header skeleton */}
        <div style={{ marginBottom: "28px" }}>
          <div className="skeleton" style={{ width: "200px", height: "22px", marginBottom: "8px" }} />
          <div className="skeleton" style={{ width: "140px", height: "14px" }} />
        </div>
        {/* Stat cards skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "130px", borderRadius: "var(--radius-lg)" }} />
          ))}
        </div>
        {/* Table skeleton */}
        <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard — StarVnt Vendor</title>
        <meta name="description" content="Manage your StarVnt vendor bookings, inquiries and upcoming events." />
      </Helmet>

      <div className="anim-fade-in">

        {/* ── Page Header ── */}
        <div
          className="anim-fade-in-up"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "var(--color-text)",
                  letterSpacing: "-0.5px",
                }}
              >
                {greeting}, {firstName}! 👋
              </h2>
              {newCount > 0 && (
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "999px",
                    backgroundColor: "var(--color-new-bg)",
                    color: "var(--color-new)",
                    fontSize: "11px",
                    fontWeight: "700",
                    border: "1px solid var(--color-new)",
                    animation: "fadeIn 0.3s ease",
                  }}
                >
                  +{newCount} new
                </span>
              )}
            </div>
            <p style={{ fontSize: "13px", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="live-dot" style={{ width: "6px", height: "6px" }} />
              {lastUpdated ? `Updated ${formatRelative(lastUpdated)}` : "Loading data…"}
            </p>
          </div>

          {/* Refresh button */}
          <button
            id="refresh-dashboard-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 16px",
              borderRadius: "10px",
              border: "1px solid var(--color-border)",
              backgroundColor: isRefreshing ? "var(--color-surface-2)" : "var(--color-surface)",
              color: isRefreshing ? "var(--color-text-muted)" : "var(--color-text)",
              fontSize: "13px",
              fontWeight: "600",
              cursor: isRefreshing ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
              boxShadow: "var(--shadow-sm)",
            }}
            onMouseEnter={(e) => {
              if (!isRefreshing) {
                e.currentTarget.style.borderColor = "var(--color-primary)";
                e.currentTarget.style.color = "var(--color-primary)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.color = "var(--color-text)";
            }}
          >
            <RefreshIcon spinning={isRefreshing} />
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div
            className="anim-fade-in-up"
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid var(--color-rejected)",
              backgroundColor: "var(--color-rejected-bg)",
              color: "var(--color-rejected)",
              fontSize: "13px",
              marginBottom: "20px",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            ⚠️ {error}
            <button
              onClick={() => fetchData(false)}
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: "600", fontSize: "12px", fontFamily: "inherit" }}
            >
              Retry →
            </button>
          </div>
        )}

        {/* ── Stat Cards ── */}
        <div
          className="stagger"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <Link to="/inquiries" style={{ textDecoration: "none" }}>
            <StatCard title="Total Inquiries" value={stats.totalInquiries} subtitle="All-time booking requests" icon={<InboxIcon />} color="#6366f1" trend="View all →" index={0} />
          </Link>
          <Link to="/inquiries" style={{ textDecoration: "none" }}>
            <StatCard title="Pending Review" value={stats.pendingReview ?? 0} subtitle="New & contacted" icon={<ClockIcon />} color="#f59e0b" trend="Needs attention →" index={1} />
          </Link>
          <Link to="/inquiries" style={{ textDecoration: "none" }}>
            <StatCard title="Confirmed" value={stats.confirmedBookings} subtitle="Successfully booked" icon={<CheckIcon />} color="#10b981" trend="Confirmed status →" index={2} />
          </Link>
          <Link to="/inquiries" style={{ textDecoration: "none" }}>
            <StatCard title="Upcoming Events" value={stats.upcomingEvents} subtitle="Future event dates" icon={<CalendarIcon />} color="#a855f7" trend="Scheduled events →" index={3} />
          </Link>
        </div>

        {/* ── Share Link Banner ── */}
        <div
          className="anim-fade-in-up glass-card"
          style={{
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            animationDelay: "200ms",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                backgroundColor: "var(--color-primary-light)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <LinkIcon />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--color-text)", marginBottom: "2px" }}>
                Share Your Inquiry Form
              </p>
              <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                Clients can submit booking requests without creating an account
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <code
              style={{
                fontSize: "11px",
                backgroundColor: "var(--color-surface-2)",
                padding: "6px 10px",
                borderRadius: "7px",
                color: "var(--color-text-muted)",
                border: "1px solid var(--color-border)",
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
              }}
            >
              {inquiryUrl}
            </code>
            <button
              onClick={handleCopyLink}
              id="copy-inquiry-link-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "7px 13px",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                backgroundColor: copySuccess ? "var(--color-confirmed-bg)" : "var(--color-surface-2)",
                color: copySuccess ? "var(--color-confirmed)" : "var(--color-text)",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              <CopyIcon />
              {copySuccess ? "Copied!" : "Copy"}
            </button>
            <a
              href="/submit-inquiry"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "7px 13px",
                borderRadius: "8px",
                border: "1px solid var(--color-primary)",
                backgroundColor: "var(--color-primary-light)",
                color: "var(--color-primary)",
                fontSize: "12px",
                fontWeight: "600",
                textDecoration: "none",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
            >
              Preview →
            </a>
          </div>
        </div>

        {/* ── Recent Inquiries ── */}
        <div
          className="anim-fade-in-up glass-card"
          style={{ overflow: "hidden", animationDelay: "280ms" }}
        >
          {/* Card header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text)" }}>
                Recent Inquiries
              </p>
              <span
                style={{
                  padding: "1px 8px",
                  borderRadius: "999px",
                  backgroundColor: "var(--color-surface-2)",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                Last 5
              </span>
            </div>
            <Link
              to="/inquiries"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--color-primary)",
                textDecoration: "none",
                transition: "gap 0.15s ease",
              }}
            >
              View all <ArrowRightIcon />
            </Link>
          </div>

          {/* Table */}
          {inquiries.length === 0 ? (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
                color: "var(--color-text-muted)",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-text)", marginBottom: "4px" }}>
                No inquiries yet
              </p>
              <p style={{ fontSize: "13px", marginBottom: "16px" }}>
                Share your public inquiry form to start receiving bookings
              </p>
              <a
                href="/submit-inquiry"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 18px",
                  borderRadius: "9px",
                  border: "1px solid var(--color-primary)",
                  backgroundColor: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                <ZapIcon /> Open public form
              </a>
            </div>
          ) : (
            <>
              {/* Column headers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 130px 120px 110px",
                  gap: "12px",
                  padding: "10px 20px",
                  borderBottom: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface-2)",
                }}
              >
                {["Client", "Event Type", "Event Date", "Status"].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "var(--color-text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {inquiries.map((inq, idx) => (
                <div
                  key={inq._id}
                  className="interactive-row"
                  onClick={() => navigate("/inquiries")}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 130px 120px 110px",
                    gap: "12px",
                    padding: "13px 20px",
                    borderBottom: idx < inquiries.length - 1 ? "1px solid var(--color-border)" : "none",
                    alignItems: "center",
                    animation: `fadeInUp 0.35s ease both`,
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  {/* Client */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: `hsl(${(inq.clientName?.charCodeAt(0) || 65) * 5 % 360}, 60%, ${document.documentElement.classList.contains("dark") ? "30%" : "85%"})`,
                        color: `hsl(${(inq.clientName?.charCodeAt(0) || 65) * 5 % 360}, 70%, ${document.documentElement.classList.contains("dark") ? "70%" : "35%"})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700",
                        fontSize: "13px",
                        flexShrink: 0,
                      }}
                    >
                      {inq.clientName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {inq.clientName}
                      </p>
                      <p style={{ fontSize: "11px", color: "var(--color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {inq.clientEmail || inq.clientPhone || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Event type */}
                  <p style={{ fontSize: "13px", color: "var(--color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {inq.eventType || "—"}
                  </p>

                  {/* Date */}
                  <p style={{ fontSize: "13px", color: "var(--color-text)", fontVariantNumeric: "tabular-nums" }}>
                    {formatDate(inq.eventDate)}
                  </p>

                  {/* Status */}
                  <Badge status={inq.status} size="sm" />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
