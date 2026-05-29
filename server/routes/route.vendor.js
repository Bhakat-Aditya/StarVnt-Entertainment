// routes/route.vendor.js
// Defines endpoints for vendor profile management.
// All routes here are protected — they require a valid JWT.

import express from "express";
import { getProfile, updateProfile } from "../controllers/controller.vendor.js";
import protect from "../middleware/middleware.auth.js";

// This router will be mounted at '/api/vendor' in server.js
const router = express.Router();

// Apply 'protect' middleware to ALL routes in this router.
// router.use(protect) is equivalent to adding protect to every individual route.
router.use(protect);

// GET  /api/vendor/profile — Fetch the logged-in vendor's profile
// PUT  /api/vendor/profile — Update the logged-in vendor's profile
router.route("/profile").get(getProfile).put(updateProfile);

export default router;
