
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/route.auth.js";
import vendorRoutes from "./routes/route.vendor.js";
import inquiryRoutes from "./routes/route.inquiry.js";

dotenv.config();

connectDB();

const app = express();

// Build the CORS whitelist from environment — add your Vercel URL as CLIENT_URL on Render
const allowedOrigins = [
  process.env.CLIENT_URL,              // e.g. https://starvnt-entertainment.vercel.app
  "https://starvnt-entertainment.vercel.app", // fallback if env var not yet set
  "http://localhost:5173",             // local Vite dev server
].filter(Boolean); // remove undefined entries

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, Postman, Render health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);       // → /api/auth/login, /api/auth/register
app.use("/api/vendor", vendorRoutes);   // → /api/vendor/profile
app.use("/api/inquiries", inquiryRoutes); // → /api/inquiries, /api/inquiries/:id

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "StarVnt API is running 🚀" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 StarVnt Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});