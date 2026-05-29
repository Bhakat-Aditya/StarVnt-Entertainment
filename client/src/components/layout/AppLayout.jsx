
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

const DESKTOP_BREAKPOINT = 768;

const AppLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < DESKTOP_BREAKPOINT
  );

  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < DESKTOP_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false); // auto-close drawer on desktop
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  useEffect(() => {
    document.body.style.overflow =
      isMobile && sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, sidebarOpen]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {}
      <Sidebar
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />

      {}
      {isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,                        // behind sidebar (z-50) but above content
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)",

            opacity: sidebarOpen ? 1 : 0,
            pointerEvents: sidebarOpen ? "auto" : "none",
            transition: "opacity 0.3s ease",
          }}
          aria-hidden="true"
        />
      )}

      {}
      <div
        style={{

          marginLeft: isMobile ? 0 : "var(--sidebar-width)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0,          // prevents flex overflow
          transition: "margin-left 0.3s ease",
        }}
      >
        {}
        <Topbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
        />

        {}
        <main style={{ flex: 1, padding: "24px", overflowX: "hidden" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
