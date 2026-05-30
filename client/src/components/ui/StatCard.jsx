import { useState, useEffect, useRef } from "react";

// Animated counter hook
const useCountUp = (target, duration = 1000) => {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    if (target === prevTarget.current) return;
    const start = prevTarget.current;
    const end = target;
    prevTarget.current = target;

    if (start === end) return;

    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return count;
};

const StatCard = ({ title, value, subtitle, icon, color = "#6366f1", trend, index = 0 }) => {
  const animatedValue = useCountUp(value ?? 0, 900);
  const [hovered, setHovered] = useState(false);

  const hexOpacity = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  };

  const isHex = color.startsWith("#");
  const bgColor = isHex ? hexOpacity(color, 0.1) : "var(--color-primary-light)";
  const borderHighlight = isHex ? hexOpacity(color, 0.2) : "transparent";

  return (
    <div
      className="anim-fade-in-up"
      style={{ animationDelay: `${index * 70}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: `1px solid ${hovered ? borderHighlight : "var(--color-border)"}`,
          borderRadius: "var(--radius-lg)",
          padding: "22px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          cursor: "default",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hovered ? `0 12px 32px ${isHex ? hexOpacity(color, 0.15) : "rgba(0,0,0,0.1)"}` : "var(--shadow-sm)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${color}, transparent)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
        />

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            {title}
          </p>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: color,
              flexShrink: 0,
              transition: "transform 0.25s ease",
              transform: hovered ? "scale(1.1)" : "scale(1)",
            }}
          >
            {icon}
          </div>
        </div>

        {/* Value */}
        <div>
          <p
            style={{
              fontSize: "36px",
              fontWeight: "900",
              color: "var(--color-text)",
              lineHeight: 1,
              letterSpacing: "-2px",
              fontVariantNumeric: "tabular-nums",
              animation: "countUp 0.4s ease both",
            }}
          >
            {animatedValue}
          </p>
          {subtitle && (
            <p
              style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
                marginTop: "5px",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Trend footer */}
        {trend && (
          <div
            style={{
              paddingTop: "12px",
              borderTop: "1px solid var(--color-border)",
              fontSize: "12px",
              color: color,
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
