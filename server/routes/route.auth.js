// routes/route.auth.js
// Defines the URL endpoints for authentication.
// Each route maps an HTTP method + path to a controller function.

import express from "express";
import { register, login, getMe } from "../controllers/controller.auth.js";
import protect from "../middleware/middleware.auth.js";

// express.Router() creates a mini-app that handles only auth routes.
// It will be mounted at '/api/auth' in server.js.
const router = express.Router();

// POST /api/auth/register — Create a new user account
router.post("/register", register);

// POST /api/auth/login — Login and receive a JWT
router.post("/login", login);

// GET /api/auth/me — Get current user info (PROTECTED)
// 'protect' middleware runs first; if valid, 'getMe' runs next
router.get("/me", protect, getMe);

export default router;
