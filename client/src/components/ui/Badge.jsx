const statusConfig = {
  New: {
    bg: "var(--color-new-bg)",
    color: "var(--color-new)",
    dot: "var(--color-new)",
    label: "New",
    pulse: true,
  },
  Contacted: {
    bg: "var(--color-contacted-bg)",
    color: "var(--color-contacted)",
    dot: "var(--color-contacted)",
    label: "Contacted",
    pulse: false,
  },
  Confirmed: {
    bg: "var(--color-confirmed-bg)",
    color: "var(--color-confirmed)",
    dot: "var(--color-confirmed)",
    label: "Confirmed",
    pulse: false,
  },
  Rejected: {
    bg: "var(--color-rejected-bg)",
    color: "var(--color-rejected)",
    dot: "var(--color-rejected)",
    label: "Rejected",
    pulse: false,
  },
};

const Badge = ({ status, size = "md" }) => {
  const cfg = statusConfig[status] || statusConfig.New;

  const padding    = size === "sm" ? "3px 9px"  : "4px 12px";
  const fontSize   = size === "sm" ? "11px"      : "12px";
  const dotSize    = size === "sm" ? "5px"       : "6px";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding,
        borderRadius: "9999px",
        backgroundColor: cfg.bg,
        color: cfg.color,
        fontSize,
        fontWeight: "700",
        whiteSpace: "nowrap",
        letterSpacing: "0.02em",
        border: `1px solid ${cfg.color}28`,
        position: "relative",
      }}
    >
      {/* Animated pulse dot */}
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          backgroundColor: cfg.dot,
          flexShrink: 0,
          animation: cfg.pulse ? "pulseDot 1.8s ease infinite" : "none",
        }}
      />
      {cfg.label}
    </span>
  );
};

export default Badge;
