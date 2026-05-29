// pages/VendorProfile.jsx
// Allows the logged-in vendor to view and edit their profile details.
// Follows a read-then-edit pattern: view mode by default, edit mode on button click.

import { useState, useEffect } from "react";
import api from "../api/axios.js";

const VendorProfile = () => {
  // --- State ---
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // --- Fetch Profile on Mount ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/vendor/profile");
        setProfile(response.data.profile);
        // Pre-populate form with current values
        setFormData({
          vendorName: response.data.profile.vendorName || "",
          category: response.data.profile.category || "",
          location: response.data.profile.location || "",
          contact: response.data.profile.contact || "",
          bio: response.data.profile.bio || "",
        });
      } catch (error) {
        console.error("Fetch profile error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- Handle Input Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Save Profile ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await api.put("/vendor/profile", formData);
      setProfile(response.data.profile);
      setIsEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      // Auto-clear the success message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Cancel Edit (restore original values) ---
  const handleCancel = () => {
    // Reset form data back to what the profile currently has
    setFormData({
      vendorName: profile?.vendorName || "",
      category: profile?.category || "",
      location: profile?.location || "",
      contact: profile?.contact || "",
      bio: profile?.bio || "",
    });
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  // --- Styles ---
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1.5px solid var(--color-border)",
    backgroundColor: isEditing ? "var(--color-surface-2)" : "transparent",
    color: "var(--color-text)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.15s ease",
    fontFamily: "inherit",
    cursor: isEditing ? "text" : "default",
  };

  const categoryOptions = [
    "Photography", "Catering", "Venue", "DJ & Music", "Florist",
    "Videography", "Decoration", "Makeup & Beauty", "Transportation", "Other",
  ];

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
        <p style={{ color: "var(--color-text-muted)" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "720px" }}>
      {/* --- Page Header --- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--color-text)" }}>
            Vendor Profile
          </h2>
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>
            Manage your public business information
          </p>
        </div>

        {/* Edit / Cancel Buttons */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "white",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "opacity 0.15s ease",
            }}
          >
            Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleCancel}
              style={{
                padding: "9px 18px",
                borderRadius: "8px",
                border: "1.5px solid var(--color-border)",
                background: "none",
                color: "var(--color-text-muted)",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* --- Success / Error Message --- */}
      {message.text && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "13px",
            backgroundColor: message.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: message.type === "success" ? "#15803d" : "#dc2626",
            border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* --- Profile Card --- */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Profile Header with Avatar */}
        <div
          style={{
            padding: "28px 32px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            background: "linear-gradient(135deg, var(--color-primary-light), var(--color-surface))",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "800",
              fontSize: "28px",
              flexShrink: 0,
            }}
          >
            {profile?.user?.name?.charAt(0).toUpperCase() || "V"}
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--color-text)" }}>
              {profile?.vendorName || profile?.user?.name || "Your Business"}
            </h3>
            <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>
              {profile?.category || "Category not set"} · {profile?.location || "Location not set"}
            </p>
            <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "2px" }}>
              Account: {profile?.user?.email}
            </p>
          </div>
        </div>

        {/* --- Profile Form --- */}
        <form onSubmit={handleSave} style={{ padding: "28px 32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Vendor / Business Name */}
            <div>
              <label style={labelStyle}>Business Name</label>
              <input
                type="text"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., Aria Photography"
                style={inputStyle}
                onFocus={(e) => isEditing && (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>Category</label>
              {isEditing ? (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.category || "Not set"}
                  disabled
                  style={inputStyle}
                />
              )}
            </div>

            {/* Location */}
            <div>
              <label style={labelStyle}>Location / City</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., Mumbai, Maharashtra"
                style={inputStyle}
                onFocus={(e) => isEditing && (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
            </div>

            {/* Contact */}
            <div>
              <label style={labelStyle}>Contact Number</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., +91 98765 43210"
                style={inputStyle}
                onFocus={(e) => isEditing && (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
            </div>

            {/* Bio — full width */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>
                Bio{" "}
                <span style={{ color: "var(--color-text-muted)", fontWeight: "400" }}>
                  ({formData.bio?.length || 0}/500)
                </span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Describe your services, experience, and what makes you unique..."
                maxLength={500}
                rows={4}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  lineHeight: "1.6",
                }}
                onFocus={(e) => isEditing && (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
            </div>
          </div>

          {/* Save Button — only in edit mode */}
          {isEditing && (
            <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  background: isSaving ? "var(--color-text-muted)" : "linear-gradient(135deg, #6366f1, #4f46e5)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  transition: "opacity 0.15s ease",
                  fontFamily: "inherit",
                }}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "1.5px solid var(--color-border)",
                  background: "none",
                  color: "var(--color-text-muted)",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Discard
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// Reusable label style object
const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "500",
  color: "var(--color-text-muted)",
  marginBottom: "6px",
};

export default VendorProfile;
