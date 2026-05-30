import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Helmet } from "react-helmet-async";
import api from "../api/axios.js";

// ── Constants ──────────────────────────────────────────────────────────────────
const EVENT_TYPES = [
  "Wedding", "Corporate", "Birthday", "Anniversary",
  "Fashion Show", "Conference", "Concert", "Other",
];

const CATEGORY_ICONS = {
  Photographer:   "📷",
  Decorator:      "🎨",
  "Makeup Artist": "💄",
  Caterer:        "🍽️",
  DJ:             "🎧",
  Anchor:         "🎤",
  "Event Planner": "📋",
};

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputBase = {
  width: "100%",
  padding: "10px 13px",
  borderRadius: "9px",
  border: "1.5px solid rgba(255,255,255,0.12)",
  backgroundColor: "rgba(255,255,255,0.06)",
  color: "#f1f5f9",
  fontSize: "13px",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
};

const labelBase = {
  display: "block",
  fontSize: "10px",
  fontWeight: "700",
  color: "rgba(255,255,255,0.45)",
  textTransform: "uppercase",
  letterSpacing: "0.09em",
  marginBottom: "5px",
};

const focusStyle = {
  borderColor: "#818cf8",
  backgroundColor: "rgba(129,140,248,0.08)",
  boxShadow: "0 0 0 3px rgba(129,140,248,0.15)",
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const CheckCircleIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

// ══════════════════════════════════════════════════════════════════════════════
// LEFT PANEL — Public Inquiry Form
// ══════════════════════════════════════════════════════════════════════════════
const InquiryPanel = () => {
  const [vendors, setVendors]         = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [form, setForm] = useState({
    vendorId: "", clientName: "", clientEmail: "",
    clientPhone: "", eventType: "", eventDate: "", message: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);
  const [error, setError]               = useState("");

  useEffect(() => {
    api.get("/vendor/public")
      .then(({ data }) => {
        setVendors(data.vendors || []);
        if (data.vendors?.length === 1) {
          setForm((f) => ({ ...f, vendorId: data.vendors[0]._id }));
        }
      })
      .catch(() => setError("Could not load vendors."))
      .finally(() => setLoadingVendors(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.vendorId)            return setError("Please select a vendor.");
    if (!form.clientName.trim())   return setError("Please enter your name.");
    if (!form.eventDate)           return setError("Please select an event date.");

    setIsSubmitting(true);
    setError("");
    try {
      await api.post("/inquiries", form);
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setForm({ vendorId: "", clientName: "", clientEmail: "", clientPhone: "", eventType: "", eventDate: "", message: "" });
    setError("");
  };

  const selectedVendor = vendors.find((v) => v._id === form.vendorId);
  const getFocus = (field) => focusedField === field ? focusStyle : {};

  // ── Success screen ─────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 32px",
          textAlign: "center",
          flexDirection: "column",
          animation: "fadeInUp 0.5s ease",
        }}
      >
        <div style={{ color: "#34d399", marginBottom: "16px" }}>
          <CheckCircleIcon />
        </div>
        <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#f1f5f9", marginBottom: "10px", letterSpacing: "-0.4px" }}>
          Inquiry Sent! 🎉
        </h3>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.7", marginBottom: "8px" }}>
          Your inquiry has been sent to{" "}
          <strong style={{ color: "#818cf8" }}>{selectedVendor?.vendorName || "the vendor"}</strong>.
          They'll get back to you within 24 hours.
        </p>
        {/* Summary */}
        <div style={{ width: "100%", maxWidth: "340px", backgroundColor: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: "12px", padding: "14px 16px", marginBottom: "24px", textAlign: "left" }}>
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Summary</p>
          {[
            ["Name", form.clientName],
            ["Vendor", selectedVendor?.vendorName || "—"],
            ["Event", `${form.eventType || "—"} · ${form.eventDate ? new Date(form.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}`],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{k}</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#f1f5f9", textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleReset}
          style={{
            padding: "11px 28px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "white", fontSize: "13px", fontWeight: "700",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
          }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Hero */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          backgroundColor: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.25)",
          borderRadius: "999px", padding: "3px 10px", marginBottom: "14px",
          color: "#fbbf24", fontSize: "11px", fontWeight: "600",
        }}>
          <StarIcon /> Trusted by 500+ clients across India
        </div>
        <h2 style={{ fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: "900", color: "#f1f5f9", letterSpacing: "-0.5px", lineHeight: "1.2", marginBottom: "8px" }}>
          Book Your Perfect{" "}
          <span style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Event Vendor
          </span>
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: "1.65" }}>
          Fill in your event details and your chosen vendor will get back to you within 24 hours. No account needed.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(248,113,113,0.3)", backgroundColor: "rgba(248,113,113,0.08)", color: "#fca5a5", fontSize: "12px", marginBottom: "16px", display: "flex", gap: "6px", alignItems: "center" }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>

        {/* 1. Choose Vendor */}
        <section>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
            1 · Choose Your Vendor
          </p>
          {loadingVendors ? (
            <div style={{ padding: "14px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "10px" }}>
              Loading vendors…
            </div>
          ) : vendors.length === 0 ? (
            <div style={{ padding: "14px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "10px" }}>
              No vendors available yet.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px" }}>
              {vendors.map((vendor) => {
                const isSelected = form.vendorId === vendor._id;
                return (
                  <button
                    key={vendor._id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, vendorId: vendor._id }))}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: isSelected ? "1.5px solid #818cf8" : "1.5px solid rgba(255,255,255,0.1)",
                      backgroundColor: isSelected ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.03)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.18s ease",
                      outline: "none",
                      boxShadow: isSelected ? "0 0 0 3px rgba(129,140,248,0.12)" : "none",
                    }}
                    onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = "rgba(129,140,248,0.35)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; }}}
                    onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}}
                  >
                    <div style={{ fontSize: "20px", marginBottom: "6px" }}>{CATEGORY_ICONS[vendor.category] || "⭐"}</div>
                    <p style={{ fontSize: "12px", fontWeight: "700", color: isSelected ? "#818cf8" : "#f1f5f9", lineHeight: "1.3", marginBottom: "3px" }}>
                      {vendor.vendorName}
                    </p>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>
                      {vendor.category}{vendor.location ? ` · ${vendor.location}` : ""}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* 2. Your Info */}
        <section>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
            2 · Your Information
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { name: "clientName",  label: "Full Name *", type: "text",  placeholder: "Your full name",       required: true },
              { name: "clientEmail", label: "Email",        type: "email", placeholder: "you@example.com",       required: false },
              { name: "clientPhone", label: "Phone",        type: "tel",   placeholder: "+91 XXXXX XXXXX",       required: false },
              { name: "eventDate",   label: "Event Date *", type: "date",  placeholder: "",                      required: true },
            ].map(({ name, label, type, placeholder, required }) => (
              <div key={name}>
                <label style={labelBase}>{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(name)}
                  onBlur={() => setFocusedField(null)}
                  placeholder={placeholder}
                  required={required}
                  min={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
                  style={{ ...inputBase, ...getFocus(name), colorScheme: type === "date" ? "dark" : undefined }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 3. Event Details */}
        <section>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
            3 · Event Details
          </p>
          <div style={{ marginBottom: "10px" }}>
            <label style={labelBase}>Event Type</label>
            <select
              name="eventType"
              value={form.eventType}
              onChange={handleChange}
              onFocus={() => setFocusedField("eventType")}
              onBlur={() => setFocusedField(null)}
              style={{ ...inputBase, ...getFocus("eventType"), cursor: "pointer" }}
            >
              <option value="" style={{ backgroundColor: "#1e293b" }}>Select event type</option>
              {EVENT_TYPES.map((t) => <option key={t} value={t} style={{ backgroundColor: "#1e293b" }}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelBase}>Message / Requirements</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
              rows={3}
              placeholder="Describe your event — venue, guest count, budget, special requests…"
              style={{ ...inputBase, ...getFocus("message"), resize: "vertical", lineHeight: "1.6", minHeight: "70px" }}
            />
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          id="submit-inquiry-btn"
          disabled={isSubmitting || loadingVendors}
          style={{
            padding: "13px",
            borderRadius: "10px",
            border: "none",
            background: isSubmitting ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "white",
            fontSize: "14px",
            fontWeight: "700",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            boxShadow: isSubmitting ? "none" : "0 4px 16px rgba(99,102,241,0.4)",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => { if (!isSubmitting) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.5)"; }}}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = isSubmitting ? "none" : "0 4px 16px rgba(99,102,241,0.4)"; }}
        >
          {isSubmitting ? "Sending Inquiry…" : "Send Inquiry →"}
        </button>
      </form>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// RIGHT PANEL — Vendor Login / Register
// ══════════════════════════════════════════════════════════════════════════════
const VendorLoginPanel = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData]   = useState({ name: "", email: "", password: "" });
  const [error, setError]         = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const endpoint = isRegisterMode ? "/auth/register" : "/auth/login";
      const payload  = isRegisterMode
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const { data } = await api.post(endpoint, payload);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const field = (name, label, type, placeholder, required = true) => (
    <div>
      <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "rgba(255,255,255,0.6)", marginBottom: "5px" }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        style={{
          ...inputBase,
          border: "1.5px solid rgba(255,255,255,0.12)",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#818cf8"; e.target.style.backgroundColor = "rgba(129,140,248,0.08)"; e.target.style.boxShadow = "0 0 0 3px rgba(129,140,248,0.15)"; }}
        onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.backgroundColor = "rgba(255,255,255,0.06)"; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "380px",
        padding: "40px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "24px",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
        <div style={{ width: "38px", height: "38px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900", fontSize: "18px", boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}>
          S
        </div>
        <div>
          <p style={{ fontSize: "16px", fontWeight: "800", color: "#f1f5f9", letterSpacing: "-0.3px", lineHeight: 1.2 }}>StarVnt</p>
          <p style={{ fontSize: "10px", fontWeight: "600", color: "#818cf8", letterSpacing: "0.05em", textTransform: "uppercase" }}>Vendor Portal</p>
        </div>
      </div>

      {/* Heading */}
      <div>
        <h2 style={{ fontSize: "19px", fontWeight: "800", color: "#f1f5f9", letterSpacing: "-0.4px", marginBottom: "5px" }}>
          {isRegisterMode ? "Create an account" : "Welcome back"}
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.5" }}>
          {isRegisterMode
            ? "Start managing your vendor bookings"
            : "Sign in to your vendor dashboard"}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "10px 13px", borderRadius: "8px", border: "1px solid rgba(248,113,113,0.3)", backgroundColor: "rgba(248,113,113,0.08)", color: "#fca5a5", fontSize: "12px", lineHeight: "1.5" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {isRegisterMode && field("name", "Full Name", "text", "Your business name")}
        {field("email", "Email Address", "email", "you@example.com")}
        {field("password", "Password", "password", isRegisterMode ? "Min. 6 characters" : "Enter your password")}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: "4px",
            width: "100%",
            padding: "11px",
            borderRadius: "9px",
            border: "none",
            background: isLoading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1, #4f46e5)",
            color: "white",
            fontSize: "14px",
            fontWeight: "700",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            boxShadow: isLoading ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
          }}
          onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.45)"; }}}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = isLoading ? "none" : "0 4px 14px rgba(99,102,241,0.35)"; }}
        >
          {isLoading ? "Please wait…" : isRegisterMode ? "Create Account" : "Sign In"}
        </button>
      </form>

      {/* Toggle */}
      <div style={{ textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
          {isRegisterMode ? "Already have an account?" : "New vendor?"}{" "}
        </span>
        <button
          onClick={() => { setIsRegisterMode(!isRegisterMode); setError(""); setFormData({ name: "", email: "", password: "" }); }}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "700", color: "#818cf8", padding: 0, fontFamily: "inherit" }}
        >
          {isRegisterMode ? "Sign in" : "Register here"}
        </button>
      </div>

      {/* Footer note */}
      <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: "1.6", marginTop: "-8px" }}>
        This portal is for registered StarVnt vendors only. Client bookings are handled via the inquiry form on the left.
      </p>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ROOT — Login Page (Split Layout)
// ══════════════════════════════════════════════════════════════════════════════
const Login = () => {
  const [mobileTab, setMobileTab] = useState("inquiry"); // "inquiry" | "login"

  return (
    <>
      <Helmet>
        <title>Book a Vendor or Sign In — StarVnt</title>
        <meta name="description" content="Submit a vendor booking inquiry or sign in to the StarVnt vendor dashboard." />
      </Helmet>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0f1e 0%, #0f1729 50%, #0a0f1e 100%)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Background decorations ── */}
        <div aria-hidden="true" style={{ position: "absolute", top: "-300px", left: "-200px", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", bottom: "-200px", right: "-150px", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* ── Mobile Tabs ── */}
        <div
          style={{
            display: "none",
            padding: "16px 20px 0",
            // only visible on mobile via inline media query workaround
          }}
          className="mobile-tabs-bar"
        >
          {["inquiry", "login"].map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              style={{
                flex: 1, padding: "9px 0", border: "none",
                borderBottom: mobileTab === tab ? "2px solid #818cf8" : "2px solid transparent",
                background: "none", cursor: "pointer", fontFamily: "inherit",
                fontSize: "13px", fontWeight: mobileTab === tab ? "700" : "500",
                color: mobileTab === tab ? "#818cf8" : "rgba(255,255,255,0.4)",
                transition: "all 0.15s ease",
              }}
            >
              {tab === "inquiry" ? "📋 Book a Vendor" : "🔐 Vendor Login"}
            </button>
          ))}
        </div>

        {/* ── Main split layout ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "stretch",
            maxWidth: "1100px",
            margin: "0 auto",
            width: "100%",
            padding: "0",
          }}
        >
          {/* LEFT — Inquiry form */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <InquiryPanel />
          </div>

          {/* Divider */}
          <div style={{ width: "1px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)", flexShrink: 0, margin: "40px 0" }} />

          {/* RIGHT — Vendor login */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <VendorLoginPanel />
          </div>
        </div>

        {/* ── Responsive style override ── */}
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.97); }
            to   { opacity: 1; transform: scale(1); }
          }

          /* Mobile: stacked tabs */
          @media (max-width: 768px) {
            .mobile-tabs-bar {
              display: flex !important;
              border-bottom: 1px solid rgba(255,255,255,0.06);
              gap: 0;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Login;
