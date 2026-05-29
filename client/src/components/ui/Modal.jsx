
const Modal = ({ isOpen, onClose, title, children }) => {

  if (!isOpen) return null;

  return (

    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,                          // Shorthand for top/right/bottom/left: 0
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "16px",
        backdropFilter: "blur(4px)",       // Frosted glass effect on the background
        animation: "fadeIn 0.15s ease",
      }}
    >
      {}
      {}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
          animation: "slideUp 0.2s ease",
        }}
      >
        {}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid var(--color-border)",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "var(--color-text)",
            }}
          >
            {title}
          </h2>
          {}
          <button
            onClick={onClose}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface-2)",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              lineHeight: 1,
              transition: "all 0.15s ease",
            }}
          >
            ×
          </button>
        </div>

        {}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </div>

      {}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Modal;
