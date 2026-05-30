
import express from "express";
import { getProfile, updateProfile, getPublicVendors } from "../controllers/controller.vendor.js";
import protect from "../middleware/middleware.auth.js";

const router = express.Router();

// ─── Public Routes (no auth required) ──────────────────────────────────────
// Returns safe public fields (name, category, location) for the inquiry form
router.get("/public", getPublicVendors);

// ─── Protected Routes (vendor must be logged in) ────────────────────────────
router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

export default router;
