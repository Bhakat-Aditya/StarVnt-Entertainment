// components/ui/Badge.jsx
// A reusable status badge component.
// Renders a colored pill label based on the inquiry status value.
//
// Props:
//   - status: "New" | "Contacted" | "Confirmed" | "Rejected"
//   - size: "sm" | "md" (optional, defaults to "md")

// Map each status to its display color
// These match the CSS variables defined in index.css
const statusStyles = {
  New: {
    bg: "rgba(6, 182, 212, 0.12)",      // cyan with transparency
    color: "#0891b2",                    // cyan-600
    dot: "#06b6d4",                      // cyan-500
  },
  Contacted: {
    bg: "rgba(245, 158, 11, 0.12)",     // amber with transparency
    color: "#d97706",                    // amber-600
    dot: "#f59e0b",                      // amber-500
  },
  Confirmed: {
    bg: "rgba(16, 185, 129, 0.12)",     // emerald with transparency
    color: "#059669",                    // emerald-600
    dot: "#10b981",                      // emerald-500
  },
  Rejected: {
    bg: "rgba(239, 68, 68, 0.12)",      // red with transparency
    color: "#dc2626",                    // red-600
    dot: "#ef4444",                      // red-500
  },
};

const Badge = ({ status, size = "md" }) => {
  // Fall back to "New" style if an unrecognized status is passed
  const styles = statusStyles[status] || statusStyles["New"];

  const padding = size === "sm" ? "3px 8px" : "4px 10px";
  const fontSize = size === "sm" ? "11px" : "12px";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding,
        borderRadius: "9999px",       // Makes it a full pill shape
        backgroundColor: styles.bg,
        color: styles.color,
        fontSize,
        fontWeight: "600",
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
      }}
    >
      {/* Pulsing dot to draw attention */}
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: styles.dot,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
};

export default Badge;
