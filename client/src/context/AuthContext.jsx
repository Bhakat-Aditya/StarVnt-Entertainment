
import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("starvnt_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("starvnt_token") || null;
  });

  const login = useCallback((userData, jwtToken) => {

    setUser(userData);
    setToken(jwtToken);

    localStorage.setItem("starvnt_user", JSON.stringify(userData));
    localStorage.setItem("starvnt_token", jwtToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("starvnt_user");
    localStorage.removeItem("starvnt_token");
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token, // !! converts token to boolean (null → false, string → true)
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
