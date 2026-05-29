// routes/route.inquiry.js
// Full CRUD routes for inquiry management.

import express from "express";
import {
  getAllInquiries,
  getInquiry,
  updateInquiryStatus,
  updateInquiry,
  deleteInquiry,
  createInquiry,
  createInquiryManual,
} from "../controllers/controller.inquiry.js";
import protect from "../middleware/middleware.auth.js";

const router = express.Router();

// GET  /api/inquiries    — All inquiries for this vendor (PROTECTED)
// POST /api/inquiries    — Create new inquiry (PUBLIC — from clients)
router.route("/").get(protect, getAllInquiries).post(createInquiry);

// POST /api/inquiries/manual — Vendor adds an inquiry manually (PROTECTED)
router.post("/manual", protect, createInquiryManual);

// GET    /api/inquiries/:id   — Single inquiry detail (PROTECTED)
// PUT    /api/inquiries/:id   — Edit full inquiry (PROTECTED)
// DELETE /api/inquiries/:id   — Delete inquiry (PROTECTED)
router
  .route("/:id")
  .get(protect, getInquiry)
  .put(protect, updateInquiry)
  .delete(protect, deleteInquiry);

// PUT /api/inquiries/:id/status — Quick status update only (PROTECTED)
router.put("/:id/status", protect, updateInquiryStatus);

export default router;
