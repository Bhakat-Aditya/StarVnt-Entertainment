// models/model.inquiry.js
// Defines the Inquiry schema.
// An inquiry is a booking request submitted by a client to a vendor.

import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    // --- Relationship to VendorProfile ---
    // Each inquiry is directed at a specific vendor profile.
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProfile",
      required: true,
    },

    // --- Client (Requester) Information ---
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    clientEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    clientPhone: {
      type: String,
      trim: true,
    },

    // --- Event Details ---
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    eventType: {
      type: String,
      trim: true,
      // Examples: Wedding, Corporate, Birthday, Concert
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    // --- Inquiry Status (Workflow) ---
    // The status follows a simple linear workflow:
    // New → Contacted → Confirmed → Rejected
    status: {
      type: String,
      enum: {
        values: ["New", "Contacted", "Confirmed", "Rejected"],
        message: "Status must be New, Contacted, Confirmed, or Rejected",
      },
      default: "New", // All new inquiries start with 'New'
    },
  },
  {
    timestamps: true, // Adds createdAt (when inquiry was submitted) and updatedAt
  }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
