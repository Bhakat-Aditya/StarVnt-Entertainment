// context/AuthContext.jsx
// Global Authentication State using React Context.
//
// WHY CONTEXT?
// We need the user's login status available across many components
// (Sidebar, ProtectedRoute, Topbar, etc.). Instead of "prop drilling"
// (passing props through every component), Context makes state globally accessible.
//
// PATTERN: We create a Context, a Provider component, and a custom hook (useAuth).

import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios.js";

// --- 1. Create the Context ---
// createContext() creates a Context object. We'll fill it in the Provider.
const AuthContext = createContext(null);

// --- 2. Create the Provider Component ---
// AuthProvider wraps the entire app (in main.jsx).
// Any component inside can access auth state via useAuth().
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage so the user stays logged in on refresh.
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("starvnt_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("starvnt_token") || null;
  });

  // --- Login Function ---
  // Called from Login.jsx after successful POST /api/auth/login
  const login = useCallback((userData, jwtToken) => {
    // Save to state (for immediate UI reactivity)
    setUser(userData);
    setToken(jwtToken);

    // Save to localStorage (persists across page refreshes)
    localStorage.setItem("starvnt_user", JSON.stringify(userData));
    localStorage.setItem("starvnt_token", jwtToken);
  }, []);

  // --- Logout Function ---
  // Clears state and localStorage, then redirects to login.
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("starvnt_user");
    localStorage.removeItem("starvnt_token");
  }, []);

  // The value object is what gets injected into every consuming component.
  // We expose: current user, token, login function, logout function,
  // and a computed 'isAuthenticated' boolean for convenience.
  const value = {
    user,
    token,
    isAuthenticated: !!token, // !! converts token to boolean (null → false, string → true)
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- 3. Custom Hook ---
// useAuth() is a convenience hook. Instead of writing:
//   const { user } = useContext(AuthContext)
// Components can just write:
//   const { user } = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);

  // If useAuth is called outside of AuthProvider, throw a helpful error.
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
