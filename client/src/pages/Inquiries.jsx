import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/axios.js";
import Badge from "../components/ui/Badge.jsx";
import Modal from "../components/ui/Modal.jsx";

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = ["New", "Contacted", "Confirmed", "Rejected"];
const EVENT_TYPES = [
  "Wedding", "Corporate", "Birthday", "Anniversary",
  "Fashion Show", "Conference", "Concert", "Other",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (ds) =>
  new Date(ds).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const toInputDate = (ds) => {
  try { return new Date(ds).toISOString().split("T")[0]; }
  catch { return ""; }
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const RefreshIcon = ({ spinning }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: spinning ? "spin 0.7s linear infinite" : "none" }}>
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const ChevronIcon = ({ dir = "down" }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: dir === "up" ? "rotate(180deg)" : "none" }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ── Status color config ───────────────────────────────────────────────────────
const STATUS_META = {
  New:       { color: "var(--color-new)",       bg: "var(--color-new-bg)" },
  Contacted: { color: "var(--color-contacted)", bg: "var(--color-contacted-bg)" },
  Confirmed: { color: "var(--color-confirmed)", bg: "var(--color-confirmed-bg)" },
  Rejected:  { color: "var(--color-rejected)",  bg: "var(--color-rejected-bg)" },
};

// ── Shared input style ────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "9px",
  border: "1.5px solid var(--color-border)",
  backgroundColor: "var(--color-surface-2)",
  color: "var(--color-text)",
  fontSize: "13px",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "700",
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: "5px",
};

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 34 }) => {
  const ch = name?.charCodeAt(0) || 65;
  const hue = (ch * 47) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: "9px", flexShrink: 0,
      background: `hsl(${hue}, 55%, 88%)`,
      color: `hsl(${hue}, 55%, 35%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: "800", fontSize: `${Math.round(size * 0.38)}px`,
    }}>
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
};

// ── Skeleton row ──────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <div style={{ display: "flex", gap: "12px", padding: "14px 20px", alignItems: "center", borderBottom: "1px solid var(--color-border)" }}>
    <div className="skeleton" style={{ width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0 }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
      <div className="skeleton" style={{ width: "170px", height: "13px" }} />
      <div className="skeleton" style={{ width: "110px", height: "11px" }} />
    </div>
    <div className="skeleton" style={{ width: "90px", height: "14px" }} />
    <div className="skeleton" style={{ width: "90px", height: "14px" }} />
    <div className="skeleton" style={{ width: "76px", height: "24px", borderRadius: "999px" }} />
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// Inquiries Page
// ══════════════════════════════════════════════════════════════════════════════
const Inquiries = () => {
  const [inquiries, setInquiries]     = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch]           = useState("");
  const [sortField, setSortField]     = useState("eventDate");
  const [sortDir, setSortDir]         = useState("asc");
  const [error, setError]             = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [modalMode, setModalMode]             = useState("view");

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm]     = useState({});
  const [formError, setFormError]   = useState("");

  // ── Add Manual Inquiry ─────────────────────────────────────────────────────
  const [isAddOpen, setIsAddOpen]   = useState(false);
  const [addForm, setAddForm]       = useState({ clientName: "", clientEmail: "", clientPhone: "", eventType: "", eventDate: "", message: "" });
  const [isAdding, setIsAdding]     = useState(false);
  const [addError, setAddError]     = useState("");

  // ── Status quick-update ─────────────────────────────────────────────────────
  const [statusDropdownId, setStatusDropdownId] = useState(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchInquiries = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setError("");
    try {
      const { data } = await api.get("/inquiries");
      if (!data?.inquiries) throw new Error("Invalid response");
      setInquiries(data.inquiries);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load inquiries.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchInquiries(false); }, [fetchInquiries]);

  // ── Filter + Sort ──────────────────────────────────────────────────────────
  const filtered = inquiries
    .filter((i) => filterStatus === "All" || i.status === filterStatus)
    .filter((i) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        i.clientName?.toLowerCase().includes(q) ||
        i.clientEmail?.toLowerCase().includes(q) ||
        i.eventType?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "eventDate") return (new Date(a.eventDate) - new Date(b.eventDate)) * dir;
      if (sortField === "clientName") return a.clientName?.localeCompare(b.clientName) * dir;
      if (sortField === "createdAt") return (new Date(a.createdAt) - new Date(b.createdAt)) * dir;
      return 0;
    });

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  // ── Status counts ──────────────────────────────────────────────────────────
  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = inquiries.filter((i) => i.status === s).length;
    return acc;
  }, { All: inquiries.length });

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openModal = (inquiry, mode = "view") => {
    setSelectedInquiry(inquiry);
    setModalMode(mode);
    setEditForm({
      clientName:  inquiry.clientName  || "",
      clientEmail: inquiry.clientEmail || "",
      clientPhone: inquiry.clientPhone || "",
      eventType:   inquiry.eventType   || "",
      eventDate:   toInputDate(inquiry.eventDate),
      message:     inquiry.message     || "",
      status:      inquiry.status      || "New",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => { setSelectedInquiry(null); setModalMode("view"); }, 200);
  };

  // ── Status quick-update ─────────────────────────────────────────────────────
  const handleQuickStatus = async (id, newStatus) => {
    setIsStatusUpdating(id);
    setStatusDropdownId(null);
    try {
      await api.put(`/inquiries/${id}/status`, { status: newStatus });
      setInquiries((prev) => prev.map((i) => i._id === id ? { ...i, status: newStatus } : i));
    } catch {
      setError("Failed to update status.");
    } finally {
      setIsStatusUpdating(null);
    }
  };

  // ── Update inquiry ─────────────────────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.clientName?.trim() || !editForm.eventDate) {
      setFormError("Client name and event date are required.");
      return;
    }
    setIsUpdating(true);
    setFormError("");
    try {
      const { data } = await api.put(`/inquiries/${selectedInquiry._id}`, editForm);
      setInquiries((prev) =>
        prev.map((i) => i._id === selectedInquiry._id ? data.inquiry : i)
      );
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Update failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Delete inquiry ─────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/inquiries/${selectedInquiry._id}`);
      setInquiries((prev) => prev.filter((i) => i._id !== selectedInquiry._id));
      closeModal();
    } catch {
      setFormError("Delete failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Add manual inquiry ─────────────────────────────────────────────────────
  const handleAddInquiry = async (e) => {
    e.preventDefault();
    if (!addForm.clientName?.trim() || !addForm.eventDate) {
      setAddError("Client name and event date are required.");
      return;
    }
    setIsAdding(true);
    setAddError("");
    try {
      const { data } = await api.post("/inquiries/manual", addForm);
      setInquiries((prev) => [data.inquiry, ...prev]);
      setIsAddOpen(false);
      setAddForm({ clientName: "", clientEmail: "", clientPhone: "", eventType: "", eventDate: "", message: "" });
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to add inquiry.");
    } finally {
      setIsAdding(false);
    }
  };

  // ── Relative time ──────────────────────────────────────────────────────────
  const relativeTime = (d) => {
    if (!d) return "";
    const diff = Math.round((Date.now() - new Date(d)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return formatDate(d);
  };

  // ── Sort header ─────────────────────────────────────────────────────────────
  const SortHeader = ({ field, label }) => (
    <button
      onClick={() => toggleSort(field)}
      style={{
        background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: "4px",
        fontSize: "10px", fontWeight: "700", color: sortField === field ? "var(--color-primary)" : "var(--color-text-muted)",
        textTransform: "uppercase", letterSpacing: "0.07em", padding: 0, transition: "color 0.15s",
      }}
    >
      {label} {sortField === field && <ChevronIcon dir={sortDir === "asc" ? "down" : "up"} />}
    </button>
  );

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <>
      <Helmet>
        <title>Inquiries — StarVnt Vendor</title>
        <meta name="description" content="View and manage all your vendor booking inquiries on StarVnt." />
      </Helmet>

      <div className="anim-fade-in">

        {/* ── Page Header ── */}
        <div
          className="anim-fade-in-up"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "12px", marginBottom: "24px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--color-text)", letterSpacing: "-0.4px" }}>
                Inquiries
              </h2>
              <span style={{
                padding: "2px 9px", borderRadius: "999px",
                backgroundColor: "var(--color-primary-light)",
                color: "var(--color-primary)", fontSize: "12px", fontWeight: "700",
              }}>
                {inquiries.length}
              </span>
              {inquiries.filter(i => i.status === "New").length > 0 && (
                <span style={{
                  padding: "2px 9px", borderRadius: "999px",
                  backgroundColor: "var(--color-new-bg)", color: "var(--color-new)",
                  fontSize: "11px", fontWeight: "700", border: "1px solid var(--color-new)",
                  display: "flex", alignItems: "center", gap: "4px",
                }}>
                  <span className="live-dot" style={{ width: "5px", height: "5px" }} />
                  {inquiries.filter(i => i.status === "New").length} new
                </span>
              )}
            </div>
            {lastUpdated && (
              <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "3px", display: "flex", alignItems: "center", gap: "5px" }}>
                <span className="live-dot" style={{ width: "5px", height: "5px" }} />
                Updated {relativeTime(lastUpdated)}
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {/* Refresh */}
            <button
              id="refresh-inquiries-btn"
              onClick={() => fetchInquiries(true)}
              disabled={isRefreshing}
              style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "8px 14px", borderRadius: "10px",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)", fontSize: "13px", fontWeight: "600",
                cursor: isRefreshing ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "all 0.15s ease",
                boxShadow: "var(--shadow-sm)",
                opacity: isRefreshing ? 0.6 : 1,
              }}
              onMouseEnter={(e) => { if (!isRefreshing) { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.color = "var(--color-primary)"; }}}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text)"; }}
            >
              <RefreshIcon spinning={isRefreshing} />
              {isRefreshing ? "Refreshing…" : "Refresh"}
            </button>

            {/* Add inquiry */}
            <button
              id="add-inquiry-btn"
              onClick={() => setIsAddOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", borderRadius: "10px",
                border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white", fontSize: "13px", fontWeight: "600",
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.3)"; }}
            >
              <PlusIcon /> Add Inquiry
            </button>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="anim-fade-in-up" style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid var(--color-rejected)", backgroundColor: "var(--color-rejected-bg)", color: "var(--color-rejected)", fontSize: "13px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            ⚠️ {error}
            <button onClick={() => fetchInquiries(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: "600", fontSize: "12px", fontFamily: "inherit" }}>Retry →</button>
          </div>
        )}

        {/* ── Filters Bar ── */}
        <div
          className="anim-fade-in-up glass-card"
          style={{ padding: "14px 16px", marginBottom: "16px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", animationDelay: "60ms" }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <div style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", pointerEvents: "none" }}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by name, email or event type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: "34px" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-glow)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "var(--color-border)";  e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Status tabs */}
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {["All", ...STATUS_OPTIONS].map((s) => {
              const isActive = filterStatus === s;
              const meta = STATUS_META[s];
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    padding: "5px 12px", borderRadius: "8px",
                    border: `1px solid ${isActive ? (meta?.color || "var(--color-primary)") : "var(--color-border)"}`,
                    backgroundColor: isActive ? (meta?.bg || "var(--color-primary-light)") : "var(--color-surface-2)",
                    color: isActive ? (meta?.color || "var(--color-primary)") : "var(--color-text-muted)",
                    fontSize: "12px", fontWeight: isActive ? "700" : "500",
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s}
                  <span style={{
                    padding: "0 5px", borderRadius: "999px", fontSize: "10px", fontWeight: "700",
                    backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "var(--color-surface-3)",
                    color: isActive ? (meta?.color || "var(--color-primary)") : "var(--color-text-subtle)",
                  }}>
                    {counts[s] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="anim-fade-in-up glass-card" style={{ overflow: "hidden", animationDelay: "120ms" }}>

          {/* Column headers */}
          {!isLoading && inquiries.length > 0 && (
            <div
              className="inquiry-header"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 130px 115px 130px 100px",
                gap: "12px",
                padding: "10px 20px",
                borderBottom: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface-2)",
                alignItems: "center",
              }}
            >
              <SortHeader field="clientName" label="Client" />
              <SortHeader field="eventDate" label="Event Date" />
              <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Event Type</span>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Status</span>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Actions</span>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div>{[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}</div>
          )}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <div style={{ padding: "64px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "14px" }}>
                {search || filterStatus !== "All" ? "🔍" : "📭"}
              </div>
              <p style={{ fontSize: "15px", fontWeight: "700", color: "var(--color-text)", marginBottom: "6px" }}>
                {search || filterStatus !== "All" ? "No matching inquiries" : "No inquiries yet"}
              </p>
              <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
                {search || filterStatus !== "All"
                  ? "Try adjusting your search or filter."
                  : "Share your public inquiry form to start receiving bookings."}
              </p>
              {filterStatus !== "All" && (
                <button
                  onClick={() => setFilterStatus("All")}
                  style={{ padding: "8px 18px", borderRadius: "9px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-2)", color: "var(--color-text)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
                >
                  Clear filter
                </button>
              )}
            </div>
          )}

          {/* Rows */}
          {!isLoading && filtered.map((inq, idx) => (
            <div
              key={inq._id}
              className="interactive-row inquiry-row-wrapper"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 130px 115px 130px 100px",
                gap: "12px",
                padding: "12px 20px",
                borderBottom: idx < filtered.length - 1 ? "1px solid var(--color-border)" : "none",
                alignItems: "center",
                animation: `fadeInUp 0.35s ease both`,
                animationDelay: `${Math.min(idx, 8) * 40}ms`,
                position: "relative",
              }}
            >
              {/* Client info */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                <Avatar name={inq.clientName} size={34} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {inq.clientName}
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {inq.clientEmail || inq.clientPhone || "—"}
                  </p>
                </div>
              </div>

              {/* Event date */}
              <p style={{ fontSize: "12px", color: "var(--color-text)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                {formatDate(inq.eventDate)}
              </p>

              {/* Event type */}
              <p style={{ fontSize: "12px", color: "var(--color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {inq.eventType || "—"}
              </p>

              {/* Status dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setStatusDropdownId(statusDropdownId === inq._id ? null : inq._id); }}
                  disabled={isStatusUpdating === inq._id}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "none", border: "none", cursor: isStatusUpdating === inq._id ? "wait" : "pointer",
                    padding: "2px 4px", borderRadius: "6px", fontFamily: "inherit",
                    transition: "background 0.15s",
                  }}
                >
                  {isStatusUpdating === inq._id
                    ? <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>Updating…</span>
                    : <><Badge status={inq.status} size="sm" /><ChevronIcon /></>
                  }
                </button>

                {statusDropdownId === inq._id && (
                  <div
                    style={{
                      position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
                      backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)",
                      borderRadius: "10px", padding: "4px", minWidth: "140px",
                      boxShadow: "var(--shadow-lg)", animation: "scaleIn 0.15s ease",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleQuickStatus(inq._id, s)}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                          gap: "8px", padding: "8px 10px", borderRadius: "7px", border: "none",
                          backgroundColor: inq.status === s ? STATUS_META[s].bg : "transparent",
                          color: inq.status === s ? STATUS_META[s].color : "var(--color-text)",
                          fontSize: "12px", fontWeight: "600", cursor: "pointer",
                          fontFamily: "inherit", transition: "background 0.1s",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => { if (inq.status !== s) e.currentTarget.style.backgroundColor = "var(--color-surface-2)"; }}
                        onMouseLeave={(e) => { if (inq.status !== s) e.currentTarget.style.backgroundColor = "transparent"; }}
                      >
                        {s}
                        {inq.status === s && <CheckIcon />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="inquiry-actions">
                <button
                  onClick={() => openModal(inq, "view")}
                  title="View details"
                  style={{
                    width: "28px", height: "28px", borderRadius: "7px",
                    border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-2)",
                    color: "var(--color-text-muted)", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.color = "var(--color-primary)"; e.currentTarget.style.backgroundColor = "var(--color-primary-light)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text-muted)"; e.currentTarget.style.backgroundColor = "var(--color-surface-2)"; }}
                >
                  <EyeIcon />
                </button>
                <button
                  onClick={() => openModal(inq, "edit")}
                  title="Edit inquiry"
                  style={{
                    width: "28px", height: "28px", borderRadius: "7px",
                    border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-2)",
                    color: "var(--color-text-muted)", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-contacted)"; e.currentTarget.style.color = "var(--color-contacted)"; e.currentTarget.style.backgroundColor = "var(--color-contacted-bg)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text-muted)"; e.currentTarget.style.backgroundColor = "var(--color-surface-2)"; }}
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => openModal(inq, "delete")}
                  title="Delete inquiry"
                  style={{
                    width: "28px", height: "28px", borderRadius: "7px",
                    border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-2)",
                    color: "var(--color-text-muted)", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-rejected)"; e.currentTarget.style.color = "var(--color-rejected)"; e.currentTarget.style.backgroundColor = "var(--color-rejected-bg)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text-muted)"; e.currentTarget.style.backgroundColor = "var(--color-surface-2)"; }}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}

          {/* Footer count */}
          {!isLoading && filtered.length > 0 && (
            <div style={{ padding: "10px 20px", borderTop: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-2)", fontSize: "11px", color: "var(--color-text-muted)", fontWeight: "500" }}>
              Showing {filtered.length} of {inquiries.length} inquiries
            </div>
          )}
        </div>
      </div>

      {/* ── Close status dropdown on outside click ── */}
      {statusDropdownId && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 49 }}
          onClick={() => setStatusDropdownId(null)}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW / EDIT / DELETE MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalMode === "view"   ? "Inquiry Details" :
          modalMode === "edit"   ? "Edit Inquiry" :
                                   "Delete Inquiry?"
        }
      >
        {selectedInquiry && (
          <>
            {/* ── VIEW ── */}
            {modalMode === "view" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px", backgroundColor: "var(--color-surface-2)", borderRadius: "12px" }}>
                  <Avatar name={selectedInquiry.clientName} size={48} />
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: "800", color: "var(--color-text)" }}>{selectedInquiry.clientName}</p>
                    <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{selectedInquiry.clientEmail || selectedInquiry.clientPhone || "No contact info"}</p>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Badge status={selectedInquiry.status} />
                  </div>
                </div>

                {/* Detail grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
                    { label: "Event Type",  value: selectedInquiry.eventType  || "—" },
                    { label: "Event Date",  value: formatDate(selectedInquiry.eventDate) },
                    { label: "Phone",       value: selectedInquiry.clientPhone || "—" },
                    { label: "Email",       value: selectedInquiry.clientEmail || "—" },
                    { label: "Received",    value: relativeTime(selectedInquiry.createdAt) },
                    { label: "Status",      value: selectedInquiry.status },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ padding: "12px", backgroundColor: "var(--color-surface-2)", borderRadius: "9px", border: "1px solid var(--color-border)" }}>
                      <p style={labelStyle}>{label}</p>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text)" }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Message */}
                {selectedInquiry.message && (
                  <div style={{ padding: "14px", backgroundColor: "var(--color-surface-2)", borderRadius: "10px", border: "1px solid var(--color-border)" }}>
                    <p style={labelStyle}>Message</p>
                    <p style={{ fontSize: "13px", color: "var(--color-text)", lineHeight: "1.65", whiteSpace: "pre-wrap" }}>
                      {selectedInquiry.message}
                    </p>
                  </div>
                )}

                {/* Status actions */}
                <div>
                  <p style={{ ...labelStyle, marginBottom: "8px" }}>Update Status</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {STATUS_OPTIONS.map((s) => {
                      const meta = STATUS_META[s];
                      const isActive = selectedInquiry.status === s;
                      return (
                        <button
                          key={s}
                          onClick={async () => {
                            await handleQuickStatus(selectedInquiry._id, s);
                            setSelectedInquiry((p) => ({ ...p, status: s }));
                          }}
                          style={{
                            padding: "6px 14px", borderRadius: "8px",
                            border: `1px solid ${isActive ? meta.color : "var(--color-border)"}`,
                            backgroundColor: isActive ? meta.bg : "var(--color-surface-2)",
                            color: isActive ? meta.color : "var(--color-text-muted)",
                            fontSize: "12px", fontWeight: "600", cursor: "pointer",
                            fontFamily: "inherit", transition: "all 0.15s",
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Edit / Delete buttons */}
                <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
                  <button onClick={() => setModalMode("edit")} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-2)", color: "var(--color-text)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <EditIcon /> Edit
                  </button>
                  <button onClick={() => setModalMode("delete")} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "1px solid var(--color-rejected)", backgroundColor: "var(--color-rejected-bg)", color: "var(--color-rejected)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <TrashIcon /> Delete
                  </button>
                </div>
              </div>
            )}

            {/* ── EDIT ── */}
            {modalMode === "edit" && (
              <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {formError && <div style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--color-rejected)", backgroundColor: "var(--color-rejected-bg)", color: "var(--color-rejected)", fontSize: "12px" }}>⚠️ {formError}</div>}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
                    { key: "clientName",  label: "Client Name *",  type: "text",  required: true },
                    { key: "clientEmail", label: "Email",           type: "email", required: false },
                    { key: "clientPhone", label: "Phone",           type: "tel",   required: false },
                    { key: "eventDate",   label: "Event Date *",    type: "date",  required: true },
                  ].map(({ key, label, type, required }) => (
                    <div key={key}>
                      <label style={labelStyle}>{label}</label>
                      <input
                        type={type} required={required}
                        value={editForm[key] || ""}
                        onChange={(e) => setEditForm((p) => ({ ...p, [key]: e.target.value }))}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-glow)"; }}
                        onBlur={(e)  => { e.target.style.borderColor = "var(--color-border)";  e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label style={labelStyle}>Event Type</label>
                  <select value={editForm.eventType || ""} onChange={(e) => setEditForm((p) => ({ ...p, eventType: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={editForm.status || "New"} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea rows={3} value={editForm.message || ""} onChange={(e) => setEditForm((p) => ({ ...p, message: e.target.value }))} style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-glow)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "var(--color-border)";  e.target.style.boxShadow = "none"; }}
                  />
                </div>

                <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
                  <button type="button" onClick={() => setModalMode("view")} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-2)", color: "var(--color-text)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isUpdating} style={{ flex: 2, padding: "10px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: "13px", fontWeight: "700", cursor: isUpdating ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: isUpdating ? 0.7 : 1 }}>
                    {isUpdating ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {/* ── DELETE ── */}
            {modalMode === "delete" && (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗑️</div>
                <p style={{ fontSize: "15px", fontWeight: "700", color: "var(--color-text)", marginBottom: "8px" }}>
                  Delete this inquiry?
                </p>
                <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "24px", lineHeight: "1.6" }}>
                  You're about to permanently delete the inquiry from <strong style={{ color: "var(--color-text)" }}>{selectedInquiry.clientName}</strong>. This action cannot be undone.
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setModalMode("view")} style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-2)", color: "var(--color-text)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
                    Cancel
                  </button>
                  <button onClick={handleDelete} disabled={isDeleting} style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "1px solid var(--color-rejected)", backgroundColor: "var(--color-rejected)", color: "white", fontSize: "13px", fontWeight: "700", cursor: isDeleting ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: isDeleting ? 0.7 : 1 }}>
                    {isDeleting ? "Deleting…" : "Yes, Delete"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* ── Add Manual Inquiry Modal ── */}
      <Modal isOpen={isAddOpen} onClose={() => { setIsAddOpen(false); setAddError(""); }} title="Add Inquiry Manually">
        <form onSubmit={handleAddInquiry} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {addError && <div style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--color-rejected)", backgroundColor: "var(--color-rejected-bg)", color: "var(--color-rejected)", fontSize: "12px" }}>⚠️ {addError}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { key: "clientName",  label: "Client Name *", type: "text",  required: true },
              { key: "clientEmail", label: "Email",          type: "email", required: false },
              { key: "clientPhone", label: "Phone",          type: "tel",   required: false },
              { key: "eventDate",   label: "Event Date *",   type: "date",  required: true },
            ].map(({ key, label, type, required }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  type={type} required={required}
                  value={addForm[key] || ""}
                  onChange={(e) => setAddForm((p) => ({ ...p, [key]: e.target.value }))}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-glow)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "var(--color-border)";  e.target.style.boxShadow = "none"; }}
                />
              </div>
            ))}
          </div>

          <div>
            <label style={labelStyle}>Event Type</label>
            <select value={addForm.eventType || ""} onChange={(e) => setAddForm((p) => ({ ...p, eventType: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Select event type</option>
              {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Message</label>
            <textarea rows={3} value={addForm.message || ""} onChange={(e) => setAddForm((p) => ({ ...p, message: e.target.value }))} style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px var(--color-primary-glow)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "var(--color-border)";  e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
            <button type="button" onClick={() => setIsAddOpen(false)} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-2)", color: "var(--color-text)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
              Cancel
            </button>
            <button type="submit" disabled={isAdding} style={{ flex: 2, padding: "10px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: "13px", fontWeight: "700", cursor: isAdding ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: isAdding ? 0.7 : 1 }}>
              {isAdding ? "Adding…" : "Add Inquiry"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

const relativeTime = (d) => {
  if (!d) return "";
  const diff = Math.round((Date.now() - new Date(d)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return formatDate(d);
};

export default Inquiries;
