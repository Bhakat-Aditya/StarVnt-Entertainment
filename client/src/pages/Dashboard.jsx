// pages/Dashboard.jsx
// The main dashboard page shown after login.
// Displays 3 summary stat cards and a recent activity feed.

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import StatCard from "../components/ui/StatCard.jsx";
import Badge from "../components/ui/Badge.jsx";

// --- Icon Components ---
const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalInquiries: 0, upcomingEvents: 0, confirmedBookings: 0 });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Fetch Dashboard Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/inquiries");
        
        // Defensive check: if proxy fails and returns HTML, response.data will not have inquiries
        if (!response.data || !response.data.inquiries) {
          throw new Error("Invalid API response. Server might be down or proxy failed.");
        }

        const { stats: apiStats, inquiries } = response.data;

        setStats(apiStats);
        setRecentInquiries(inquiries.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Could not load dashboard data. Please check your backend connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Format Date ---
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
        <div style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "10px",
          color: "#dc2626",
          fontSize: "14px",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* --- Welcome Header --- */}
      <div style={{ marginBottom: "28px" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "var(--color-text)",
            letterSpacing: "-0.3px",
          }}
        >
          Good {getGreeting()}, {user?.name?.split(" ")[0]} 👋
        </h2>
        <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginTop: "4px" }}>
          Here's what's happening with your bookings today.
        </p>
      </div>

      {/* --- Stat Cards Grid --- */}
      {/* CSS Grid: 3 equal columns on desktop, 1 on mobile */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {/*
          Wrapping each StatCard in a <Link> makes the whole card clickable.
          We use 'style={{ textDecoration: "none" }}' so the Link doesn't add underlines.
          useNavigate() is used for the trend link inside StatCard — but the whole card
          navigates via the <Link> wrapper.
        */}
        <Link to="/inquiries" style={{ textDecoration: "none" }}>
          <StatCard
            title="Total Inquiries"
            value={stats.totalInquiries}
            subtitle="All time booking requests"
            icon={<InboxIcon />}
            color="#6366f1"
            trend="Click to view all inquiries →"
          />
        </Link>

        <Link to="/inquiries" style={{ textDecoration: "none" }}>
          <StatCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            subtitle="Scheduled future events"
            icon={<CalendarIcon />}
            color="#f59e0b"
            trend="Events not yet rejected"
          />
        </Link>

        <Link to="/inquiries" style={{ textDecoration: "none" }}>
          <StatCard
            title="Confirmed Bookings"
            value={stats.confirmedBookings}
            subtitle="Successfully booked events"
            icon={<CheckIcon />}
            color="#10b981"
            trend="Confirmed status inquiries"
          />
        </Link>
      </div>

      {/* --- Recent Activity --- */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Section Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--color-text)" }}>
            Recent Activity
          </h3>

          {/*
            FIX: Changed from <a href="/inquiries"> to <Link to="/inquiries">.
            <a href="..."> causes a full page reload (browser navigation).
            <Link to="..."> is react-router's SPA navigation — no page reload,
            faster, and preserves React state.
          */}
          <Link
            to="/inquiries"
            style={{
              fontSize: "13px",
              color: "var(--color-primary)",
              textDecoration: "none",
              fontWeight: "600",
              padding: "5px 10px",
              borderRadius: "6px",
              border: "1px solid var(--color-primary-light)",
              backgroundColor: "var(--color-primary-light)",
              transition: "all 0.15s ease",
            }}
          >
            View all inquiries →
          </Link>
        </div>

        {/* Activity List */}
        {recentInquiries.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--color-text-muted)" }}>
            <p style={{ fontSize: "24px", marginBottom: "12px" }}>📭</p>
            <p style={{ fontSize: "15px", fontWeight: "600", color: "var(--color-text)" }}>
              No inquiries yet
            </p>
            <p style={{ fontSize: "13px", marginTop: "6px" }}>
              Run{" "}
              <code
                style={{
                  backgroundColor: "var(--color-surface-2)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                node seed.js
              </code>{" "}
              in the server folder to add demo data.
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: "none" }}>
            {recentInquiries.map((inquiry, index) => (
              <li
                key={inquiry._id}
                onClick={() => navigate("/inquiries")}
                style={{
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  borderBottom:
                    index < recentInquiries.length - 1
                      ? "1px solid var(--color-border)"
                      : "none",
                  transition: "background 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--color-surface-2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {/* Client Avatar + Name */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "13px",
                      flexShrink: 0,
                    }}
                  >
                    {inquiry.clientName?.charAt(0) || "?"}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "var(--color-text)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {inquiry.clientName}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                      {inquiry.eventType || "Event"} · {formatDate(inquiry.eventDate)}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <Badge status={inquiry.status} size="sm" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Helper: returns a time-of-day greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export default Dashboard;
