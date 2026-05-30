
import axios from "axios";

const api = axios.create({
  // In local dev: use relative '/api' path — Vite's proxy rewrites it to http://localhost:5000/api
  // In production: VITE_API_URL is the full Render/Railway backend URL (e.g. https://starvnt-api.onrender.com/api)
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("starvnt_token");

    if (token) {

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Return the modified config to continue the request
  },
  (error) => {

    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, // If successful, just return the response as-is
  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem("starvnt_token");
      localStorage.removeItem("starvnt_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
