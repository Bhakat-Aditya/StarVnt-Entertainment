
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const Login = () => {

  const [isRegisterMode, setIsRegisterMode] = useState(false); // Toggle between login/register
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default HTML form submission (page reload)
    setIsLoading(true);
    setError("");

    try {
      const endpoint = isRegisterMode ? "/auth/register" : "/auth/login";
      const payload = isRegisterMode
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await api.post(endpoint, payload);
      const { user, token } = response.data;

      login(user, token);

      navigate("/dashboard");
    } catch (err) {

      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false); // Always reset loading state
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1.5px solid var(--color-border)",
    backgroundColor: "var(--color-surface-2)",
    color: "var(--color-text)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.15s ease",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "16px",
          padding: "40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        {}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "800",
              fontSize: "22px",
              margin: "0 auto 16px",
            }}
          >
            S
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "var(--color-text)",
              marginBottom: "6px",
              letterSpacing: "-0.5px",
            }}
          >
            {isRegisterMode ? "Create an Account" : "Welcome back"}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
            {isRegisterMode
              ? "Start managing your vendor bookings"
              : "Sign in to your StarVnt dashboard"}
          </p>
        </div>

        {}
        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "20px",
              fontSize: "13px",
              color: "#dc2626",
            }}
          >
            {error}
          </div>
        )}

        {}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {}
          {isRegisterMode && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "var(--color-text)",
                  marginBottom: "6px",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your business name"
                required={isRegisterMode}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
            </div>
          )}

          {}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "var(--color-text)",
                marginBottom: "6px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          {}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "var(--color-text)",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isRegisterMode ? "Min. 6 characters" : "Enter your password"}
              required
              minLength={6}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          {}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: "8px",
              border: "none",
              background: isLoading
                ? "var(--color-text-muted)"
                : "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              marginTop: "4px",
              fontFamily: "inherit",
            }}
          >
            {isLoading
              ? "Please wait..."
              : isRegisterMode
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        {}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
            {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
          </span>
          <button
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError("");
              setFormData({ name: "", email: "", password: "" });
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              color: "#6366f1",
              padding: 0,
            }}
          >
            {isRegisterMode ? "Sign In" : "Register"}
          </button>
        </div>


      </div>
    </div>
  );
};

export default Login;
