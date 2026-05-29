
const StatCard = ({ title, value, subtitle, icon, color = "#6366f1", trend }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "all 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: "500",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </p>
        {}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: `${color}18`, // 18 = ~10% opacity in hex
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>

      {}
      <div>
        <p
          style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "var(--color-text)",
            lineHeight: 1,
            letterSpacing: "-1px",
          }}
        >
          {value}
        </p>
        {subtitle && (
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px" }}>
            {subtitle}
          </p>
        )}
      </div>

      {}
      {trend && (
        <div
          style={{
            paddingTop: "12px",
            borderTop: "1px solid var(--color-border)",
            fontSize: "12px",
            color: "var(--color-text-muted)",
          }}
        >
          {trend}
        </div>
      )}
    </div>
  );
};

export default StatCard;
