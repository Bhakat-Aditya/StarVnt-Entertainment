
import mongoose from "mongoose";

const vendorProfileSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One profile per user — enforced at DB level
    },

    vendorName: {
      type: String,
      required: [true, "Vendor name is required"],
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,

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
