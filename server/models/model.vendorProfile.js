// models/model.vendorProfile.js
// Defines the VendorProfile schema.
// Each vendor has exactly ONE profile, linked to their User account via a reference.

import mongoose from "mongoose";

const vendorProfileSchema = new mongoose.Schema(
  {
    // --- Relationship to User ---
    // 'ref: "User"' tells Mongoose this ObjectId points to the User collection.
    // This enables .populate('user') to fetch the full User document in queries.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One profile per user — enforced at DB level
    },

    // --- Vendor Business Details ---
    vendorName: {
      type: String,
      required: [true, "Vendor name is required"],
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      // Examples: Photography, Catering, Venue, DJ, Florist
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    contact: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const VendorProfile = mongoose.model("VendorProfile", vendorProfileSchema);

export default VendorProfile;
