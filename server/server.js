
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

const allowedOrigins = [
  process.env.CLIENT_URL, // Whitelist your live Vercel URL from environment variables
  "http://localhost:5173"  // Whitelist your local Vite development environment
];

app.use(
  cors({
    origin: [
      "https://starvnt-entertainment.vercel.app", // No trailing slashes
      "http://localhost:5173"
    ],
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