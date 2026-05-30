import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/axios.js";

const EVENT_TYPES = [
  "Wedding",
  "Corporate",
  "Birthday",
  "Anniversary",
  "Fashion Show",
  "Conference",
  "Concert",
  "Other",
];

const VENDOR_CATEGORY_ICONS = {
  Photographer: "📷",
  Decorator: "🎨",
  "Makeup Artist": "💄",
  Caterer: "🍽️",
  DJ: "🎧",
  Anchor: "🎤",
  "Event Planner": "📋",
};

// ── Small SVG Icons ──────────────────────────────────────────────────────────
const CheckCircleIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ── Styles ──────────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1.5px solid rgba(255,255,255,0.15)",
  backgroundColor: "rgba(255,255,255,0.08)",
  color: "#f1f5f9",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s ease, background-color 0.2s ease",
  backdropFilter: "blur(4px)",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "700",
  color: "rgba(255,255,255,0.5)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "6px",
};

// ── Main Component ───────────────────────────────────────────────────────────
const PublicInquiry = () => {
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const [form, setForm] = useState({
    vendorId: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventType: "",
    eventDate: "",
    message: "",
  });

  // Fetch public vendor list on mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const { data } = await api.get("/vendor/public");
        setVendors(data.vendors || []);
        // Auto-select first vendor if only one exists
        if (data.vendors?.length === 1) {
          setForm((f) => ({ ...f, vendorId: data.vendors[0]._id }));
        }
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
        setError("Could not load vendor list. Please try again later.");
      } finally {
        setLoadingVendors(false);
      }
    };
    fetchVendors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Basic client-side validation
    if (!form.vendorId) {
      setError("Please select a vendor.");
      setIsSubmitting(false);
      return;
    }
    if (!form.clientName.trim()) {
      setError("Please enter your name.");
      setIsSubmitting(false);
      return;
    }
    if (!form.eventDate) {
      setError("Please select an event date.");
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post("/inquiries", form);
      setIsSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setForm({
      vendorId: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      eventType: "",
      eventDate: "",
      message: "",
    });
    setError("");
  };

  const selectedVendor = vendors.find((v) => v._id === form.vendorId);

  const getFocusStyle = (field) =>
    focusedField === field
      ? { borderColor: "#818cf8", backgroundColor: "rgba(129,140,248,0.1)" }
      : {};

  return (
    <>
      <Helmet>
        <title>Submit an Inquiry — StarVnt</title>
        <meta
          name="description"
          content="Submit a booking inquiry to your preferred StarVnt event vendor. Connect with top photographers, decorators, DJs, makeup artists, and more for your next event."
        />
        <meta property="og:title" content="Submit an Inquiry — StarVnt" />
        <meta
          property="og:description"
          content="Find and book top event vendors through StarVnt. Submit your event details and get connected instantly."
        />
      </Helmet>

      {/* ── Page Wrapper ── */}
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Decorative background blobs ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-200px",
            left: "-200px",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Header / Nav ── */}
        <header
          style={{
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(15,23,42,0.4)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          {/* Logo */}
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                borderRadius: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "900",
                fontSize: "18px",
              }}
            >
              S
            </div>
            <span
              style={{
                fontWeight: "800",
                fontSize: "18px",
                color: "#f1f5f9",
                letterSpacing: "-0.5px",
              }}
            >
              StarVnt
            </span>
          </a>

          {/* Vendor login link */}
          <a
            href="/login"
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.6)",
              textDecoration: "none",
              padding: "8px 16px",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              backdropFilter: "blur(4px)",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#818cf8";
              e.target.style.borderColor = "rgba(129,140,248,0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "rgba(255,255,255,0.6)";
              e.target.style.borderColor = "rgba(255,255,255,0.15)";
            }}
          >
            Vendor Login →
          </a>
        </header>

        {/* ── Main Content ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "48px 20px 64px",
          }}
        >
          {/* ── Hero Text ── */}
          {!isSuccess && (
            <div style={{ textAlign: "center", marginBottom: "40px", maxWidth: "620px" }}>
              {/* Star rating badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(234,179,8,0.15)",
                  border: "1px solid rgba(234,179,8,0.3)",
                  borderRadius: "100px",
                  padding: "5px 14px",
                  marginBottom: "20px",
                  color: "#fbbf24",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                <StarIcon />
                Trusted by 500+ clients across India
              </div>

              <h1
                style={{
                  fontSize: "clamp(28px, 5vw, 46px)",
                  fontWeight: "900",
                  color: "#f1f5f9",
                  lineHeight: "1.15",
                  letterSpacing: "-1px",
                  marginBottom: "16px",
                }}
              >
                Book Your Perfect{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Event Vendor
                </span>
              </h1>

              <p
                style={{
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: "1.7",
                  maxWidth: "480px",
                  margin: "0 auto",
                }}
              >
                Fill in your event details below and your chosen vendor will get
                back to you within 24 hours. No account needed.
              </p>
            </div>
          )}

          {/* ── Success State ── */}
          {isSuccess ? (
            <div
              style={{
                width: "100%",
                maxWidth: "520px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "24px",
                padding: "56px 40px",
                textAlign: "center",
                backdropFilter: "blur(20px)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
                animation: "fadeInUp 0.5s ease",
              }}
            >
              <div
                style={{
                  color: "#34d399",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CheckCircleIcon />
              </div>
              <h2
                style={{
                  fontSize: "26px",
                  fontWeight: "800",
                  color: "#f1f5f9",
                  marginBottom: "12px",
                  letterSpacing: "-0.5px",
                }}
              >
                Inquiry Submitted! 🎉
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: "1.7",
                  marginBottom: "32px",
                }}
              >
                Your inquiry has been sent to{" "}
                <strong style={{ color: "#818cf8" }}>
                  {selectedVendor?.vendorName || "the vendor"}
                </strong>
                . They'll review your details and get back to you within 24 hours.
              </p>

              <div
                style={{
                  backgroundColor: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "28px",
                  textAlign: "left",
                }}
              >
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "700" }}>
                  Inquiry Summary
                </p>
                <p style={{ fontSize: "14px", color: "#f1f5f9", marginBottom: "4px" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>Name: </span> {form.clientName}
                </p>
                <p style={{ fontSize: "14px", color: "#f1f5f9", marginBottom: "4px" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>Event: </span> {form.eventType || "—"} on {form.eventDate ? new Date(form.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                </p>
                <p style={{ fontSize: "14px", color: "#f1f5f9" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>Vendor: </span> {selectedVendor?.vendorName}
                </p>
              </div>

              <button
                onClick={handleReset}
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px 32px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                  width: "100%",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            /* ── Form Card ── */
            <div
              style={{
                width: "100%",
                maxWidth: "680px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "24px",
                padding: "clamp(24px, 4vw, 48px)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {/* Card Header */}
              <div style={{ marginBottom: "32px" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    color: "#f1f5f9",
                    marginBottom: "6px",
                    letterSpacing: "-0.3px",
                  }}
                >
                  Inquiry Details
                </h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                  All fields marked with <span style={{ color: "#f87171" }}>*</span> are required
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    marginBottom: "24px",
                    fontSize: "13px",
                    color: "#fca5a5",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* ── Section: Choose Vendor ── */}
                <SectionTitle>1. Choose Your Vendor</SectionTitle>

                {loadingVendors ? (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "13px",
                    }}
                  >
                    Loading vendors...
                  </div>
                ) : vendors.length === 0 ? (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "13px",
                      border: "1px dashed rgba(255,255,255,0.15)",
                      borderRadius: "12px",
                    }}
                  >
                    No vendors available yet. Please check back soon.
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                      gap: "10px",
                      marginBottom: "28px",
                    }}
                  >
                    {vendors.map((vendor) => {
                      const isSelected = form.vendorId === vendor._id;
                      const icon = VENDOR_CATEGORY_ICONS[vendor.category] || "⭐";
                      return (
                        <button
                          key={vendor._id}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, vendorId: vendor._id }))}
                          style={{
                            padding: "14px 16px",
                            borderRadius: "12px",
                            border: isSelected
                              ? "1.5px solid #818cf8"
                              : "1.5px solid rgba(255,255,255,0.1)",
                            backgroundColor: isSelected
                              ? "rgba(99,102,241,0.2)"
                              : "rgba(255,255,255,0.04)",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.2s ease",
                            outline: "none",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = "rgba(129,140,248,0.4)";
                              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                            }
                          }}
                        >
                          <div style={{ fontSize: "22px", marginBottom: "8px" }}>{icon}</div>
                          <p
                            style={{
                              fontSize: "13px",
                              fontWeight: "700",
                              color: isSelected ? "#818cf8" : "#f1f5f9",
                              marginBottom: "3px",
                              lineHeight: "1.3",
                            }}
                          >
                            {vendor.vendorName}
                          </p>
                          <p
                            style={{
                              fontSize: "11px",
                              color: "rgba(255,255,255,0.4)",
                            }}
                          >
                            {vendor.category}
                            {vendor.location ? ` · ${vendor.location}` : ""}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* ── Section: Your Information ── */}
                <SectionTitle>2. Your Information</SectionTitle>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "14px",
                    marginBottom: "28px",
                  }}
                >
                  <div>
                    <label htmlFor="clientName" style={labelStyle}>
                      Full Name <span style={{ color: "#f87171" }}>*</span>
                    </label>
                    <input
                      id="clientName"
                      type="text"
                      name="clientName"
                      value={form.clientName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("clientName")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your full name"
                      required
                      style={{ ...inputStyle, ...getFocusStyle("clientName") }}
                    />
                  </div>

                  <div>
                    <label htmlFor="clientEmail" style={labelStyle}>
                      Email Address
                    </label>
                    <input
                      id="clientEmail"
                      type="email"
                      name="clientEmail"
                      value={form.clientEmail}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("clientEmail")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@example.com"
                      style={{ ...inputStyle, ...getFocusStyle("clientEmail") }}
                    />
                  </div>

                  <div>
                    <label htmlFor="clientPhone" style={labelStyle}>
                      Phone Number
                    </label>
                    <input
                      id="clientPhone"
                      type="tel"
                      name="clientPhone"
                      value={form.clientPhone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("clientPhone")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="+91 XXXXX XXXXX"
                      style={{ ...inputStyle, ...getFocusStyle("clientPhone") }}
                    />
                  </div>
                </div>

                {/* ── Section: Event Details ── */}
                <SectionTitle>3. Event Details</SectionTitle>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "14px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label htmlFor="eventType" style={labelStyle}>
                      Event Type
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={form.eventType}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("eventType")}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        ...inputStyle,
                        cursor: "pointer",
                        ...getFocusStyle("eventType"),
                      }}
                    >
                      <option value="" style={{ backgroundColor: "#1e293b" }}>
                        Select event type
                      </option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t} style={{ backgroundColor: "#1e293b" }}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="eventDate" style={labelStyle}>
                      Event Date <span style={{ color: "#f87171" }}>*</span>
                    </label>
                    <input
                      id="eventDate"
                      type="date"
                      name="eventDate"
                      value={form.eventDate}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("eventDate")}
                      onBlur={() => setFocusedField(null)}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      style={{
                        ...inputStyle,
                        colorScheme: "dark",
                        ...getFocusStyle("eventDate"),
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "28px" }}>
                  <label htmlFor="message" style={labelStyle}>
                    Message / Additional Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    rows={4}
                    placeholder="Tell the vendor about your event — expected guests, venue, special requirements, budget range, etc."
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: "1.7",
                      minHeight: "100px",
                      ...getFocusStyle("message"),
                    }}
                  />
                </div>

                {/* ── Submit Button ── */}
                <button
                  type="submit"
                  disabled={isSubmitting || loadingVendors}
                  id="submit-inquiry-btn"
                  style={{
                    width: "100%",
                    padding: "15px",
                    borderRadius: "12px",
                    border: "none",
                    background: isSubmitting
                      ? "rgba(99,102,241,0.5)"
                      : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "white",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                    letterSpacing: "0.01em",
                    boxShadow: isSubmitting ? "none" : "0 4px 20px rgba(99,102,241,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  {isSubmitting ? "Submitting…" : "Send Inquiry →"}
                </button>

                <p
                  style={{
                    textAlign: "center",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.3)",
                    marginTop: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  By submitting, you agree to be contacted by the selected vendor.
                  <br />
                  Your information will not be shared with third parties.
                </p>
              </form>
            </div>
          )}

          {/* ── Vendor category quick reference ── */}
          {!isSuccess && (
            <div
              style={{
                marginTop: "40px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                justifyContent: "center",
                opacity: 0.6,
              }}
            >
              {Object.entries(VENDOR_CATEGORY_ICONS).map(([cat, icon]) => (
                <span
                  key={cat}
                  style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}
                >
                  {icon} {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <footer
          style={{
            padding: "20px 32px",
            textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
            © 2026 StarVnt. All rights reserved. |{" "}
            <a href="/login" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
              Vendor Dashboard
            </a>
          </p>
        </footer>
      </main>

      {/* Keyframe animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

// ── Helper sub-components ────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <div style={{ marginBottom: "16px" }}>
    <h3
      style={{
        fontSize: "13px",
        fontWeight: "700",
        color: "#818cf8",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </h3>
    <div
      style={{
        height: "1px",
        background: "linear-gradient(90deg, rgba(129,140,248,0.3), transparent)",
        marginTop: "8px",
      }}
    />
  </div>
);

export default PublicInquiry;
