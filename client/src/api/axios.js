// api/axios.js
// Creates a pre-configured Axios instance for all API calls.
// This saves us from repeating the base URL and auth header in every request.

import axios from "axios";

// Create an Axios instance with our base configuration
const api = axios.create({
  // Use VITE_API_URL for production (pointing to Render), 
  // fallback directly to localhost during development.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor ---
// This function runs automatically before EVERY request made with this axios instance.
// Its job: attach the JWT token from localStorage to the Authorization header.
api.interceptors.request.use(
  (config) => {
    // Get the token stored during login
    const token = localStorage.getItem("starvnt_token");

    if (token) {
      // Add the Bearer token to the Authorization header
      // The backend middleware (middleware.auth.js) reads this header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Return the modified config to continue the request
  },
  (error) => {
    // If something goes wrong setting up the request, reject the promise
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// Runs on every response. Useful for global error handling (e.g., auto-logout on 401).
api.interceptors.response.use(
  (response) => response, // If successful, just return the response as-is
  (error) => {
    // If the server returns 401 (Unauthorized), the token is invalid/expired
    if (error.response?.status === 401) {
      // Clear the stored token and redirect to login
      localStorage.removeItem("starvnt_token");
      localStorage.removeItem("starvnt_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
