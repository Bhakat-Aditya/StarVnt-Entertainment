// main.jsx
// The React application entry point.
// Renders the App component into the HTML root element.
// Wraps the entire app in AuthProvider so auth state is globally accessible.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import "./index.css"; // Global styles + Tailwind v4

// --- Apply Saved Theme on Initial Load ---
// We check localStorage for a saved theme preference BEFORE React renders.
// This prevents a "flash of wrong theme" (FOWT) on page load.
const savedTheme = localStorage.getItem("starvnt_theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}

// createRoot is the React 18 way of rendering.
// document.getElementById('root') points to <div id="root"> in index.html.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/*
      AuthProvider wraps the entire app.
      Any component can now call useAuth() to get the current user.
    */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
