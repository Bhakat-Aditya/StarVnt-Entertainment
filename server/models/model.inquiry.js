
import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProfile",
      required: true,
    },

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

    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    eventType: {
      type: String,
      trim: true,

    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

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
