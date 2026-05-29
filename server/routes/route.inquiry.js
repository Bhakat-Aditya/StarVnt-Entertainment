
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

router.route("/").get(protect, getAllInquiries).post(createInquiry);

router.post("/manual", protect, createInquiryManual);

router
  .route("/:id")
  .get(protect, getInquiry)
  .put(protect, updateInquiry)
  .delete(protect, deleteInquiry);

router.put("/:id/status", protect, updateInquiryStatus);

export default router;
