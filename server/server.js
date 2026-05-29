// server.js
// The main entry point for the Express backend.
// This file: loads environment variables, connects to DB, sets up middleware, mounts routes.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// --- Import Routes ---
import authRoutes from "./routes/route.auth.js";
import vendorRoutes from "./routes/route.vendor.js";
import inquiryRoutes from "./routes/route.inquiry.js";

// --- Load Environment Variables ---
// dotenv.config() reads the .env file and makes values available via process.env
// This MUST be called before any code that uses process.env variables.
dotenv.config();

// --- Connect to Database ---
// We call this async function but don't await it here.
// Mongoose internally queues operations until the connection is ready.
connectDB();

// --- Initialize Express App ---
const app = express();

// ============================================================
// MIDDLEWARE STACK
// Middleware functions run in ORDER on every incoming request.
// ============================================================

// 1. CORS (Cross-Origin Resource Sharing)
// Allows production and local frontends to safely access this API.
const allowedOrigins = [
  process.env.CLIENT_URL, // Whitelist your live Vercel URL from environment variables
  "http://localhost:5173"  // Whitelist your local Vite development environment
];

// 1. CORS (Cross-Origin Resource Sharing) - Bulletproof Version
app.use(
  cors({
    origin: [
      "https://starvnt-entertainment.vercel.app", // No trailing slashes
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

// 2. JSON Body Parser
//    Parses incoming requests with JSON payloads.
//    Without this, req.body would be undefined.
app.use(express.json());

// 3. URL-Encoded Body Parser
//    Parses form data submitted as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// ============================================================
// ROUTES
// We mount each router at a specific base path.
// All routes defined inside that router are prefixed with this base path.
// ============================================================
app.use("/api/auth", authRoutes);       // → /api/auth/login, /api/auth/register
app.use("/api/vendor", vendorRoutes);   // → /api/vendor/profile
app.use("/api/inquiries", inquiryRoutes); // → /api/inquiries, /api/inquiries/:id

// --- Health Check Route ---
// A simple endpoint to verify the server is running.
// Useful for deployment health checks.
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "StarVnt API is running 🚀" });
});

// --- 404 Handler ---
// If no route matches, send a 404 response.
// This MUST be the last route/middleware.
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// --- Global Error Handler ---
// Express recognizes error-handling middleware by the 4-parameter signature (err, req, res, next).
// Any error passed to next(err) in a route will end up here.
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 StarVnt Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});