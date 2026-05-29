
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import "./index.css"; // Global styles + Tailwind v4

const savedTheme = localStorage.getItem("starvnt_theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
