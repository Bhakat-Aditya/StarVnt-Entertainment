// vite.config.js
// Vite configuration for StarVnt client.
// We add the Tailwind CSS v4 plugin and a proxy for the dev API.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind CSS v4 plugin — no separate tailwind.config.js needed
  ],
  server: {
    port: 5173,
    // Proxy API calls to the backend in development.
    // Instead of writing http://localhost:5000/api/... in every axios call,
    // we can just write /api/... and Vite will forward it to the backend.
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
